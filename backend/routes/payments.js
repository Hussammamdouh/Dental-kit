const express = require('express');
const { body, param } = require('express-validator');
const paymentController = require('../controlllers/paymentController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

const router = express.Router();

// Create payment invoice for an order
router.post('/invoice/create', [
  auth,
  body('orderId').notEmpty().withMessage('Order ID is required'),
], validate, paymentController.createPaymentInvoice);

// Check payment invoice status
router.get('/status/:orderId', [
  auth,
  param('orderId').notEmpty().withMessage('Order ID is required'),
], validate, paymentController.checkPaymentStatus);

// Delete payment invoice
router.delete('/invoice/:orderId', [
  auth,
  param('orderId').notEmpty().withMessage('Order ID is required'),
], validate, paymentController.deletePaymentInvoice);

// Payment webhook (no auth required - Shakeout will call this)
router.post('/webhook', [
  body('invoiceId').optional().notEmpty().withMessage('Invoice ID is required'),
  body('invoiceRef').optional().notEmpty().withMessage('Invoice reference is required'),
  body('orderId').optional().notEmpty().withMessage('Order ID is required'),
], validate, paymentController.paymentWebhook);

module.exports = router;


