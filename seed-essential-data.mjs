#!/usr/bin/env node

/**
 * Seed Script for Essential NurseCare Tables
 * 
 * This script populates essential database tables with realistic test data:
 * - activities
 * - daily_reports
 * - check_in_out
 * - photos
 * - fees
 * - payments
 * - invoices
 * 
 * Usage: node seed-essential-data.mjs
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/')[3] || 'nursery_db',
  waitForConnections: true,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

async function seedData() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🌱 Starting seed data insertion...\n');

    // 1. Seed Activities
    console.log('📚 Seeding Activities...');
    await connection.query(`
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
      ('Water Play', 'Safe water activities and sensory play', 2, 4, 45, 'physical', NOW(), NOW())
    `);
    console.log('✅ Activities seeded (10 records)\n');

    // 2. Seed Daily Reports
    console.log('📝 Seeding Daily Reports...');
    const childrenIds = [1, 2, 3, 4, 5];
    let reportCount = 0;
    
    for (const childId of childrenIds) {
      for (let day = 1; day <= 5; day++) {
        const reportDate = new Date();
        reportDate.setDate(reportDate.getDate() - day);
        
        await connection.query(`
          INSERT INTO daily_reports (childId, reportDate, mood, appetite, sleep, activities, notes, createdAt, updatedAt) VALUES
          (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, [
          childId,
          reportDate.toISOString().split('T')[0],
          ['happy', 'neutral', 'fussy'][Math.floor(Math.random() * 3)],
          ['good', 'fair', 'poor'][Math.floor(Math.random() * 3)],
          Math.floor(Math.random() * 3) + 1,
          JSON.stringify(['Story Time', 'Music & Dance', 'Art & Craft'][Math.floor(Math.random() * 3)]),
          `Child had a ${['great', 'good', 'fair'][Math.floor(Math.random() * 3)]} day today.`
        ]);
        reportCount++;
      }
    }
    console.log(`✅ Daily Reports seeded (${reportCount} records)\n`);

    // 3. Seed Check-In/Out Records
    console.log('⏰ Seeding Check-In/Out Records...');
    let checkInOutCount = 0;
    
    for (const childId of childrenIds) {
      for (let day = 1; day <= 3; day++) {
        const checkInDate = new Date();
        checkInDate.setDate(checkInDate.getDate() - day);
        
        const checkInTime = new Date(checkInDate);
        checkInTime.setHours(7 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0);
        
        const checkOutTime = new Date(checkInDate);
        checkOutTime.setHours(16 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0);
        
        await connection.query(`
          INSERT INTO check_in_out (childId, checkInTime, checkOutTime, checkedInBy, checkedOutBy, createdAt, updatedAt) VALUES
          (?, ?, ?, ?, ?, NOW(), NOW())
        `, [
          childId,
          checkInTime.toISOString(),
          checkOutTime.toISOString(),
          1,
          1
        ]);
        checkInOutCount++;
      }
    }
    console.log(`✅ Check-In/Out Records seeded (${checkInOutCount} records)\n`);

    // 4. Seed Photos
    console.log('📸 Seeding Photos...');
    const photoDescriptions = [
      'Child playing with blocks',
      'Group activity - story time',
      'Outdoor play time',
      'Art and craft session',
      'Snack time with friends',
      'Music and dance class',
      'Science exploration activity',
      'Water play fun',
      'Social skills activity',
      'Nap time rest'
    ];
    
    let photoCount = 0;
    for (let i = 0; i < 15; i++) {
      await connection.query(`
        INSERT INTO photos (childId, photoUrl, description, uploadedBy, createdAt, updatedAt) VALUES
        (?, ?, ?, ?, NOW(), NOW())
      `, [
        childrenIds[Math.floor(Math.random() * childrenIds.length)],
        `https://via.placeholder.com/400x300?text=Photo${i + 1}`,
        photoDescriptions[Math.floor(Math.random() * photoDescriptions.length)],
        1
      ]);
      photoCount++;
    }
    console.log(`✅ Photos seeded (${photoCount} records)\n`);

    // 5. Seed Fees
    console.log('💰 Seeding Fees...');
    const feeTypes = [
      { name: 'Monthly Tuition', amount: 500, frequency: 'monthly' },
      { name: 'Registration Fee', amount: 100, frequency: 'once' },
      { name: 'Activity Fee', amount: 50, frequency: 'monthly' },
      { name: 'Meal Plan', amount: 100, frequency: 'monthly' },
      { name: 'Transportation', amount: 75, frequency: 'monthly' }
    ];
    
    for (const fee of feeTypes) {
      await connection.query(`
        INSERT INTO fees (name, description, amount, frequency, createdAt, updatedAt) VALUES
        (?, ?, ?, ?, NOW(), NOW())
      `, [
        fee.name,
        `${fee.name} - ${fee.frequency}`,
        fee.amount,
        fee.frequency
      ]);
    }
    console.log(`✅ Fees seeded (${feeTypes.length} records)\n`);

    // 6. Seed Payments
    console.log('💳 Seeding Payments...');
    const paymentMethods = ['credit_card', 'bank_transfer', 'cash', 'check'];
    let paymentCount = 0;
    
    for (const childId of childrenIds) {
      for (let month = 1; month <= 3; month++) {
        const paymentDate = new Date();
        paymentDate.setMonth(paymentDate.getMonth() - month);
        
        await connection.query(`
          INSERT INTO payments (childId, amount, paymentDate, paymentMethod, status, notes, createdAt, updatedAt) VALUES
          (?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, [
          childId,
          500 + Math.floor(Math.random() * 200),
          paymentDate.toISOString().split('T')[0],
          paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          'completed',
          'Monthly tuition payment'
        ]);
        paymentCount++;
      }
    }
    console.log(`✅ Payments seeded (${paymentCount} records)\n`);

    // 7. Seed Invoices
    console.log('📄 Seeding Invoices...');
    let invoiceCount = 0;
    
    for (const childId of childrenIds) {
      for (let month = 1; month <= 3; month++) {
        const invoiceDate = new Date();
        invoiceDate.setMonth(invoiceDate.getMonth() - month);
        
        const dueDate = new Date(invoiceDate);
        dueDate.setDate(dueDate.getDate() + 30);
        
        const invoiceNumber = `INV-${invoiceDate.getFullYear()}-${String(invoiceDate.getMonth() + 1).padStart(2, '0')}-${childId}`;
        
        await connection.query(`
          INSERT INTO invoices (childId, invoiceNumber, invoiceDate, dueDate, amount, status, description, createdAt, updatedAt) VALUES
          (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, [
          childId,
          invoiceNumber,
          invoiceDate.toISOString().split('T')[0],
          dueDate.toISOString().split('T')[0],
          500 + Math.floor(Math.random() * 200),
          Math.random() > 0.3 ? 'paid' : 'pending',
          'Monthly invoice for nursery services'
        ]);
        invoiceCount++;
      }
    }
    console.log(`✅ Invoices seeded (${invoiceCount} records)\n`);

    console.log('✨ All seed data inserted successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Activities: 10`);
    console.log(`   - Daily Reports: ${reportCount}`);
    console.log(`   - Check-In/Out: ${checkInOutCount}`);
    console.log(`   - Photos: ${photoCount}`);
    console.log(`   - Fees: ${feeTypes.length}`);
    console.log(`   - Payments: ${paymentCount}`);
    console.log(`   - Invoices: ${invoiceCount}`);
    console.log(`\n✅ Total: ${10 + reportCount + checkInOutCount + photoCount + feeTypes.length + paymentCount + invoiceCount} records\n`);

  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  } finally {
    await connection.release();
    await pool.end();
  }
}

// Run the seed script
seedData().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
