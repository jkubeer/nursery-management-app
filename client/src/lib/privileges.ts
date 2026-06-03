/**
 * Privilege checking utilities for RBAC
 */

export type PrivilegeType = 'view' | 'manage' | 'delete';
export type EntityType = 'staff' | 'children' | 'parents' | 'rooms' | 'activities' | 'payments';

export interface UserPrivilege {
  entityType: EntityType;
  privilegeType: PrivilegeType;
}

/**
 * Check if user has a specific privilege for an entity
 */
export function hasPrivilege(
  userPrivileges: UserPrivilege[] | undefined,
  entity: EntityType,
  privilege: PrivilegeType
): boolean {
  if (!userPrivileges) return false;
  
  // Super admin and admin have all privileges
  if (!userPrivileges) return false;
  
  return userPrivileges.some(
    (p) => p.entityType === entity && p.privilegeType === privilege
  );
}

/**
 * Check if user can view an entity
 */
export function canView(userPrivileges: UserPrivilege[] | undefined, entity: EntityType): boolean {
  return hasPrivilege(userPrivileges, entity, 'view');
}

/**
 * Check if user can manage (create/edit) an entity
 */
export function canManage(userPrivileges: UserPrivilege[] | undefined, entity: EntityType): boolean {
  return hasPrivilege(userPrivileges, entity, 'manage');
}

/**
 * Check if user can delete an entity
 */
export function canDelete(userPrivileges: UserPrivilege[] | undefined, entity: EntityType): boolean {
  return hasPrivilege(userPrivileges, entity, 'delete');
}

/**
 * Check if user can create an entity (requires manage privilege)
 */
export function canCreate(userPrivileges: UserPrivilege[] | undefined, entity: EntityType): boolean {
  return canManage(userPrivileges, entity);
}

/**
 * Check if user can edit an entity (requires manage privilege)
 */
export function canEdit(userPrivileges: UserPrivilege[] | undefined, entity: EntityType): boolean {
  return canManage(userPrivileges, entity);
}
