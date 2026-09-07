import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ClipboardList,
  Heart,
  MapPin,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  UserRound,
} from "lucide-react";
import { PanelShell } from "../components/layout/PanelShell";
import { MetricCard } from "../components/common/MetricCard";
import { useOrders } from "../context/OrderContext";
import { formatDate, money } from "../utils/formatters";

export const CustomerDashboardPage: React.FC = () => {
  const { orders } = useOrders();
  const latestOrder = orders[0];
  const savedPincode =
    localStorage.getItem("localcart-location") || "Not configured";

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
              ? "Latest order in transit"
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
          value={latestOrder?.items[0]?.vendor || "Prime Electronics"}
          detail="Nearest verified merchant"
        />
        <MetricCard
          icon={<MapPin size={20} />}
          label="Current Locality"
          value={savedPincode}
          detail="Primary delivery zone"
        />
      </div>

      {/* Main Panel Content */}
      <div className="panel-grid">
        {/* Order History */}
        <section className="panel-card wide">
          <div className="card-heading">
            <div>
              <span className="kicker">ORDER HISTORY</span>
              <h2>Your recent orders ({orders.length})</h2>
            </div>
            <Link to="/products">
              Shop again <ArrowRight size={15} />
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="flex flex-col">
              {orders.map((order) => (
                <div className="order-row" key={order.orderNumber}>
                  <span className="order-icon">
                    <Package size={20} />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <b>{order.orderNumber}</b>
                      <span className="text-xs text-slate-500 font-mono">
                        {formatDate(order.timestamp)}
                      </span>
                    </div>
                    <small>
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"} ·{" "}
                      {order.items[0]?.vendor ? (
                        <span className="text-orange-600 dark:text-orange-400 font-semibold">
                          {order.items[0].vendor}
                        </span>
                      ) : (
                        "Local Merchant"
                      )}{" "}
                      (
                      {order.customer.deliveryType === "pickup"
                        ? "Pickup"
                        : "Home Delivery"}
                      )
                    </small>
                  </div>
                  <div className="text-right">
                    <strong>{money(order.total)}</strong>
                    <span className="status-pill block mt-1">
                      {order.status || "Dispatched"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="panel-empty">
              <ClipboardList size={36} />
              <p>No orders yet. Your first local find is waiting.</p>
              <Link className="btn btn-dark" to="/products">
                Start shopping <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </section>

        {/* Account & Quick Actions */}
        <section className="flex flex-col gap-6">
          <div className="panel-card">
            <span className="kicker">PREFERENCES</span>
            <h2>Neighborhood Profile</h2>

            <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span>Active Delivery Area:</span>
                <b className="font-mono">{savedPincode}</b>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span>Account Type:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <ShieldCheck size={14} /> Guest Checkout Enabled
                </span>
              </div>
            </div>
          </div>

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
                <Store size={16} /> Open a Store (Become a Vendor)
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
