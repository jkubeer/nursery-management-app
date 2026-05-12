import { getDb } from "./db";
import { users, roles, userRoles, permissions, rolePermissions, userPrivileges, userActivityLogs } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

/**
 * Get all users with their roles
 */
export async function getAllUsers() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const allUsers = await db.select().from(users);
  
  const usersWithRoles = await Promise.all(
    allUsers.map(async (user: typeof users.$inferSelect) => {
      const userRolesList = await db
        .select({ role: roles })
        .from(userRoles)
        .innerJoin(roles, eq(userRoles.roleId, roles.id))
        .where(eq(userRoles.userId, user.id));
      
      return {
        ...user,
        roles: userRolesList.map((ur: any) => ur.role),
      };
    })
  );
  
  return usersWithRoles;
}

/**
 * Get user by ID with roles
 */
export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  
  if (!user.length) return null;
  
  const userRolesList = await db
    .select({ role: roles })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, userId));
  
  return {
    ...user[0],
    roles: userRolesList.map((ur: any) => ur.role),
  };
}

/**
 * Create a new user
 */
export async function createUser(data: {
  openId: string;
  name?: string;
  email?: string;
  loginMethod?: string;
  role?: "admin" | "staff" | "parent";
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(users).values(data);
  return result;
}

/**
 * Update user
 */
export async function updateUser(userId: number, data: Partial<{
  name: string;
  email: string;
  role: "admin" | "staff" | "parent";
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.update(users).set(data).where(eq(users.id, userId));
  return result;
}

/**
 * Delete user
 */
export async function deleteUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Delete user roles first
  await db.delete(userRoles).where(eq(userRoles.userId, userId));
  // Delete user privileges
  await db.delete(userPrivileges).where(eq(userPrivileges.userId, userId));
  // Delete user activity logs
  await db.delete(userActivityLogs).where(eq(userActivityLogs.userId, userId));
  // Delete user
  const result = await db.delete(users).where(eq(users.id, userId));
  return result;
}

/**
 * Get all roles
 */
export async function getAllRoles() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(roles);
}

/**
 * Create a new role
 */
export async function createRole(data: {
  name: string;
  description?: string;
  isSystem?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(roles).values(data);
  return result;
}

/**
 * Update role
 */
export async function updateRole(roleId: number, data: Partial<{
  name: string;
  description: string;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.update(roles).set(data).where(eq(roles.id, roleId));
  return result;
}

/**
 * Delete role (only if not system role)
 */
export async function deleteRole(roleId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const role = await db.select().from(roles).where(eq(roles.id, roleId)).limit(1);
  
  if (!role.length || role[0].isSystem) {
    throw new Error("Cannot delete system role");
  }
  
  // Delete role permissions
  await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));
  // Delete user roles
  await db.delete(userRoles).where(eq(userRoles.roleId, roleId));
  // Delete role
  const result = await db.delete(roles).where(eq(roles.id, roleId));
  return result;
}

/**
 * Assign role to user
 */
export async function assignRoleToUser(userId: number, roleId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Check if assignment already exists
  const existing = await db
    .select()
    .from(userRoles)
    .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)))
    .limit(1);
  
  if (existing.length) {
    return existing[0];
  }
  
  const result = await db.insert(userRoles).values({ userId, roleId });
  return result;
}

/**
 * Remove role from user
 */
export async function removeRoleFromUser(userId: number, roleId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db
    .delete(userRoles)
    .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)));
  return result;
}

/**
 * Get all permissions
 */
export async function getAllPermissions() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(permissions);
}

/**
 * Get permissions for a role
 */
export async function getPermissionsForRole(roleId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .select({ permission: permissions })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(rolePermissions.roleId, roleId));
}

/**
 * Get permissions for a user (from all assigned roles + direct privileges)
 */
export async function getPermissionsForUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Get permissions from roles
  const rolePermsList = await db
    .select({ permission: permissions })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .innerJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(userRoles.userId, userId));
  
  // Get direct user privileges
  const allDirectPrivs = await db
    .select({ permission: permissions, expiresAt: userPrivileges.expiresAt })
    .from(userPrivileges)
    .innerJoin(permissions, eq(userPrivileges.permissionId, permissions.id))
    .where(eq(userPrivileges.userId, userId));
  
  // Filter out expired privileges
  const now = new Date();
  const directPrivs = allDirectPrivs.filter(p => !p.expiresAt || p.expiresAt > now);
  
  // Combine and deduplicate
  const allPerms = [...rolePermsList, ...directPrivs.map(p => ({ permission: p.permission }))];
  const uniquePerms = Array.from(
    new Map(allPerms.map(p => [p.permission.id, p.permission])).values()
  );
  
  return uniquePerms;
}

/**
 * Log user activity
 */
export async function logUserActivity(data: {
  userId: number;
  action: string;
  entityType: string;
  entityId?: number;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(userActivityLogs).values(data);
  return result;
}

/**
 * Get user activity logs
 */
export async function getUserActivityLogs(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .select()
    .from(userActivityLogs)
    .where(eq(userActivityLogs.userId, userId))
    .orderBy(userActivityLogs.createdAt)
    .limit(limit);
}
