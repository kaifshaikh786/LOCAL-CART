import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerVendor } = useAuth();

  const [shopName, setShopName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    if (!shopName.trim() || !fullName.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      setBusy(false);
      return;
    }

    try {
      await registerVendor({
        ownerName: fullName.trim(),
        fullName: fullName.trim(),
        storeName: shopName.trim(),
        shopName: shopName.trim(),
        email: email.trim(),
        password,
        phoneNumber: phone.trim() || "+91 9999900000",
        address: address.trim() || "Local Market",
        city: city.trim() || "Mumbai",
      });
      setBusy(false);
      navigate("/vendor");
    } catch (err: any) {
      setBusy(false);
      setError(
        err.message ||
          "Failed to register shop. Please check your credentials.",
      );
    }
  };

  return (
    <main className="page login-page" style={{ background: "var(--cream)" }}>
      {/* Visual Brand Side */}
      <div
        className="login-visual"
        style={{
          background: "#181614",
          borderRadius: "28px",
          color: "#ffffff",
        }}
      >
        <div className="mb-8">
          <img
            className="auth-brand-logo"
            src="/localcart-logo.png"
            alt="LocalCart - Hyperlocal E-Commerce Platform"
          />
          <small className="auth-brand-caption">Neighborhood Merchant Hub</small>
        </div>

        <span className="kicker" style={{ color: "var(--rust)" }}>
          <Sparkles size={14} /> FOR LOCAL SHOP OWNERS
        </span>

        <h1 style={{ color: "#ffffff", marginTop: "12px" }}>
          Bring your store to thousands of nearby buyers.
        </h1>

        <p style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: 1.7 }}>
          Create your digital merchant profile in minutes. Receive neighborhood
          orders directly, control live inventory, and serve local customers
          with express pickup and same-day delivery.
        </p>

        <div
          className="mt-8 pt-8 space-y-3.5 text-xs"
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            color: "rgba(255, 255, 255, 0.85)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={16} style={{ color: "var(--green)" }} />
            <span>Direct local customer demand from your postal pincode</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={16} style={{ color: "var(--rust)" }} />
            <span>Single-vendor protected checkout & live stock tracking</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Lock size={16} style={{ color: "var(--gold)" }} />
            <span>Zero setup fees — verified neighborhood merchant badge</span>
          </div>
        </div>
      </div>

      {/* Register Form Card */}
      <form
        className="login-form"
        onSubmit={handleSubmit}
        style={{
          background: "var(--paper)",
          borderRadius: "28px",
          border: "1px solid var(--line)",
          padding: "clamp(28px, 4vw, 44px)",
        }}
      >
        {/* Customer Shopper Notice */}
        <div
          className="mb-5 p-3.5 rounded-2xl flex items-center justify-between gap-3"
          style={{
            background: "var(--rust-light)",
            border: "1px solid rgba(212, 98, 42, 0.25)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={18} style={{ color: "var(--rust)" }} />
            <p
              className="text-xs font-semibold leading-tight"
              style={{ color: "var(--ink)", margin: 0 }}
            >
              Looking to buy products? Customers shop 100% login-free!
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold shrink-0 hover:underline inline-flex items-center gap-1"
            style={{ color: "var(--rust)" }}
          >
            Shop Now <ArrowRight size={12} />
          </Link>
        </div>

        <span className="kicker">VENDOR ONBOARDING</span>
        <h2 style={{ fontSize: "24px", margin: "6px 0 16px" }}>
          Register Your Store
        </h2>

        <div className="space-y-3.5">
          {/* Shop Name */}
          <label
            className="block text-xs font-bold"
            style={{ color: "var(--ink)" }}
          >
            Shop Name *
            <div className="relative mt-1">
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="e.g. Prime Electronics & Provisions"
                style={{
                  width: "100%",
                  background: "var(--cream)",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "11px 14px",
                  fontSize: "13px",
                  color: "var(--ink)",
                  outline: "none",
                }}
              />
            </div>
          </label>

          {/* Owner Full Name */}
          <label
            className="block text-xs font-bold"
            style={{ color: "var(--ink)" }}
          >
            Owner Full Name *
            <div className="relative mt-1">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Vikram Sharma"
                style={{
                  width: "100%",
                  background: "var(--cream)",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "11px 14px",
                  fontSize: "13px",
                  color: "var(--ink)",
                  outline: "none",
                }}
              />
            </div>
          </label>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className="block text-xs font-bold"
              style={{ color: "var(--ink)" }}
            >
              Business Email *
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="shop@localcart.in"
                style={{
                  width: "100%",
                  background: "var(--cream)",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "11px 14px",
                  fontSize: "13px",
                  color: "var(--ink)",
                  outline: "none",
                  marginTop: "4px",
                }}
              />
            </label>

            <label
              className="block text-xs font-bold"
              style={{ color: "var(--ink)" }}
            >
              Phone Number
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                style={{
                  width: "100%",
                  background: "var(--cream)",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "11px 14px",
                  fontSize: "13px",
                  color: "var(--ink)",
                  outline: "none",
                  marginTop: "4px",
                }}
              />
            </label>
          </div>

          {/* Address & City Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className="block text-xs font-bold"
              style={{ color: "var(--ink)" }}
            >
              Shop Address / Landmark
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Shop 4, MG Road Bazaar"
                style={{
                  width: "100%",
                  background: "var(--cream)",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "11px 14px",
                  fontSize: "13px",
                  color: "var(--ink)",
                  outline: "none",
                  marginTop: "4px",
                }}
              />
            </label>

            <label
              className="block text-xs font-bold"
              style={{ color: "var(--ink)" }}
            >
              City / Locality
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai"
                style={{
                  width: "100%",
                  background: "var(--cream)",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "11px 14px",
                  fontSize: "13px",
                  color: "var(--ink)",
                  outline: "none",
                  marginTop: "4px",
                }}
              />
            </label>
          </div>

          {/* Password */}
          <label
            className="block text-xs font-bold"
            style={{ color: "var(--ink)" }}
          >
            Create Studio Password *
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                background: "var(--cream)",
                border: "1px solid var(--line)",
                borderRadius: "12px",
                padding: "11px 14px",
                fontSize: "13px",
                color: "var(--ink)",
                outline: "none",
                marginTop: "4px",
              }}
            />
          </label>
        </div>

        {error && (
          <div
            className="mt-4 text-xs font-semibold"
            style={{
              color: "var(--rust)",
              background: "var(--rust-light)",
              border: "1px solid rgba(212, 98, 42, 0.2)",
              borderRadius: "10px",
              padding: "10px 14px",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-dark full py-3.5 mt-5"
          style={{ width: "100%" }}
          disabled={busy}
        >
          {busy ? (
            "Creating Vendor Profile..."
          ) : (
            <>
              Register Store & Open Studio <ArrowRight size={16} />
            </>
          )}
        </button>

        {/* Link to Sign In */}
        <div
          className="mt-5 pt-4 text-center text-xs"
          style={{ borderTop: "1px solid var(--line)", color: "var(--muted)" }}
        >
          Already have a merchant account?{" "}
          <Link
            to="/signin?role=vendor"
            className="font-bold underline ml-1"
            style={{ color: "var(--rust)" }}
          >
            Sign in to Vendor Studio
          </Link>
        </div>
      </form>
    </main>
  );
};
