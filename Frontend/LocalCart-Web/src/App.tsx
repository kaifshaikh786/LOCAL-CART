import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider, useCart } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Toast } from "./components/common/Toast";
import { AppRoutes } from "./routes/AppRoutes";

const AppContent: React.FC = () => {
  const { toast } = useCart();

  return (
    <>
      <Header />
      <AppRoutes />
      <Toast message={toast} />
      <Footer />
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <AppContent />
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
