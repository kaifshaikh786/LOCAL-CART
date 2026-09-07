import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Sparkles, Store, Truck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer aria-label="Site Footer">
      {/* Brand & Mission */}
      <div className="footer-brand">
        <div className="flex items-center gap-3">
          <img src="/localcart-logo.svg" alt="LocalCart" />
          <b>LocalCart</b>
        </div>
        <p>
          Good things are closer than you think. Bringing verified neighbourhood
          shops directly to your doorstep.
        </p>
        <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Truck size={14} className="text-emerald-600" /> Same-day delivery
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-orange-600" /> Verified
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
        <a href="#how-it-works">How LocalCart Works</a>
        <Link to="/signin?role=vendor">Register Your Shop</Link>
        <a href="mailto:partners@localcart.in">Seller Partnerships</a>
        <a href="mailto:support@localcart.in">Merchant Support</a>
        <div className="mt-4 p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/40 text-xs">
          <span className="font-bold text-orange-700 dark:text-orange-400 flex items-center gap-1">
            <Sparkles size={13} /> Grow with LocalCart
          </span>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-[11px] leading-tight">
            Reach thousands of buyers right in your pincode area.
          </p>
        </div>
      </div>

      {/* Bottom Copyright & Badges */}
      <div className="copyright">
        <div>© 2026 LocalCart Technologies Inc. All rights reserved.</div>
        <div className="flex items-center gap-6 text-xs text-slate-500">
          <a
            href="#terms"
            className="hover:text-slate-800 dark:hover:text-slate-200"
          >
            Terms of Service
          </a>
          <a
            href="#privacy"
            className="hover:text-slate-800 dark:hover:text-slate-200"
          >
            Privacy Policy
          </a>
          <span>Hyperlocal Commerce System</span>
        </div>
      </div>
    </footer>
  );
};
