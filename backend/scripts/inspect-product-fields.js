#!/usr/bin/env node

const { db } = require('../config/firebase');

async function inspectProductFields() {
  const snapshot = await db.collection('products').limit(10).get();
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`ID: ${doc.id}`);
    console.log('  name:', data.name);
    console.log('  price:', data.price, typeof data.price);
    console.log('  images:', data.images, typeof data.images);
    console.log('  image:', data.image, typeof data.image);
    console.log('  imageUrl:', data.imageUrl, typeof data.imageUrl);
    console.log('  stock:', data.stock, typeof data.stock);
    console.log('---');
  });
  process.exit(0);
}

inspectProductFields();
