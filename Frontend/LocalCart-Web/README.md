# LocalCart frontend demo

React and TypeScript customer storefront with customer, vendor, and admin workspaces. This frontend is intentionally demo-ready while the backend is being completed.

## Run locally

```bash
npm install
npm run dev
```

The Vite server runs on `http://localhost:5173` and proxies `/api` requests to the backend at `http://localhost:5000`.

## Demo routes

- `/` - Customer storefront; no login required
- `/products` - Nearby product discovery
- `/cart` and `/checkout` - Customer purchase flow
- `/customer` - Customer order history
- `/vendor/login` - Vendor login demo
- `/vendor` - Vendor catalog, image upload, and incoming orders
- `/admin/login` - Admin login demo
- `/admin` - Admin revenue, catalog, and order overview

The role workspaces and checkout use browser storage for demonstration, so the site can be shown without the backend running. The checkout also attempts `/api/send-order` when the backend is available. Replace the browser-storage adapter with the database API once the backend contract is ready.