import { useAuth } from "@/_core/hooks/useAuth";
import { EntityType, PrivilegeType } from "@/lib/privileges";

/**
 * Hook to check user privileges
 * For now, admins have all privileges, non-admins have no privileges
 * TODO: Integrate with privileges router when backend is ready
 */
export function usePrivileges() {
  const { user } = useAuth();

  // Super admin and admin have all privileges
  if (user?.role === 'super_admin' || user?.role === 'admin') {
    return {
      hasPrivilege: () => true,
      canView: () => true,
      canManage: () => true,
      canDelete: () => true,
      canCreate: () => true,
      canEdit: () => true,
      isAdmin: true,
      loading: false,
    };
  }

  // Non-admins have no privileges for now
  // TODO: Fetch from backend privileges table
  const userPrivileges: any[] = [];

  return {
    hasPrivilege: (entity: EntityType, privilege: PrivilegeType) => {
      return userPrivileges.some(
        (p: any) => p.entityType === entity && p.privilegeType === privilege
      );
    },
    canView: (entity: EntityType) => {
      return userPrivileges.some((p: any) => p.entityType === entity && p.privilegeType === 'view');
    },
    canManage: (entity: EntityType) => {
      return userPrivileges.some((p: any) => p.entityType === entity && p.privilegeType === 'manage');
    },
    canDelete: (entity: EntityType) => {
      return userPrivileges.some((p: any) => p.entityType === entity && p.privilegeType === 'delete');
    },
    canCreate: (entity: EntityType) => {
      return userPrivileges.some((p: any) => p.entityType === entity && p.privilegeType === 'manage');
    },
    canEdit: (entity: EntityType) => {
      return userPrivileges.some((p: any) => p.entityType === entity && p.privilegeType === 'manage');
    },
    isAdmin: false,
    loading: false,
  };
}
