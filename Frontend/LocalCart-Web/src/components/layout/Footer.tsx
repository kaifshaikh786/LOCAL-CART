import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Sparkles, Store, Truck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer aria-label="Site Footer">
      {/* Brand & Mission */}
      <div className="footer-brand">
        <div className="flex items-center gap-3">
          <img
            className="footer-brand-logo"
            src="/localcart-logo.png"
            alt="LocalCart cart logo"
          />
          <b style={{ color: "var(--ink)" }}>LocalCart</b>
        </div>
        <p style={{ color: "var(--muted)" }}>
          Good things are closer than you think. Bringing verified neighbourhood
          shops directly to your doorstep.
        </p>
        <div
          className="flex flex-wrap gap-4 mt-2 text-xs"
          style={{ color: "var(--muted)" }}
        >
          <span className="flex items-center gap-1.5">
            <Truck size={14} style={{ color: "var(--green)" }} /> Same-day
            delivery
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} style={{ color: "var(--rust)" }} /> Verified
            stores
          </span>
        </div>
      </div>

      {/* Explore Links */}
      <div>
        <b>Explore Catalog</b>
        <Link to="/products">All Products</Link>
        <Link to="/products?category=Electronics">Electronics & Audio</Link>
        <Link to="/products?category=Grocery">Fresh Grocery & Staples</Link>
        <Link to="/products?category=Fashion">Apparel & Footwear</Link>
        <Link to="/products?category=Home">Home & Living</Link>
        <Link to="/products?category=Beauty">Health & Personal Care</Link>
      </div>

      {/* Workspaces & Portals */}
      <div>
        <b>Workspaces</b>
        <Link to="/customer">Customer Account</Link>
        <Link to="/cart">Shopping Bag</Link>
        <Link to="/vendor">
          <span className="inline-flex items-center gap-1.5">
            <Store size={13} /> Vendor Studio
          </span>
        </Link>
        <Link to="/signin?role=vendor">Vendor Login</Link>
        <Link to="/admin">Admin Control Center</Link>
        <Link to="/signin?role=admin">Admin Sign-in</Link>
      </div>

      {/* Community & Sellers */}
      <div>
        <b>For Local Sellers</b>
        <Link to="/how-it-works">How LocalCart Works</Link>
        <Link to="/signup">Register Your Shop</Link>
        <a href="mailto:partners@localcart.in">Seller Partnerships</a>
        <a href="mailto:support@localcart.in">Merchant Support</a>
        <div
          className="mt-4 p-3.5 text-xs"
          style={{
            background: "var(--rust-light)",
            border: "1px solid rgba(212, 98, 42, 0.2)",
            borderRadius: "14px",
          }}
        >
          <span
            className="font-bold flex items-center gap-1"
            style={{ color: "var(--rust)" }}
          >
            <Sparkles size={13} /> Grow with LocalCart
          </span>
          <p
            className="mt-1 text-[11px] leading-tight"
            style={{ color: "var(--muted)" }}
          >
            Reach thousands of buyers right in your pincode area.
          </p>
        </div>
      </div>

      {/* Bottom Copyright & Badges */}
      <div className="copyright">
        <div>
          © 2026 LocalCart Technologies Inc. All rights reserved. · Developed
          by Mohammad Kaif Shaikh and Tanish Gupta
        </div>
        <div
          className="flex items-center gap-6 text-xs"
          style={{ color: "var(--muted)" }}
        >
          <a
            href="#terms"
            className="hover:underline"
            style={{ color: "var(--muted)" }}
          >
            Terms of Service
          </a>
          <a
            href="#privacy"
            className="hover:underline"
            style={{ color: "var(--muted)" }}
          >
            Privacy Policy
          </a>
          <span>Hyperlocal Commerce System</span>
        </div>
      </div>
    </footer>
  );
};
