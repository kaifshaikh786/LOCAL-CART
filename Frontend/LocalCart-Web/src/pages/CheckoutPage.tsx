import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Banknote,
  Check,
  CreditCard,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { money } from "../utils/formatters";
import { Order } from "../types";

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart, subtotal } = useCart();
  const { addOrder } = useOrders();

  const [busy, setBusy] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [paymentMode, setPaymentMode] = useState<"cod" | "counter">("cod");

  const deliveryFee = deliveryType === "pickup" ? 0 : 50;
  const grandTotal = subtotal + deliveryFee;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cart.length) return;

    setBusy(true);
    const data = new FormData(event.currentTarget);
    const orderNumber = `LC${Date.now()}`;

    const order: Order = {
      orderNumber,
      customer: {
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        phone: String(data.get("phone") || ""),
        address: String(data.get("address") || ""),
        deliveryType,
        notes: String(data.get("notes") || ""),
      },
      items: [...cart],
      total: grandTotal,
      timestamp: new Date().toISOString(),
      status: "Pending",
    };

    addOrder(order);
    clearCart();
    setBusy(false);
    navigate(`/confirmed?orderNumber=${orderNumber}`);
  };

  return (
    <main className="page checkout-page">
      <Link className="back-link" to="/cart">
        <ArrowLeft size={16} /> Back to bag
      </Link>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <span className="kicker">SECURE HYPERLOCAL CHECKOUT</span>
          <h1>Complete your order.</h1>
          <p>Provide your delivery address or select in-store pickup.</p>

          {/* Delivery Method Selector */}
          <div className="mb-6">
            <span className="block text-xs font-bold uppercase text-slate-500 mb-2">
              Fulfillment Method
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  deliveryType === "delivery"
                    ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/30"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                }`}
                onClick={() => setDeliveryType("delivery")}
              >
                <Truck size={18} className="text-orange-600 mt-0.5" />
                <div>
                  <b className="block text-sm">Home Delivery</b>
                  <small className="text-slate-500 text-xs">
                    Delivered in 2-4 hours (₹50)
                  </small>
                </div>
              </button>

              <button
                type="button"
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  deliveryType === "pickup"
                    ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/30"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                }`}
                onClick={() => setDeliveryType("pickup")}
              >
                <Store size={18} className="text-emerald-600 mt-0.5" />
                <div>
                  <b className="block text-sm">Store Pickup</b>
                  <small className="text-slate-500 text-xs">
                    Ready in 20 min (Free)
                  </small>
                </div>
              </button>
            </div>
          </div>

          {/* Contact & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label>
              Full name
              <input name="name" placeholder="Rahul Sharma" required />
            </label>

            <label>
              Phone number
              <input
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                required
              />
            </label>
          </div>

          <label>
            Email address (for receipt & updates)
            <input
              name="email"
              type="email"
              placeholder="rahul@example.com"
              required
            />
          </label>

          {deliveryType === "delivery" && (
            <label>
              Delivery address in neighborhood
              <textarea
                name="address"
                placeholder="Flat / House No., Street, Landmark, Pincode"
                required
              />
            </label>
          )}

          <label>
            Special instructions for shopkeeper{" "}
            <span className="optional">optional</span>
            <textarea
              name="notes"
              placeholder="e.g. Ring the bell, call before arrival, or double-pack eggs"
            />
          </label>

          {/* Payment Method Option */}
          <div className="mt-4 mb-6">
            <span className="block text-xs font-bold uppercase text-slate-500 mb-2">
              Payment Method
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`p-3.5 rounded-xl border text-left flex items-center gap-2.5 text-xs font-bold ${
                  paymentMode === "cod"
                    ? "border-orange-500 bg-orange-50/40 dark:bg-orange-950/20 text-orange-600"
                    : "border-slate-200 dark:border-slate-700"
                }`}
                onClick={() => setPaymentMode("cod")}
              >
                <Banknote size={16} /> Cash / UPI on Delivery
              </button>
              <button
                type="button"
                className={`p-3.5 rounded-xl border text-left flex items-center gap-2.5 text-xs font-bold ${
                  paymentMode === "counter"
                    ? "border-orange-500 bg-orange-50/40 dark:bg-orange-950/20 text-orange-600"
                    : "border-slate-200 dark:border-slate-700"
                }`}
                onClick={() => setPaymentMode("counter")}
              >
                <CreditCard size={16} /> Pay at Store Counter
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-dark full text-sm py-4"
            disabled={busy || !cart.length}
          >
            {busy ? (
              "Confirming order..."
            ) : (
              <>
                Place Order ({money(grandTotal)}) <Check size={18} />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>
              Zero pre-payment required. Pay only after you receive goods.
            </span>
          </div>
        </form>

        {/* Order Summary Sidebar */}
        <aside className="summary checkout-summary">
          <h2>Order breakdown</h2>
          <div className="border-b border-slate-200 dark:border-slate-700 pb-3 mb-3">
            {cart.map((item) => (
              <div className="checkout-item py-2" key={item.id}>
                <span>
                  {item.name} <small>×{item.quantity}</small>
                  <small className="block text-[11px] text-slate-400">
                    {item.vendor}
                  </small>
                </span>
                <b>{money(item.price * item.quantity)}</b>
              </div>
            ))}
          </div>

          <div>
            <span>Items subtotal</span>
            <b>{money(subtotal)}</b>
          </div>

          <div>
            <span>Fulfillment</span>
            <b>{deliveryType === "pickup" ? "Free (Pickup)" : money(50)}</b>
          </div>

          <div className="summary-total">
            <span>Amount Due</span>
            <b>{money(grandTotal)}</b>
          </div>

          <small className="secure">
            <ShieldCheck size={14} className="text-emerald-600" />
            Direct hyperlocal fulfillment from verified seller
          </small>
        </aside>
      </div>
    </main>
  );
};
