-- ============================================
-- NurseCare Complete Users & Roles Seed Script
-- ============================================
-- This script includes:
-- 1. All existing users
-- 2. Roles and Permissions
-- 3. User-Role assignments
-- 4. User-Privileges assignments

-- ============================================
-- 1. EXISTING USERS (4 records)
-- ============================================
-- These users already exist in the database
-- User 1: Jamal Kubeer (Admin)
-- User 1290058: John Doe (Teacher)
-- User 1440016: Test User (Staff)
-- User 1470020: Dana Hmoud (Assistant)

-- ============================================
-- 2. SEED ROLES (8 records)
-- ============================================
INSERT INTO roles (name, description, isSystem, createdAt, updatedAt) VALUES
('admin', 'Administrator with full system access', true, NOW(), NOW()),
('director', 'Nursery director with management access', true, NOW(), NOW()),
('teacher', 'Teacher with classroom management access', true, NOW(), NOW()),
('assistant', 'Teaching assistant with limited classroom access', true, NOW(), NOW()),
('nurse', 'Nurse with health and medical access', true, NOW(), NOW()),
('parent', 'Parent/Guardian with child-specific access', true, NOW(), NOW()),
('staff', 'General staff member with basic access', false, NOW(), NOW()),
('accountant', 'Accountant with financial access', false, NOW(), NOW());

-- ============================================
-- 3. SEED PERMISSIONS (46 records)
-- ============================================
INSERT INTO permissions (name, description, category, createdAt) VALUES
-- Staff Management (5)
('view_staff', 'View staff members', 'staff', NOW()),
('create_staff', 'Create new staff members', 'staff', NOW()),
('edit_staff', 'Edit staff information', 'staff', NOW()),
('delete_staff', 'Delete staff members', 'staff', NOW()),
('manage_staff_schedules', 'Manage staff work schedules', 'staff', NOW()),

-- Children Management (6)
('view_children', 'View children information', 'children', NOW()),
('create_children', 'Create new child records', 'children', NOW()),
('edit_children', 'Edit child information', 'children', NOW()),
('delete_children', 'Delete child records', 'children', NOW()),
('view_child_medical', 'View child medical information', 'children', NOW()),
('edit_child_medical', 'Edit child medical information', 'children', NOW()),

-- Parents Management (4)
('view_parents', 'View parent information', 'parents', NOW()),
('create_parents', 'Create parent records', 'parents', NOW()),
('edit_parents', 'Edit parent information', 'parents', NOW()),
('delete_parents', 'Delete parent records', 'parents', NOW()),

-- Rooms Management (4)
('view_rooms', 'View room information', 'rooms', NOW()),
('create_rooms', 'Create new rooms', 'rooms', NOW()),
('edit_rooms', 'Edit room information', 'rooms', NOW()),
('delete_rooms', 'Delete rooms', 'rooms', NOW()),

-- Activities Management (5)
('view_activities', 'View activities', 'activities', NOW()),
('create_activities', 'Create activities', 'activities', NOW()),
('edit_activities', 'Edit activities', 'activities', NOW()),
('delete_activities', 'Delete activities', 'activities', NOW()),
('manage_attendance', 'Manage activity attendance', 'activities', NOW()),

-- Daily Reports (4)
('view_daily_reports', 'View daily reports', 'reports', NOW()),
('create_daily_reports', 'Create daily reports', 'reports', NOW()),
('edit_daily_reports', 'Edit daily reports', 'reports', NOW()),
('delete_daily_reports', 'Delete daily reports', 'reports', NOW()),

-- Check-in/Out (3)
('view_checkin_out', 'View check-in/out records', 'attendance', NOW()),
('create_checkin_out', 'Create check-in/out records', 'attendance', NOW()),
('edit_checkin_out', 'Edit check-in/out records', 'attendance', NOW()),

-- Photos (3)
('view_photos', 'View photos', 'photos', NOW()),
('upload_photos', 'Upload photos', 'photos', NOW()),
('delete_photos', 'Delete photos', 'photos', NOW()),

-- Payments & Invoices (7)
('view_payments', 'View payment records', 'payments', NOW()),
('create_payments', 'Create payment records', 'payments', NOW()),
('edit_payments', 'Edit payment records', 'payments', NOW()),
('view_invoices', 'View invoices', 'payments', NOW()),
('create_invoices', 'Create invoices', 'payments', NOW()),
('edit_invoices', 'Edit invoices', 'payments', NOW()),
('manage_fees', 'Manage fee structures', 'payments', NOW()),

-- System Management (5)
('manage_users', 'Manage user accounts', 'system', NOW()),
('manage_roles', 'Manage roles and permissions', 'system', NOW()),
('view_audit_logs', 'View audit logs', 'system', NOW()),
('system_settings', 'Access system settings', 'system', NOW()),
('manage_notifications', 'Manage notifications', 'system', NOW());

-- ============================================
-- 4. SEED ROLE-PERMISSION MAPPINGS (136 records)
-- ============================================

-- Admin role gets all permissions
INSERT INTO role_permissions (roleId, permissionId, createdAt)
SELECT 1, id, NOW() FROM permissions;

-- Director role gets most permissions except system management
INSERT INTO role_permissions (roleId, permissionId, createdAt)
SELECT 2, id, NOW() FROM permissions WHERE category != 'system';

-- Teacher role gets classroom-related permissions
INSERT INTO role_permissions (roleId, permissionId, createdAt)
SELECT 3, id, NOW() FROM permissions WHERE category IN ('children', 'activities', 'reports', 'attendance', 'photos');

-- Assistant role gets limited classroom permissions
INSERT INTO role_permissions (roleId, permissionId, createdAt)
SELECT 4, id, NOW() FROM permissions WHERE name IN ('view_children', 'view_activities', 'view_daily_reports', 'create_daily_reports', 'view_checkin_out', 'view_photos', 'upload_photos');

-- Nurse role gets medical and health-related permissions
INSERT INTO role_permissions (roleId, permissionId, createdAt)
SELECT 5, id, NOW() FROM permissions WHERE name IN ('view_children', 'view_child_medical', 'edit_child_medical', 'view_daily_reports', 'create_daily_reports', 'view_checkin_out');

-- Parent role gets child-specific read-only permissions
INSERT INTO role_permissions (roleId, permissionId, createdAt)
SELECT 6, id, NOW() FROM permissions WHERE name IN ('view_children', 'view_daily_reports', 'view_photos');

-- Staff role gets basic permissions
INSERT INTO role_permissions (roleId, permissionId, createdAt)
SELECT 7, id, NOW() FROM permissions WHERE name IN ('view_children', 'view_activities', 'view_daily_reports', 'view_checkin_out', 'view_photos');

-- Accountant role gets financial permissions
INSERT INTO role_permissions (roleId, permissionId, createdAt)
SELECT 8, id, NOW() FROM permissions WHERE category = 'payments';

-- ============================================
-- 5. SEED USER-ROLE ASSIGNMENTS (4 records)
-- ============================================
INSERT INTO user_roles (userId, roleId, assignedAt) VALUES
-- User 1: Jamal Kubeer - Admin
(1, 1, NOW()),

-- User 1290058: John Doe - Teacher
(1290058, 3, NOW()),

-- User 1440016: Test User - Staff
(1440016, 7, NOW()),

-- User 1470020: Dana Hmoud - Assistant
(1470020, 4, NOW());

-- ============================================
-- 6. SEED USER-PRIVILEGES (9 records)
-- ============================================

-- Grant admin user (ID: 1) additional system privileges
INSERT INTO user_privileges (userId, permissionId, grantedBy, grantedAt, expiresAt)
SELECT 1, id, 1, NOW(), NULL FROM permissions WHERE category = 'system';

-- Grant teacher (ID: 1290058) additional report editing privileges
INSERT INTO user_privileges (userId, permissionId, grantedBy, grantedAt, expiresAt)
SELECT 1290058, id, 1, NOW(), NULL FROM permissions WHERE name IN ('edit_daily_reports', 'create_checkin_out', 'edit_checkin_out');

-- Grant assistant (ID: 1470020) temporary photo upload privilege (expires in 90 days)
INSERT INTO user_privileges (userId, permissionId, grantedBy, grantedAt, expiresAt)
SELECT 1470020, id, 1, NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY) FROM permissions WHERE name = 'upload_photos';

-- ============================================
-- USERS SUMMARY
-- ============================================
-- ID: 1
-- Name: Jamal Kubeer
-- Email: j.kubeer@e.net.kw
-- Role: Admin
-- Permissions: 46 (all permissions)
-- 
-- ID: 1290058
-- Name: John Doe
-- Email: john@example.com
-- Role: Teacher
-- Permissions: 21 + 3 additional
-- 
-- ID: 1440016
-- Name: Test User
-- Email: testuser@example.com
-- Role: Staff
-- Permissions: 5
-- 
-- ID: 1470020
-- Name: Dana Hmoud
-- Email: kubeerja@yahoo.com
-- Role: Assistant
-- Permissions: 7 + 1 temporary (90 days)

-- ============================================
-- TOTAL DATA SEEDED
-- ============================================
-- Users: 4 (existing)
-- Roles: 8
-- Permissions: 46
-- Role-Permissions: 136
-- User-Roles: 4
-- User-Privileges: 9
-- TOTAL: 207 records

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the seed data:

-- Show all users with their roles and permission counts:
-- SELECT 
--   u.id,
--   u.name,
--   u.email,
--   r.name as role,
--   COUNT(DISTINCT rp.permissionId) as role_permissions,
--   COUNT(DISTINCT up.id) as user_privileges
-- FROM users u
-- LEFT JOIN user_roles ur ON u.id = ur.userId
-- LEFT JOIN roles r ON ur.roleId = r.id
-- LEFT JOIN role_permissions rp ON r.id = rp.roleId
-- LEFT JOIN user_privileges up ON u.id = up.userId
-- GROUP BY u.id, u.name, u.email, r.name
-- ORDER BY u.id;

-- Show role summary:
-- SELECT 
--   r.id,
--   r.name,
--   r.description,
--   COUNT(rp.id) as permission_count,
--   COUNT(DISTINCT ur.userId) as user_count
-- FROM roles r
-- LEFT JOIN role_permissions rp ON r.id = rp.roleId
-- LEFT JOIN user_roles ur ON r.id = ur.roleId
-- GROUP BY r.id, r.name, r.description
-- ORDER BY r.id;

-- Show permissions by category:
-- SELECT 
--   category,
--   COUNT(*) as permission_count
-- FROM permissions
-- GROUP BY category
-- ORDER BY category;

-- Show user permissions (role + direct privileges):
-- SELECT 
--   u.id,
--   u.name,
--   p.name as permission,
--   p.category,
--   'role' as source
-- FROM users u
-- JOIN user_roles ur ON u.id = ur.userId
-- JOIN roles r ON ur.roleId = r.id
-- JOIN role_permissions rp ON r.id = rp.roleId
-- JOIN permissions p ON rp.permissionId = p.id
-- UNION ALL
-- SELECT 
--   u.id,
--   u.name,
--   p.name as permission,
--   p.category,
--   'direct' as source
-- FROM users u
-- JOIN user_privileges up ON u.id = up.userId
-- JOIN permissions p ON up.permissionId = p.id
-- WHERE up.expiresAt IS NULL OR up.expiresAt > NOW()
-- ORDER BY id, permission;
