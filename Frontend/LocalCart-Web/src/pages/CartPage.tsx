import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Store,
  Trash2,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { CartItemRow } from "../components/cart/CartItemRow";
import { OrderSummary } from "../components/cart/OrderSummary";

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal } =
    useCart();

  const activeVendor = cart.length > 0 ? cart[0].vendor : null;

  return (
    <main className="page cart-page">
      <div className="flex justify-between items-end flex-wrap gap-4 mb-8">
        <div className="page-intro compact m-0">
          <span className="kicker">YOUR LOCAL SHOPPING BAG</span>
          <h1>Ready when you are.</h1>
          <p>
            {cart.length
              ? `${cart.length} local ${cart.length === 1 ? "item" : "items"} ready for checkout.`
              : "Your bag is waiting for a good find."}
          </p>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800"
          >
            <Trash2 size={14} /> Clear entire bag
          </button>
        )}
      </div>

      {cart.length > 0 ? (
        <div className="cart-layout">
          <div className="flex flex-col gap-4">
            {/* Active Store Indicator */}
            {activeVendor && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/40 text-xs font-semibold text-orange-900 dark:text-orange-200">
                <Store size={16} className="text-orange-600" />
                <span>
                  Ordering from verified store: <b>{activeVendor}</b>
                </span>
              </div>
            )}

            {/* Cart Items List */}
            <div className="cart-list">
              {cart.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            <div className="pt-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
              >
                <ArrowLeft size={14} /> Continue shopping nearby
              </Link>
            </div>
          </div>

          <OrderSummary subtotal={subtotal} />
        </div>
      ) : (
        <div className="empty-state">
          <ShoppingBag size={48} />
          <h2>Your bag is empty</h2>
          <p>
            Explore nearby stores and find daily essentials, tech, fashion, and
            home goods.
          </p>
          <Link className="btn btn-dark" to="/products">
            Explore local catalog <ArrowRight size={17} />
          </Link>
        </div>
      )}
    </main>
  );
};
