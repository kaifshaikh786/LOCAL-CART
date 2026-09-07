import React, { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  Download,
  Shield,
  UserRound,
} from "lucide-react";
import { PanelShell } from "../components/layout/PanelShell";
import { MetricCard } from "../components/common/MetricCard";
import { useProducts } from "../context/ProductContext";
import { useOrders } from "../context/OrderContext";
import { formatDate, money } from "../utils/formatters";

export const AdminDashboardPage: React.FC = () => {
  const { catalog } = useProducts();
  const { orders } = useOrders();
  const [reviewItems, setReviewItems] = useState([
    {
      id: 1,
      title: "Fresh Organic Mart - Vendor KYC",
      desc: "Pincode 400076 · Awaiting license verification",
      type: "vendor",
    },
    {
      id: 2,
      title: "Sony XM5 Low Inventory Alert",
      desc: "Prime Electronics · 2 units remaining",
      type: "stock",
    },
    {
      id: 3,
      title: "Customer Refund Request (LC1710)",
      desc: "Damaged packaging report · ₹599 dispute",
      type: "refund",
    },
  ]);
  const [notice, setNotice] = useState("");

  const handleResolveReview = (id: number, actionName: string) => {
    setReviewItems((prev) => prev.filter((item) => item.id !== id));
    setNotice(`Action resolved: ${actionName}`);
    window.setTimeout(() => setNotice(""), 2500);
  };

  const handleExport = () => {
    setNotice("Platform report generated and exported to CSV!");
    window.setTimeout(() => setNotice(""), 2500);
  };

  return (
    <PanelShell
      role="Admin"
      title="Platform Operations Center."
      description="Live platform analytics, hyperlocal network health, revenue streams, and dispute oversight."
    >
      {/* Metric Grid */}
      <div className="metric-grid">
        <MetricCard
          icon={<CircleDollarSign size={20} />}
          label="Gross Merchandise Value"
          value="₹3,84,210"
          detail="+14.6% this cycle"
        />
        <MetricCard
          icon={<ClipboardList size={20} />}
          label="Total Orders"
          value={String(orders.length || 18)}
          detail="99.2% delivery success"
        />
        <MetricCard
          icon={<UserRound size={20} />}
          label="Active Neighborhood Stores"
          value="86"
          detail="5 awaiting onboard approval"
        />
        <MetricCard
          icon={<BarChart3 size={20} />}
          label="Catalog SKUs"
          value={String(catalog.length)}
          detail="Distributed across 12 zones"
        />
      </div>

      {notice && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} /> {notice}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="panel-grid">
        {/* Recent Orders Stream */}
        <section className="panel-card wide">
          <div className="card-heading">
            <div>
              <span className="kicker">PLATFORM STREAM</span>
              <h2>Recent customer orders</h2>
            </div>
            <button
              type="button"
              className="text-btn flex items-center gap-1.5"
              onClick={handleExport}
            >
              <Download size={14} /> Export CSV <ArrowRight size={14} />
            </button>
          </div>

          <div className="stock-table">
            <div className="table-head">
              <span>Order Reference</span>
              <span>Customer</span>
              <span>Amount</span>
              <span>Status</span>
            </div>

            {orders.length > 0 ? (
              orders.slice(0, 8).map((order) => (
                <div className="table-row" key={order.orderNumber}>
                  <span>
                    <b>{order.orderNumber}</b>
                    <small>{formatDate(order.timestamp)}</small>
                  </span>
                  <strong>{order.customer.name}</strong>
                  <span>{money(order.total)}</span>
                  <em>{order.status || "Active"}</em>
                </div>
              ))
            ) : (
              <div className="panel-empty">
                <ClipboardList size={32} />
                <p>
                  No orders placed yet. As customers book, orders will populate
                  live.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Action / Review Queue */}
        <section className="panel-card">
          <div className="flex justify-between items-center mb-4">
            <span className="kicker">ATTENTION REQUIRED</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
              {reviewItems.length} open
            </span>
          </div>
          <h2>Review Queue</h2>

          {reviewItems.length > 0 ? (
            <div className="review-list">
              {reviewItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 py-3 border-t border-slate-100 dark:border-slate-700"
                >
                  <div className="flex items-start gap-3">
                    <span className="review-number">0{index + 1}</span>
                    <div className="flex-1">
                      <p className="font-bold text-xs">{item.title}</p>
                      <small className="text-slate-500">{item.desc}</small>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => handleResolveReview(item.id, item.title)}
                      className="text-[11px] font-bold px-2.5 py-1 rounded bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    >
                      Approve / Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="panel-empty py-8">
              <CheckCircle2
                size={32}
                className="text-emerald-600 mx-auto mb-2"
              />
              <p className="text-xs font-semibold">
                Queue clean! No urgent merchant or customer disputes.
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
            <span className="kicker block mb-2">SYSTEM INTEGRITY</span>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <Shield size={14} /> Hyperlocal Gateway Operating Normally (100%
              SLA)
            </div>
          </div>
        </section>
      </div>
    </PanelShell>
  );
};
