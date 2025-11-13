// Vercel serverless function handler
// This file exports the Express app as a serverless function

const app = require('../app');

// Log that the function is being loaded
console.log('✅ Vercel serverless function loaded - api/index.js');

// Export the Express app as a serverless function
// Vercel's @vercel/node adapter will automatically handle the request/response conversion
module.exports = app;

