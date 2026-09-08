import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { OrderConfirmedPage } from "../pages/OrderConfirmedPage";
import { LoginPage } from "../pages/LoginPage";
import { SignUpPage } from "../pages/SignUpPage";
import { CustomerDashboardPage } from "../pages/CustomerDashboardPage";
import { VendorDashboardPage } from "../pages/VendorDashboardPage";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { HowItWorksPage } from "../pages/HowItWorksPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { RequireAccess } from "../components/auth/RequireAccess";

const RedirectToSignin: React.FC<{ defaultRole?: string }> = ({
  defaultRole,
}) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  if (defaultRole && !params.get("role")) {
    params.set("role", defaultRole);
  }
  const search = params.toString() ? `?${params.toString()}` : "";
  return <Navigate to={`/signin${search}`} replace />;
};

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
      <Route path="/how-it-works" element={<HowItWorksPage />} />

      {/* Customer Account */}
      <Route path="/customer" element={<CustomerDashboardPage />} />
      <Route path="/account" element={<Navigate to="/customer" replace />} />

      {/* Authentication */}
      <Route path="/signin" element={<LoginPage />} />
      <Route path="/login" element={<RedirectToSignin />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/register" element={<SignUpPage />} />
      <Route
        path="/vendor/login"
        element={<RedirectToSignin defaultRole="vendor" />}
      />
      <Route path="/vendor/signup" element={<SignUpPage />} />
      <Route
        path="/admin/login"
        element={<RedirectToSignin defaultRole="admin" />}
      />
      <Route
        path="/admin/signup"
        element={<RedirectToSignin defaultRole="admin" />}
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
      <Route path="/customers/login.html" element={<RedirectToSignin />} />
      <Route path="/customers/signup.html" element={<RedirectToSignin />} />
      <Route
        path="/vendors/login.html"
        element={<RedirectToSignin defaultRole="vendor" />}
      />
      <Route
        path="/vendors/signup.html"
        element={<RedirectToSignin defaultRole="vendor" />}
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
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
