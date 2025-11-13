const OrderService = require('../services/orderService');
const CartService = require('../services/cartService');
const ProductService = require('../services/productService');
const ShakeoutService = require('../services/shakeoutService');
const UserService = require('../services/userService');

const orderService = new OrderService();
const cartService = new CartService();
const productService = new ProductService();
const shakeoutService = new ShakeoutService();

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      sortBy,
      sortOrder
    };

    const result = await orderService.getUserOrders(userId, options);
    res.json(result);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Get order by ID
exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await orderService.getOrderById(id);
    
    // Check if user owns this order
    if (order.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(404).json({ message: 'Order not found' });
  }
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderData = req.body;

    // Use cart items from request body (frontend local storage)
    const cartItems = orderData.items || [];
    
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate products and stock
    const validatedItems = [];
    for (const item of cartItems) {
      const product = await productService.getProductById(item.productId);
      
      if (!product || !product.isActive) {
        return res.status(400).json({ 
          message: `Product ${item.name || item.productId} is no longer available` 
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}` 
        });
      }
      
      validatedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image
      });
    }

    // Calculate totals from order summary or cart items
    const orderSummary = orderData.orderSummary || {};
    const subtotal = orderSummary.subtotal || cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = orderSummary.tax || 0;
    const shipping = orderSummary.shipping || 0;
    const discount = orderSummary.discount || 0;
    const total = orderSummary.total || subtotal + tax + shipping - discount;

    // Create order
    const order = await orderService.createOrder({
      userId,
      items: validatedItems,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      paymentMethod: orderData.paymentMethod,
      notes: orderData.customerNotes || orderData.notes
    });

    // Update product stock
    for (const item of validatedItems) {
      await productService.updateStock(item.productId, item.quantity, 'decrease');
    }

    // Create Shakeout invoice if payment method is shakeout
    let shakeoutInvoiceData = null;
    if (orderData.paymentMethod === 'shakeout') {
      let customer = null; // Declare outside try block for error logging
      try {
        const userService = new UserService();
        const user = await userService.getById(userId);
        
        // Prepare customer information
        customer = {
          firstName: orderData.shippingAddress?.firstName || user?.firstName || 'Customer',
          lastName: orderData.shippingAddress?.lastName || user?.lastName || '',
          email: req.user.email,
          phone: orderData.shippingAddress?.phone || user?.phone || '+201000000000',
          address: orderData.shippingAddress?.address1 || 
                   `${orderData.shippingAddress?.city || ''} ${orderData.shippingAddress?.state || ''}`.trim() || 
                   'Address not provided'
        };

        // Prepare invoice items
        const invoiceItems = validatedItems.map(item => ({
          name: item.name || 'Product',
          price: item.price || 0,
          quantity: item.quantity || 1
        }));

        // Calculate due date (7 days from now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);
        
        // Format due date as YYYY-MM-DD for Shakeout API
        const formattedDueDate = dueDate.toISOString().split('T')[0];

        // Prepare redirection URLs
        const baseUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000';
        const redirectionUrls = {
          successUrl: `${baseUrl}/payment/success?orderId=${order.id}`,
          failUrl: `${baseUrl}/payment/fail?orderId=${order.id}`,
          pendingUrl: `${baseUrl}/payment/pending?orderId=${order.id}`
        };

        // Create invoice in Shakeout
        const invoiceResult = await shakeoutService.createInvoice({
          amount: total,
          currency: 'EGP',
          dueDate: formattedDueDate,
          customer: customer,
          redirectionUrls: redirectionUrls,
          invoiceItems: invoiceItems,
          taxEnabled: tax > 0,
          taxValue: tax > 0 ? ((tax / subtotal) * 100) : undefined,
          discountEnabled: discount > 0,
          discountType: 'fixed',
          discountValue: discount
        });

        // Update order with invoice details
        await orderService.updateOrder(order.id, {
          shakeoutInvoiceId: invoiceResult.invoiceId,
          shakeoutInvoiceRef: invoiceResult.invoiceRef,
          shakeoutInvoiceUrl: invoiceResult.invoiceUrl
        });

        shakeoutInvoiceData = {
          invoiceUrl: invoiceResult.invoiceUrl,
          invoiceId: invoiceResult.invoiceId,
          invoiceRef: invoiceResult.invoiceRef
        };
      } catch (shakeoutError) {
        console.error('Shakeout invoice creation error:', shakeoutError);
        console.error('Error details:', {
          message: shakeoutError.message,
          stack: shakeoutError.stack,
          orderId: order.id,
          paymentMethod: orderData.paymentMethod,
          customer: customer || 'Not initialized',
          invoiceItemsCount: validatedItems.length,
          total: total,
          subtotal: subtotal,
          tax: tax
        });
        // Don't fail the order creation if invoice creation fails
        // The user can create the invoice later via the payment endpoint
      }
    }

    // Send order confirmation email (non-blocking)
    try {
      const sendEmail = require('../utils/email');
      const orderUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order.id}`;
      await sendEmail({
        to: req.user.email,
        subject: `Your order ${order.id} is confirmed`,
        template: 'order-confirmation',
        context: {
          customerName: `${orderData?.shippingAddress?.firstName || req.user.firstName || ''} ${orderData?.shippingAddress?.lastName || req.user.lastName || ''}`.trim() || req.user.email,
          orderNumber: order.id,
          orderDate: new Date(order.createdAt || Date.now()).toLocaleString(),
          paymentMethod: orderData.paymentMethod,
          shippingMethod: orderData.shippingMethod || 'standard',
          items: validatedItems,
          subtotal: subtotal.toFixed(2),
          shipping: shipping.toFixed(2),
          tax: tax.toFixed(2),
          total: total.toFixed(2),
          shippingAddress: orderData.shippingAddress || {},
          orderUrl,
          estimatedDelivery: new Date(Date.now() + (orderData.shippingMethod === 'express' ? 2 : orderData.shippingMethod === 'overnight' ? 1 : 5) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          customerEmail: req.user.email
        }
      });

      // Notify admin about the new order
      await sendEmail({
        to: 'artcode-admin@dentalkit.org',
        subject: `New order received - ${order.id}`,
        template: 'new-order-notification',
        context: {
          orderNumber: order.id,
          customerName: `${orderData?.shippingAddress?.firstName || req.user.firstName || ''} ${orderData?.shippingAddress?.lastName || req.user.lastName || ''}`.trim() || req.user.email,
          customerEmail: req.user.email,
          orderTotal: total.toFixed(2),
          itemCount: validatedItems.length,
          orderDate: new Date(order.createdAt || Date.now()).toLocaleString(),
          orderUrl
        }
      });
    } catch (emailErr) {
      console.warn('Order confirmation email failed:', emailErr.message);
    }

    // Note: Cart clearing is handled by frontend after successful order

    // Include Shakeout invoice data in response if available
    const response = { order };
    if (shakeoutInvoiceData) {
      response.shakeoutInvoice = shakeoutInvoiceData;
    }

    res.status(201).json(response);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { reason } = req.body;

    const order = await orderService.getOrderById(id);
    
    // Check if user owns this order
    if (order.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedOrder = await orderService.cancelOrder(id, reason);

    // Restore product stock if order was cancelled
    if (updatedOrder.status === 'cancelled') {
      for (const item of order.items) {
        await productService.updateStock(item.productId, item.quantity, 'increase');
      }
    }

    res.json({ order: updatedOrder });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Error cancelling order' });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, estimatedDelivery } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const additionalData = {};
    if (trackingNumber) {
      additionalData.trackingNumber = trackingNumber;
    }
    if (estimatedDelivery) {
      additionalData.estimatedDelivery = new Date(estimatedDelivery);
    }

    const order = await orderService.updateOrderStatus(id, status, additionalData);
    res.json({ order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
};

// Get order statistics
exports.getOrderStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await orderService.getOrderStats(userId);
    res.json({ stats });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ message: 'Error fetching order statistics' });
  }
};

// Get recent orders
exports.getRecentOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 5 } = req.query;
    
    const orders = await orderService.getRecentOrders(userId, parseInt(limit));
    res.json({ orders });
  } catch (error) {
    console.error('Get recent orders error:', error);
    res.status(500).json({ message: 'Error fetching recent orders' });
  }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const {
      status,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder
    };

    const result = await orderService.getOrdersByStatus(status, options);
    res.json(result);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Admin: Get order analytics
exports.getOrderAnalytics = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { startDate, endDate } = req.query;
    const options = { startDate, endDate };

    const analytics = await orderService.getOrderAnalytics(options);
    res.json({ analytics });
  } catch (error) {
    console.error('Get order analytics error:', error);
    res.status(500).json({ message: 'Error fetching order analytics' });
  }
}; 