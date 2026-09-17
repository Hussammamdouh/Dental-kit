#!/usr/bin/env node

const { db } = require('../config/firebase');

async function inspectInventory() {
  try {
    console.log('🔍 Inspecting product inventory in Firestore...\n');
    const snapshot = await db.collection('products').limit(15).get();
    
    console.log(`Examining ${snapshot.size} sample products:`);
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log({
        id: doc.id,
        name: data.name || data.title,
        stock: data.stock,
        quantity: data.quantity,
        inventory: data.inventory,
        inStock: data.inStock,
        isActive: data.isActive
      });
    });

    const allSnapshot = await db.collection('products').get();
    let zeroOrNullStock = 0;
    let positiveStock = 0;
    let missingStock = 0;

    allSnapshot.forEach(doc => {
      const d = doc.data();
      if (d.stock === undefined && d.quantity === undefined) {
        missingStock++;
      } else if ((d.stock || 0) <= 0 && (d.quantity || 0) <= 0) {
        zeroOrNullStock++;
      } else {
        positiveStock++;
      }
    });

    console.log('\n--- Summary across ALL products ---');
    console.log(`Total Products: ${allSnapshot.size}`);
    console.log(`Positive stock: ${positiveStock}`);
    console.log(`Zero or negative stock: ${zeroOrNullStock}`);
    console.log(`Missing stock/quantity field: ${missingStock}`);

  } catch (err) {
    console.error('Error inspecting:', err);
  } finally {
    process.exit(0);
  }
}

inspectInventory();
