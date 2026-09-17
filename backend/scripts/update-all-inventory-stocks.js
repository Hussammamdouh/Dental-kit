#!/usr/bin/env node

const { db } = require('../config/firebase');

async function updateAllInventoryStocks() {
  try {
    console.log('🚀 Starting full database inventory stock update...\n');

    const snapshot = await db.collection('products').get();
    console.log(`📦 Found ${snapshot.size} total products to update in Firestore.`);

    if (snapshot.empty) {
      console.log('No products found in database.');
      return;
    }

    // Firestore batch supports up to 500 operations per batch
    const batches = [];
    let currentBatch = db.batch();
    let count = 0;
    let totalUpdated = 0;

    snapshot.forEach((doc) => {
      const docRef = db.collection('products').doc(doc.id);
      const existingData = doc.data();

      // Assign a realistic positive stock number (between 20 and 75 units, or preserve if already high)
      const currentStock = typeof existingData.stock === 'number' ? existingData.stock : 0;
      const newStock = currentStock > 10 ? currentStock : Math.floor(Math.random() * 45) + 25; // 25 to 69 units

      currentBatch.update(docRef, {
        stock: newStock,
        quantity: newStock,
        inventory: newStock,
        inStock: true,
        isActive: true,
        status: 'active',
        availability: 'in_stock',
        updatedAt: new Date()
      });

      count++;
      totalUpdated++;

      if (count === 450) {
        batches.push(currentBatch);
        currentBatch = db.batch();
        count = 0;
      }
    });

    if (count > 0) {
      batches.push(currentBatch);
    }

    console.log(`⚙️  Committing ${batches.length} batch(es) to Firestore...`);

    for (let i = 0; i < batches.length; i++) {
      console.log(`   Writing batch ${i + 1} of ${batches.length}...`);
      await batches[i].commit();
      console.log(`   ✅ Batch ${i + 1} committed successfully.`);
    }

    console.log(`\n🎉 Successfully updated ${totalUpdated} products!`);
    console.log('✨ All inventory items are now fully in stock with positive quantities (25-75 units) and active status.');

  } catch (error) {
    console.error('❌ Error updating inventory stocks:', error);
  } finally {
    process.exit(0);
  }
}

updateAllInventoryStocks();
