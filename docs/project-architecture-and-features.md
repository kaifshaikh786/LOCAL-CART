# LocalCart Project Architecture and Features

## 1. Project Overview

LocalCart is a hyperlocal marketplace that connects customers with nearby stores. Customers can discover products, enter a location or pincode, compare local products, view store details, add products to a cart, and place guest orders.

The platform has three main user experiences:

1. Customer storefront
2. Vendor Studio
3. Admin Operations

The project also includes a CSV catalog importer for stores, products, categories, stock quantities, and product images.

## 2. Main Features

### 2.1 Customer Storefront

- Customers can browse products without creating an account.
- Customers can enter an area or six-digit pincode.
- Nearby products are placed first using vendor pincode matching.
- Customers can search by:
  - Product name
  - Category
  - Store name
  - Store address
  - Store phone number
- Customers can filter by:
  - Category
  - Price range
  - Product rating
  - Stock availability
- Customers can sort by:
  - Featured
  - Popularity
  - Price low to high
  - Price high to low
  - Nearest store
- Customers can view product images, product name, price, stock, store name, address, phone, and category.
- Product images use the imported CSV image URLs.
- Broken product images automatically fall back to generated artwork.
- Customers can add products to a single-vendor cart.
- The cart prevents products from multiple stores being mixed in one order.
- Customers can choose home delivery or store pickup.
- Customers can place orders as guests.
- Customers can look up an order using the order number.

### 2.2 Location Experience

- New customers see a location prompt on public storefront pages.
- The prompt accepts an area or pincode.
- The location is saved in browser local storage.
- The customer is taken to the nearby product catalog after submitting a location.
- The location can be changed later using the location bar.
- Exact vendor pincode matches receive the highest priority.
- Other products are ordered using numeric pincode proximity.

### 2.3 Store Directory

- The navigation includes a Stores section.
- The Stores page loads store data from the backend.
- Customers can search stores by name, city, address, or phone.
- Each store displays:
  - Store name
  - Address
  - Phone number
  - Verified store label
- A customer can select Shop this store.
- The store link opens the catalog filtered to that vendor.
- Product detail pages also make the store name and address clickable.

### 2.4 Categories

- Categories are loaded from the backend.
- The desktop navbar has a hover/focus Categories menu.
- The mobile menu includes all categories.
- Categories display product counts.
- Clicking a category opens the filtered product catalog.
- The category page scrolls to the filtered product results.

### 2.5 Vendor Studio

Vendors can sign in and access their store workspace.

Vendor features include:

- View the vendor's products.
- Add new products.
- Upload product image URLs.
- View incoming orders.
- Update order status.
- Track product stock.
- Manage vendor product information.
- Use the store-specific product catalog.

Supported order statuses include:

- Pending
- Accepted
- ReadyForPickup
- Completed
- Cancelled

### 2.6 Admin Operations

Admins can sign in and access the operations workspace.

Admin features include:

- View catalog products.
- Search products.
- View registered stores.
- View store contact details.
- Delete products.
- Update product price and stock.
- Export product data to CSV.
- Export store data to CSV.
- Export order data to CSV.
- View operational metrics and alerts.

### 2.7 Branding and Mobile Experience

- LocalCart uses the orange cart logo across the application.
- The logo is used in:
  - Header
  - Footer
  - Login page
  - Vendor signup page
  - Browser tab favicon
- Developer credits are included for Mohammad Kaif Shaikh and Tanish Gupta.
- Mobile navigation uses a scrollable drawer.
- Mobile product cards use a two-column layout.
- Mobile store cards use a one-column layout.
- Product detail pages become single-column on mobile.
- Mobile buttons use full available width where appropriate.
- Mobile surfaces use consistent light and dark theme backgrounds.

## 3. Technology Stack

### 3.1 Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide React icons
- Context API for shared state
- Browser local storage for cart, location, products, and orders
- Browser session storage for authentication state

Frontend location:

```text
Frontend/LocalCart-Web
```

### 3.2 Backend

- ASP.NET Core Web API
- .NET 10
- Entity Framework Core
- SQL Server provider for production-style SQL databases
- SQLite provider for local development fallback
- JWT Bearer authentication
- PBKDF2 password hashing with SHA-256
- OpenAPI support
- CORS configuration

Backend location:

```text
backend/LocalCart.Api
```

### 3.3 Database

The application supports two database modes:

1. SQL Server when a valid `DefaultConnection` is configured.
2. Local SQLite fallback when SQL Server configuration is unavailable.

Local SQLite database file:

```text
backend/LocalCart.Api/localcart.db
```

The local database file is ignored by Git because it is a runtime file.

## 4. Frontend Architecture

### 4.1 Application Shell

The application shell is defined in:

```text
Frontend/LocalCart-Web/src/App.tsx
```

The main providers are:

1. ThemeProvider
2. AuthProvider
3. ProductProvider
4. CartProvider
5. OrderProvider

The shell also renders:

- Header
- Routes
- Toast notifications
- Footer
- Location prompt

### 4.2 Frontend Contexts

#### AuthContext

Responsible for:

- Login
- Vendor registration
- Session token storage
- Current user profile
- Current user role
- Logout
- Admin/vendor access checks

#### ProductContext

Responsible for:

- Loading products
- Loading categories
- Mapping backend DTOs to frontend products
- Product refresh
- Product creation
- Local product fallback

#### CartContext

Responsible for:

- Cart items
- Cart persistence
- Single-vendor enforcement
- Cart quantity changes
- Cart total calculation

#### OrderContext

Responsible for:

- Booking orders
- Looking up orders
- Persisting local order history
- Synchronizing order status
- Storing the latest order

#### ThemeContext

Responsible for:

- Light/dark theme state
- Theme persistence

### 4.3 Frontend Services

Located in:

```text
Frontend/LocalCart-Web/src/services
```

Services include:

- `apiClient.ts`: shared HTTP client and error handling
- `authApi.ts`: authentication requests
- `productApi.ts`: products and categories
- `orderApi.ts`: order creation, lookup, status updates
- `vendorApi.ts`: vendor/store requests

The HTTP client automatically adds the JWT bearer token when a user is logged in.

## 5. Frontend Routes

### Public Routes

- `/`: customer homepage
- `/products`: product catalog
- `/products/:id`: product details
- `/stores`: store directory
- `/cart`: shopping cart
- `/checkout`: guest checkout
- `/confirmed`: order confirmation
- `/how-it-works`: About and platform explanation

### Authentication Routes

- `/signin`
- `/login`
- `/signup`
- `/register`
- `/vendor/login`
- `/vendor/signup`
- `/admin/login`
- `/admin/signup`

### Protected Routes

- `/customer`: customer account
- `/vendor`: Vendor Studio
- `/admin`: Admin Operations

## 6. Backend Architecture

### 6.1 Controllers

Located in:

```text
backend/LocalCart.Api/Controllers
```

Controllers include:

- `AuthController`
- `ProductsController`
- `OrdersController`
- `VendorsController`
- `ProductCategoriesController`

### 6.2 Services

Located in:

```text
backend/LocalCart.Api/Services
```

Main services include:

- `AuthService`
- `JwtTokenService`
- `PasswordHasherService`
- `ProductService`
- `OrderService`
- `VendorService`
- `ProductCategoryServices`
- `CsvCatalogSeeder`

### 6.3 Repositories

Located in:

```text
backend/LocalCart.Api/Repositories
```

Repositories handle database access for:

- Users
- Vendors
- Products
- Orders
- Categories

### 6.4 Middleware

`ExceptionHandlingMiddleware` converts backend exceptions into consistent JSON responses with status codes and messages.

## 7. Main Backend API Endpoints

### Authentication

```text
POST /auth/login
POST /auth/register
POST /auth/register-vendor
GET  /auth/me
```

### Products

```text
GET    /products
GET    /products/{id}
GET    /products/my-products
POST   /products
PUT    /products/{id}
DELETE /products/{id}
```

Product query parameters include:

- `vendorId`
- `categoryId`
- `search`
- `includeUnavailable`

### Categories

```text
GET    /product-categories
GET    /product-categories/{id}
POST   /product-categories
PUT    /product-categories/{id}
DELETE /product-categories/{id}
```

### Vendors

```text
GET    /vendors
GET    /vendors/{id}
POST   /vendors
PUT    /vendors/{id}
DELETE /vendors/{id}
```

### Orders

```text
POST /orders
GET  /orders/lookup/{orderNumber}
GET  /orders/my-orders
GET  /orders/{id}
PUT  /orders/{id}/status
```

## 8. CSV Catalog Import

The catalog source file is:

```text
demo_marts_data_v4.csv
```

The CSV includes:

- Store name
- Area or region
- Physical address
- Store contact number
- Store email
- Product name
- Product category
- Product price
- Store image URL
- Product image URL

The importer creates:

- Vendors
- Categories
- Products
- Product images
- Vendor login users

The importer also:

- Ignores owner names from the CSV.
- Assigns product stock between 50 and 100.
- Avoids duplicate products.
- Keeps vendors active.
- Extracts pincodes from addresses.
- Creates Vendor accounts for stores without linked users.

Importer file:

```text
backend/LocalCart.Api/Services/CsvCatalogSeeder.cs
```

## 9. Credentials and Secrets

Credentials are intentionally not stored in the repository. Create local test accounts through a private seed script or environment-managed setup, and store production secrets in the deployment provider's secret manager.

Never commit passwords, JWT secrets, database connection strings, or user credential exports. Rotate any credentials that may previously have been exposed.

## 10. Customer Flow

1. Customer opens the website.
2. Location prompt asks for an area or pincode.
3. Customer submits the location.
4. Location is saved in local storage.
5. Nearby products are shown first.
6. Customer searches or filters products.
7. Customer opens a product.
8. Product details show the store name, address, and phone.
9. Customer clicks the store name or address.
10. The full product catalog for that store opens.
11. Customer adds products from one store to the cart.
12. Customer chooses delivery or pickup.
13. Customer places the order.
14. Customer receives an order number.
15. Customer can track the order using public lookup.

## 11. Vendor Flow

1. Vendor opens the sign-in page.
2. Vendor selects Vendor Studio.
3. Vendor signs in with a store credential.
4. Vendor views their products.
5. Vendor adds or updates products.
6. Vendor receives customer orders.
7. Vendor changes order statuses.
8. Customer-facing order tracking reflects the status.

## 12. Admin Flow

1. Admin opens the sign-in page.
2. Admin selects Admin Operations.
3. Admin signs in with an admin credential.
4. Admin reviews products, stores, orders, and metrics.
5. Admin updates or removes catalog products.
6. Admin exports operational CSV files.

## 13. Local Development

### Start the Backend

```bash
cd backend/LocalCart.Api
dotnet run --launch-profile http
```

Backend URL:

```text
http://localhost:5168
```

### Start the Frontend

```bash
cd Frontend/LocalCart-Web
npm ci
npm run dev -- --host 0.0.0.0
```

Frontend URL:

```text
http://localhost:5173
```

### Build Validation

```bash
cd Frontend/LocalCart-Web
npm run build

cd ../../backend/LocalCart.Api
dotnet build
```

## 14. Mobile Testing

Codespaces forwarded URL:

```text
https://friendly-yodel-59j696j5967hv7qq-5173.app.github.dev/
```

The Codespaces port must be running and accessible. If the URL is not reachable from a phone, set port `5173` visibility to Public in the VS Code Ports panel.

## 15. Production Deployment Notes

Recommended deployment:

- Frontend: Vercel
- Backend: Render or Azure App Service
- Database: Azure SQL or managed SQL Server

Production requirements:

- Set `VITE_API_BASE_URL` on the frontend.
- Configure a strong JWT secret of at least 256 bits.
- Use a managed database instead of local SQLite.
- Configure production CORS to allow only the frontend domain.
- Do not expose demo credentials publicly.
- Do not commit real passwords or production secrets.
- Store production secrets in deployment environment variables.

## 16. Current Validation Status

The following checks have passed during development:

- Frontend TypeScript and Vite build
- Backend .NET build
- Frontend route smoke tests
- Products API
- Vendors API
- Categories API
- Vendor login
- Admin login
- Vendor protected product access
- Admin protected product access
- Store-filtered product catalog
- Mobile forwarded routes
- CSV catalog image coverage for 400 products

## 17. Important Security Note

The credential CSV contains local development passwords because it was requested for local testing. Before publishing this project publicly or deploying it to production:

1. Remove the credential CSV from the public repository.
2. Change all demo and store passwords.
3. Use secure secret storage.
4. Never reuse local passwords in production.
