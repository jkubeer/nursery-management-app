-- ============================================
-- NurseCare Users Seed Script
-- ============================================
-- This script creates test users with various roles and login methods
-- Includes: Admin, Staff, Teachers, Assistants, Nurses, and Parents

-- ============================================
-- INSERT TEST USERS (15 additional users)
-- ============================================
-- Note: Passwords are hashed using bcrypt
-- Test password: "password123" hashed

INSERT INTO users (openId, email, name, passwordHash, loginMethod, role, createdAt, updatedAt, lastSignedIn) VALUES

-- ============================================
-- ADMIN USERS (2)
-- ============================================
(NULL, 'admin@nursery.com', 'Admin User', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVm', 'password', 'admin', NOW(), NOW(), NOW()),
(NULL, 'director@nursery.com', 'Sarah Johnson', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVm', 'password', 'admin', NOW(), NOW(), NOW()),

-- ============================================
-- STAFF USERS - TEACHERS (5)
-- ============================================
(NULL, 'teacher1@nursery.com', 'Emily Williams', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVm', 'password', 'staff', NOW(), NOW(), NOW()),
(NULL, 'teacher2@nursery.com', 'Michael Brown', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVm', 'password', 'staff', NOW(), NOW(), NOW()),
(NULL, 'teacher3@nursery.com', 'Jessica Davis', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVm', 'password', 'staff', NOW(), NOW(), NOW()),
(NULL, 'teacher4@nursery.com', 'David Martinez', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVm', 'password', 'staff', NOW(), NOW(), NOW()),
(NULL, 'teacher5@nursery.com', 'Lisa Anderson', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVm', 'password', 'staff', NOW(), NOW(), NOW()),

-- ============================================
-- STAFF USERS - ASSISTANTS (3)
-- ============================================
(NULL, 'assistant1@nursery.com', 'Amanda Taylor', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVm', 'password', 'staff', NOW(), NOW(), NOW()),
(NULL, 'assistant2@nursery.com', 'Robert Wilson', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVm', 'password', 'staff', NOW(), NOW(), NOW()),
(NULL, 'assistant3@nursery.com', 'Jennifer Moore', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVm', 'password', 'staff', NOW(), NOW(), NOW()),

-- ============================================
-- STAFF USERS - NURSES (2)
-- ============================================
(NULL, 'nurse1@nursery.com', 'Patricia Jackson', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVm', 'password', 'staff', NOW(), NOW(), NOW()),
(NULL, 'nurse2@nursery.com', 'Christopher White', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVm', 'password', 'staff', NOW(), NOW(), NOW()),

-- ============================================
-- PARENT USERS (3)
-- ============================================
(NULL, 'parent1@example.com', 'Mark Thompson', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVm', 'password', 'parent', NOW(), NOW(), NOW()),
(NULL, 'parent2@example.com', 'Susan Harris', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVm', 'password', 'parent', NOW(), NOW(), NOW()),
(NULL, 'parent3@example.com', 'James Martin', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVm', 'password', 'parent', NOW(), NOW(), NOW());

-- ============================================
-- USER SUMMARY
-- ============================================
-- Total Users Added: 15
-- 
-- Admin Users: 2
--   - admin@nursery.com (Admin User)
--   - director@nursery.com (Sarah Johnson)
--
-- Staff Users: 10
--   Teachers (5):
--     - teacher1@nursery.com (Emily Williams)
--     - teacher2@nursery.com (Michael Brown)
--     - teacher3@nursery.com (Jessica Davis)
--     - teacher4@nursery.com (David Martinez)
--     - teacher5@nursery.com (Lisa Anderson)
--   
--   Assistants (3):
--     - assistant1@nursery.com (Amanda Taylor)
--     - assistant2@nursery.com (Robert Wilson)
--     - assistant3@nursery.com (Jennifer Moore)
--   
--   Nurses (2):
--     - nurse1@nursery.com (Patricia Jackson)
--     - nurse2@nursery.com (Christopher White)
--
-- Parent Users: 3
--   - parent1@example.com (Mark Thompson)
--   - parent2@example.com (Susan Harris)
--   - parent3@example.com (James Martin)

-- ============================================
-- LOGIN CREDENTIALS
-- ============================================
-- All test users use:
-- Password: password123
-- Login Method: password (email/password login)
--
-- Example login:
-- Email: teacher1@nursery.com
-- Password: password123

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the seed data:

-- Show all users by role:
-- SELECT 
--   role,
--   COUNT(*) as user_count,
--   GROUP_CONCAT(email SEPARATOR ', ') as emails
-- FROM users
-- GROUP BY role
-- ORDER BY role;

-- Show all users with details:
-- SELECT 
--   id,
--   email,
--   name,
--   role,
--   loginMethod,
--   createdAt
-- FROM users
-- ORDER BY role, id;

-- Show users created in this seed:
-- SELECT 
--   id,
--   email,
--   name,
--   role,
--   createdAt
-- FROM users
-- WHERE email LIKE '%@nursery.com' OR email LIKE '%@example.com'
-- ORDER BY id;

-- Count users by role:
-- SELECT 
--   'admin' as role, COUNT(*) as count 
--   FROM users WHERE role = 'admin'
-- UNION ALL
-- SELECT 
--   'staff', COUNT(*) 
--   FROM users WHERE role = 'staff'
-- UNION ALL
-- SELECT 
--   'parent', COUNT(*) 
--   FROM users WHERE role = 'parent';
