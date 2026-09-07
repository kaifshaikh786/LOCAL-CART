import React, { useState } from "react";
import {
  BarChart3,
  Check,
  CheckCircle2,
  Clock,
  Package,
  Plus,
  ShoppingBag,
  Store,
} from "lucide-react";
import { PanelShell } from "../components/layout/PanelShell";
import { MetricCard } from "../components/common/MetricCard";
import { useProducts } from "../context/ProductContext";
import { useOrders } from "../context/OrderContext";
import { money } from "../utils/formatters";
import { Category, Product } from "../types";
import { CATEGORIES } from "../data/mockData";

export const VendorDashboardPage: React.FC = () => {
  const { catalog, addProduct } = useProducts();
  const { orders } = useOrders();

  const [activeTab, setActiveTab] = useState<"catalog" | "orders">("catalog");
  const [message, setMessage] = useState("");
  const [storeName, setStoreName] = useState(
    () => localStorage.getItem("localcart-store-name") ?? "Prime Electronics",
  );

  const vendorProducts = catalog.filter(
    (p) => !p.vendor || p.vendor.toLowerCase() === storeName.toLowerCase(),
  );
  const displayProducts = vendorProducts.length > 0 ? vendorProducts : catalog;

  const handleAddStock = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const price = Number(data.get("price"));
    const category = (data.get("category") as Category) || "Home";
    const imageFile = data.get("imageFile");
    const imageUrl = String(data.get("image") || "");

    const saveProduct = (image?: string) => {
      const name = String(data.get("name"));
      const newProduct: Product = {
        id: Date.now(),
        name,
        category,
        vendor: storeName,
        vendorPhone: String(data.get("vendorPhone") || ""),
        price,
        oldPrice: price * 1.2,
        rating: 5.0,
        distance: "0.4 km",
        color: "#e2e8f0",
        accent: "#1e293b",
        tag: "Store Fresh",
        image: image || imageUrl || undefined,
        stock: Number(data.get("quantity")),
      };

      addProduct(newProduct);
      setMessage(`"${name}" is now live in the neighborhood catalog!`);
      window.setTimeout(() => setMessage(""), 3000);
    };

    if (imageFile instanceof File && imageFile.size > 0) {
      const reader = new FileReader();
      reader.onload = () => saveProduct(String(reader.result));
      reader.readAsDataURL(imageFile);
    } else {
      saveProduct();
    }

    event.currentTarget.reset();
  };

  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoreName(e.target.value);
    localStorage.setItem("localcart-store-name", e.target.value);
  };

  return (
    <PanelShell
      role="Vendor"
      title="Vendor Studio."
      description="Manage your store catalog, track incoming customer orders, and publish live inventory."
    >
      {/* Metric Cards */}
      <div className="metric-grid">
        <MetricCard
          icon={<BarChart3 size={20} />}
          label="Estimated Revenue"
          value="₹48,950"
          detail="+22.4% this month"
        />
        <MetricCard
          icon={<Package size={20} />}
          label="Active Store Items"
          value={String(displayProducts.length)}
          detail="Live to nearby buyers"
        />
        <MetricCard
          icon={<ShoppingBag size={20} />}
          label="Customer Orders"
          value={String(orders.length)}
          detail="Fulfilled or In-Progress"
        />
        <MetricCard
          icon={<Store size={20} />}
          label="Seller Health"
          value="100% Verified"
          detail="Top Neighborhood Store"
        />
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700 mb-6 pb-2">
        <button
          type="button"
          className={`pb-2 text-sm font-bold flex items-center gap-2 transition-colors ${
            activeTab === "catalog"
              ? "text-orange-600 border-b-2 border-orange-600 -mb-2.5"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
          onClick={() => setActiveTab("catalog")}
        >
          <Package size={16} /> Store Inventory ({displayProducts.length})
        </button>

        <button
          type="button"
          className={`pb-2 text-sm font-bold flex items-center gap-2 transition-colors ${
            activeTab === "orders"
              ? "text-orange-600 border-b-2 border-orange-600 -mb-2.5"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          <Clock size={16} /> Incoming Orders ({orders.length})
        </button>
      </div>

      <div className="panel-grid">
        {/* Main Section Based on Active Tab */}
        <section className="panel-card wide">
          {activeTab === "catalog" ? (
            <>
              <div className="card-heading">
                <div>
                  <span className="kicker">LIVE INVENTORY</span>
                  <h2>{storeName} Catalog</h2>
                </div>
                <span className="vendor-id">
                  <span>Merchant ID</span> LC-VN-2048
                </span>
              </div>

              <div className="stock-table">
                <div className="table-head">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Units</span>
                  <span>Status</span>
                </div>
                {displayProducts.map((item) => (
                  <div className="table-row" key={item.id}>
                    <span>
                      <b>{item.name}</b>
                      <small>
                        SKU: LC-{item.id} · {item.category}
                      </small>
                    </span>
                    <strong>{money(item.price)}</strong>
                    <span>{item.stock ?? "In Stock"}</span>
                    <em>● Live</em>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="card-heading">
                <div>
                  <span className="kicker">ORDER FULFILLMENT QUEUE</span>
                  <h2>Customer Orders</h2>
                </div>
              </div>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.orderNumber}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <b className="text-sm">{order.orderNumber}</b>
                          <small className="block text-slate-500 text-xs mt-0.5">
                            Customer: {order.customer.name} (
                            {order.customer.phone})
                          </small>
                          <small className="block text-slate-400 text-xs">
                            Address: {order.customer.address}
                          </small>
                        </div>
                        <div className="text-right">
                          <strong className="text-base text-orange-600 block">
                            {money(order.total)}
                          </strong>
                          <span className="status-pill text-[10px] inline-block mt-1">
                            {order.status || "Pending"}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700 pt-2 mb-3">
                        <b>Items Ordered:</b>
                        <ul className="list-disc list-inside mt-1 space-y-0.5">
                          {order.items.map((i) => (
                            <li key={i.id}>
                              {i.name} × {i.quantity} (
                              {money(i.price * i.quantity)})
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-2 justify-end border-t border-slate-100 dark:border-slate-700 pt-3">
                        <button
                          type="button"
                          className="btn btn-dark py-1.5 px-3 text-xs"
                          onClick={() =>
                            alert(
                              `Order ${order.orderNumber} marked as Ready for Pickup!`,
                            )
                          }
                        >
                          <CheckCircle2 size={13} /> Mark Ready
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="panel-empty">
                  <Package size={36} />
                  <p>
                    No customer orders yet. Orders placed by nearby buyers will
                    appear here in real-time.
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        {/* Sidebar: Store Profile & Add Product Form */}
        <section className="panel-card">
          <span className="kicker">QUICK PUBLISH</span>
          <h2>Add New Product</h2>

          <form className="stock-form" onSubmit={handleAddStock}>
            <label>
              Store name
              <input
                value={storeName}
                onChange={handleStoreNameChange}
                placeholder="Store name"
                required
              />
            </label>

            <label>
              Store WhatsApp / Phone
              <input
                name="vendorPhone"
                type="tel"
                placeholder="+91 98765 43210"
                required
              />
            </label>

            <label>
              Category
              <select
                name="category"
                defaultValue="Electronics"
                className="w-full mt-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.label} value={c.label}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Product title
              <input
                name="name"
                placeholder="e.g. Mechanical Keyboard"
                required
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label>
                Price (₹)
                <input
                  name="price"
                  type="number"
                  min="1"
                  placeholder="₹ 499"
                  required
                />
              </label>

              <label>
                Stock Units
                <input
                  name="quantity"
                  type="number"
                  min="1"
                  placeholder="10"
                  required
                />
              </label>
            </div>

            <label>
              Image URL <span className="optional">optional</span>
              <input
                name="image"
                type="url"
                placeholder="https://images.unsplash.com/..."
              />
            </label>

            <label>
              Upload Photo File <span className="optional">optional</span>
              <input name="imageFile" type="file" accept="image/*" />
            </label>

            <button type="submit" className="btn btn-dark full mt-4">
              <Plus size={16} /> Publish to Catalog
            </button>
          </form>

          {message && (
            <div className="form-message mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-300">
              <Check size={16} /> {message}
            </div>
          )}
        </section>
      </div>
    </PanelShell>
  );
};
