import React from "react";
import { Link } from "react-router-dom";
import {
  Apple,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Coffee,
  Handshake,
  Headphones,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
  Zap,
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
            <Link className="btn btn-outline" to="/signup">
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

          <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-[var(--line)] text-xs text-[var(--muted)]">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={15} style={{ color: "var(--green)" }} />{" "}
              Real-time Store Stock
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={15} style={{ color: "var(--rust)" }} /> 100%
              Verified Local Sellers
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles size={15} style={{ color: "var(--gold)" }} />{" "}
              Single-Vendor Fresh Checkout
            </span>
          </div>
        </div>

        {/* Right Column: Luxury Merchant Showcase Card */}
        <div className="hero-showcase">
          <div>
            <div className="showcase-header">
              <span className="showcase-badge">
                <Sparkles size={13} /> Curated Merchant Spotlight
              </span>
              <span className="showcase-rating">
                ★ 4.9 ·{" "}
                <span className="font-normal text-stone-300">142 reviews</span>
              </span>
            </div>

            <div className="showcase-merchant">
              <h3>Prime Provisions & Electronics</h3>
              <p>Verified Merchant · 0.8 km away · MG Road Bazaar</p>
            </div>

            <div className="showcase-items">
              <div className="showcase-item">
                <div className="showcase-item-info">
                  <div className="showcase-item-icon">
                    <Headphones size={18} />
                  </div>
                  <div>
                    <div className="showcase-item-name">Sony WH-1000XM5</div>
                    <div className="showcase-item-sub">
                      Noise Cancelling · In Local Stock
                    </div>
                  </div>
                </div>
                <div className="showcase-item-price">₹28,990</div>
              </div>

              <div className="showcase-item">
                <div className="showcase-item-info">
                  <div className="showcase-item-icon">
                    <Apple size={18} />
                  </div>
                  <div>
                    <div className="showcase-item-name">
                      Organic Royal Delicious
                    </div>
                    <div className="showcase-item-sub">
                      Kashmir Orchards · 1 kg
                    </div>
                  </div>
                </div>
                <div className="showcase-item-price">₹180</div>
              </div>

              <div className="showcase-item">
                <div className="showcase-item-info">
                  <div className="showcase-item-icon">
                    <Coffee size={18} />
                  </div>
                  <div>
                    <div className="showcase-item-name">
                      Single Estate Darjeeling
                    </div>
                    <div className="showcase-item-sub">
                      Spring Flush Tea · 250g
                    </div>
                  </div>
                </div>
                <div className="showcase-item-price">₹420</div>
              </div>
            </div>
          </div>

          <div className="showcase-footer">
            <span className="showcase-status">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Open Now · Same-Day Local Delivery
            </span>
            <Link
              to="/products"
              className="text-xs text-amber-300 hover:text-amber-200 inline-flex items-center gap-1 font-semibold"
            >
              Browse Shop <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Value Strip (Luxury Cards) */}
      <section className="quick-strip">
        <div className="quick-strip-card">
          <div className="quick-strip-icon">
            <Store size={20} />
          </div>
          <div className="quick-strip-text">
            <b>100% Local Merchants</b>
            <small>Handpicked stores in your postal area</small>
          </div>
        </div>
        <div className="quick-strip-card">
          <div className="quick-strip-icon">
            <Zap size={20} />
          </div>
          <div className="quick-strip-text">
            <b>Express Delivery</b>
            <small>Doorstep dispatch in 2–4 hours</small>
          </div>
        </div>
        <div className="quick-strip-card">
          <div className="quick-strip-icon">
            <Handshake size={20} />
          </div>
          <div className="quick-strip-text">
            <b>Fair Local Prices</b>
            <small>Zero marked-up platform fees</small>
          </div>
        </div>
        <div className="quick-strip-card">
          <div className="quick-strip-icon">
            <BadgeCheck size={20} />
          </div>
          <div className="quick-strip-text">
            <b>Verified Authentic</b>
            <small>Genuine neighborhood shopkeepers</small>
          </div>
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
              <div className="category-icon">
                <ShoppingBag size={22} />
              </div>
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
      <section className="w-full px-4 sm:px-8 lg:px-16 py-20 bg-[var(--paper)] border-t border-[var(--line)]">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <span className="kicker">FOR SHOP OWNERS</span>
          <h2 className="heading-serif text-3xl sm:text-4xl font-bold tracking-tight mt-3 text-[var(--ink)]">
            Do you own a store in the neighborhood?
          </h2>
          <p className="text-[var(--muted)] mt-3 text-base max-w-xl leading-relaxed">
            List your inventory, manage customer orders in real time, and
            connect with buyers right across your street. Zero setup fees.
          </p>
          <div className="flex items-center gap-4 mt-8 flex-wrap justify-center">
            <Link to="/signup" className="btn btn-dark">
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
