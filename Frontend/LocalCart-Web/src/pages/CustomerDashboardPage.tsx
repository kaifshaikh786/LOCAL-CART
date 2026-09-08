import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Edit2,
  Heart,
  MapPin,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { PanelShell } from "../components/layout/PanelShell";
import { MetricCard } from "../components/common/MetricCard";
import { useOrders } from "../context/OrderContext";
import { formatDate, money } from "../utils/formatters";

export const CustomerDashboardPage: React.FC = () => {
  const { orders, syncOrders, lookupOrder } = useOrders();
  const latestOrder = orders[0];

  // Location State
  const [storedLocation, setStoredLocation] = useState(
    localStorage.getItem("localcart-location") || "",
  );
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [newLocationInput, setNewLocationInput] = useState("");

  // Live Sync & Track State
  const [isSyncing, setIsSyncing] = useState(false);
  const [trackNumber, setTrackNumber] = useState("");
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackNotice, setTrackNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Sync orders with live backend on initial render
  useEffect(() => {
    syncOrders();
  }, []);

  // Compute active locality
  const effectiveLocality =
    storedLocation && storedLocation !== "Not configured"
      ? storedLocation
      : latestOrder?.customer?.address
        ? latestOrder.customer.address.split("\n")[0].trim()
        : "Mumbai Central";

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocationInput.trim()) return;
    const val = newLocationInput.trim();
    localStorage.setItem("localcart-location", val);
    setStoredLocation(val);
    setIsEditingLocation(false);
    setNewLocationInput("");
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncOrders();
    setTimeout(() => setIsSyncing(false), 600);
  };

  const handleTrackAndLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackNumber.trim()) return;
    setTrackLoading(true);
    setTrackNotice(null);

    try {
      const found = await lookupOrder(trackNumber.trim());
      setTrackNotice({
        type: "success",
        msg: `Order ${found.orderNumber} successfully found and linked (${found.status || "Active"})!`,
      });
      setTrackNumber("");
    } catch (err: any) {
      setTrackNotice({
        type: "error",
        msg: `Order "${trackNumber}" not found. Please verify the order reference.`,
      });
    } finally {
      setTrackLoading(false);
    }
  };

  const getStatusBadgeStyle = (status?: string) => {
    const s = (status || "Pending").toLowerCase();
    if (s === "completed" || s === "delivered") {
      return {
        bg: "var(--green-light)",
        color: "var(--green)",
        label: status || "Completed",
      };
    }
    if (s === "accepted" || s === "readyforpickup" || s === "in transit") {
      return {
        bg: "var(--rust-light)",
        color: "var(--rust)",
        label: status === "ReadyForPickup" ? "Ready for Pickup" : status || "Accepted",
      };
    }
    if (s === "cancelled") {
      return {
        bg: "rgba(239, 68, 68, 0.1)",
        color: "#ef4444",
        label: "Cancelled",
      };
    }
    return {
      bg: "var(--gold-light)",
      color: "var(--gold)",
      label: status || "Pending",
    };
  };

  return (
    <PanelShell
      role="Customer"
      title="Your local account."
      description="Track live order dispatches, manage your neighborhood preferences, and support local shops."
    >
      {/* Metric Cards */}
      <div className="metric-grid">
        <MetricCard
          icon={<ClipboardList size={20} />}
          label="Orders placed"
          value={String(orders.length)}
          detail={
            latestOrder
              ? `Status: ${latestOrder.status || "Active"}`
              : "Your next order starts here"
          }
        />
        <MetricCard
          icon={<Truck size={20} />}
          label="Preferred Mode"
          value={
            latestOrder?.customer?.deliveryType === "pickup"
              ? "Store Pickup"
              : "Home Delivery"
          }
          detail="Change at checkout"
        />
        <MetricCard
          icon={<Heart size={20} />}
          label="Neighborhood Store"
          value={
            latestOrder?.items[0]?.vendor ||
            latestOrder?.vendorName ||
            "Prime Electronics"
          }
          detail="Nearest verified merchant"
        />
        <MetricCard
          icon={<MapPin size={20} />}
          label="Current Locality"
          value={effectiveLocality}
          detail="Primary delivery zone"
        />
      </div>

      {/* Main Panel Content */}
      <div className="panel-grid">
        {/* Order History Stream */}
        <section className="panel-card wide">
          <div className="card-heading flex-wrap gap-3">
            <div>
              <span className="kicker">ORDER HISTORY</span>
              <h2>Your recent orders ({orders.length})</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-btn flex items-center gap-1.5 cursor-pointer text-xs font-bold"
                onClick={handleManualSync}
                title="Refresh order status from server"
              >
                <RefreshCw size={13} className={isSyncing ? "animate-spin" : ""} />
                {isSyncing ? "Syncing..." : "Sync Live Status"}
              </button>
              <Link to="/products" className="text-btn flex items-center gap-1 text-xs font-bold">
                Shop again <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {orders.length > 0 ? (
            <div className="flex flex-col">
              {orders.map((order) => {
                const badge = getStatusBadgeStyle(order.status);
                const storeName =
                  order.items[0]?.vendor || order.vendorName || "Local Merchant";

                return (
                  <div className="order-row" key={order.orderNumber}>
                    <span className="order-icon">
                      <Package size={20} />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <b style={{ color: "var(--ink)" }}>{order.orderNumber}</b>
                        <span
                          className="text-xs font-mono"
                          style={{ color: "var(--muted)" }}
                        >
                          {formatDate(order.timestamp)}
                        </span>
                      </div>
                      <small style={{ color: "var(--muted)" }}>
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"} ·{" "}
                        <span
                          className="font-semibold"
                          style={{ color: "var(--rust)" }}
                        >
                          {storeName}
                        </span>{" "}
                        (
                        {order.customer.deliveryType === "pickup"
                          ? "Pickup"
                          : "Home Delivery"}
                        )
                      </small>
                      {order.items.length > 0 && (
                        <div className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>
                          {order.items.map((it) => it.name).join(", ")}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <strong style={{ color: "var(--ink)", display: "block" }}>
                        {money(order.total)}
                      </strong>
                      <span
                        className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold"
                        style={{
                          background: badge.bg,
                          color: badge.color,
                        }}
                      >
                        {badge.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="panel-empty py-12 text-center">
              <ClipboardList size={36} className="mx-auto mb-3 text-[var(--muted)]" />
              <p style={{ color: "var(--muted)" }}>
                No orders yet. Your first local find is waiting.
              </p>
              <Link className="btn btn-dark mt-4 inline-flex items-center gap-1.5" to="/products">
                Start shopping <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </section>

        {/* Account & Quick Actions */}
        <section className="flex flex-col gap-6">
          {/* Order Tracking by Reference Box */}
          <div className="panel-card">
            <span className="kicker">ORDER LOOKUP</span>
            <h2>Track Existing Order</h2>
            <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
              Have an order reference from a previous checkout? Enter it below to sync live status from the database.
            </p>

            <form onSubmit={handleTrackAndLink} className="space-y-3">
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background: "var(--cream)",
                  border: "1px solid var(--line)",
                }}
              >
                <Search size={14} style={{ color: "var(--muted)" }} />
                <input
                  type="text"
                  placeholder="e.g. LC-260908-931C"
                  value={trackNumber}
                  onChange={(e) => setTrackNumber(e.target.value)}
                  className="bg-transparent text-xs outline-none w-full font-mono font-bold"
                  style={{ color: "var(--ink)" }}
                />
              </div>

              <button
                type="submit"
                disabled={trackLoading || !trackNumber.trim()}
                className="btn btn-dark w-full text-xs font-bold py-2 cursor-pointer flex items-center justify-center gap-1"
              >
                {trackLoading ? "Looking up..." : "Track & Link to Account"}
              </button>

              {trackNotice && (
                <div
                  className="p-3 rounded-xl text-xs font-semibold flex items-center gap-2 mt-2"
                  style={{
                    background:
                      trackNotice.type === "success"
                        ? "var(--green-light)"
                        : "rgba(239, 68, 68, 0.1)",
                    color:
                      trackNotice.type === "success"
                        ? "var(--green)"
                        : "#ef4444",
                    border:
                      trackNotice.type === "success"
                        ? "1px solid rgba(26, 107, 67, 0.2)"
                        : "1px solid rgba(239, 68, 68, 0.2)",
                  }}
                >
                  {trackNotice.type === "success" ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <X size={14} />
                  )}
                  <span>{trackNotice.msg}</span>
                </div>
              )}
            </form>
          </div>

          {/* Neighborhood Profile Preferences */}
          <div className="panel-card">
            <div className="flex justify-between items-center mb-1">
              <span className="kicker">PREFERENCES</span>
              <button
                type="button"
                onClick={() => {
                  setIsEditingLocation(!isEditingLocation);
                  setNewLocationInput(effectiveLocality);
                }}
                className="text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                style={{ color: "var(--rust)" }}
              >
                <Edit2 size={11} /> {isEditingLocation ? "Cancel" : "Change"}
              </button>
            </div>
            <h2>Neighborhood Profile</h2>

            <div
              className="mt-4 space-y-3 text-xs"
              style={{ color: "var(--muted)" }}
            >
              {isEditingLocation ? (
                <form onSubmit={handleSaveLocation} className="space-y-2 py-2">
                  <label className="block text-[11px] font-bold" style={{ color: "var(--ink)" }}>
                    Update Neighborhood Area / Locality:
                  </label>
                  <input
                    type="text"
                    value={newLocationInput}
                    onChange={(e) => setNewLocationInput(e.target.value)}
                    placeholder="Enter locality, area, or pincode"
                    className="w-full p-2 rounded-xl text-xs font-semibold"
                    style={{
                      background: "var(--cream)",
                      border: "1px solid var(--line)",
                      color: "var(--ink)",
                    }}
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="submit"
                      className="btn btn-dark text-xs font-bold py-1.5 px-3 cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <div
                  className="flex items-center justify-between py-2"
                  style={{ borderBottom: "1px solid var(--line)" }}
                >
                  <span style={{ color: "var(--muted)" }}>
                    Active Delivery Area:
                  </span>
                  <b className="font-semibold" style={{ color: "var(--ink)" }}>
                    {effectiveLocality}
                  </b>
                </div>
              )}

              <div
                className="flex items-center justify-between py-2"
                style={{ borderBottom: "1px solid var(--line)" }}
              >
                <span style={{ color: "var(--muted)" }}>Account Type:</span>
                <span
                  className="font-bold flex items-center gap-1"
                  style={{ color: "var(--green)" }}
                >
                  <ShieldCheck size={14} /> Guest Checkout Enabled
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="panel-card">
            <span className="kicker">QUICK LINKS</span>
            <h2>Explore LocalCart</h2>
            <div className="quick-links">
              <Link to="/products">
                <Search size={16} /> Browse Neighborhood Products
              </Link>
              <Link to="/cart">
                <ShoppingBag size={16} /> Open Shopping Bag
              </Link>
              <Link to="/signin?role=vendor">
                <Store size={16} /> Vendor Studio Portal
              </Link>
              <a href="mailto:support@localcart.in">
                <UserRound size={16} /> Contact Neighborhood Support
              </a>
            </div>
          </div>
        </section>
      </div>
    </PanelShell>
  );
};
