#!/usr/bin/env node

const unifiedStore = require('../services/unifiedStore');

async function flushCache() {
  try {
    console.log('🧹 Clearing product caches in unifiedStore...');
    await unifiedStore.clearCache('products:*');
    console.log('✅ Product cache cleared successfully!');
  } catch (err) {
    console.warn('Cache clear note:', err.message);
  } finally {
    process.exit(0);
  }
}

flushCache();
