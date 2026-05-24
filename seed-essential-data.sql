-- ============================================
-- NurseCare Essential Data Seed Script
-- ============================================
-- This script populates essential database tables with realistic test data
-- Tables: activities, daily_reports, check_in_out, photos, fees, payments, invoices

-- ============================================
-- 1. SEED ACTIVITIES (10 records)
-- ============================================
INSERT INTO activities (name, description, ageGroupMin, ageGroupMax, duration, activityType, createdAt, updatedAt) VALUES
('Story Time', 'Interactive storytelling with colorful books', 1, 3, 30, 'learning', NOW(), NOW()),
('Music & Dance', 'Fun music and movement activities', 2, 4, 45, 'physical', NOW(), NOW()),
('Art & Craft', 'Creative painting and drawing sessions', 1, 4, 60, 'creative', NOW(), NOW()),
('Outdoor Play', 'Supervised outdoor activities and games', 2, 4, 60, 'physical', NOW(), NOW()),
('Snack Time', 'Healthy snacks and nutrition education', 1, 4, 20, 'nutrition', NOW(), NOW()),
('Nap Time', 'Quiet rest period with supervision', 1, 3, 90, 'rest', NOW(), NOW()),
('Science Exploration', 'Simple science experiments and exploration', 3, 4, 45, 'learning', NOW(), NOW()),
('Language Development', 'Language learning and vocabulary building', 1, 4, 30, 'learning', NOW(), NOW()),
('Social Skills', 'Group activities for social development', 2, 4, 40, 'social', NOW(), NOW()),
('Water Play', 'Safe water activities and sensory play', 2, 4, 45, 'physical', NOW(), NOW());

-- ============================================
-- 2. SEED DAILY REPORTS (25 records)
-- ============================================
INSERT INTO daily_reports (childId, reportDate, mood, appetite, sleep, activities, notes, createdAt, updatedAt) VALUES
(1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'happy', 'good', 2, JSON_ARRAY('Story Time'), 'Child had a great day today.', NOW(), NOW()),
(1, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'neutral', 'fair', 2, JSON_ARRAY('Music & Dance'), 'Good participation in activities.', NOW(), NOW()),
(1, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'happy', 'good', 2, JSON_ARRAY('Art & Craft'), 'Very creative today.', NOW(), NOW()),
(1, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'fussy', 'poor', 1, JSON_ARRAY('Outdoor Play'), 'A bit tired today.', NOW(), NOW()),
(1, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'happy', 'good', 3, JSON_ARRAY('Science Exploration'), 'Excellent participation.', NOW(), NOW()),

(2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'happy', 'good', 2, JSON_ARRAY('Music & Dance'), 'Very energetic today.', NOW(), NOW()),
(2, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'happy', 'good', 2, JSON_ARRAY('Art & Craft'), 'Made beautiful artwork.', NOW(), NOW()),
(2, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'neutral', 'fair', 2, JSON_ARRAY('Story Time'), 'Good listener today.', NOW(), NOW()),
(2, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'happy', 'good', 2, JSON_ARRAY('Water Play'), 'Had lots of fun.', NOW(), NOW()),
(2, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'happy', 'good', 2, JSON_ARRAY('Outdoor Play'), 'Great day overall.', NOW(), NOW()),

(3, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'happy', 'good', 2, JSON_ARRAY('Art & Craft'), 'Creative and engaged.', NOW(), NOW()),
(3, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'happy', 'good', 2, JSON_ARRAY('Science Exploration'), 'Very curious today.', NOW(), NOW()),
(3, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'neutral', 'fair', 1, JSON_ARRAY('Story Time'), 'A bit sleepy.', NOW(), NOW()),
(3, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'happy', 'good', 2, JSON_ARRAY('Music & Dance'), 'Enjoyed the music.', NOW(), NOW()),
(3, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'happy', 'good', 2, JSON_ARRAY('Outdoor Play'), 'Active and happy.', NOW(), NOW()),

(4, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'happy', 'good', 2, JSON_ARRAY('Water Play'), 'Loved water activities.', NOW(), NOW()),
(4, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'happy', 'good', 2, JSON_ARRAY('Outdoor Play'), 'Great social interaction.', NOW(), NOW()),
(4, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'happy', 'good', 2, JSON_ARRAY('Art & Craft'), 'Very creative.', NOW(), NOW()),
(4, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'neutral', 'fair', 2, JSON_ARRAY('Story Time'), 'Good day.', NOW(), NOW()),
(4, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'happy', 'good', 2, JSON_ARRAY('Music & Dance'), 'Enjoyed dancing.', NOW(), NOW()),

(5, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'happy', 'good', 2, JSON_ARRAY('Science Exploration'), 'Very inquisitive.', NOW(), NOW()),
(5, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'happy', 'good', 2, JSON_ARRAY('Art & Craft'), 'Made nice artwork.', NOW(), NOW()),
(5, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'happy', 'good', 2, JSON_ARRAY('Outdoor Play'), 'Active and engaged.', NOW(), NOW()),
(5, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'happy', 'good', 2, JSON_ARRAY('Music & Dance'), 'Great participation.', NOW(), NOW()),
(5, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'neutral', 'fair', 2, JSON_ARRAY('Story Time'), 'Quiet day.', NOW(), NOW());

-- ============================================
-- 3. SEED CHECK-IN/OUT RECORDS (15 records)
-- ============================================
INSERT INTO check_in_out (childId, checkInTime, checkOutTime, checkedInBy, checkedOutBy, createdAt, updatedAt) VALUES
(1, CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 07:30:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 16:45:00'), 1, 1, NOW(), NOW()),
(1, CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 07:45:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 16:30:00'), 1, 1, NOW(), NOW()),
(1, CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 08:00:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 17:00:00'), 1, 1, NOW(), NOW()),

(2, CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 07:15:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 16:15:00'), 1, 1, NOW(), NOW()),
(2, CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 07:30:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 16:45:00'), 1, 1, NOW(), NOW()),
(2, CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 08:15:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 17:15:00'), 1, 1, NOW(), NOW()),

(3, CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 07:45:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 16:30:00'), 1, 1, NOW(), NOW()),
(3, CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 08:00:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 17:00:00'), 1, 1, NOW(), NOW()),
(3, CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 07:30:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 16:45:00'), 1, 1, NOW(), NOW()),

(4, CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 08:00:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 17:00:00'), 1, 1, NOW(), NOW()),
(4, CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 07:45:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 16:30:00'), 1, 1, NOW(), NOW()),
(4, CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 07:15:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 16:15:00'), 1, 1, NOW(), NOW()),

(5, CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 07:30:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 16:45:00'), 1, 1, NOW(), NOW()),
(5, CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 08:15:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 17:15:00'), 1, 1, NOW(), NOW()),
(5, CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 07:45:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 16:30:00'), 1, 1, NOW(), NOW());

-- ============================================
-- 4. SEED PHOTOS (15 records)
-- ============================================
INSERT INTO photos (childId, photoUrl, description, uploadedBy, createdAt, updatedAt) VALUES
(1, 'https://via.placeholder.com/400x300?text=Photo1', 'Child playing with blocks', 1, NOW(), NOW()),
(1, 'https://via.placeholder.com/400x300?text=Photo2', 'Group activity - story time', 1, NOW(), NOW()),
(2, 'https://via.placeholder.com/400x300?text=Photo3', 'Outdoor play time', 1, NOW(), NOW()),
(2, 'https://via.placeholder.com/400x300?text=Photo4', 'Art and craft session', 1, NOW(), NOW()),
(3, 'https://via.placeholder.com/400x300?text=Photo5', 'Snack time with friends', 1, NOW(), NOW()),
(3, 'https://via.placeholder.com/400x300?text=Photo6', 'Music and dance class', 1, NOW(), NOW()),
(4, 'https://via.placeholder.com/400x300?text=Photo7', 'Science exploration activity', 1, NOW(), NOW()),
(4, 'https://via.placeholder.com/400x300?text=Photo8', 'Water play fun', 1, NOW(), NOW()),
(5, 'https://via.placeholder.com/400x300?text=Photo9', 'Social skills activity', 1, NOW(), NOW()),
(5, 'https://via.placeholder.com/400x300?text=Photo10', 'Nap time rest', 1, NOW(), NOW()),
(1, 'https://via.placeholder.com/400x300?text=Photo11', 'Child painting', 1, NOW(), NOW()),
(2, 'https://via.placeholder.com/400x300?text=Photo12', 'Playing with toys', 1, NOW(), NOW()),
(3, 'https://via.placeholder.com/400x300?text=Photo13', 'Learning activity', 1, NOW(), NOW()),
(4, 'https://via.placeholder.com/400x300?text=Photo14', 'Group play', 1, NOW(), NOW()),
(5, 'https://via.placeholder.com/400x300?text=Photo15', 'Reading time', 1, NOW(), NOW());

-- ============================================
-- 5. SEED FEES (5 records)
-- ============================================
INSERT INTO fees (name, description, amount, frequency, createdAt, updatedAt) VALUES
('Monthly Tuition', 'Monthly tuition fee', 500.00, 'monthly', NOW(), NOW()),
('Registration Fee', 'One-time registration fee', 100.00, 'once', NOW(), NOW()),
('Activity Fee', 'Monthly activity and supplies fee', 50.00, 'monthly', NOW(), NOW()),
('Meal Plan', 'Monthly meal and snack plan', 100.00, 'monthly', NOW(), NOW()),
('Transportation', 'Monthly transportation fee', 75.00, 'monthly', NOW(), NOW());

-- ============================================
-- 6. SEED PAYMENTS (15 records)
-- ============================================
INSERT INTO payments (childId, amount, paymentDate, paymentMethod, status, notes, createdAt, updatedAt) VALUES
(1, 550.00, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'credit_card', 'completed', 'Monthly tuition payment', NOW(), NOW()),
(1, 500.00, DATE_SUB(CURDATE(), INTERVAL 30 DAY), 'bank_transfer', 'completed', 'Monthly tuition payment', NOW(), NOW()),
(1, 525.00, DATE_SUB(CURDATE(), INTERVAL 60 DAY), 'cash', 'completed', 'Monthly tuition payment', NOW(), NOW()),

(2, 500.00, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'credit_card', 'completed', 'Monthly tuition payment', NOW(), NOW()),
(2, 575.00, DATE_SUB(CURDATE(), INTERVAL 32 DAY), 'bank_transfer', 'completed', 'Monthly tuition payment', NOW(), NOW()),
(2, 500.00, DATE_SUB(CURDATE(), INTERVAL 62 DAY), 'check', 'completed', 'Monthly tuition payment', NOW(), NOW()),

(3, 525.00, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'credit_card', 'completed', 'Monthly tuition payment', NOW(), NOW()),
(3, 500.00, DATE_SUB(CURDATE(), INTERVAL 33 DAY), 'cash', 'completed', 'Monthly tuition payment', NOW(), NOW()),
(3, 550.00, DATE_SUB(CURDATE(), INTERVAL 63 DAY), 'bank_transfer', 'completed', 'Monthly tuition payment', NOW(), NOW()),

(4, 500.00, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'bank_transfer', 'completed', 'Monthly tuition payment', NOW(), NOW()),
(4, 575.00, DATE_SUB(CURDATE(), INTERVAL 34 DAY), 'credit_card', 'completed', 'Monthly tuition payment', NOW(), NOW()),
(4, 500.00, DATE_SUB(CURDATE(), INTERVAL 64 DAY), 'cash', 'completed', 'Monthly tuition payment', NOW(), NOW()),

(5, 550.00, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'check', 'completed', 'Monthly tuition payment', NOW(), NOW()),
(5, 500.00, DATE_SUB(CURDATE(), INTERVAL 35 DAY), 'credit_card', 'completed', 'Monthly tuition payment', NOW(), NOW()),
(5, 525.00, DATE_SUB(CURDATE(), INTERVAL 65 DAY), 'bank_transfer', 'completed', 'Monthly tuition payment', NOW(), NOW());

-- ============================================
-- 7. SEED INVOICES (15 records)
-- ============================================
INSERT INTO invoices (childId, invoiceNumber, invoiceDate, dueDate, amount, status, description, createdAt, updatedAt) VALUES
(1, 'INV-2026-05-001', DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL 30 DAY), 550.00, 'paid', 'Monthly invoice for nursery services', NOW(), NOW()),
(1, 'INV-2026-04-001', DATE_SUB(CURDATE(), INTERVAL 31 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 31 DAY), INTERVAL 30 DAY), 500.00, 'paid', 'Monthly invoice for nursery services', NOW(), NOW()),
(1, 'INV-2026-03-001', DATE_SUB(CURDATE(), INTERVAL 61 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 61 DAY), INTERVAL 30 DAY), 525.00, 'paid', 'Monthly invoice for nursery services', NOW(), NOW()),

(2, 'INV-2026-05-002', DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL 30 DAY), 500.00, 'paid', 'Monthly invoice for nursery services', NOW(), NOW()),
(2, 'INV-2026-04-002', DATE_SUB(CURDATE(), INTERVAL 32 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 32 DAY), INTERVAL 30 DAY), 575.00, 'paid', 'Monthly invoice for nursery services', NOW(), NOW()),
(2, 'INV-2026-03-002', DATE_SUB(CURDATE(), INTERVAL 62 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 62 DAY), INTERVAL 30 DAY), 500.00, 'pending', 'Monthly invoice for nursery services', NOW(), NOW()),

(3, 'INV-2026-05-003', DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL 30 DAY), 525.00, 'paid', 'Monthly invoice for nursery services', NOW(), NOW()),
(3, 'INV-2026-04-003', DATE_SUB(CURDATE(), INTERVAL 33 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 33 DAY), INTERVAL 30 DAY), 500.00, 'paid', 'Monthly invoice for nursery services', NOW(), NOW()),
(3, 'INV-2026-03-003', DATE_SUB(CURDATE(), INTERVAL 63 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 63 DAY), INTERVAL 30 DAY), 550.00, 'paid', 'Monthly invoice for nursery services', NOW(), NOW()),

(4, 'INV-2026-05-004', DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL 30 DAY), 500.00, 'paid', 'Monthly invoice for nursery services', NOW(), NOW()),
(4, 'INV-2026-04-004', DATE_SUB(CURDATE(), INTERVAL 34 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 34 DAY), INTERVAL 30 DAY), 575.00, 'pending', 'Monthly invoice for nursery services', NOW(), NOW()),
(4, 'INV-2026-03-004', DATE_SUB(CURDATE(), INTERVAL 64 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 64 DAY), INTERVAL 30 DAY), 500.00, 'paid', 'Monthly invoice for nursery services', NOW(), NOW()),

(5, 'INV-2026-05-005', DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL 30 DAY), 550.00, 'paid', 'Monthly invoice for nursery services', NOW(), NOW()),
(5, 'INV-2026-04-005', DATE_SUB(CURDATE(), INTERVAL 35 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 35 DAY), INTERVAL 30 DAY), 500.00, 'paid', 'Monthly invoice for nursery services', NOW(), NOW()),
(5, 'INV-2026-03-005', DATE_SUB(CURDATE(), INTERVAL 65 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 65 DAY), INTERVAL 30 DAY), 525.00, 'paid', 'Monthly invoice for nursery services', NOW(), NOW());

-- ============================================
-- SUMMARY
-- ============================================
-- Total records inserted:
-- Activities: 10
-- Daily Reports: 25
-- Check-In/Out: 15
-- Photos: 15
-- Fees: 5
-- Payments: 15
-- Invoices: 15
-- TOTAL: 100 records
-- ============================================
