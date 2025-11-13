# Shakeout Payment Gateway Test Script

This script tests the Shakeout payment gateway integration to ensure everything is working correctly before moving to frontend implementation.

## Prerequisites

1. **Environment Variables**: Make sure your `.env` file has:
   ```env
   SHAKEOUT_API_KEY=your-api-key-here
   SHAKEOUT_SECRET_KEY=your-secret-key-here  # Optional but recommended
   FRONTEND_URL=http://localhost:3000  # Or your frontend URL
   ```

2. **Server Running**: The backend server should be running on `http://localhost:5000` (or set `API_URL` in `.env`)

3. **Test User**: The script uses admin user by default:
   ```env
   TEST_USER_EMAIL=admin@dentalkit.com  # Default
   TEST_USER_PASSWORD=Admin123!  # Default
   ```
   
   You can override these in `.env` if needed.

## Running the Tests

### Option 1: Using npm script
```bash
npm run test:shakeout
```

### Option 2: Direct execution
```bash
node scripts/test-shakeout-payment.js
```

## What the Script Tests

### 1. Environment Setup Check
- Verifies that `SHAKEOUT_API_KEY` is set
- Checks if `SHAKEOUT_SECRET_KEY` is configured (optional)

### 2. ShakeoutService Methods
- ✅ **createInvoice**: Creates a test invoice in Shakeout
- ✅ **checkInvoiceStatus**: Checks the status of the created invoice
- ✅ **deleteInvoice**: Deletes the test invoice

### 3. User Authentication
- Attempts to authenticate with test user credentials
- Creates a test user if one doesn't exist

### 4. Payment API Endpoints
- Creates a test order with Shakeout payment method
- Tests `POST /api/payments/invoice/create` endpoint
- Tests `GET /api/payments/status/:orderId` endpoint

### 5. Webhook Signature Verification
- Tests valid signature verification
- Tests invalid signature rejection
- Tests missing signature handling

## Expected Output

The script will output:
- ✅ Green checkmarks for successful tests
- ❌ Red X marks for failed tests
- ⚠️ Yellow warnings for skipped tests
- ℹ️ Blue info messages for additional information

## Troubleshooting

### "Missing required environment variables"
- Make sure your `.env` file has `SHAKEOUT_API_KEY` set
- Check that you're running the script from the `backend` directory

### "Authentication failed"
- Ensure the backend server is running
- Create a test user manually or check `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` in `.env`

### "Invoice creation failed"
- Verify your `SHAKEOUT_API_KEY` is correct
- Check your internet connection
- Ensure the Shakeout API is accessible

### "Order creation failed"
- This is normal if products don't exist in your database
- The script will still test other endpoints

## Notes

- The script creates real invoices in Shakeout (test mode if available)
- Test invoices are automatically deleted after testing
- Webhook verification tests use mock data (no actual webhooks sent)
- All test data is cleaned up automatically

## Next Steps

After all tests pass:
1. ✅ Payment gateway is ready for frontend integration
2. ✅ You can proceed to build payment pages in the frontend
3. ✅ Configure webhook URL in Shakeout dashboard: `https://your-domain.com/api/payments/webhook`

