import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Shield,
  ShoppingBag,
  Sparkles,
  Store,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { loginAsDemo } = useAuth();

  const [role, setRole] = useState<"Vendor" | "Admin">(
    params.get("role") === "admin" ? "Admin" : "Vendor",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleFillDemo = () => {
    if (role === "Vendor") {
      setEmail("vendor@localcart.in");
      setPassword("vendor123");
    } else {
      setEmail("admin@localcart.in");
      setPassword("admin123");
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    const targetRole = role.toLowerCase() as "vendor" | "admin";
    loginAsDemo(targetRole);
    setBusy(false);
    navigate(`/${targetRole}`);
  };

  return (
    <main className="page login-page">
      {/* Visual Brand Side */}
      <div className="login-visual">
        <div className="flex items-center gap-3 mb-10">
          <img
            src="/localcart-logo.svg"
            alt="LocalCart"
            className="w-12 h-12"
          />
          <div>
            <b className="text-xl font-extrabold tracking-tight">
              LocalCart Workspace
            </b>
            <small className="block text-slate-400 font-mono text-[11px] uppercase">
              Unified Merchant & Ops Portal
            </small>
          </div>
        </div>

        <span className="kicker">
          <Sparkles size={14} /> TEAM ACCESS & DASHBOARD
        </span>

        <h1>
          {role === "Vendor"
            ? "Bring your shop online."
            : "Keep local commerce moving."}
        </h1>

        <p>
          {role === "Vendor"
            ? "Manage your store catalog, incoming neighborhood orders, dispatch tracking, and revenue from one intuitive studio."
            : "Complete real-time platform oversight of every seller, order, dispute, and rupee moving across the hyper-local grid."}
        </p>

        <div className="mt-8 pt-8 border-t border-slate-800 space-y-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>Instant order notifications & stock updates</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-orange-400" />
            <span>Role-based secured merchant authentication</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-blue-400" />
            <span>Encrypted local session management</span>
          </div>
        </div>
      </div>

      {/* Login Form Card */}
      <form className="login-form" onSubmit={handleSubmit}>
        <span className="kicker">AUTHENTICATION</span>
        <h2>Sign in to workspace</h2>

        {/* Role Switcher */}
        <div className="role-switch">
          <button
            type="button"
            className={role === "Vendor" ? "selected" : ""}
            onClick={() => {
              setRole("Vendor");
              setEmail("");
              setPassword("");
            }}
          >
            <Store size={15} className="inline mr-1.5" /> Vendor Studio
          </button>
          <button
            type="button"
            className={role === "Admin" ? "selected" : ""}
            onClick={() => {
              setRole("Admin");
              setEmail("");
              setPassword("");
            }}
          >
            <Shield size={15} className="inline mr-1.5" /> Platform Admin
          </button>
        </div>

        <label>
          Email address
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={`${role.toLowerCase()}@localcart.in`}
            required
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline"
          >
            ⚡ Auto-fill {role} Demo
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-dark full py-3.5"
          disabled={busy}
        >
          {busy ? (
            "Authenticating..."
          ) : (
            <>
              Continue to {role} Portal <ArrowRight size={16} />
            </>
          )}
        </button>

        {error && <p className="login-error">{error}</p>}

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 mb-2">
            Are you a customer wanting to shop?
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-orange-600"
          >
            <ShoppingBag size={14} /> Shop without signing in (Guest Checkout)
          </Link>
        </div>
      </form>
    </main>
  );
};
