const express = require('express');
const { body, param } = require('express-validator');
const paymentProfileController = require('../controlllers/paymentProfileController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all payment profiles for authenticated user
router.get('/', auth, paymentProfileController.getPaymentProfiles);

// Create a new payment profile
router.post('/', [
  auth,
  body('type').optional().isIn(['card', 'bank_account']).withMessage('Invalid payment type'),
  body('cardNumber').optional().isLength({ min: 13, max: 19 }).withMessage('Invalid card number'),
  body('cardholderName').optional().isString().trim(),
  body('expiryMonth').optional().isInt({ min: 1, max: 12 }).withMessage('Invalid expiry month'),
  body('expiryYear').optional().isInt({ min: new Date().getFullYear() }).withMessage('Invalid expiry year'),
  body('isDefault').optional().isBoolean(),
], validate, paymentProfileController.createPaymentProfile);

// Update a payment profile
router.put('/:profileId', [
  auth,
  param('profileId').notEmpty().withMessage('Profile ID is required'),
  body('type').optional().isIn(['card', 'bank_account']).withMessage('Invalid payment type'),
  body('cardNumber').optional().isLength({ min: 13, max: 19 }).withMessage('Invalid card number'),
  body('cardholderName').optional().isString().trim(),
  body('expiryMonth').optional().isInt({ min: 1, max: 12 }).withMessage('Invalid expiry month'),
  body('expiryYear').optional().isInt({ min: new Date().getFullYear() }).withMessage('Invalid expiry year'),
  body('isDefault').optional().isBoolean(),
], validate, paymentProfileController.updatePaymentProfile);

// Delete a payment profile
router.delete('/:profileId', [
  auth,
  param('profileId').notEmpty().withMessage('Profile ID is required'),
], validate, paymentProfileController.deletePaymentProfile);

// Set a payment profile as default
router.patch('/:profileId/default', [
  auth,
  param('profileId').notEmpty().withMessage('Profile ID is required'),
], validate, paymentProfileController.setDefaultPaymentProfile);

module.exports = router;




