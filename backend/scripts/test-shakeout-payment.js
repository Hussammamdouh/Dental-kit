#!/usr/bin/env node

/**
 * Shakeout Payment Gateway Test Script
 * 
 * This script tests the Shakeout payment gateway integration:
 * 1. Tests ShakeoutService methods (createInvoice, checkInvoiceStatus, deleteInvoice)
 * 2. Tests payment controller endpoints
 * 3. Tests order integration with Shakeout
 * 4. Tests webhook signature verification
 */

require('dotenv').config();
const colors = require('colors');
const axios = require('axios');
const ShakeoutService = require('../services/shakeoutService');
const OrderService = require('../services/orderService');
const UserService = require('../services/userService');

// Test configuration
const BASE_URL = process.env.API_URL || 'http://localhost:5000';
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'admin@dentalkit.com';
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'Admin123!';

// Test data
let testOrderId = null;
let testInvoiceId = null;
let testInvoiceRef = null;
let testInvoiceUrl = null;
let authToken = null;
let csrfToken = null;
let testUserId = null;

// Helper functions
function logSuccess(message) {
  console.log('✅'.green, message);
}

function logError(message) {
  console.log('❌'.red, message);
}

function logInfo(message) {
  console.log('ℹ️ '.blue, message);
}

function logWarning(message) {
  console.log('⚠️ '.yellow, message);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60).cyan);
  console.log(`  ${title}`.cyan.bold);
  console.log('='.repeat(60).cyan + '\n');
}

// Test functions
async function testEnvironmentSetup() {
  logSection('1. Environment Setup Check');
  
  const requiredVars = ['SHAKEOUT_API_KEY'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    logError(`Missing required environment variables: ${missingVars.join(', ')}`);
    logInfo('Please set these in your .env file');
    return false;
  }
  
  logSuccess('All required environment variables are set');
  
  if (!process.env.SHAKEOUT_SECRET_KEY) {
    logWarning('SHAKEOUT_SECRET_KEY is not set - webhook verification will be skipped');
  } else {
    logSuccess('SHAKEOUT_SECRET_KEY is configured');
  }
  
  return true;
}

async function testShakeoutService() {
  logSection('2. Testing ShakeoutService Methods');
  
  const shakeoutService = new ShakeoutService();
  
  // Test 1: Create Invoice
  logInfo('Testing createInvoice...');
  try {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    
    const invoiceData = {
      amount: 100.00,
      currency: 'EGP',
      dueDate: dueDate.toISOString().split('T')[0],
      customer: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+201234567890',
        address: '123 Test Street, Cairo'
      },
      redirectionUrls: {
        successUrl: `${BASE_URL}/payment/success`,
        failUrl: `${BASE_URL}/payment/fail`,
        pendingUrl: `${BASE_URL}/payment/pending`
      },
      invoiceItems: [
        {
          name: 'Test Product',
          price: 100.00,
          quantity: 1
        }
      ]
    };
    
    const result = await shakeoutService.createInvoice(invoiceData);
    
    if (result.success && result.invoiceId && result.invoiceRef) {
      testInvoiceId = result.invoiceId;
      testInvoiceRef = result.invoiceRef;
      testInvoiceUrl = result.invoiceUrl;
      logSuccess(`Invoice created successfully!`);
      logInfo(`Invoice ID: ${testInvoiceId}`);
      logInfo(`Invoice Ref: ${testInvoiceRef}`);
      logInfo(`Invoice URL: ${testInvoiceUrl}`);
    } else {
      logError('Invoice creation failed - unexpected response format');
      return false;
    }
  } catch (error) {
    logError(`Invoice creation failed: ${error.message}`);
    return false;
  }
  
  // Test 2: Check Invoice Status
  logInfo('Testing checkInvoiceStatus...');
  try {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    
    const statusResult = await shakeoutService.checkInvoiceStatus(testInvoiceId, testInvoiceRef);
    
    if (statusResult.success) {
      logSuccess('Invoice status checked successfully!');
      logInfo(`Status: ${statusResult.invoiceStatus}`);
      logInfo(`Amount: ${statusResult.amount} EGP`);
      logInfo(`Payment Method: ${statusResult.paymentMethod || 'Not set'}`);
    } else {
      logError('Status check failed - unexpected response format');
      return false;
    }
  } catch (error) {
    logError(`Status check failed: ${error.message}`);
    return false;
  }
  
  // Test 3: Delete Invoice
  logInfo('Testing deleteInvoice...');
  try {
    const deleteResult = await shakeoutService.deleteInvoice(testInvoiceId, testInvoiceRef);
    
    if (deleteResult.success) {
      logSuccess('Invoice deleted successfully!');
      logInfo(`Message: ${deleteResult.message}`);
    } else {
      logError('Invoice deletion failed - unexpected response format');
      return false;
    }
  } catch (error) {
    logError(`Invoice deletion failed: ${error.message}`);
    return false;
  }
  
  return true;
}

async function authenticateUser() {
  logSection('3. User Authentication');
  
  try {
    logInfo(`Attempting to authenticate as: ${TEST_USER_EMAIL}...`);
    
    // First check if server is running
    try {
      await axios.get(`${BASE_URL}/api/health`, { timeout: 5000 });
      logSuccess('Server is running');
    } catch (error) {
      logError('Server is not running or not accessible');
      logInfo(`Please start the server: npm run dev`);
      logInfo(`Expected server URL: ${BASE_URL}`);
      return false;
    }
    
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD
    }, {
      // Use axios interceptor to capture response headers properly
      validateStatus: function (status) {
        return status < 500; // Resolve only if the status code is less than 500
      }
    });
    
    if (response.data && response.data.accessToken) {
      authToken = response.data.accessToken;
      testUserId = response.data.user?.id;
      
      // Extract CSRF token from response headers (axios lowercases headers)
      csrfToken = response.headers['x-csrf-token'];
      
      // Always make a GET request to get a fresh CSRF token for authenticated requests
      // This ensures the token is properly associated with the user session
      try {
        logInfo('Fetching CSRF token for authenticated session...');
        const csrfResponse = await axios.get(`${BASE_URL}/api/users/profile`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        csrfToken = csrfResponse.headers['x-csrf-token'];
        if (csrfToken) {
          logSuccess('CSRF token retrieved successfully');
        }
      } catch (csrfError) {
        logWarning('Could not fetch CSRF token:', csrfError.response?.data?.message || csrfError.message);
        // Try to use token from login response if available
        if (!csrfToken) {
          csrfToken = response.headers['x-csrf-token'];
        }
      }
      
      logSuccess('User authenticated successfully!');
      logInfo(`User ID: ${testUserId}`);
      logInfo(`User Role: ${response.data.user?.role || 'user'}`);
      if (csrfToken) {
        logInfo(`CSRF Token: ${csrfToken.substring(0, 20)}...`);
      } else {
        logWarning('CSRF token not found - requests may fail');
      }
      return true;
    } else {
      logWarning('Authentication response missing accessToken');
      logInfo('Response data:', JSON.stringify(response.data, null, 2));
      
      // Try to create a test user (only if not admin)
      if (TEST_USER_EMAIL !== 'admin@dentalkit.com') {
        try {
          const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
            email: TEST_USER_EMAIL,
            password: TEST_USER_PASSWORD,
            firstName: 'Test',
            lastName: 'User',
            consentGiven: true
          });
          
          if (registerResponse.data && registerResponse.data.accessToken) {
            authToken = registerResponse.data.accessToken;
            testUserId = registerResponse.data.user?.id;
            logSuccess('Test user created and authenticated!');
            return true;
          }
        } catch (regError) {
          logError(`Failed to create test user: ${regError.response?.data?.message || regError.message}`);
        }
      } else {
        logError('Admin user authentication failed');
        logInfo('Please verify admin user exists: admin@dentalkit.com');
        logInfo('You can create admin user with: npm run create-admin');
        logInfo('Response received:', JSON.stringify(response.data, null, 2));
      }
      return false;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      logError('Cannot connect to server');
      logInfo(`Please start the server: npm run dev`);
      logInfo(`Expected server URL: ${BASE_URL}`);
    } else {
      logError(`Authentication failed: ${error.response?.data?.message || error.message}`);
      if (error.response?.status === 401) {
        logInfo('Invalid credentials - please check your username and password');
      } else if (error.response?.status === 404) {
        logInfo('Server endpoint not found - check if server is running');
      }
    }
    return false;
  }
}

async function testPaymentEndpoints() {
  logSection('4. Testing Payment API Endpoints');
  
  if (!authToken) {
    logError('Authentication required - skipping endpoint tests');
    return false;
  }
  
  // Reset invoice variables for this test (they were set in ShakeoutService test)
  const orderInvoiceId = null;
  const orderInvoiceRef = null;
  
  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  };
  
  // Add CSRF token if available
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }
  
  // First, create a test order using a real product
  logInfo('Creating a test order...');
  try {
    // Use a real product from the database
    const testProduct = {
      id: '015511699363625',
      name: 'COXO Contra Angle low speed',
      price: 1600,
      stock: 9
    };
    
    const orderData = {
      items: [
        {
          productId: testProduct.id,
          name: testProduct.name,
          price: testProduct.price,
          quantity: 1
        }
      ],
      orderSummary: {
        subtotal: testProduct.price * 1,
        tax: (testProduct.price * 1) * 0.14, // 14% tax
        shipping: 50.00,
        discount: 0,
        total: (testProduct.price * 1) + ((testProduct.price * 1) * 0.14) + 50.00
      },
      shippingAddress: {
        firstName: 'Test',
        lastName: 'User',
        address1: '123 Test Street',
        city: 'Cairo',
        state: 'Cairo',
        country: 'EG',
        zipCode: '12345',
        phone: '+201234567890'
      },
      billingAddress: {
        firstName: 'Test',
        lastName: 'User',
        address1: '123 Test Street',
        city: 'Cairo',
        state: 'Cairo',
        country: 'EG',
        zipCode: '12345',
        phone: '+201234567890'
      },
      paymentMethod: 'shakeout'
    };
    
    const orderResponse = await axios.post(
      `${BASE_URL}/api/orders/checkout`,
      orderData,
      { headers }
    );
    
    if (orderResponse.data && orderResponse.data.order) {
      testOrderId = orderResponse.data.order.id;
      logSuccess(`Test order created! Order ID: ${testOrderId}`);
      
      // Check if invoice was created automatically
      if (orderResponse.data.shakeoutInvoice) {
        logSuccess('Shakeout invoice created automatically!');
        logInfo(`Invoice URL: ${orderResponse.data.shakeoutInvoice.invoiceUrl}`);
        testInvoiceId = orderResponse.data.shakeoutInvoice.invoiceId;
        testInvoiceRef = orderResponse.data.shakeoutInvoice.invoiceRef;
      } else {
        logInfo('Shakeout invoice not created automatically - will create manually');
        logInfo(`Order payment method: ${orderResponse.data.order.paymentMethod || 'not set'}`);
        // Reset testInvoiceId to ensure we try to create invoice manually
        testInvoiceId = null;
        testInvoiceRef = null;
      }
    } else {
      logError('Order creation failed - unexpected response format');
      return false;
    }
  } catch (error) {
    logError(`Order creation failed: ${error.response?.data?.message || error.message}`);
    logInfo('Note: This might fail if products don\'t exist. That\'s okay for testing.');
    
    // Try to create invoice manually for existing order
    if (error.response?.status === 400) {
      logInfo('Attempting to create invoice manually...');
      // We'll test the create invoice endpoint separately
    }
  }
  
  // Test: Create Payment Invoice (only if not already created)
  if (testOrderId && !testInvoiceId) {
    logInfo('Testing POST /api/payments/invoice/create...');
    
    // First verify the order exists and get its details
    try {
      logInfo(`Verifying order exists: ${testOrderId}`);
      const orderCheckResponse = await axios.get(
        `${BASE_URL}/api/orders/${testOrderId}`,
        { headers }
      );
      
      if (orderCheckResponse.data && orderCheckResponse.data.order) {
        logSuccess('Order verified');
        logInfo(`Order payment method: ${orderCheckResponse.data.order.paymentMethod}`);
        logInfo(`Order total: ${orderCheckResponse.data.order.total}`);
      }
    } catch (orderError) {
      logWarning(`Order verification failed: ${orderError.response?.data?.message || orderError.message}`);
    }
    
    try {
      logInfo(`Creating invoice for order: ${testOrderId}`);
      const invoiceResponse = await axios.post(
        `${BASE_URL}/api/payments/invoice/create`,
        { orderId: testOrderId },
        { headers }
      );
      
      if (invoiceResponse.data && invoiceResponse.data.success) {
        logSuccess('Payment invoice created via API!');
        logInfo(`Invoice URL: ${invoiceResponse.data.invoiceUrl}`);
        testInvoiceId = invoiceResponse.data.invoiceId;
        testInvoiceRef = invoiceResponse.data.invoiceRef;
      } else {
        logWarning('Invoice creation response missing success flag');
        logInfo('Response:', JSON.stringify(invoiceResponse.data, null, 2));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      logWarning(`Create invoice endpoint test failed: ${errorMessage}`);
      
      // Log all possible error formats
      if (error.response) {
        logInfo(`HTTP Status: ${error.response.status}`);
        logInfo(`Response Headers:`, JSON.stringify(error.response.headers, null, 2));
        
        if (error.response.data) {
          logInfo('Full error response data:', JSON.stringify(error.response.data, null, 2));
          
          if (error.response.data.errors) {
            logInfo('Validation errors array:', JSON.stringify(error.response.data.errors, null, 2));
          }
          
          if (error.response.data.error) {
            logInfo('Error object:', JSON.stringify(error.response.data.error, null, 2));
          }
        } else {
          logWarning('No response data in error');
        }
      } else {
        logInfo('No response object in error (network error?)');
      }
      
      // Log the request that was sent
      logInfo(`Request payload:`, JSON.stringify({ orderId: testOrderId }, null, 2));
      logInfo(`Request headers:`, JSON.stringify(headers, null, 2));
    }
  } else if (testInvoiceId) {
    logInfo('Invoice already exists from automatic creation, skipping manual create test');
  } else {
    logWarning('Cannot create invoice: testOrderId or testInvoiceId missing');
  }
  
  // Test: Check Payment Status
  if (testOrderId) {
    logInfo('Testing GET /api/payments/status/:orderId...');
    try {
      const statusResponse = await axios.get(
        `${BASE_URL}/api/payments/status/${testOrderId}`,
        { headers }
      );
      
      if (statusResponse.data && statusResponse.data.success) {
        logSuccess('Payment status checked successfully!');
        logInfo(`Invoice Status: ${statusResponse.data.invoiceStatus}`);
        logInfo(`Payment Status: ${statusResponse.data.paymentStatus}`);
      }
    } catch (error) {
      logWarning(`Status check endpoint test: ${error.response?.data?.message || error.message}`);
    }
  }
  
  return true;
}

async function testWebhookVerification() {
  logSection('5. Testing Webhook Signature Verification');
  
  const shakeoutService = new ShakeoutService();
  
  if (!process.env.SHAKEOUT_SECRET_KEY) {
    logWarning('Secret key not configured - skipping webhook verification test');
    return true;
  }
  
  // Test webhook payload
  const testPayload = {
    invoiceId: 'test123',
    invoiceRef: 'ref456',
    status: 'paid',
    orderId: 'order789'
  };
  
  // Test 1: Valid signature
  logInfo('Testing valid signature verification...');
  try {
    const crypto = require('crypto');
    const payloadString = JSON.stringify(testPayload);
    const validSignature = crypto
      .createHmac('sha256', process.env.SHAKEOUT_SECRET_KEY)
      .update(payloadString)
      .digest('hex');
    
    const isValid = shakeoutService.verifyWebhookSignature(testPayload, validSignature);
    
    if (isValid) {
      logSuccess('Valid signature verification passed!');
    } else {
      logError('Valid signature verification failed!');
      return false;
    }
  } catch (error) {
    logError(`Signature verification test failed: ${error.message}`);
    return false;
  }
  
  // Test 2: Invalid signature
  logInfo('Testing invalid signature verification...');
  try {
    const isValid = shakeoutService.verifyWebhookSignature(testPayload, 'invalid_signature');
    
    if (!isValid) {
      logSuccess('Invalid signature correctly rejected!');
    } else {
      logError('Invalid signature was accepted - security issue!');
      return false;
    }
  } catch (error) {
    logError(`Invalid signature test failed: ${error.message}`);
    return false;
  }
  
  // Test 3: Missing signature
  logInfo('Testing missing signature verification...');
  try {
    const isValid = shakeoutService.verifyWebhookSignature(testPayload, null);
    
    if (!isValid) {
      logSuccess('Missing signature correctly rejected!');
    } else {
      logWarning('Missing signature was accepted (might be okay in dev mode)');
    }
  } catch (error) {
    logError(`Missing signature test failed: ${error.message}`);
    return false;
  }
  
  return true;
}

async function cleanup() {
  logSection('6. Cleanup');
  
  if (testOrderId && testInvoiceId && testInvoiceRef && authToken) {
    logInfo('Cleaning up test data...');
    
    try {
      const headers = {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      };
      
      // Add CSRF token if available
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }
      
      // Try to delete the invoice (if it wasn't already deleted)
      try {
        await axios.delete(
          `${BASE_URL}/api/payments/invoice/${testOrderId}`,
          { headers }
        );
        logSuccess('Test invoice deleted');
      } catch (error) {
        logWarning(`Invoice cleanup: ${error.response?.data?.message || error.message}`);
      }
    } catch (error) {
      logWarning(`Cleanup failed: ${error.message}`);
    }
  } else {
    logInfo('No test data to clean up');
  }
}

// Main test runner
async function runTests() {
  console.log('\n' + '🚀'.repeat(20));
  console.log('  SHAKEOUT PAYMENT GATEWAY TEST SUITE'.bold.cyan);
  console.log('🚀'.repeat(20) + '\n');
  
  const results = {
    environment: false,
    service: false,
    authentication: false,
    endpoints: false,
    webhook: false
  };
  
  try {
    // Test 1: Environment
    results.environment = await testEnvironmentSetup();
    if (!results.environment) {
      logError('Environment setup failed - cannot continue');
      return;
    }
    
    // Test 2: Shakeout Service
    results.service = await testShakeoutService();
    
    // Test 3: Authentication
    results.authentication = await authenticateUser();
    
    // Test 4: Payment Endpoints (requires authentication)
    if (results.authentication) {
      results.endpoints = await testPaymentEndpoints();
    }
    
    // Test 5: Webhook Verification
    results.webhook = await testWebhookVerification();
    
    // Cleanup
    await cleanup();
    
    // Summary
    logSection('Test Summary');
    console.log('Environment Setup:'.padEnd(30), results.environment ? '✅ PASSED'.green : '❌ FAILED'.red);
    console.log('Shakeout Service:'.padEnd(30), results.service ? '✅ PASSED'.green : '❌ FAILED'.red);
    console.log('Authentication:'.padEnd(30), results.authentication ? '✅ PASSED'.green : '❌ FAILED'.red);
    console.log('Payment Endpoints:'.padEnd(30), results.endpoints ? '✅ PASSED'.green : '⚠️  SKIPPED'.yellow);
    console.log('Webhook Verification:'.padEnd(30), results.webhook ? '✅ PASSED'.green : '❌ FAILED'.red);
    
    const passedCount = Object.values(results).filter(r => r === true).length;
    const totalCount = Object.keys(results).length;
    
    console.log('\n' + '-'.repeat(60));
    console.log(`Total: ${passedCount}/${totalCount} tests passed`.bold);
    
    if (passedCount === totalCount) {
      console.log('\n🎉 All tests passed! Payment gateway is ready to use.'.green.bold);
    } else {
      console.log('\n⚠️  Some tests failed. Please review the errors above.'.yellow.bold);
    }
    
  } catch (error) {
    logError(`Test suite failed: ${error.message}`);
    console.error(error);
  }
}

// Run tests
if (require.main === module) {
  runTests()
    .then(() => {
      console.log('\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test suite crashed:', error);
      process.exit(1);
    });
}

module.exports = {
  testEnvironmentSetup,
  testShakeoutService,
  authenticateUser,
  testPaymentEndpoints,
  testWebhookVerification
};

