import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
} from "lucide-react";
import { LocationBar } from "../components/common/LocationBar";
import { ProductGrid } from "../components/product/ProductGrid";
import { useProducts } from "../context/ProductContext";
import { CATEGORIES } from "../data/mockData";

export const HomePage: React.FC = () => {
  const { catalog } = useProducts();
  const featuredProducts = catalog.slice(0, 4);

  return (
    <main className="w-full flex flex-col items-center">
      {/* Hero Section (Full Width, Screen-Filling) */}
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={15} /> LOCAL FINDS, BETTER PRICES · HYPERLOCAL
            COMMERCE
          </span>

          <h1>
            Your neighborhood,
            <br />
            <em>in your bag.</em>
          </h1>

          <p>
            Discover verified neighbourhood stores, compare local prices, and
            get fresh goods delivered to your doorstep in hours—or ready for
            express pickup.
          </p>

          <LocationBar />

          <div className="hero-actions">
            <Link className="btn btn-dark" to="/products">
              Start exploring <ArrowRight size={17} />
            </Link>
            <Link
              className="btn btn-outline border-slate-600 text-slate-200 hover:bg-slate-800"
              to="/signin?role=vendor"
            >
              <Store size={16} /> Sell locally
            </Link>
            <span className="delivery-note">
              <Truck size={20} />
              <div>
                Same-day delivery
                <small>across your neighbourhood</small>
              </div>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" /> Real-time
              Store Stock
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-orange-400" /> 100%
              Verified Local Sellers
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles size={15} className="text-amber-400" /> Single-Vendor
              Fresh Checkout
            </span>
          </div>
        </div>

        {/* Hero Art Visual (Right Side) */}
        <div className="hero-art">
          <div className="sun" />
          <div className="art-label">
            THIS WEEK'S
            <br />
            <b>LOCAL EDIT</b>
          </div>

          <div className="art-product product-watch" title="Electronics">
            ◒
          </div>
          <div className="art-product product-bag" title="Everyday Goods">
            ⌁
          </div>
          <div className="art-product product-flower" title="Fresh Picks">
            ✿
          </div>

          <div className="art-caption">
            Curated close to home <ArrowRight size={15} />
          </div>
        </div>
      </section>

      {/* Quick Value Strip (Full Width) */}
      <section className="quick-strip">
        <div>
          <span className="quick-emoji">🛍️</span>
          <b>Shop 100% Local</b>
          <small>Handpicked from stores near you</small>
        </div>
        <div>
          <span className="quick-emoji">⚡</span>
          <b>Express Delivery</b>
          <small>Same-day dispatch in your area</small>
        </div>
        <div>
          <span className="quick-emoji">🤝</span>
          <b>Real Neighbourhood Sellers</b>
          <small>Real shopkeepers behind every order</small>
        </div>
        <div>
          <span className="quick-emoji">💛</span>
          <b>Keep Wealth Local</b>
          <small>Your spend supports local businesses</small>
        </div>
      </section>

      {/* Browse by Categories (Full Width) */}
      <section className="section category-section">
        <div className="section-heading">
          <div>
            <span className="kicker">BROWSE BY MOOD</span>
            <h2>Find your next favorite.</h2>
          </div>
          <Link to="/products">
            See all categories <ArrowRight size={16} />
          </Link>
        </div>

        <div className="category-list">
          {CATEGORIES.map((category) => (
            <Link
              to={`/products?category=${category.label}`}
              className="category-item"
              key={category.label}
            >
              <span>{category.icon}</span>
              <b>{category.label}</b>
              <small>
                Explore items <ArrowRight size={12} />
              </small>
            </Link>
          ))}
        </div>
      </section>

      {/* Deals & Nearby Favorites Grid (Full Width) */}
      <section className="section deals-section">
        <div className="section-heading">
          <div>
            <span className="kicker">NEARBY FAVORITES</span>
            <h2>Good things, close by.</h2>
          </div>
          <Link to="/products">
            Shop all products <ArrowRight size={16} />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} />
      </section>

      {/* The LocalCart Promise Banner (Full Bleed Screen Width) */}
      <section className="local-banner" id="how-it-works">
        <div>
          <span className="kicker">THE LOCALCART PROMISE</span>
          <h2>
            Small stores.
            <br />
            <em>Big difference.</em>
          </h2>
          <p className="text-slate-400 mt-4 text-sm leading-relaxed max-w-md">
            We are reimagining online shopping by putting neighborhood shops at
            the center. Fair prices for you, sustainable growth for local
            merchants.
          </p>
        </div>

        <div className="promise-grid">
          <div>
            <span>01</span>
            <b>Compare nearby</b>
            <p>
              See live stock, prices, and vendor distance in one clean view.
            </p>
          </div>
          <div>
            <span>02</span>
            <b>Choose your way</b>
            <p>Select doorstep delivery or express in-store counter pickup.</p>
          </div>
          <div>
            <span>03</span>
            <b>Support local</b>
            <p>
              Every single order keeps your immediate neighborhood thriving.
            </p>
          </div>
        </div>
      </section>

      {/* Merchant Spotlight Call-to-Action */}
      <section className="w-full px-4 sm:px-8 lg:px-16 py-16 bg-slate-100 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <span className="kicker">FOR SHOP OWNERS</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 text-slate-900 dark:text-slate-100">
            Do you own a store in the neighborhood?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3 text-base max-w-xl">
            List your inventory, manage customer orders in real time, and
            connect with buyers right across your street. Zero setup fees.
          </p>
          <div className="flex items-center gap-4 mt-8 flex-wrap justify-center">
            <Link to="/signin?role=vendor" className="btn btn-dark">
              Open Vendor Studio <ArrowRight size={16} />
            </Link>
            <Link to="/products" className="btn btn-outline">
              Browse Customer View
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
