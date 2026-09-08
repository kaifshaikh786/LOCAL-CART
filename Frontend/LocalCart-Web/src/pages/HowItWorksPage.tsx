import React from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  BarChart2,
  Clock,
  Headphones,
  IndianRupee,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  Users,
  Zap,
} from "lucide-react";

export const HowItWorksPage: React.FC = () => {
  return (
    <main className="how-it-works-page">
      {/* Hero Section */}
      <section className="hiw-hero">
        <span className="kicker">HOW LOCALCART WORKS</span>
        <h1>
          Hyperlocal. Fast.
          <br />
          Simple.
        </h1>
        <p>
          LocalCart connects you to real stores in your neighborhood. Shop local
          goods, get same-day delivery, support the businesses that make your
          community thrive.
        </p>
        <div className="hiw-hero-actions">
          <Link to="/products" className="btn btn-dark">
            Start Shopping
          </Link>
          <Link to="/signup" className="btn btn-outline">
            Open Your Store
          </Link>
        </div>
      </section>

      {/* Section 1: For Shoppers */}
      <section className="hiw-section">
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 clamp(16px, 4vw, 48px)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "8px" }}>
            <span className="kicker">FOR CUSTOMERS</span>
            <h2
              style={{
                fontSize: "clamp(26px, 3vw, 36px)",
                fontWeight: 800,
                color: "var(--ink)",
                marginTop: "8px",
                letterSpacing: "-1px",
              }}
            >
              Shop your neighborhood in three easy steps
            </h2>
          </div>

          <div className="hiw-steps">
            <div className="hiw-step-card">
              <span className="hiw-step-number">01</span>
              <div className="hiw-step-icon">
                <MapPin size={24} />
              </div>
              <h3>Find Nearby Stores</h3>
              <p>
                Enter your pincode to discover verified shops within walking
                distance that carry exactly what you need.
              </p>
            </div>

            <div className="hiw-step-card">
              <span className="hiw-step-number">02</span>
              <div className="hiw-step-icon">
                <ShoppingBag size={24} />
              </div>
              <h3>Browse &amp; Compare</h3>
              <p>
                Compare prices, check live stock levels, and read verified
                reviews — all from stores within your neighborhood.
              </p>
            </div>

            <div className="hiw-step-card">
              <span className="hiw-step-number">03</span>
              <div className="hiw-step-icon">
                <Truck size={24} />
              </div>
              <h3>Doorstep or Pickup</h3>
              <p>
                Choose same-day home delivery or express counter pickup. Pay
                once, track in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: For Vendors */}
      <section className="hiw-section-alt">
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 clamp(16px, 4vw, 48px)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "8px" }}>
            <span className="kicker">FOR SHOP OWNERS</span>
            <h2
              style={{
                fontSize: "clamp(26px, 3vw, 36px)",
                fontWeight: 800,
                color: "var(--ink)",
                marginTop: "8px",
                letterSpacing: "-1px",
              }}
            >
              Sell to your community with zero friction
            </h2>
          </div>

          <div className="hiw-steps">
            <div className="hiw-step-card">
              <span className="hiw-step-number">01</span>
              <div className="hiw-step-icon">
                <Store size={24} />
              </div>
              <h3>List Your Inventory</h3>
              <p>
                Log into your Vendor Studio and add your products in minutes.
                Set prices, stock levels, and delivery radius — you&apos;re in
                control.
              </p>
            </div>

            <div className="hiw-step-card">
              <span className="hiw-step-number">02</span>
              <div className="hiw-step-icon">
                <BarChart2 size={24} />
              </div>
              <h3>Receive Orders</h3>
              <p>
                Get customer orders in real time. Manage incoming demand, update
                availability, and build a loyal local customer base.
              </p>
            </div>

            <div className="hiw-step-card">
              <span className="hiw-step-number">03</span>
              <div className="hiw-step-icon">
                <IndianRupee size={24} />
              </div>
              <h3>Grow Locally</h3>
              <p>
                Earn fairly. Zero commission on your first 50 orders. We grow
                only when you grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Features Grid */}
      <section className="hiw-section">
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 clamp(16px, 4vw, 48px)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "8px" }}>
            <span className="kicker">WHY LOCALCART</span>
            <h2
              style={{
                fontSize: "clamp(26px, 3vw, 36px)",
                fontWeight: 800,
                color: "var(--ink)",
                marginTop: "8px",
                letterSpacing: "-1px",
              }}
            >
              Everything you&apos;d expect. Nothing you don&apos;t.
            </h2>
          </div>

          <div className="hiw-features">
            <div className="hiw-feature-tile">
              <div className="hiw-feature-icon">
                <Zap size={20} />
              </div>
              <h3>Real-time Stock</h3>
              <p>Live inventory synced across all platforms</p>
            </div>

            <div className="hiw-feature-tile">
              <div className="hiw-feature-icon">
                <ShieldCheck size={20} />
              </div>
              <h3>Verified Merchants</h3>
              <p>Every seller manually vetted by our team</p>
            </div>

            <div className="hiw-feature-tile">
              <div className="hiw-feature-icon">
                <Clock size={20} />
              </div>
              <h3>Same-Day Delivery</h3>
              <p>Dispatch within 2–4 hours of order</p>
            </div>

            <div className="hiw-feature-tile">
              <div className="hiw-feature-icon">
                <BadgeCheck size={20} />
              </div>
              <h3>Authentic Products</h3>
              <p>No counterfeits, no fake listings</p>
            </div>

            <div className="hiw-feature-tile">
              <div className="hiw-feature-icon">
                <Users size={20} />
              </div>
              <h3>Community First</h3>
              <p>Profit stays in your neighborhood</p>
            </div>

            <div className="hiw-feature-tile">
              <div className="hiw-feature-icon">
                <Headphones size={20} />
              </div>
              <h3>24/7 Support</h3>
              <p>Live chat support for every order</p>
            </div>
          </div>

          {/* Section 4: CTA Banner */}
          <div className="hiw-cta-banner">
            <h2>Ready to shop local?</h2>
            <p>
              Join thousands of shoppers and hundreds of neighborhood vendors
              already on LocalCart.
            </p>
            <div className="hiw-cta-actions">
              <Link
                to="/products"
                className="btn btn-dark"
                style={{ background: "#ffffff", color: "#181614" }}
              >
                Start Exploring
              </Link>
              <Link
                to="/signup"
                className="btn btn-outline"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  color: "#ffffff",
                  background: "transparent",
                }}
              >
                Open Vendor Studio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
