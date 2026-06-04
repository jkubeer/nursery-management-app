-- Insert permissions
INSERT INTO permissions (name, description, category) VALUES ('view_dashboard', 'View Dashboard', 'Dashboard');
INSERT INTO permissions (name, description, category) VALUES ('view_staff', 'View Staff', 'Staff');
INSERT INTO permissions (name, description, category) VALUES ('manage_staff', 'Manage Staff (Create/Edit)', 'Staff');
INSERT INTO permissions (name, description, category) VALUES ('delete_staff', 'Delete Staff', 'Staff');
INSERT INTO permissions (name, description, category) VALUES ('view_children', 'View Children', 'Children');
INSERT INTO permissions (name, description, category) VALUES ('manage_children', 'Manage Children (Create/Edit)', 'Children');
INSERT INTO permissions (name, description, category) VALUES ('delete_children', 'Delete Children', 'Children');
INSERT INTO permissions (name, description, category) VALUES ('view_parents', 'View Parents', 'Parents');
INSERT INTO permissions (name, description, category) VALUES ('manage_parents', 'Manage Parents (Create/Edit)', 'Parents');
INSERT INTO permissions (name, description, category) VALUES ('delete_parents', 'Delete Parents', 'Parents');
INSERT INTO permissions (name, description, category) VALUES ('view_rooms', 'View Rooms', 'Rooms');
INSERT INTO permissions (name, description, category) VALUES ('manage_rooms', 'Manage Rooms (Create/Edit)', 'Rooms');
INSERT INTO permissions (name, description, category) VALUES ('delete_rooms', 'Delete Rooms', 'Rooms');
INSERT INTO permissions (name, description, category) VALUES ('view_activities', 'View Activities', 'Activities');
INSERT INTO permissions (name, description, category) VALUES ('manage_activities', 'Manage Activities (Create/Edit)', 'Activities');
INSERT INTO permissions (name, description, category) VALUES ('delete_activities', 'Delete Activities', 'Activities');
INSERT INTO permissions (name, description, category) VALUES ('view_checkin', 'View Check-in/Out', 'Check-in/Out');
INSERT INTO permissions (name, description, category) VALUES ('manage_checkin', 'Manage Check-in/Out', 'Check-in/Out');
INSERT INTO permissions (name, description, category) VALUES ('view_payments', 'View Payments', 'Payments');
INSERT INTO permissions (name, description, category) VALUES ('manage_payments', 'Manage Payments', 'Payments');
INSERT INTO permissions (name, description, category) VALUES ('view_photos', 'View Photos', 'Photos');
INSERT INTO permissions (name, description, category) VALUES ('manage_photos', 'Manage Photos', 'Photos');
INSERT INTO permissions (name, description, category) VALUES ('view_reports', 'View Reports', 'Reports');
INSERT INTO permissions (name, description, category) VALUES ('manage_users', 'Manage Users', 'Admin');
INSERT INTO permissions (name, description, category) VALUES ('manage_privileges', 'Manage Privileges', 'Admin');

-- Create roles
INSERT INTO roles (name, description, nurseryId) VALUES ('Admin', 'Full system access', NULL);
INSERT INTO roles (name, description, nurseryId) VALUES ('Staff', 'Staff member access', NULL);
INSERT INTO roles (name, description, nurseryId) VALUES ('Parent', 'Parent/Guardian access', NULL);

-- Assign Admin role all permissions (1-25)
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 1);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 2);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 3);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 4);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 5);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 6);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 7);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 8);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 9);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 10);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 11);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 12);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 13);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 14);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 15);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 16);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 17);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 18);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 19);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 20);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 21);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 22);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 23);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 24);
INSERT INTO role_permissions (roleId, permissionId) VALUES (1, 25);

-- Assign Staff role permissions (view_dashboard, view_staff, view_children, manage_children, view_rooms, manage_rooms, view_activities, manage_activities, view_checkin, manage_checkin)
INSERT INTO role_permissions (roleId, permissionId) VALUES (2, 1);
INSERT INTO role_permissions (roleId, permissionId) VALUES (2, 2);
INSERT INTO role_permissions (roleId, permissionId) VALUES (2, 5);
INSERT INTO role_permissions (roleId, permissionId) VALUES (2, 6);
INSERT INTO role_permissions (roleId, permissionId) VALUES (2, 11);
INSERT INTO role_permissions (roleId, permissionId) VALUES (2, 12);
INSERT INTO role_permissions (roleId, permissionId) VALUES (2, 14);
INSERT INTO role_permissions (roleId, permissionId) VALUES (2, 15);
INSERT INTO role_permissions (roleId, permissionId) VALUES (2, 17);
INSERT INTO role_permissions (roleId, permissionId) VALUES (2, 18);

-- Assign Parent role permissions (view_dashboard, view_children, view_photos, manage_photos, view_payments)
INSERT INTO role_permissions (roleId, permissionId) VALUES (3, 1);
INSERT INTO role_permissions (roleId, permissionId) VALUES (3, 5);
INSERT INTO role_permissions (roleId, permissionId) VALUES (3, 21);
INSERT INTO role_permissions (roleId, permissionId) VALUES (3, 22);
INSERT INTO role_permissions (roleId, permissionId) VALUES (3, 19);

-- Assign users to roles
-- Admin users get Admin role
INSERT INTO user_roles (userId, roleId) VALUES (1, 1);
INSERT INTO user_roles (userId, roleId) VALUES (1830008, 1);
INSERT INTO user_roles (userId, roleId) VALUES (2850004, 1);
INSERT INTO user_roles (userId, roleId) VALUES (3090001, 1);

-- Staff users get Staff role
INSERT INTO user_roles (userId, roleId) VALUES (1440016, 2);
INSERT INTO user_roles (userId, roleId) VALUES (3030006, 2);

-- Parent users get Parent role
INSERT INTO user_roles (userId, roleId) VALUES (1830020, 3);
INSERT INTO user_roles (userId, roleId) VALUES (1830021, 3);
INSERT INTO user_roles (userId, roleId) VALUES (1830022, 3);
