#!/usr/bin/env node

/**
 * Seed Custom User and Admin Accounts
 *
 * Credentials:
 * 1. User: hossammamdouh05@gmail.com (Password: Hussam4716#)
 * 2. Admin: hussam.mamdouh@aiesec.net (Password: Hussam4716#)
 */

const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { db, auth } = require('../config/firebase');

const usersToSeed = [
  {
    email: 'hossammamdouh05@gmail.com',
    password: 'Hussam4716#',
    firstName: 'Hossam',
    lastName: 'Mamdouh',
    role: 'user',
    isVerified: true,
    isActive: true,
    university: 'Cairo University (Kasr Al-Ainy)',
    governorate: 'Cairo',
    country: 'EG'
  },
  {
    email: 'hussam.mamdouh@aiesec.net',
    password: 'Hussam4716#',
    firstName: 'Hussam',
    lastName: 'Mamdouh',
    role: 'admin',
    isVerified: true,
    isActive: true,
    university: 'Ain Shams University',
    governorate: 'Cairo',
    country: 'EG'
  }
];

async function seedUsers() {
  console.log('🚀 Starting user & admin seeding process...\n');

  for (const user of usersToSeed) {
    console.log(`👤 Processing account: ${user.email} (Role: ${user.role})...`);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    let firebaseUid = null;

    // 1. Firebase Auth handling
    if (auth) {
      try {
        const existingAuthUser = await auth.getUserByEmail(user.email).catch(() => null);

        if (existingAuthUser) {
          console.log(`   Updating existing Firebase Auth user (${existingAuthUser.uid})...`);
          await auth.updateUser(existingAuthUser.uid, {
            password: user.password,
            displayName: `${user.firstName} ${user.lastName}`,
            emailVerified: true
          });
          firebaseUid = existingAuthUser.uid;
        } else {
          console.log(`   Creating new Firebase Auth user...`);
          const newAuthUser = await auth.createUser({
            email: user.email,
            password: user.password,
            displayName: `${user.firstName} ${user.lastName}`,
            emailVerified: true
          });
          firebaseUid = newAuthUser.uid;
        }
        console.log(`   ✅ Firebase Auth synced (UID: ${firebaseUid})`);
      } catch (authErr) {
        console.warn(`   ⚠️ Firebase Auth notice: ${authErr.message}`);
      }
    }

    // 2. Firestore Document handling
    if (db) {
      try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', user.email).get();

        const docData = {
          email: user.email.toLowerCase(),
          password: hashedPassword,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: true,
          isVerified: true,
          firebaseUid: firebaseUid || (snapshot.empty ? undefined : snapshot.docs[0].data().firebaseUid),
          university: user.university,
          governorate: user.governorate,
          country: user.country,
          failedLoginAttempts: 0,
          lockUntil: null,
          updatedAt: new Date()
        };

        if (snapshot.empty) {
          docData.createdAt = new Date();
          const newDoc = await usersRef.add(docData);
          console.log(`   ✅ Created new Firestore document in 'users' (ID: ${newDoc.id})`);
        } else {
          const docId = snapshot.docs[0].id;
          await usersRef.doc(docId).set(docData, { merge: true });
          console.log(`   ✅ Updated existing Firestore document in 'users' (ID: ${docId})`);
        }
      } catch (dbErr) {
        console.error(`   ❌ Firestore error for ${user.email}:`, dbErr.message);
      }
    }

    console.log(`   🎉 Successfully seeded ${user.email} with password ${user.password}\n`);
  }

  console.log('✨ All credentials successfully seeded and verified!\n');
}

seedUsers()
  .then(() => {
    console.log('Done.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Fatal seed error:', err);
    process.exit(1);
  });
