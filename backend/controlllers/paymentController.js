const ShakeoutService = require('../services/shakeoutService');
const OrderService = require('../services/orderService');
const UserService = require('../services/userService');

const shakeoutService = new ShakeoutService();
const orderService = new OrderService();

/**
 * Create a payment invoice for an order
 */
exports.createPaymentInvoice = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ 
        success: false,
        message: 'Order ID is required' 
      });
    }

    // Get order details
    const order = await orderService.getOrderById(orderId);
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // Verify order belongs to user
    if (order.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied' 
      });
    }

    // Check if order already has a payment invoice
    if (order.shakeoutInvoiceId && order.shakeoutInvoiceRef) {
      // Check if invoice is still valid
      try {
        const status = await shakeoutService.checkInvoiceStatus(
          order.shakeoutInvoiceId,
          order.shakeoutInvoiceRef
        );
        
        if (status.invoiceStatus === 'unpaid' || status.invoiceStatus === 'pending') {
          return res.json({
            success: true,
            invoiceUrl: order.shakeoutInvoiceUrl,
            invoiceId: order.shakeoutInvoiceId,
            invoiceRef: order.shakeoutInvoiceRef,
            orderId: order.id,
            message: 'Invoice already exists'
          });
        }
      } catch (error) {
        // Invoice might be expired or deleted, create a new one
        console.log('Previous invoice check failed, creating new invoice:', error.message);
      }
    }

    // Get user details
    const userService = new UserService();
    const user = await userService.getById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Prepare customer information from order or user
    const customer = {
      firstName: order.shippingAddress?.firstName || user.firstName || 'Customer',
      lastName: order.shippingAddress?.lastName || user.lastName || '',
      email: user.email,
      phone: order.shippingAddress?.phone || user.phone || '+201000000000',
      address: order.shippingAddress?.address1 || 
               `${order.shippingAddress?.city || ''} ${order.shippingAddress?.state || ''}`.trim() || 
               'Address not provided'
    };

    // Prepare invoice items from order
    const invoiceItems = order.items.map(item => ({
      name: item.name || 'Product',
      price: item.price || 0,
      quantity: item.quantity || 1
    }));

    // Calculate due date (7 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    // Prepare redirection URLs
    const baseUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000';
    const redirectionUrls = {
      successUrl: `${baseUrl}/payment/success?orderId=${order.id}`,
      failUrl: `${baseUrl}/payment/fail?orderId=${order.id}`,
      pendingUrl: `${baseUrl}/payment/pending?orderId=${order.id}`
    };

    // Create invoice in Shakeout
    const invoiceResult = await shakeoutService.createInvoice({
      amount: order.total,
      currency: 'EGP',
      dueDate: dueDate,
      customer: customer,
      redirectionUrls: redirectionUrls,
      invoiceItems: invoiceItems,
      taxEnabled: order.tax > 0,
      taxValue: order.tax > 0 ? ((order.tax / order.subtotal) * 100) : undefined,
      discountEnabled: order.discount > 0,
      discountType: 'fixed',
      discountValue: order.discount
    });

    // Update order with invoice details
    await orderService.updateOrder(orderId, {
      shakeoutInvoiceId: invoiceResult.invoiceId,
      shakeoutInvoiceRef: invoiceResult.invoiceRef,
      shakeoutInvoiceUrl: invoiceResult.invoiceUrl,
      paymentMethod: 'shakeout',
      updatedAt: new Date()
    });

    res.json({
      success: true,
      invoiceUrl: invoiceResult.invoiceUrl,
      invoiceId: invoiceResult.invoiceId,
      invoiceRef: invoiceResult.invoiceRef,
      orderId: order.id,
      message: 'Payment invoice created successfully'
    });
  } catch (error) {
    console.error('Create payment invoice error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error creating payment invoice' 
    });
  }
};

/**
 * Check payment invoice status
 */
exports.checkPaymentStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ 
        success: false,
        message: 'Order ID is required' 
      });
    }

    // Get order details
    const order = await orderService.getOrderById(orderId);
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // Verify order belongs to user
    if (order.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied' 
      });
    }

    // Check if order has Shakeout invoice
    if (!order.shakeoutInvoiceId || !order.shakeoutInvoiceRef) {
      return res.status(400).json({ 
        success: false,
        message: 'Order does not have a Shakeout invoice' 
      });
    }

    // Check invoice status
    const statusResult = await shakeoutService.checkInvoiceStatus(
      order.shakeoutInvoiceId,
      order.shakeoutInvoiceRef
    );

    // Map Shakeout status to our payment status
    const paymentStatus = shakeoutService.mapPaymentStatus(statusResult.invoiceStatus);

    // Update order payment status if it changed
    if (order.paymentStatus !== paymentStatus) {
      const updateData = {
        paymentStatus: paymentStatus,
        updatedAt: new Date()
      };

      // If paid, update payment date and order status
      if (paymentStatus === 'paid') {
        updateData.paymentDate = new Date();
        updateData.paymentId = statusResult.referenceNumber || statusResult.invoiceId;
        
        // Update order status to confirmed if it's still pending
        if (order.status === 'pending') {
          updateData.status = 'confirmed';
          updateData.confirmedAt = new Date();
        }
      }

      await orderService.updateOrder(orderId, updateData);
    }

    res.json({
      success: true,
      orderId: order.id,
      invoiceStatus: statusResult.invoiceStatus,
      paymentStatus: paymentStatus,
      paymentMethod: statusResult.paymentMethod,
      amount: statusResult.amount,
      referenceNumber: statusResult.referenceNumber,
      updatedAt: statusResult.updatedAt,
      invoiceId: statusResult.invoiceId,
      invoiceRef: statusResult.invoiceRef
    });
  } catch (error) {
    console.error('Check payment status error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error checking payment status' 
    });
  }
};

/**
 * Delete a payment invoice
 */
exports.deletePaymentInvoice = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ 
        success: false,
        message: 'Order ID is required' 
      });
    }

    // Get order details
    const order = await orderService.getOrderById(orderId);
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // Verify order belongs to user or user is admin
    if (order.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied' 
      });
    }

    // Check if order has Shakeout invoice
    if (!order.shakeoutInvoiceId || !order.shakeoutInvoiceRef) {
      return res.status(400).json({ 
        success: false,
        message: 'Order does not have a Shakeout invoice' 
      });
    }

    // Prevent deletion if order is already paid
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot delete invoice for a paid order' 
      });
    }

    // Delete invoice from Shakeout
    await shakeoutService.deleteInvoice(
      order.shakeoutInvoiceId,
      order.shakeoutInvoiceRef
    );

    // Update order to remove invoice details
    await orderService.updateOrder(orderId, {
      shakeoutInvoiceId: null,
      shakeoutInvoiceRef: null,
      shakeoutInvoiceUrl: null,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Payment invoice deleted successfully',
      orderId: order.id
    });
  } catch (error) {
    console.error('Delete payment invoice error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error deleting payment invoice' 
    });
  }
};

/**
 * Handle payment webhook/callback from Shakeout
 * This endpoint can be called by Shakeout to notify about payment status changes
 */
exports.paymentWebhook = async (req, res) => {
  try {
    // Extract signature from headers (common header names: X-Shakeout-Signature, X-Signature, Signature)
    const signature = req.headers['x-shakeout-signature'] || 
                      req.headers['x-signature'] || 
                      req.headers['signature'];
    
    // Verify webhook signature if secret key is configured
    // Use rawBody if available (set by express.json middleware), otherwise use parsed body
    const payloadForVerification = req.rawBody || req.body;
    
    if (process.env.SHAKEOUT_SECRET_KEY) {
      const isValid = shakeoutService.verifyWebhookSignature(payloadForVerification, signature);
      if (!isValid) {
        console.warn('Invalid webhook signature received', {
          signature: signature ? 'present' : 'missing',
          headers: Object.keys(req.headers).filter(h => h.toLowerCase().includes('signature'))
        });
        return res.status(401).json({ 
          success: false,
          message: 'Invalid webhook signature' 
        });
      }
    }

    // Extract invoice information from request
    // Note: Shakeout documentation doesn't specify webhook format,
    // so this is a placeholder that can be updated based on actual webhook payload
    const { invoiceId, invoiceRef, status, orderId } = req.body;

    if (!invoiceId || !invoiceRef) {
      return res.status(400).json({ 
        success: false,
        message: 'Invoice ID and reference are required' 
      });
    }

    // If orderId is provided, use it; otherwise, find order by invoice details
    let order;
    if (orderId) {
      order = await orderService.getOrderById(orderId);
    } else {
      // Find order by invoice ID (would need to query orders collection)
      // For now, we'll require orderId in webhook payload
      return res.status(400).json({ 
        success: false,
        message: 'Order ID is required in webhook payload' 
      });
    }

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // Verify invoice matches order
    if (order.shakeoutInvoiceId !== invoiceId || order.shakeoutInvoiceRef !== invoiceRef) {
      return res.status(400).json({ 
        success: false,
        message: 'Invoice does not match order' 
      });
    }

    // Map Shakeout status to our payment status
    const paymentStatus = shakeoutService.mapPaymentStatus(status);

    // Update order payment status
    const updateData = {
      paymentStatus: paymentStatus,
      updatedAt: new Date()
    };

    // If paid, update payment date and order status
    if (paymentStatus === 'paid') {
      updateData.paymentDate = new Date();
      updateData.paymentId = req.body.referenceNumber || invoiceId;
      
      // Update order status to confirmed if it's still pending
      if (order.status === 'pending') {
        updateData.status = 'confirmed';
        updateData.confirmedAt = new Date();
      }
    }

    await orderService.updateOrder(orderId, updateData);

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      orderId: order.id,
      paymentStatus: paymentStatus
    });
  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error processing webhook' 
    });
  }
};

