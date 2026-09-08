import React, { useEffect, useState } from "react";
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
import { CustomSelect } from "../components/common/CustomSelect";
import { useProducts } from "../context/ProductContext";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { money } from "../utils/formatters";
import {
  CreateProductDto,
  Order,
  mapBackendOrderToFrontend,
  mapBackendProductToFrontend,
} from "../types";
import { orderApi } from "../services/orderApi";
import { productApi } from "../services/productApi";

export const VendorDashboardPage: React.FC = () => {
  const { catalog, categories, addProduct } = useProducts();
  const { orders: localOrders, updateOrder } = useOrders();
  const { currentUser, token } = useAuth();

  const [activeTab, setActiveTab] = useState<"catalog" | "orders">("catalog");
  const [message, setMessage] = useState("");
  const [vendorOrders, setVendorOrders] = useState<Order[]>(localOrders);
  const [vendorProducts, setVendorProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(String(categories[0].productCategoryId));
    }
  }, [categories, selectedCategoryId]);

  const storeName =
    currentUser?.shopName ||
    localStorage.getItem("localcart-store-name") ||
    "Prime Electronics";

  const fetchVendorData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [apiOrders, apiProducts] = await Promise.allSettled([
        orderApi.getMyVendorOrders(),
        productApi.getMyProducts(),
      ]);

      if (apiOrders.status === "fulfilled" && apiOrders.value.length >= 0) {
        setVendorOrders(apiOrders.value.map(mapBackendOrderToFrontend));
      }
      if (apiProducts.status === "fulfilled" && apiProducts.value.length >= 0) {
        setVendorProducts(apiProducts.value.map(mapBackendProductToFrontend));
      }
    } catch (err) {
      console.warn("Could not fetch vendor data from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, [token]);

  const displayProducts =
    vendorProducts.length > 0
      ? vendorProducts
      : catalog.filter(
          (p) =>
            !p.vendor || p.vendor.toLowerCase() === storeName.toLowerCase(),
        );

  const handleUpdateStatus = async (order: Order, newStatus: string) => {
    if (order.orderId) {
      try {
        const updated = await orderApi.updateOrderStatus(
          order.orderId,
          newStatus,
        );
        const mapped = mapBackendOrderToFrontend(updated);
        setVendorOrders((prev) =>
          prev.map((o) => (o.orderId === order.orderId ? mapped : o)),
        );
        if (updateOrder) {
          updateOrder(mapped);
        }
        setMessage(
          `Order ${order.orderNumber} status updated to ${newStatus}!`,
        );
        window.setTimeout(() => setMessage(""), 3000);
        return;
      } catch (err: any) {
        console.warn("Failed to update status on backend:", err);
      }
    }
    // Local fallback
    const fallbackUpdated = { ...order, status: newStatus };
    setVendorOrders((prev) =>
      prev.map((o) =>
        o.orderNumber === order.orderNumber ? fallbackUpdated : o,
      ),
    );
    if (updateOrder) {
      updateOrder(fallbackUpdated);
    }
    setMessage(`Order ${order.orderNumber} marked as ${newStatus}!`);
    window.setTimeout(() => setMessage(""), 3000);
  };

  const handleAddStock = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const price = Number(data.get("price"));
    const categoryId =
      Number(data.get("categoryId")) ||
      (categories[0]?.productCategoryId ?? 13);
    const name = String(data.get("name"));
    const quantity = Number(data.get("quantity"));
    const imageUrl = String(data.get("image") || "");

    const dto: CreateProductDto = {
      productCategoryId: categoryId,
      name,
      price,
      stockQuantity: quantity,
      unit: "1 piece",
      description: `Supplied by ${storeName}`,
      imageUrls: imageUrl ? [imageUrl] : undefined,
    };

    try {
      const created = await addProduct(dto);
      setVendorProducts((prev) => [created, ...prev]);
      setMessage(`"${name}" is now live in the neighborhood catalog!`);
      form.reset();
      window.setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setMessage(`Failed to add product: ${err.message}`);
    }
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
          value={String(vendorOrders.length)}
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
      <div
        className="flex gap-4 mb-6 pb-2"
        style={{ borderBottom: "1px solid var(--line)" }}
      >
        <button
          type="button"
          className="pb-2 text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
          style={{
            color: activeTab === "catalog" ? "var(--rust)" : "var(--muted)",
            borderBottom:
              activeTab === "catalog"
                ? "2px solid var(--rust)"
                : "2px solid transparent",
            marginBottom: "-2.5px",
          }}
          onClick={() => setActiveTab("catalog")}
        >
          <Package size={16} /> Store Inventory ({displayProducts.length})
        </button>

        <button
          type="button"
          className="pb-2 text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
          style={{
            color: activeTab === "orders" ? "var(--rust)" : "var(--muted)",
            borderBottom:
              activeTab === "orders"
                ? "2px solid var(--rust)"
                : "2px solid transparent",
            marginBottom: "-2.5px",
          }}
          onClick={() => setActiveTab("orders")}
        >
          <Clock size={16} /> Incoming Orders ({vendorOrders.length})
        </button>

        {loading && (
          <span
            className="text-xs font-semibold animate-pulse self-center ml-auto"
            style={{ color: "var(--rust)" }}
          >
            Syncing with server...
          </span>
        )}
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

              {vendorOrders.length > 0 ? (
                <div className="space-y-4">
                  {vendorOrders.map((order) => (
                    <div
                      key={order.orderNumber}
                      className="p-5"
                      style={{
                        background: "var(--paper)",
                        border: "1px solid var(--line)",
                        borderRadius: "16px",
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <b
                            className="text-sm"
                            style={{ color: "var(--ink)" }}
                          >
                            {order.orderNumber}
                          </b>
                          <small
                            className="block text-xs mt-0.5"
                            style={{ color: "var(--muted)" }}
                          >
                            Customer: {order.customer.name} (
                            {order.customer.phone})
                          </small>
                          <small
                            className="block text-xs"
                            style={{ color: "var(--muted)" }}
                          >
                            Address: {order.customer.address || "Store Pickup"}
                          </small>
                        </div>
                        <div className="text-right">
                          <strong
                            className="text-base block"
                            style={{ color: "var(--rust)" }}
                          >
                            {money(order.total)}
                          </strong>
                          <span
                            className={`status-pill text-[10px] inline-block mt-1 ${
                              (order.status || "").toLowerCase() === "pending"
                                ? "pending"
                                : "delivered"
                            }`}
                          >
                            {order.status || "Pending"}
                          </span>
                        </div>
                      </div>

                      <div
                        className="text-xs pt-2 mb-3"
                        style={{
                          borderTop: "1px solid var(--line)",
                          color: "var(--muted)",
                        }}
                      >
                        <b style={{ color: "var(--ink)" }}>Items Ordered:</b>
                        <ul className="list-disc list-inside mt-1 space-y-0.5">
                          {order.items.map((i) => (
                            <li key={i.id} style={{ color: "var(--muted)" }}>
                              <span style={{ color: "var(--ink)" }}>
                                {i.name}
                              </span>{" "}
                              × {i.quantity} ({money(i.price * i.quantity)})
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div
                        className="flex gap-2 justify-end pt-3"
                        style={{ borderTop: "1px solid var(--line)" }}
                      >
                        {order.status !== "Completed" && (
                          <button
                            type="button"
                            className="btn btn-dark py-1.5 px-3 text-xs"
                            onClick={() =>
                              handleUpdateStatus(
                                order,
                                order.status === "ReadyForPickup"
                                  ? "Completed"
                                  : "ReadyForPickup",
                              )
                            }
                          >
                            <CheckCircle2 size={13} />
                            {order.status === "ReadyForPickup"
                              ? "Mark Delivered"
                              : "Mark Ready"}
                          </button>
                        )}
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
                readOnly
                className="opacity-80 cursor-not-allowed"
              />
            </label>

            <label>
              Category
              <input
                type="hidden"
                name="categoryId"
                value={selectedCategoryId}
              />
              <div className="mt-2">
                <CustomSelect
                  options={
                    categories.length > 0
                      ? categories.map((c) => ({
                          value: String(c.productCategoryId),
                          label: c.categoryName,
                        }))
                      : [{ value: "13", label: "Gaming Accessories" }]
                  }
                  value={selectedCategoryId}
                  onChange={(val) => setSelectedCategoryId(val)}
                  ariaLabel="Select product category"
                  className="w-full"
                />
              </div>
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

            <button type="submit" className="btn btn-rust full mt-4">
              <Plus size={16} /> Publish to Catalog
            </button>
          </form>

          {message && (
            <div
              className="form-message mt-4 p-3 rounded-xl flex items-center gap-2 text-xs font-bold"
              style={{
                background: "var(--green-light)",
                border: "1px solid rgba(26, 107, 67, 0.2)",
                color: "var(--green)",
              }}
            >
              <Check size={16} /> {message}
            </div>
          )}
        </section>
      </div>
    </PanelShell>
  );
};
