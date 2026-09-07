import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { OrderConfirmedPage } from "../pages/OrderConfirmedPage";
import { LoginPage } from "../pages/LoginPage";
import { CustomerDashboardPage } from "../pages/CustomerDashboardPage";
import { VendorDashboardPage } from "../pages/VendorDashboardPage";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { RequireAccess } from "../components/auth/RequireAccess";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Storefront Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/confirmed" element={<OrderConfirmedPage />} />

      {/* Customer Account */}
      <Route path="/customer" element={<CustomerDashboardPage />} />

      {/* Authentication */}
      <Route path="/signin" element={<LoginPage />} />
      <Route
        path="/vendor/login"
        element={<Navigate to="/signin?role=vendor" replace />}
      />
      <Route
        path="/admin/login"
        element={<Navigate to="/signin?role=admin" replace />}
      />

      {/* Role-Protected Workspaces */}
      <Route
        path="/vendor"
        element={
          <RequireAccess role="vendor">
            <VendorDashboardPage />
          </RequireAccess>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAccess role="admin">
            <AdminDashboardPage />
          </RequireAccess>
        }
      />

      {/* Legacy HTML Route Redirects */}
      <Route path="/index.html" element={<Navigate to="/" replace />} />
      <Route
        path="/products.html"
        element={<Navigate to="/products" replace />}
      />
      <Route
        path="/customers/product.html"
        element={<Navigate to="/products" replace />}
      />
      <Route
        path="/customers/p-details.html"
        element={<Navigate to="/products/1" replace />}
      />
      <Route
        path="/customers/cart.html"
        element={<Navigate to="/cart" replace />}
      />
      <Route
        path="/customers/order.html"
        element={<Navigate to="/checkout" replace />}
      />
      <Route
        path="/customers/order-confirmation.html"
        element={<Navigate to="/confirmed" replace />}
      />
      <Route
        path="/vendors/login.html"
        element={<Navigate to="/signin?role=vendor" replace />}
      />
      <Route
        path="/vendors/signup.html"
        element={<Navigate to="/signin?role=vendor" replace />}
      />
      <Route
        path="/vendors/dashboard.html"
        element={<Navigate to="/vendor" replace />}
      />
      <Route
        path="/vendors/settings.html"
        element={<Navigate to="/vendor" replace />}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
