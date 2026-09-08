import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ClipboardList,
  MapPin,
  Package,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";
import { useOrders } from "../context/OrderContext";
import { money } from "../utils/formatters";
import { Order } from "../types";

export const OrderConfirmedPage: React.FC = () => {
  const [params] = useSearchParams();
  const { lastOrder, lookupOrder } = useOrders();
  const [liveOrder, setLiveOrder] = useState<Order | null>(lastOrder);

  const orderNumber =
    params.get("orderNumber") || lastOrder?.orderNumber || "LC-ORDER";

  useEffect(() => {
    if (orderNumber && orderNumber !== "LC-ORDER") {
      lookupOrder(orderNumber)
        .then((order) => setLiveOrder(order))
        .catch((err) =>
          console.warn("Could not fetch live order status:", err),
        );
    }
  }, [orderNumber]);

  const customerName = liveOrder?.customer?.name || lastOrder?.customer?.name;
  const deliveryAddress =
    liveOrder?.customer?.address || lastOrder?.customer?.address;
  const storeName =
    liveOrder?.vendorName ||
    liveOrder?.items[0]?.vendor ||
    lastOrder?.items[0]?.vendor ||
    "Verified Local Merchant";
  const totalAmount = liveOrder?.total ?? lastOrder?.total ?? 0;
  const status = liveOrder?.status || "Pending";

  const isPacking = ["Accepted", "ReadyForPickup", "Completed"].includes(
    status,
  );
  const isDone = ["Completed", "Delivered"].includes(status);

  return (
    <main
      className="page confirmed"
      style={{
        maxWidth: "680px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      {/* Animated Checkmark */}
      <div
        className="confirm-mark"
        style={{
          width: "72px",
          height: "72px",
          background: "var(--green)",
          borderRadius: "50%",
          boxShadow: "0 16px 40px rgba(26, 107, 67, 0.22)",
        }}
      >
        <Check size={36} style={{ color: "#ffffff" }} />
      </div>

      <span className="kicker">
        <ShieldCheck size={16} /> ORDER CONFIRMED & DISPATCH NOTIFIED
      </span>

      <h1
        style={{
          fontSize: "clamp(36px, 4vw, 52px)",
          fontWeight: 800,
          letterSpacing: "-2px",
        }}
      >
        It's on its way
        <br />
        <em>to becoming yours.</em>
      </h1>

      <p style={{ color: "var(--muted)" }}>
        Thanks{customerName ? `, ${customerName}` : ""}! Your order has been
        dispatched to <b style={{ color: "var(--ink)" }}>{storeName}</b>. The
        merchant is processing your items now.
      </p>

      {/* Order Ticket Card */}
      <div
        className="order-ticket shadow-sm"
        style={{
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
          margin: "40px 0",
          padding: "24px",
        }}
      >
        <div>
          <span>Order Reference</span>
          <b>{orderNumber}</b>
        </div>
        <div>
          <span>Store</span>
          <b className="flex items-center gap-1.5 text-sm">
            <Store size={15} style={{ color: "var(--rust)" }} /> {storeName}
          </b>
        </div>
        <div>
          <span>Total Amount</span>
          <b>{money(totalAmount)}</b>
        </div>
      </div>

      {/* Live Order Timeline */}
      <div
        className="rounded-2xl p-6 text-left my-8"
        style={{
          background: "var(--paper)",
          border: "1px solid var(--line)",
        }}
      >
        <span
          className="text-xs uppercase font-bold tracking-wider block mb-4"
          style={{ color: "var(--muted)" }}
        >
          Live Fulfillment Status
        </span>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="flex flex-col items-center">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm mb-2"
              style={{
                background: "var(--green-light)",
                color: "var(--green)",
              }}
            >
              <Check size={18} />
            </div>
            <b className="text-xs font-bold" style={{ color: "var(--ink)" }}>
              Order Placed
            </b>
            <small className="text-[11px]" style={{ color: "var(--muted)" }}>
              Confirmed
            </small>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${
                !isPacking ? "animate-pulse" : ""
              }`}
              style={
                isPacking
                  ? { background: "var(--green-light)", color: "var(--green)" }
                  : { background: "var(--rust-light)", color: "var(--rust)" }
              }
            >
              <Package size={18} />
            </div>
            <b className="text-xs font-bold" style={{ color: "var(--ink)" }}>
              {status === "ReadyForPickup" ? "Ready" : "Preparing"}
            </b>
            <small className="text-[11px]" style={{ color: "var(--muted)" }}>
              {status === "ReadyForPickup" ? "At counter" : "At store"}
            </small>
          </div>

          <div
            className={`flex flex-col items-center ${
              isDone ? "" : "opacity-60"
            }`}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm mb-2"
              style={
                isDone
                  ? { background: "var(--green-light)", color: "var(--green)" }
                  : {
                      background: "var(--cream)",
                      color: "var(--muted)",
                      border: "1px solid var(--line)",
                    }
              }
            >
              <Truck size={18} />
            </div>
            <b className="text-xs font-bold" style={{ color: "var(--ink)" }}>
              {isDone ? "Completed" : "Delivery / Handover"}
            </b>
            <small className="text-[11px]" style={{ color: "var(--muted)" }}>
              {isDone ? "Delivered" : "To your door"}
            </small>
          </div>
        </div>

        {deliveryAddress && (
          <div
            className="mt-4 pt-4 flex items-center gap-2 text-xs"
            style={{
              borderTop: "1px solid var(--line)",
              color: "var(--muted)",
            }}
          >
            <MapPin
              size={14}
              className="flex-shrink-0"
              style={{ color: "var(--rust)" }}
            />
            <span>
              Delivering to:{" "}
              <b style={{ color: "var(--ink)" }}>{deliveryAddress}</b>
            </span>
          </div>
        )}
      </div>

      {/* Action CTA Buttons */}
      <div className="hero-actions centered">
        <Link className="btn btn-dark" to="/customer">
          <ClipboardList size={16} /> Track in Customer Portal
        </Link>
        <Link className="btn btn-outline" to="/products">
          Continue Exploring <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
};

