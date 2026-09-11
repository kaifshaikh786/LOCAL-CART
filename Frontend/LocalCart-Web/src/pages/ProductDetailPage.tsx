import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Heart,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Truck,
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { money } from "../utils/formatters";
import { ProductArtwork } from "../components/product/ProductArtwork";
import { ProductGrid } from "../components/product/ProductGrid";

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { catalog, getProductById } = useProducts();
  const { addToCart } = useCart();

  const product = (id ? getProductById(Number(id)) : undefined) ?? catalog[0];

  if (!product) {
    return (
      <main className="page detail-page" style={{ background: "var(--cream)" }}>
        <Link
          className="back-link"
          to="/products"
          style={{
            color: "var(--muted)",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> Back to catalog
        </Link>
        <div
          className="empty-state"
          style={{
            textAlign: "center",
            border: "2px dashed var(--line)",
            borderRadius: "24px",
            padding: "96px 24px",
          }}
        >
          <h2 style={{ color: "var(--ink)" }}>Product Not Found</h2>
          <p style={{ color: "var(--muted)" }}>
            The requested product is not available in our local catalog.
          </p>
          <Link to="/products" className="btn btn-dark">
            Browse All Products
          </Link>
        </div>
      </main>
    );
  }

  const hasDiscount = Boolean(
    product.oldPrice && product.oldPrice > product.price,
  );
  const savings = hasDiscount ? product.oldPrice - product.price : 0;
  const similarProducts = catalog
    .filter(
      (item) => item.id !== product.id && item.category === product.category,
    )
    .slice(0, 4);

  return (
    <main className="page detail-page" style={{ background: "var(--cream)" }}>
      <Link
        className="back-link"
        to="/products"
        style={{
          color: "var(--muted)",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "13px",
          fontWeight: 600,
        }}
      >
        <ArrowLeft size={16} /> Back to local shop
      </Link>

      <div className="detail-layout">
        {/* Product Visual */}
        <div className="flex flex-col gap-4">
          <div
            style={{
              borderRadius: "24px",
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.08)",
              overflow: "hidden",
            }}
          >
            <ProductArtwork product={product} large />
          </div>
          <div
            className="flex items-center justify-between text-xs px-2"
            style={{ color: "var(--muted)" }}
          >
            <span>SKU: LC-{product.id}-LOCAL</span>
            <span
              className="font-semibold flex items-center gap-1"
              style={{ color: "var(--green)" }}
            >
              <Check size={14} /> In Stock ({product.stock ?? 15} units left)
            </span>
          </div>
        </div>

        {/* Product Information - sits directly on canvas */}
        <div className="detail-copy">
          <div className="flex items-center gap-2">
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
              <Sparkles size={14} /> {product.category} · {product.tag}
            </span>
          </div>

          <h1 style={{ color: "var(--ink)" }}>{product.name}</h1>

          <div className="detail-rating">
            <span style={{ color: "var(--gold)" }}>
              <Star size={16} fill="currentColor" />{" "}
              {typeof product.rating === "number" ? product.rating : 4.8}
            </span>
            <span style={{ color: "var(--muted)" }}>
              38 verified neighborhood reviews
            </span>
          </div>

          <div className="detail-price">
            <b
              style={{
                fontSize: "clamp(32px, 3vw, 44px)",
                fontWeight: 800,
                color: "var(--ink)",
              }}
            >
              {money(product.price)}
            </b>
            {hasDiscount && (
              <del style={{ color: "var(--muted)", fontSize: "16px" }}>
                {money(product.oldPrice)}
              </del>
            )}
            {hasDiscount && savings > 0 && (
              <span
                style={{
                  background: "var(--green-light)",
                  color: "var(--green)",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "4px 12px",
                  display: "inline-block",
                }}
              >
                Save {money(savings)}
              </span>
            )}
          </div>

          <p className="detail-description" style={{ color: "var(--muted)" }}>
            Handpicked quality, supplied directly by your neighborhood merchant.
            When you purchase this item, your order is dispatched immediately
            from <b style={{ color: "var(--ink)" }}>{product.vendor}</b> located
            just <b style={{ color: "var(--ink)" }}>{product.distance}</b> from
            your location.
          </p>

          {/* Seller Card */}
          <div
            className="seller"
            style={{
              color: "var(--muted)",
              borderTop: "1px solid var(--line)",
              borderBottom: "none",
              paddingTop: "16px",
              paddingBottom: "16px",
              margin: "0 0 28px",
            }}
          >
            <span className="seller-avatar">{product.vendor.slice(0, 1)}</span>
            <div>
              <Link
                to={`/products?vendorId=${product.vendorId}&vendor=${encodeURIComponent(product.vendor)}`}
                className="seller-store-link"
                aria-label={`Shop all products from ${product.vendor}`}
              >
                <b style={{ color: "var(--ink)" }}>{product.vendor}</b>
                <small style={{ color: "var(--muted)" }}>
                  <MapPin size={13} style={{ color: "var(--rust)" }} />{" "}
                  {product.vendorAddress || "Local store address unavailable"}
                </small>
              </Link>
              {product.vendorPhone && (
                <a
                  href={`tel:${product.vendorPhone}`}
                  style={{ color: "var(--rust)", display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  <Phone size={13} /> {product.vendorPhone}
                </a>
              )}
            </div>
            <span
              className="verified"
              style={{
                background: "var(--green-light)",
                color: "var(--green)",
                borderRadius: "999px",
              }}
            >
              <ShieldCheck size={14} /> Verified Merchant
            </span>
          </div>

          {/* Action Buttons */}
          <div className="detail-actions flex flex-col gap-3">
            <button
              type="button"
              className="btn btn-dark"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => addToCart(product)}
            >
              Add to bag <ShoppingBag size={17} />
            </button>
            <Link
              className="btn btn-outline"
              to="/cart"
              style={{
                width: "100%",
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              View shopping bag
            </Link>
          </div>

          {/* Delivery & Assurance Perks */}
          <div
            className="detail-perks"
            style={{
              borderTop: "1px solid var(--line)",
            }}
          >
            <span>
              <Truck size={18} style={{ color: "var(--rust)" }} />
              <b style={{ color: "var(--ink)" }}>Fast Local Delivery</b>
              <small style={{ color: "var(--muted)" }}>
                Same day, from ₹50
              </small>
            </span>
            <span>
              <Heart size={18} style={{ color: "var(--rust)" }} />
              <b style={{ color: "var(--ink)" }}>Easy Local Returns</b>
              <small style={{ color: "var(--muted)" }}>Within 7 days</small>
            </span>
            <span>
              <Store size={18} style={{ color: "var(--rust)" }} />
              <b style={{ color: "var(--ink)" }}>In-Store Pickup</b>
              <small style={{ color: "var(--muted)" }}>Instant & Free</small>
            </span>
          </div>
        </div>
      </div>

      {/* Similar Neighborhood Finds */}
      {similarProducts.length > 0 && (
        <section
          className="mt-20 pt-12 border-t"
          style={{ borderColor: "var(--line)" }}
        >
          <div className="section-heading">
            <div>
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
                MORE IN {product.category.toUpperCase()}
              </span>
              <h2 style={{ color: "var(--ink)" }}>
                Similar neighborhood finds
              </h2>
            </div>
            <Link
              to={`/products?category=${product.category}`}
              style={{
                color: "var(--rust)",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              See all {product.category}
            </Link>
          </div>
          <ProductGrid products={similarProducts} />
        </section>
      )}
    </main>
  );
};
