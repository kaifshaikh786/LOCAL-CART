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
  const { bookOrder, addOrder } = useOrders();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [paymentMode, setPaymentMode] = useState<"cod" | "counter">("cod");

  const deliveryFee = deliveryType === "pickup" ? 0 : 50;
  const grandTotal = subtotal + deliveryFee;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cart.length) return;

    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);

    const customerName = String(data.get("name") || "").trim();
    const customerEmail = String(data.get("email") || "").trim();
    const customerPhone = String(data.get("phone") || "").trim();
    const deliveryAddress = String(data.get("address") || "").trim();
    const notes = String(data.get("notes") || "").trim();

    try {
      // Build CreateOrderDto for ASP.NET Core API
      const dto = {
        customerName,
        customerEmail,
        customerPhone,
        deliveryMethod:
          deliveryType === "pickup"
            ? ("Pickup" as const)
            : ("Home Delivery" as const),
        deliveryAddress:
          deliveryType === "delivery" ? deliveryAddress : undefined,
        items: cart.map((item) => ({
          productId: item.productId || item.id,
          quantity: item.quantity,
        })),
      };

      const booked = await bookOrder(dto);
      if (deliveryAddress) {
        localStorage.setItem(
          "localcart-location",
          deliveryAddress.split("\n")[0].trim(),
        );
      }
      clearCart();
      setBusy(false);
      navigate(
        `/confirmed?orderNumber=${encodeURIComponent(booked.orderNumber)}`,
      );
    } catch (err: any) {
      console.warn("Backend order failed, falling back to local order:", err);
      // If it's a backend validation error (e.g. single-vendor violation, stock error), display it
      if (err.statusCode && err.statusCode >= 400 && err.statusCode < 500) {
        setError(
          err.message || "Could not process order. Please check item details.",
        );
        setBusy(false);
        return;
      }

      // Offline demo fallback
      const fallbackOrderNumber = `LC${Date.now()}`;
      const fallbackOrder: Order = {
        orderNumber: fallbackOrderNumber,
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: deliveryAddress,
          deliveryType,
          notes,
        },
        items: [...cart],
        total: grandTotal,
        timestamp: new Date().toISOString(),
        status: "Pending",
      };
      addOrder(fallbackOrder);
      clearCart();
      setBusy(false);
      navigate(`/confirmed?orderNumber=${fallbackOrderNumber}`);
    }
  };

  return (
    <main className="page checkout-page" style={{ background: "var(--cream)" }}>
      <Link
        className="back-link"
        to="/cart"
        style={{
          color: "var(--muted)",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "13px",
          fontWeight: 600,
          marginBottom: "28px",
        }}
      >
        <ArrowLeft size={16} /> Back to bag
      </Link>

      <div className="checkout-layout">
        <form
          className="checkout-form"
          onSubmit={handleSubmit}
          style={{
            background: "var(--paper)",
            border: "1px solid var(--line)",
            borderRadius: "28px",
            padding: "clamp(28px, 4vw, 48px)",
          }}
        >
          <span
            className="kicker"
            style={{
              color: "var(--rust)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
            }}
          >
            SECURE HYPERLOCAL CHECKOUT
          </span>
          <h1 style={{ color: "var(--ink)" }}>Complete your order.</h1>
          <p style={{ color: "var(--muted)" }}>
            Provide your delivery address or select in-store pickup.
          </p>

          {/* Delivery Method Selector */}
          <div className="mb-6">
            <span
              className="block uppercase mb-2"
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--ink)",
              }}
            >
              Fulfillment Method
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer"
                style={{
                  background:
                    deliveryType === "delivery"
                      ? "var(--rust-light)"
                      : "var(--paper)",
                  borderColor:
                    deliveryType === "delivery" ? "var(--rust)" : "var(--line)",
                  borderRadius: "12px",
                  color: "var(--ink)",
                }}
                onClick={() => setDeliveryType("delivery")}
              >
                <Truck
                  size={18}
                  style={{ color: "var(--rust)", marginTop: "2px" }}
                />
                <div>
                  <b className="block text-sm" style={{ color: "var(--ink)" }}>
                    Home Delivery
                  </b>
                  <small style={{ color: "var(--muted)", fontSize: "12px" }}>
                    Delivered in 2-4 hours (₹50)
                  </small>
                </div>
              </button>

              <button
                type="button"
                className="p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer"
                style={{
                  background:
                    deliveryType === "pickup"
                      ? "var(--rust-light)"
                      : "var(--paper)",
                  borderColor:
                    deliveryType === "pickup" ? "var(--rust)" : "var(--line)",
                  borderRadius: "12px",
                  color: "var(--ink)",
                }}
                onClick={() => setDeliveryType("pickup")}
              >
                <Store
                  size={18}
                  style={{ color: "var(--green)", marginTop: "2px" }}
                />
                <div>
                  <b className="block text-sm" style={{ color: "var(--ink)" }}>
                    Store Pickup
                  </b>
                  <small style={{ color: "var(--muted)", fontSize: "12px" }}>
                    Ready in 20 min (Free)
                  </small>
                </div>
              </button>
            </div>
          </div>

          {/* Contact & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--ink)",
              }}
            >
              Full name
              <input
                name="name"
                placeholder="Rahul Sharma"
                required
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  background: "var(--cream)",
                  color: "var(--ink)",
                }}
              />
            </label>

            <label
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--ink)",
              }}
            >
              Phone number
              <input
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                required
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  background: "var(--cream)",
                  color: "var(--ink)",
                }}
              />
            </label>
          </div>

          <label
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--ink)",
            }}
          >
            Email address (for receipt & updates)
            <input
              name="email"
              type="email"
              placeholder="rahul@example.com"
              required
              style={{
                border: "1px solid var(--line)",
                borderRadius: "12px",
                padding: "14px 16px",
                background: "var(--cream)",
                color: "var(--ink)",
              }}
            />
          </label>

          {deliveryType === "delivery" && (
            <label
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--ink)",
              }}
            >
              Delivery address in neighborhood
              <textarea
                name="address"
                placeholder="Flat / House No., Street, Landmark, Pincode"
                required
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  background: "var(--cream)",
                  color: "var(--ink)",
                }}
              />
            </label>
          )}

          <label
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--ink)",
            }}
          >
            Special instructions for shopkeeper{" "}
            <span className="optional" style={{ color: "var(--muted)" }}>
              optional
            </span>
            <textarea
              name="notes"
              placeholder="e.g. Ring the bell, call before arrival, or double-pack eggs"
              style={{
                border: "1px solid var(--line)",
                borderRadius: "12px",
                padding: "14px 16px",
                background: "var(--cream)",
                color: "var(--ink)",
              }}
            />
          </label>

          {/* Payment Method Option */}
          <div className="mt-4 mb-6">
            <span
              className="block uppercase mb-2"
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--ink)",
              }}
            >
              Payment Method
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="p-3.5 rounded-xl border text-left flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer"
                style={{
                  background:
                    paymentMode === "cod"
                      ? "var(--rust-light)"
                      : "var(--paper)",
                  borderColor:
                    paymentMode === "cod" ? "var(--rust)" : "var(--line)",
                  color: paymentMode === "cod" ? "var(--rust)" : "var(--ink)",
                  borderRadius: "12px",
                }}
                onClick={() => setPaymentMode("cod")}
              >
                <Banknote size={16} /> Cash / UPI on Delivery
              </button>
              <button
                type="button"
                className="p-3.5 rounded-xl border text-left flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer"
                style={{
                  background:
                    paymentMode === "counter"
                      ? "var(--rust-light)"
                      : "var(--paper)",
                  borderColor:
                    paymentMode === "counter" ? "var(--rust)" : "var(--line)",
                  color:
                    paymentMode === "counter" ? "var(--rust)" : "var(--ink)",
                  borderRadius: "12px",
                }}
                onClick={() => setPaymentMode("counter")}
              >
                <CreditCard size={16} /> Pay at Store Counter
              </button>
            </div>
          </div>

          {error && (
            <div
              className="mb-4 p-3 rounded-xl text-xs font-semibold"
              style={{
                background: "var(--rust-light)",
                border: "1px solid rgba(212, 98, 42, 0.2)",
                color: "var(--rust)",
                borderRadius: "12px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-dark full text-sm py-4"
            style={{ width: "100%", justifyContent: "center" }}
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

          <div
            className="flex items-center justify-center gap-2 mt-4 text-xs"
            style={{ color: "var(--muted)" }}
          >
            <ShieldCheck size={14} style={{ color: "var(--green)" }} />
            <span>
              Zero pre-payment required. Pay only after you receive goods.
            </span>
          </div>
        </form>

        {/* Order Summary Sidebar */}
        <aside
          className="summary checkout-summary"
          style={{
            position: "sticky",
            top: "104px",
            background: "var(--paper)",
            border: "1px solid var(--line)",
            borderRadius: "28px",
            padding: "32px",
          }}
        >
          <h2 style={{ color: "var(--ink)" }}>Order breakdown</h2>
          <div
            className="border-b pb-3 mb-3"
            style={{ borderColor: "var(--line)" }}
          >
            {cart.map((item) => (
              <div className="checkout-item py-2" key={item.id}>
                <span>
                  <span style={{ color: "var(--ink)" }}>{item.name}</span>{" "}
                  <small style={{ color: "var(--muted)" }}>
                    ×{item.quantity}
                  </small>
                  <small
                    className="block text-[11px]"
                    style={{ color: "var(--muted)" }}
                  >
                    {item.vendor}
                  </small>
                </span>
                <b style={{ color: "var(--ink)" }}>
                  {money(item.price * item.quantity)}
                </b>
              </div>
            ))}
          </div>

          <div style={{ color: "var(--muted)" }}>
            <span>Items subtotal</span>
            <b style={{ color: "var(--ink)" }}>{money(subtotal)}</b>
          </div>

          <div style={{ color: "var(--muted)" }}>
            <span>Fulfillment</span>
            <b style={{ color: "var(--ink)" }}>
              {deliveryType === "pickup" ? "Free (Pickup)" : money(50)}
            </b>
          </div>

          <div
            className="summary-total"
            style={{
              borderTop: "2px solid var(--line)",
              paddingTop: "16px",
              marginTop: "20px",
            }}
          >
            <span style={{ color: "var(--ink)" }}>Amount Due</span>
            <b
              style={{
                color: "var(--rust)",
                fontSize: "22px",
                fontWeight: 800,
              }}
            >
              {money(grandTotal)}
            </b>
          </div>

          <small className="secure" style={{ color: "var(--muted)" }}>
            <ShieldCheck size={14} style={{ color: "var(--green)" }} />
            Direct hyperlocal fulfillment from verified seller
          </small>
        </aside>
      </div>
    </main>
  );
};
