#!/usr/bin/env node

const { db } = require('../config/firebase');

async function checkCollectionsAndStocks() {
  try {
    console.log('🔍 Checking collections in Firestore...');
    const collections = await db.listCollections();
    console.log('Collections found:', collections.map(c => c.id));

    for (const col of collections) {
      const snap = await col.limit(1).get();
      console.log(`Collection ${col.id}: total fetched sample doc exists? ${!snap.empty}`);
    }

    // Check packages collection if exists
    try {
      const pkgSnap = await db.collection('packages').get();
      console.log(`\nPackages count: ${pkgSnap.size}`);
      pkgSnap.forEach(d => {
        const data = d.data();
        console.log(`Package: ${data.name || d.id}, inStock: ${data.inStock}, stock: ${data.stock}`);
      });
    } catch (e) {
      console.log('Packages check error:', e.message);
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

checkCollectionsAndStocks();
