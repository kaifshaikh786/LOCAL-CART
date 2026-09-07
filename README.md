# LocalCart - Hyperlocal E-Commerce Platform

LocalCart is a modern, hyperlocal marketplace platform connecting customers with nearby local vendors for groceries, essentials, electronics, and local goods.

---

## Architecture & Project Structure

The project has been upgraded with a clean, separated architecture:

`
LOCAL-CART/
|-- Backend/
|   \-- LocalCart.Api/              # ASP.NET Core 9.0 Web API
|       |-- Controllers/            # REST API endpoints (Products, Vendors, Orders, Admin, etc.)
|       |-- Data/                   # EF Core DbContext, Migrations & Configurations
|       |-- Models/                 # Entities (Product, Vendor, Order, OrderItem, Customer, etc.)
|       |-- DTOs/                   # Request & Response Data Transfer Objects
|       |-- Services/               # Business logic, WhatsApp notification service, Cart rules
|       |-- appsettings.json        # Database connection strings & configuration
|       \-- Program.cs              # Dependency injection, middleware pipeline, CORS setup
|
|-- Frontend/
|   \-- LocalCart-Web/              # Modern React + TypeScript Web Application
|       |-- src/
|       |   |-- pages/              # Dedicated route pages (Home, Cart, Checkout, Vendor, Admin, Orders)
|       |   |   |-- HomePage.tsx
|       |   |   |-- CartPage.tsx
|       |   |   |-- CheckoutPage.tsx
|       |   |   |-- VendorDashboardPage.tsx
|       |   |   |-- VendorLoginPage.tsx
|       |   |   |-- AdminDashboardPage.tsx
|       |   |   |-- AdminLoginPage.tsx
|       |   |   \-- OrderTrackingPage.tsx
|       |   |-- components/         # Reusable UI components (Navbar, Footer, ProductCard, etc.)
|       |   |-- context/            # Global state (CartContext with single-vendor cart rule)
|       |   |-- services/           # API clients and mock data fallbacks
|       |   |-- types/              # TypeScript interfaces and domain types
|       |   |-- App.tsx             # Routing & application shell
|       |   \-- main.tsx            # Application entry point
|       |-- index.html
|       |-- vite.config.ts
|       \-- package.json
|
\-- .gitignore                      # Comprehensive .gitignore for .NET & React/Vite/Node
`

---

## Key Features

### Customer Experience
- Hyperlocal Discovery: Browse products from nearby vendors with real-time stock and pricing.
- Single-Vendor Cart Enforcement: Focused ordering per vendor to prevent disjointed multi-vendor fulfillment issues.
- Persistent Local Cart: Cart contents safely preserved across sessions.
- Streamlined Checkout: Rapid checkout with delivery address and contact details.
- Order Tracking: Real-time order status tracking with order lookup.

### Vendor Management
- Vendor Dashboard: Manage catalog, inventory, pricing, and live orders.
- Order Alerts: Instant WhatsApp notifications for new customer orders.
- Status Updates: Mark orders as Preparing, Ready for Pickup, Out for Delivery, or Delivered.

### Admin Management
- Platform Analytics: Total orders, revenue, active vendors, and top-selling categories.
- Vendor & Catalog Oversight: Approve vendors, audit product catalogs, and oversee operations.

---

## Getting Started

### Prerequisites
- .NET 9 SDK
- Node.js (v18 or higher) & npm
- SQL Server (LocalDB, Express, or Azure SQL)

---

### Backend Setup (.NET 9 Web API)

1. Navigate to the backend directory:
   `ash
   cd Backend/LocalCart.Api
   `

2. Configure database connection in ppsettings.json (or ppsettings.Development.json).

3. Restore dependencies and run the API:
   `ash
   dotnet restore
   dotnet run
   `

   The Swagger / OpenAPI documentation will be accessible at:
   https://localhost:7001/swagger or http://localhost:5000/swagger

---

### Frontend Setup (React 19 + Vite + Tailwind CSS)

1. Navigate to the frontend directory:
   `ash
   cd Frontend/LocalCart-Web
   `

2. Install dependencies:
   `ash
   npm install
   `

3. Start the Vite development server:
   `ash
   npm run dev
   `

4. Open http://localhost:5173 in your browser.

---

## License
This project is licensed under the MIT License.
