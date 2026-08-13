const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Twilio client setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// ==================== ROUTES ====================

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Send order to vendor via WhatsApp
app.post('/api/send-order', async (req, res) => {
    try {
        const { orderNumber, customer, items, total } = req.body;

        // Validate required fields
        if (!customer || !customer.phone || !items) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Format customer phone number (assuming Indian format)
        const vendorPhone = formatPhoneNumber(customer.phone);

        // Create order message
        const orderMessage = formatOrderMessage(orderNumber, customer, items, total);

        // Send WhatsApp message via Twilio
        const message = await client.messages.create({
            body: orderMessage,
            from: `whatsapp:${twilioPhoneNumber}`,
            to: `whatsapp:${vendorPhone}`
        });

        console.log(`✓ WhatsApp message sent to vendor. SID: ${message.sid}`);

        // Also send confirmation email to customer (optional)
        // sendConfirmationEmail(customer.email, orderNumber);

        res.json({
            success: true,
            message: 'Order notification sent to vendor',
            messageSid: message.sid
        });

    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        
        // Don't block order placement even if WhatsApp fails
        res.json({
            success: true,
            message: 'Order recorded (WhatsApp notification pending)',
            error: error.message
        });
    }
});

// Get order history (for vendor dashboard)
app.get('/api/orders/:vendorPhone', (req, res) => {
    try {
        const { vendorPhone } = req.params;
        
        // TODO: Implement database query to fetch orders for vendor
        res.json({
            vendor: vendorPhone,
            orders: []
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Get order details
app.get('/api/order/:orderNumber', (req, res) => {
    try {
        const { orderNumber } = req.params;
        
        // TODO: Implement database query to fetch order details
        res.json({
            orderNumber: orderNumber,
            status: 'pending'
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// ==================== HELPER FUNCTIONS ====================

// Format phone number to international format
function formatPhoneNumber(phone) {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // If it starts with 91 (India code), add +
    if (cleaned.startsWith('91') && cleaned.length === 12) {
        return '+' + cleaned;
    }
    
    // Otherwise, assume it's a local number and add +91
    if (cleaned.length === 10) {
        return '+91' + cleaned;
    }
    
    // If it already has country code
    return '+' + cleaned;
}

// Format order message for WhatsApp
function formatOrderMessage(orderNumber, customer, items, total) {
    let message = `📦 *New Order Received!*\n\n`;
    message += `*Order Number:* ${orderNumber}\n`;
    message += `*Date:* ${new Date().toLocaleDateString('en-IN')}\n\n`;
    
    message += `*Customer Details:*\n`;
    message += `Name: ${customer.name}\n`;
    message += `Phone: ${customer.phone}\n`;
    message += `Email: ${customer.email}\n`;
    message += `Address: ${customer.address}\n\n`;
    
    message += `*Delivery Type:* ${customer.deliveryType === 'pickup' ? 'Pickup' : 'Home Delivery'}\n`;
    
    if (customer.specialNotes) {
        message += `*Special Notes:* ${customer.specialNotes}\n`;
    }
    
    message += `\n*Order Items:*\n`;
    items.forEach(item => {
        const itemTotal = item.price * (item.quantity || 1);
        message += `• ${item.name} (x${item.quantity || 1}) - ₹${itemTotal}\n`;
    });
    
    message += `\n*Total Amount:* ₹${total}\n`;
    message += `\nPlease confirm this order or contact the customer.`;
    
    return message;
}

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Twilio WhatsApp API configured`);
});

module.exports = app;
