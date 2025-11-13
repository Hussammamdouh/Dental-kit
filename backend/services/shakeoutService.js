const axios = require('axios');

class ShakeoutService {
  constructor() {
    this.baseURL = 'https://dash.shake-out.com/api/public/vendor';
    this.apiKey = process.env.SHAKEOUT_API_KEY;
    this.secretKey = process.env.SHAKEOUT_SECRET_KEY;
    
    if (!this.apiKey) {
      console.warn('⚠️  SHAKEOUT_API_KEY is not set. Payment gateway will not work.');
    }
    
    if (!this.secretKey) {
      console.warn('⚠️  SHAKEOUT_SECRET_KEY is not set. Webhook verification may not work.');
    }
  }

  /**
   * Normalize phone number to international format
   * Converts local Egyptian numbers (011, 010, 012, etc.) to +20 format
   * @param {String} phone - Phone number in any format
   * @returns {String} Normalized phone number in international format
   */
  normalizePhoneNumber(phone) {
    if (!phone) return '+201000000000'; // Default fallback
    
    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // If already in international format with +20, return as is
    if (cleaned.startsWith('+20')) {
      return cleaned;
    }
    
    // If starts with 20 (without +), add +
    if (cleaned.startsWith('20') && cleaned.length >= 12) {
      return '+' + cleaned;
    }
    
    // Handle Egyptian local numbers (011, 010, 012, 015)
    // These start with 0 and should be converted to +20
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      // Remove leading 0 and add +20
      return '+20' + cleaned.substring(1);
    }
    
    // If it's 10 digits and starts with 1 (Egyptian mobile), add +20
    if (cleaned.length === 10 && cleaned.startsWith('1')) {
      return '+20' + cleaned;
    }
    
    // If it's 11 digits and starts with 0, remove 0 and add +20
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
      return '+20' + cleaned.substring(1);
    }
    
    // If it doesn't start with +, try to add +20 for Egyptian numbers
    if (!cleaned.startsWith('+')) {
      // Assume it's Egyptian if it's 10-11 digits
      if (cleaned.length >= 10 && cleaned.length <= 11) {
        if (cleaned.startsWith('0')) {
          return '+20' + cleaned.substring(1);
        } else if (cleaned.startsWith('1')) {
          return '+20' + cleaned;
        }
      }
    }
    
    // If we can't normalize it, return with + prefix if missing
    if (!cleaned.startsWith('+')) {
      return '+' + cleaned;
    }
    
    return cleaned;
  }

  /**
   * Create an invoice in Shakeout
   * @param {Object} invoiceData - Invoice data
   * @returns {Promise<Object>} Invoice response with URL and IDs
   */
  async createInvoice(invoiceData) {
    try {
      if (!this.apiKey) {
        throw new Error('Shakeout API key is not configured');
      }

      const {
        amount,
        currency = 'EGP',
        dueDate,
        forceExpireTimestamp,
        customer,
        redirectionUrls,
        invoiceItems,
        taxEnabled = false,
        taxCode,
        taxValue,
        discountEnabled = false,
        discountType,
        discountValue
      } = invoiceData;

      // Validate required fields
      if (!amount || !customer || !redirectionUrls || !invoiceItems || !dueDate) {
        throw new Error('Missing required invoice fields');
      }

      // Validate customer object
      if (!customer.firstName || !customer.lastName || !customer.email || !customer.phone || !customer.address) {
        throw new Error('Missing required customer fields');
      }

      // Validate redirection URLs
      if (!redirectionUrls.successUrl || !redirectionUrls.failUrl || !redirectionUrls.pendingUrl) {
        throw new Error('Missing required redirection URLs');
      }

      // Validate invoice items
      if (!Array.isArray(invoiceItems) || invoiceItems.length === 0) {
        throw new Error('Invoice items must be a non-empty array');
      }

      for (const item of invoiceItems) {
        if (!item.name || item.price === undefined || item.quantity === undefined) {
          throw new Error('Each invoice item must have name, price, and quantity');
        }
      }

      // Format due date (Y-m-d format)
      const formattedDueDate = dueDate instanceof Date 
        ? dueDate.toISOString().split('T')[0]
        : dueDate;

      // Calculate subtotal from invoice items
      const itemsSubtotal = invoiceItems.reduce((sum, item) => {
        return sum + (parseFloat(item.price) * parseInt(item.quantity));
      }, 0);

      // Calculate the amount that Shakeout expects
      // Amount should be: items_subtotal + tax - discount
      // Shakeout validates this calculation internally
      let calculatedAmount = itemsSubtotal;
      
      if (taxEnabled && taxValue !== undefined) {
        const taxAmount = itemsSubtotal * (parseFloat(taxValue) / 100);
        calculatedAmount += taxAmount;
      }
      
      if (discountEnabled && discountValue !== undefined) {
        if (discountType === 'fixed') {
          calculatedAmount -= parseFloat(discountValue);
        } else if (discountType === 'percent') {
          calculatedAmount -= (calculatedAmount * parseFloat(discountValue) / 100);
        }
      }

      // Use calculated amount (Shakeout validates this matches invoice items + tax - discount)
      // Round to 2 decimal places to match Shakeout's expected format
      const invoiceAmount = parseFloat(calculatedAmount.toFixed(2));

      // Log for debugging
      console.log('Shakeout invoice calculation:', {
        itemsSubtotal,
        taxEnabled,
        taxValue,
        taxAmount: taxEnabled && taxValue !== undefined ? itemsSubtotal * (parseFloat(taxValue) / 100) : 0,
        discountEnabled,
        discountType,
        discountValue,
        calculatedAmount,
        invoiceAmount,
        providedAmount: amount
      });

      // Normalize phone number to international format
      const normalizedPhone = this.normalizePhoneNumber(customer.phone);
      console.log('Phone number normalization:', {
        original: customer.phone,
        normalized: normalizedPhone
      });
      
      // Prepare request body
      const requestBody = {
        amount: invoiceAmount,
        currency,
        due_date: formattedDueDate,
        customer: {
          first_name: customer.firstName,
          last_name: customer.lastName,
          email: customer.email,
          phone: normalizedPhone,
          address: customer.address
        },
        redirection_urls: {
          success_url: redirectionUrls.successUrl,
          fail_url: redirectionUrls.failUrl,
          pending_url: redirectionUrls.pendingUrl
        },
        invoice_items: invoiceItems.map(item => ({
          name: item.name,
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity)
        }))
      };

      // Add optional fields
      if (forceExpireTimestamp) {
        requestBody.force_expire_timestamp = parseInt(forceExpireTimestamp);
      }

      if (taxEnabled) {
        requestBody.tax_enabled = true;
        // Shakeout requires tax_code when tax is enabled
        // Default to 'VAT' for Egypt (EGP currency) if not provided
        requestBody.tax_code = taxCode || 'VAT';
        if (taxValue !== undefined) {
          // Round tax value to 2 decimal places to avoid floating point precision issues
          requestBody.tax_value = parseFloat(parseFloat(taxValue).toFixed(2));
        }
      }

      if (discountEnabled) {
        requestBody.discount_enabled = true;
        if (discountType) requestBody.discount_type = discountType;
        if (discountValue !== undefined) requestBody.discount_value = parseFloat(discountValue);
      }

      // Make API request
      const response = await axios.post(
        `${this.baseURL}/invoice`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `apikey ${this.apiKey}`
          }
        }
      );

      if (response.data && response.data.status === 'success' && response.data.data) {
        return {
          success: true,
          invoiceUrl: response.data.data.url,
          invoiceId: response.data.data.invoice_id,
          invoiceRef: response.data.data.invoice_ref,
          data: response.data.data
        };
      }

      throw new Error('Unexpected response format from Shakeout API');
    } catch (error) {
      console.error('Shakeout createInvoice error:', error.message);
      
      if (error.response) {
        // API returned an error response
        const statusCode = error.response.status;
        const errorData = error.response.data || {};
        const errorMessage = errorData.message || errorData.error || JSON.stringify(errorData) || 'Unknown error';
        
        // Log the full error response for debugging
        console.error('Shakeout API Error Response:', {
          status: statusCode,
          data: errorData,
          requestBody: error.config?.data ? JSON.parse(error.config.data) : 'Not available'
        });
        
        if (statusCode === 401) {
          throw new Error('Unauthorized: Invalid API key');
        } else if (statusCode === 400) {
          throw new Error(`Bad Request: ${errorMessage}`);
        } else {
          throw new Error(`Shakeout API error (${statusCode}): ${errorMessage}`);
        }
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No response from Shakeout API. Please check your internet connection.');
      } else {
        // Error in setting up the request
        throw new Error(`Error creating invoice: ${error.message}`);
      }
    }
  }

  /**
   * Check invoice status
   * @param {String} invoiceId - Invoice ID
   * @param {String} invoiceRef - Invoice reference
   * @returns {Promise<Object>} Invoice status
   */
  async checkInvoiceStatus(invoiceId, invoiceRef) {
    try {
      if (!this.apiKey) {
        throw new Error('Shakeout API key is not configured');
      }

      if (!invoiceId || !invoiceRef) {
        throw new Error('Invoice ID and reference are required');
      }

      const response = await axios.get(
        `${this.baseURL}/invoice-status/${invoiceId}/${invoiceRef}`,
        {
          headers: {
            'Authorization': `apikey ${this.apiKey}`
          }
        }
      );

      if (response.data && response.data.status === 'success' && response.data.data) {
        return {
          success: true,
          invoiceId: response.data.data.invoice_id,
          invoiceRef: response.data.data.invoice_ref,
          paymentMethod: response.data.data.payment_method,
          invoiceStatus: response.data.data.invoice_status,
          amount: response.data.data.amount,
          referenceNumber: response.data.data.referenceNumber,
          updatedAt: response.data.data.updated_at,
          data: response.data.data
        };
      }

      throw new Error('Unexpected response format from Shakeout API');
    } catch (error) {
      console.error('Shakeout checkInvoiceStatus error:', error.message);
      
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Unknown error';
        
        if (statusCode === 401) {
          throw new Error('Unauthorized: Invalid API key');
        } else if (statusCode === 404) {
          throw new Error('Invoice not found');
        } else {
          throw new Error(`Shakeout API error (${statusCode}): ${errorMessage}`);
        }
      } else if (error.request) {
        throw new Error('No response from Shakeout API. Please check your internet connection.');
      } else {
        throw new Error(`Error checking invoice status: ${error.message}`);
      }
    }
  }

  /**
   * Delete an invoice
   * @param {String} invoiceId - Invoice ID
   * @param {String} refId - Invoice reference ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteInvoice(invoiceId, refId) {
    try {
      if (!this.apiKey) {
        throw new Error('Shakeout API key is not configured');
      }

      if (!invoiceId || !refId) {
        throw new Error('Invoice ID and reference ID are required');
      }

      const response = await axios.delete(
        `${this.baseURL}/invoice/${invoiceId}/${refId}`,
        {
          headers: {
            'Authorization': `apikey ${this.apiKey}`
          }
        }
      );

      if (response.data && response.data.status === 'success') {
        return {
          success: true,
          message: response.data.message || 'Invoice deleted successfully',
          data: response.data
        };
      }

      throw new Error('Unexpected response format from Shakeout API');
    } catch (error) {
      console.error('Shakeout deleteInvoice error:', error.message);
      
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Unknown error';
        
        if (statusCode === 401) {
          throw new Error('Unauthorized: Invalid API key');
        } else if (statusCode === 404) {
          throw new Error('Invoice not found');
        } else {
          throw new Error(`Shakeout API error (${statusCode}): ${errorMessage}`);
        }
      } else if (error.request) {
        throw new Error('No response from Shakeout API. Please check your internet connection.');
      } else {
        throw new Error(`Error deleting invoice: ${error.message}`);
      }
    }
  }

  /**
   * Map Shakeout invoice status to our payment status
   * @param {String} shakeoutStatus - Status from Shakeout
   * @returns {String} Our payment status
   */
  mapPaymentStatus(shakeoutStatus) {
    const statusMap = {
      'paid': 'paid',
      'unpaid': 'pending',
      'pending': 'pending',
      'expired': 'failed',
      'cancelled': 'failed'
    };

    return statusMap[shakeoutStatus?.toLowerCase()] || 'pending';
  }

  /**
   * Verify webhook signature (if Shakeout provides signature verification)
   * @param {String|Buffer|Object} payload - Webhook payload (raw body string, buffer, or parsed object)
   * @param {String} signature - Signature from webhook headers
   * @returns {Boolean} True if signature is valid
   */
  verifyWebhookSignature(payload, signature) {
    if (!this.secretKey) {
      console.warn('Secret key not configured, skipping webhook verification');
      return true; // Allow webhook if secret key is not configured (for development)
    }

    if (!signature) {
      console.warn('No signature provided in webhook headers');
      return false;
    }

    // Common webhook signature verification methods:
    // 1. HMAC SHA256: crypto.createHmac('sha256', secretKey).update(payload).digest('hex')
    // 2. HMAC SHA256 with 'sha256=' prefix
    // 3. Simple hash comparison
    
    // Since Shakeout documentation doesn't specify the exact method,
    // we'll implement a common HMAC SHA256 verification
    // You may need to adjust this based on Shakeout's actual implementation
    
    try {
      const crypto = require('crypto');
      
      // Convert payload to string if it's an object or buffer
      let payloadString;
      if (Buffer.isBuffer(payload)) {
        payloadString = payload.toString('utf8');
      } else if (typeof payload === 'object') {
        payloadString = JSON.stringify(payload);
      } else {
        payloadString = String(payload);
      }
      
      // Calculate expected signature
      const expectedSignature = crypto
        .createHmac('sha256', this.secretKey)
        .update(payloadString)
        .digest('hex');
      
      // Handle different signature formats
      // Some gateways send signature as "sha256=..." or just the hex string
      const receivedSignature = signature.replace(/^sha256=/, '').trim();
      
      // Compare signatures (use constant-time comparison to prevent timing attacks)
      if (receivedSignature.length !== expectedSignature.length) {
        return false;
      }
      
      return crypto.timingSafeEqual(
        Buffer.from(receivedSignature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      console.error('Webhook signature verification error:', error);
      return false;
    }
  }
}

module.exports = ShakeoutService;

