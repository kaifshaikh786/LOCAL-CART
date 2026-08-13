# LocalCart - Local Marketplace Platform

A modern local marketplace platform connecting customers with nearby vendors. Customers can browse products, compare prices, and place orders which are directly notified to vendors via WhatsApp.

## 🎯 Features

### Customer Side
- ✅ **Browse Products** - No login required, instant access
- ✅ **Compare Prices** - See prices from multiple vendors
- ✅ **Shopping Cart** - Add products and manage quantities
- ✅ **Simple Checkout** - Just name, email, phone, and address
- ✅ **Pickup or Delivery** - Choose delivery method at checkout
- ✅ **Order Confirmation** - Get order number instantly
- ✅ **Local Storage Cart** - Cart persists across sessions until checkout

### Vendor Side
- 📱 **WhatsApp Notifications** - Get order alerts on WhatsApp with full customer & item details
- 📊 **Dashboard** - Manage products and prices (admin folder)
- 📦 **Order Management** - Track and manage incoming orders
- 🚚 **Delivery Options** - Support pickup and home delivery

## 📁 Project Structure

```
LOCAL-CART/
├── index.html              # Home page
├── java.js                 # Core JavaScript functions (cart management)
├── style.css               # Global styles
├── customers/              # Customer-facing pages
│   ├── product.html        # Product listing
│   ├── p-details.html      # Product details & vendor comparison
│   ├── cart.html           # Shopping cart
│   ├── order.html          # Checkout form
│   └── order-confirmation.html  # Order confirmation
├── vendors/                # Vendor dashboard (to be developed)
├── admin/                  # Admin panel (to be developed)
└── backend/                # Node.js/Express server
    ├── server.js           # Main server file
    ├── package.json        # Node dependencies
    ├── .env.example        # Environment variables template
    └── README.md           # Backend setup guide
```

## 🚀 Getting Started

### Frontend Setup (Local)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd LOCAL-CART
   ```

2. **Open in browser:**
   - Simply open `index.html` in a web browser
   - Or use a local server:
     ```bash
     python -m http.server 8000
     # OR
     php -S localhost:8000
     ```

### Backend Setup (WhatsApp Integration)

1. **Navigate to backend folder:**
   ```bash
   cd backend
   npm install
   ```

2. **Setup Twilio (WhatsApp Provider):**
   - Create a Twilio account at https://www.twilio.com
   - Enable WhatsApp Business Profile
   - Note your Account SID, Auth Token, and WhatsApp number

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your Twilio credentials
   ```

4. **Start backend server:**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`

## 💡 How It Works

### Customer Flow
1. Customer browses products without login
2. Compares prices from different vendors
3. Adds items to cart (stored in localStorage)
4. Proceeds to checkout
5. Enters delivery details (name, phone, email, address)
6. Selects pickup or delivery
7. Submits order
8. Gets order number and confirmation

### Vendor Flow
1. Vendor receives WhatsApp message with:
   - Order number
   - Customer name and contact details
   - Item list with quantities
   - Total amount
   - Delivery type & address
   - Special instructions (if any)
2. Vendor confirms/processes order
3. Vendor contacts customer directly

### Backend Flow
1. Frontend sends order data to `/api/send-order`
2. Backend formats WhatsApp message
3. Twilio sends message to vendor
4. Order confirmation page displays to customer
5. Cart clears automatically

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling & Responsive Design
- **JavaScript** - Cart management & interactivity
- **localStorage** - Client-side cart storage

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Twilio** - WhatsApp API

## 📱 Responsive Design

The platform is fully responsive:
- ✅ Desktop (full grid layout)
- ✅ Tablet (2-column layout)
- ✅ Mobile (1-column stack layout)

## 🔧 Configuration

### Twilio Setup
1. Get credentials from Twilio Console
2. Create .env file from .env.example
3. Fill in credentials:
   ```
   TWILIO_ACCOUNT_SID=AC...
   TWILIO_AUTH_TOKEN=...
   TWILIO_PHONE_NUMBER=whatsapp:+...
   ```

### CORS Setup
The backend has CORS enabled for frontend requests. Update if hosting on different domains.

## 📊 Product Data Structure

Each product includes:
```javascript
{
  name: "Product Name",
  price: 1499,
  vendor: "Vendor Name",
  category: "electronics",
  rating: 4.5,
  distance: "1.2 km"
}
```

## 🛒 Cart Data Structure

Cart items stored in localStorage:
```javascript
[
  {
    name: "Product Name",
    price: 1499,
    vendor: "Vendor Name",
    quantity: 1
  }
]
```

## 📦 Order Data Structure

When order is placed:
```javascript
{
  orderNumber: "LC1692451234",
  customer: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    address: "123 Main St",
    deliveryType: "delivery",
    specialNotes: "..."
  },
  items: [...],
  total: 1499,
  timestamp: "2026-08-13T10:30:00Z"
}
```

## 🔐 Security Notes

### Current Implementation
- No user authentication (intentional - no profiles needed)
- Order data sent to backend for WhatsApp
- Cart stored locally on browser

### Future Enhancements
- Add input validation on both frontend & backend
- Implement rate limiting on API endpoints
- Add order verification before WhatsApp send
- Encrypt sensitive data in transit

## 🚧 Planned Features

- [ ] Vendor dashboard to manage products/prices
- [ ] Admin panel for platform management
- [ ] User ratings and reviews
- [ ] Order tracking with status updates
- [ ] Payment gateway integration
- [ ] SMS notifications as WhatsApp fallback
- [ ] Customer favorite vendors
- [ ] Search and advanced filters
- [ ] Push notifications

## 📝 API Documentation

See [backend/README.md](backend/README.md) for complete API documentation.

## 🐛 Troubleshooting

### Cart not saving?
- Clear browser cache
- Check localStorage is enabled
- Check browser console for errors

### WhatsApp not sending?
- Verify Twilio credentials in .env
- Check vendor phone number format
- Ensure Twilio account has WhatsApp Business Profile

### Frontend can't reach backend?
- Check backend server is running
- Verify backend URL in frontend code
- Check CORS headers

## 📚 Learning Resources

- [Express.js Docs](https://expressjs.com/)
- [Twilio WhatsApp API](https://www.twilio.com/whatsapp)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 📧 Support

For support, email support@localcart.com or open an issue in the repository.

---

**LocalCart** - Connecting local vendors with nearby customers 🏪💼
