import React, { useEffect, useState } from "react";
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

type PortalRole = "Vendor" | "Admin";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { login, currentUser, currentRole, token } = useAuth();

  const roleParam = params.get("role");
  const role: PortalRole =
    roleParam?.toLowerCase() === "admin" ? "Admin" : "Vendor";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Auto-redirect if user already has an active authenticated session
  useEffect(() => {
    if (token && (currentUser || currentRole)) {
      if (currentRole === "admin") {
        navigate("/admin", { replace: true });
      } else if (currentRole === "vendor") {
        navigate("/vendor", { replace: true });
      } else {
        navigate("/customer", { replace: true });
      }
    }
  }, [token, currentUser, currentRole, navigate]);

  // Clean form inputs whenever role transitions
  useEffect(() => {
    setEmail("");
    setPassword("");
    setError("");
  }, [role]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const user = await login(email, password);
      setBusy(false);
      if (user.roles?.some((r) => r.toLowerCase() === "admin")) {
        navigate("/admin");
      } else if (user.roles?.some((r) => r.toLowerCase() === "vendor")) {
        navigate("/vendor");
      } else {
        navigate("/customer");
      }
    } catch (err: any) {
      setBusy(false);
      const errMsg =
        err.message || "Authentication failed. Check your credentials.";
      setError(errMsg);
    }
  };

  return (
    <main className="page login-page">
      {/* Visual Brand Side */}
      <div
        className="login-visual"
        style={{
          background: "#181614",
          borderRadius: "28px",
        }}
      >
        <div className="flex items-center gap-3 mb-10">
          <div className="logo-mark">LC</div>
          <div>
            <b
              className="text-xl font-extrabold tracking-tight"
              style={{ color: "#ffffff" }}
            >
              LocalCart Workspace
            </b>
            <small
              className="block font-mono text-[11px] uppercase"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              Unified Merchant & Ops Portal
            </small>
          </div>
        </div>

        <span className="kicker" style={{ color: "var(--rust)" }}>
          <Sparkles size={14} /> SECURE PORTAL ACCESS
        </span>

        <h1 style={{ color: "#ffffff" }}>
          {role === "Vendor"
            ? "Bring your shop online."
            : "Keep local commerce moving."}
        </h1>

        <p style={{ color: "rgba(255, 255, 255, 0.8)" }}>
          {role === "Vendor"
            ? "Manage your store catalog, incoming neighborhood orders, dispatch tracking, and revenue from one intuitive studio."
            : "Complete real-time platform oversight of every seller, order, dispute, and rupee moving across the hyper-local grid."}
        </p>

        <div
          className="mt-8 pt-8 space-y-3 text-xs"
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} style={{ color: "var(--green)" }} />
            <span>Instant order notifications & stock updates</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={16} style={{ color: "var(--rust)" }} />
            <span>Role-based secured authentication</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={16} style={{ color: "var(--gold)" }} />
            <span>Encrypted local session management</span>
          </div>
        </div>
      </div>

      {/* Login Form Card */}
      <form
        className="login-form"
        onSubmit={handleSubmit}
        style={{
          background: "var(--paper)",
          borderRadius: "28px",
          border: "1px solid var(--line)",
          padding: "clamp(28px, 4vw, 48px)",
        }}
      >
        {/* Prominent Friendly Shopper Callout Banner */}
        <div
          className="shopper-banner mb-6 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{
            background: "var(--rust-light)",
            border: "1px solid rgba(212, 98, 42, 0.25)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--rust)", color: "#ffffff" }}
            >
              <ShoppingBag size={20} />
            </div>
            <div>
              <p
                className="text-xs sm:text-sm font-bold leading-tight"
                style={{ color: "var(--ink)", margin: 0 }}
              >
                Customers shop 100% login-free!
              </p>
              <p
                className="text-[11px] sm:text-xs leading-tight mt-0.5"
                style={{ color: "var(--muted)", margin: 0 }}
              >
                No account needed to browse or order
              </p>
            </div>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0"
            style={{
              background: "var(--rust)",
              color: "#ffffff",
              whiteSpace: "nowrap",
            }}
          >
            Explore Products <ArrowRight size={13} />
          </Link>
        </div>

        <span className="kicker">AUTHENTICATION</span>
        <h2>Sign in to portal</h2>

        {/* Role Switcher: Clean Two-Tab Toggle */}
        <div
          className="role-switch mb-6 grid grid-cols-2 p-1 rounded-full"
          style={{
            background: "var(--cream)",
            border: "1px solid var(--line)",
          }}
        >
          <button
            type="button"
            className={role === "Vendor" ? "selected" : ""}
            style={
              role === "Vendor"
                ? {
                    background: "var(--ink)",
                    color: "var(--cream)",
                    borderRadius: "999px",
                    padding: "8px clamp(8px, 2vw, 16px)",
                    fontSize: "clamp(12px, 2.5vw, 14px)",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }
                : {
                    border: "none",
                    background: "transparent",
                    color: "var(--muted)",
                    borderRadius: "999px",
                    padding: "8px clamp(8px, 2vw, 16px)",
                    fontSize: "clamp(12px, 2.5vw, 14px)",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }
            }
            onClick={() => setParams({ role: "vendor" })}
          >
            <Store size={14} className="inline mr-1.5" /> Vendor Studio
          </button>
          <button
            type="button"
            className={role === "Admin" ? "selected" : ""}
            style={
              role === "Admin"
                ? {
                    background: "var(--ink)",
                    color: "var(--cream)",
                    borderRadius: "999px",
                    padding: "8px clamp(8px, 2vw, 16px)",
                    fontSize: "clamp(12px, 2.5vw, 14px)",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }
                : {
                    border: "none",
                    background: "transparent",
                    color: "var(--muted)",
                    borderRadius: "999px",
                    padding: "8px clamp(8px, 2vw, 16px)",
                    fontSize: "clamp(12px, 2.5vw, 14px)",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }
            }
            onClick={() => setParams({ role: "admin" })}
          >
            <Shield size={14} className="inline mr-1.5" /> Admin Operations
          </button>
        </div>

        <label>
          Email address
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={
              role === "Vendor" ? "vendor@localcart.in" : "admin@localcart.in"
            }
            required
            style={{
              background: "var(--cream)",
              border: "1px solid var(--line)",
              borderRadius: "12px",
              padding: "14px 16px",
              color: "var(--ink)",
              outline: "none",
            }}
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
            style={{
              background: "var(--cream)",
              border: "1px solid var(--line)",
              borderRadius: "12px",
              padding: "14px 16px",
              color: "var(--ink)",
              outline: "none",
            }}
          />
        </label>

        <button
          type="submit"
          className="btn btn-dark full py-3.5 mt-2"
          style={{ width: "100%" }}
          disabled={busy}
        >
          {busy ? (
            "Authenticating with server..."
          ) : (
            <>
              Continue to{" "}
              {role === "Vendor" ? "Vendor Studio" : "Admin Operations"}{" "}
              <ArrowRight size={16} />
            </>
          )}
        </button>

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

        {/* Portal Links & Provisioning Notice */}
        <div
          className="mt-6 pt-4 text-center text-xs"
          style={{ borderTop: "1px solid var(--line)", color: "var(--muted)" }}
        >
          {role === "Vendor" ? (
            <span>
              New store owner in the neighborhood?{" "}
              <Link
                to="/signup"
                className="font-bold underline ml-1"
                style={{ color: "var(--rust)" }}
              >
                Register your shop &rarr;
              </Link>
            </span>
          ) : (
            <span>
              Administrator access is strictly provisioned by database
              administrators.
            </span>
          )}
        </div>
      </form>
    </main>
  );
};
