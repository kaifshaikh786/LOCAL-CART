# LocalCart Backend

This backend server handles order management and vendor notifications via WhatsApp.

## Features

- ✅ Express.js REST API
- ✅ WhatsApp order notifications via Twilio
- ✅ Order management endpoints
- ✅ CORS enabled for frontend integration

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Twilio account with WhatsApp Business API access

### Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Fill in your Twilio credentials in `.env`:**
   - Get your `TWILIO_ACCOUNT_SID` from Twilio Console
   - Get your `TWILIO_AUTH_TOKEN` from Twilio Console
   - Configure your WhatsApp Business Phone Number in `TWILIO_PHONE_NUMBER`

4. **Start the server:**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### 1. Send Order to Vendor
**POST** `/api/send-order`

Sends order details to vendor via WhatsApp

**Request Body:**
```json
{
  "orderNumber": "LC1692451234",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "address": "123 Main Street, City, State 12345",
    "deliveryType": "delivery",
    "specialNotes": "Ringbell twice"
  },
  "items": [
    {
      "name": "Wireless Headphones",
      "price": 1499,
      "quantity": 1,
      "vendor": "ABC Electronics"
    }
  ],
  "total": 1499,
  "timestamp": "2026-08-13T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order notification sent to vendor",
  "messageSid": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

### 2. Get Order History
**GET** `/api/orders/:vendorPhone`

Fetches all orders for a specific vendor

**Response:**
```json
{
  "vendor": "+91 9876543210",
  "orders": []
}
```

### 3. Get Order Details
**GET** `/api/order/:orderNumber`

Fetches details for a specific order

**Response:**
```json
{
  "orderNumber": "LC1692451234",
  "status": "pending"
}
```

### 4. Health Check
**GET** `/health`

Checks if the server is running

## How It Works

1. **Customer Places Order:** Customer submits checkout form on frontend
2. **Cart Data Sent:** Frontend calls `/api/send-order` with order details
3. **WhatsApp Message:** Backend formats order and sends via Twilio WhatsApp API
4. **Vendor Notified:** Vendor receives order details via WhatsApp with:
   - Order number
   - Customer name, phone, email, address
   - Order items with quantities and prices
   - Total amount
   - Delivery type (pickup/delivery)
   - Special instructions

## Frontend Integration

From the frontend (`order.html`), the checkout form calls:

```javascript
fetch('/api/send-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
})
```

Make sure the frontend URL is configured correctly:
- For local development: `http://localhost:5000/api/send-order`
- For production: Update the domain in frontend code

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `TWILIO_ACCOUNT_SID` | Twilio Account ID | `AC...` |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | `your_token` |
| `TWILIO_PHONE_NUMBER` | WhatsApp Business Number | `whatsapp:+1234567890` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |

## Getting Twilio WhatsApp Credentials

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Messaging** → **Try it out** → **Send a WhatsApp message**
3. Follow setup wizard to activate WhatsApp Business Profile
4. Copy your Account SID and Auth Token
5. Note your WhatsApp Business Phone Number

## Troubleshooting

### WhatsApp message not sending?
- Verify phone number format (should start with country code)
- Check Twilio account has active WhatsApp Business Profile
- Ensure recipient number is also registered for WhatsApp

### CORS errors?
- Check that CORS is properly enabled
- Update frontend API URL to match backend server

### Port already in use?
- Change PORT in `.env` file
- Or kill existing process on that port

## Future Enhancements

- [ ] Database integration for order history
- [ ] Email notifications to customer
- [ ] Order status tracking
- [ ] SMS fallback if WhatsApp fails
- [ ] Admin dashboard for order management
- [ ] Payment gateway integration

## Support

For issues or questions, please create an issue in the repository.
