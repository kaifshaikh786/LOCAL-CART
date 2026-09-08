import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product } from "../types";
import { readStoredCart } from "../data/mockData";

export type VendorConflictState = {
  currentVendor: string;
  newProduct: Product;
};

type CartContextType = {
  cart: CartItem[];
  itemCount: number;
  subtotal: number;
  toast: string;
  activeVendor: string | null;
  activeVendorId?: number;
  vendorConflict: VendorConflictState | null;
  addToCart: (product: Product, forceClear?: boolean) => boolean;
  resolveVendorConflict: (confirmSwitch: boolean) => void;
  updateQuantity: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  setToast: (msg: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>(readStoredCart);
  const [toast, setToast] = useState<string>("");
  const [vendorConflict, setVendorConflict] =
    useState<VendorConflictState | null>(null);

  useEffect(() => {
    localStorage.setItem("localcart-cart", JSON.stringify(cart));
  }, [cart]);

  const activeVendor = cart.length > 0 ? cart[0].vendor : null;
  const activeVendorId = cart.length > 0 ? cart[0].vendorId : undefined;

  const addToCart = (product: Product, forceClear = false): boolean => {
    // Check Single Vendor Policy
    if (cart.length > 0 && !forceClear) {
      const currentVendorKey = cart[0].vendorId
        ? String(cart[0].vendorId)
        : cart[0].vendor.trim().toLowerCase();
      const newVendorKey = product.vendorId
        ? String(product.vendorId)
        : product.vendor.trim().toLowerCase();

      if (currentVendorKey !== newVendorKey) {
        setVendorConflict({
          currentVendor: cart[0].vendor,
          newProduct: product,
        });
        return false;
      }
    }

    setCart((current) => {
      const baseCart = forceClear ? [] : current;
      const found = baseCart.find(
        (item) =>
          item.id === product.id ||
          (product.productId && item.productId === product.productId),
      );
      if (found) {
        return baseCart.map((item) =>
          item.id === product.id ||
          (product.productId && item.productId === product.productId)
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...baseCart, { ...product, quantity: 1 }];
    });

    setToast(`${product.name} added to bag`);
    window.setTimeout(() => setToast(""), 2500);
    return true;
  };

  const resolveVendorConflict = (confirmSwitch: boolean) => {
    if (confirmSwitch && vendorConflict) {
      addToCart(vendorConflict.newProduct, true);
    }
    setVendorConflict(null);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id || item.productId === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (id: number) => {
    setCart((current) =>
      current.filter((item) => item.id !== id && item.productId !== id),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        subtotal,
        toast,
        activeVendor,
        activeVendorId,
        vendorConflict,
        addToCart,
        resolveVendorConflict,
        updateQuantity,
        removeFromCart,
        clearCart,
        setToast,
      }}
    >
      {children}

      {/* Global Vendor Conflict Modal */}
      {vendorConflict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl text-left">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center font-bold text-lg mb-3">
              !
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mb-2">
              Order from one vendor at a time
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Your bag currently contains items from{" "}
              <b>{vendorConflict.currentVendor}</b>. To ensure prompt local
              fulfillment, LocalCart requires one vendor per order. Would you
              like to clear your bag and start a fresh order with{" "}
              <b>{vendorConflict.newProduct.vendor}</b>?
            </p>
            <div className="flex gap-3 justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => resolveVendorConflict(false)}
              >
                Keep Current Bag
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 text-white hover:bg-orange-700 shadow-md shadow-orange-600/20 transition-all"
                onClick={() => resolveVendorConflict(true)}
              >
                Clear & Switch Store
              </button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
