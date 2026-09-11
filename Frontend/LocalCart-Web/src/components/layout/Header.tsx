import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { darkMode, toggleTheme } = useTheme();
  const { currentUser, currentRole, token, logout } = useAuth();
  const { categories, catalog } = useProducts();

  const [open, setOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(new URLSearchParams(location.search).get("search") ?? "");
  }, [location.search]);

  const isLoggedIn = Boolean(token && (currentUser || currentRole));

  const closeMenus = () => {
    setOpen(false);
    setCategoryOpen(false);
  };

  const categoryNames = Array.from(
    new Set(
      categories.length > 0
        ? categories.map((category) => category.categoryName)
        : catalog.map((product) => product.category).filter(Boolean),
    ),
  );

  const handleSearchSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const next = new URLSearchParams();
    const current = new URLSearchParams(location.search);
    const cleanQuery = query.trim();
    const currentPincode = current.get("pincode");
    if (currentPincode) next.set("pincode", currentPincode);
    if (cleanQuery) next.set("search", cleanQuery);
    navigate(`/products${next.toString() ? `?${next.toString()}` : ""}`);
    closeMenus();
  };

  return (
    <header className="site-header">
      {/* Brand Logo */}
      <Link to="/" className="logo" onClick={closeMenus}>
        <img
          className="brand-logo"
          src="/localcart-logo.png"
          alt="LocalCart cart logo"
        />
        <div>
          <b>LocalCart</b>
          <small>Hyperlocal Marketplace</small>
        </div>
      </Link>

      {/* Primary Navigation Links */}
      <nav aria-label="Main Navigation">
        <Link className={location.pathname === "/" ? "active" : ""} to="/">
          Home
        </Link>
        <Link
          className={location.pathname.startsWith("/products") ? "active" : ""}
          to="/products"
        >
          Products
        </Link>
        <Link
          className={location.pathname.startsWith("/stores") ? "active" : ""}
          to="/stores"
        >
          Stores
        </Link>

        <div
          className="nav-category"
          onMouseEnter={() => setCategoryOpen(true)}
          onMouseLeave={() => setCategoryOpen(false)}
        >
          <button
            type="button"
            className={`nav-category-button ${categoryOpen ? "open" : ""}`}
            onClick={() => setCategoryOpen((current) => !current)}
            onFocus={() => setCategoryOpen(true)}
            aria-expanded={categoryOpen}
            aria-haspopup="menu"
          >
            Categories <ChevronDown size={14} />
          </button>
          {categoryOpen && (
            <div className="category-menu" role="menu">
              {categoryNames.map((categoryName) => (
                <Link
                  key={categoryName}
                  to={`/products?category=${encodeURIComponent(categoryName)}#category-results`}
                  onClick={closeMenus}
                  role="menuitem"
                >
                  <span><LayoutGrid size={16} /></span>
                  <b>{categoryName}</b>
                  <small>
                    {catalog.filter((product) => product.category === categoryName).length} products
                  </small>
                </Link>
              ))}
              <Link className="menu-all" to="/products" onClick={closeMenus}>
                View all products <span>→</span>
              </Link>
            </div>
          )}
        </div>

        <Link
          className={location.pathname === "/how-it-works" ? "active" : ""}
          to="/how-it-works"
        >
          About
        </Link>
      </nav>

      {/* Header Actions: Search, Theme Toggle, Auth Buttons / User Card, Cart Bag, Mobile Toggle */}
      <div className="header-actions">
        <form className="search-mini" onSubmit={handleSearchSubmit}>
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search stores or items..."
            aria-label="Search products"
          />
        </form>

        {/* Dark/Light Theme Toggle */}
        <button
          type="button"
          className="theme-toggle icon-btn"
          onClick={toggleTheme}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Cart Bag */}
        <Link
          className="bag-btn"
          to="/cart"
          aria-label={`Bag with ${itemCount} items`}
        >
          <ShoppingBag size={17} />
          <span>{itemCount}</span>
        </Link>

        {/* Authentication: When logged out -> Single Sign In pill; When logged in -> User Card pill & Logout */}
        {!isLoggedIn ? (
          <Link to="/signin" className="nav-auth-pill nav-auth-pill-outline">
            Sign In
          </Link>
        ) : (
          <div className="flex items-center gap-1.5">
            {currentRole === "admin" ? (
              <Link
                to="/admin"
                className="nav-user-pill"
                title="Admin Dashboard"
              >
                <LayoutGrid size={15} />
                <span>Admin Dashboard</span>
              </Link>
            ) : currentRole === "vendor" ? (
              <Link
                to="/vendor"
                className="nav-user-pill"
                title="Vendor Studio"
              >
                <Store size={15} />
                <span>{currentUser?.shopName || "Vendor Studio"}</span>
              </Link>
            ) : (
              <Link to="/customer" className="nav-user-pill" title="My Account">
                <UserRound size={15} />
                <span>
                  {currentUser?.fullName?.split(" ")[0] || "My Account"}
                </span>
              </Link>
            )}

            <button
              type="button"
              onClick={logout}
              className="icon-btn"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="mobile-menu icon-btn"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="mobile-nav">
          <Link to="/" onClick={closeMenus}>
            Home
          </Link>
          <Link to="/products" onClick={closeMenus}>
            Products
          </Link>
          <Link to="/stores" onClick={closeMenus}>
            Stores
          </Link>
          <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
            <span className="text-xs uppercase font-bold text-orange-600 dark:text-orange-400">
              Categories
            </span>
            {categoryNames.map((categoryName) => (
              <Link
                key={categoryName}
                to={`/products?category=${encodeURIComponent(categoryName)}#category-results`}
                onClick={closeMenus}
                className="flex items-center gap-2 py-1"
              >
                <LayoutGrid size={14} className="text-orange-600" />
                {categoryName}
              </Link>
            ))}
          </div>
          <Link to="/how-it-works" onClick={closeMenus}>
            About &amp; How it works
          </Link>
          <button
            type="button"
            className="flex items-center gap-2 py-2 text-left"
            onClick={toggleTheme}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}{" "}
            <span>{darkMode ? "Light mode" : "Dark mode"}</span>
          </button>

          {/* Auth section for mobile */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
            {!isLoggedIn ? (
              <Link
                to="/signin"
                onClick={closeMenus}
                className="nav-auth-pill nav-auth-pill-outline justify-center text-center w-full flex items-center"
              >
                Sign In
              </Link>
            ) : (
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                <Link
                  to={
                    currentRole === "admin"
                      ? "/admin"
                      : currentRole === "vendor"
                        ? "/vendor"
                        : "/customer"
                  }
                  onClick={closeMenus}
                  className="flex items-center gap-2 font-bold text-sm"
                >
                  {currentRole === "admin" ? (
                    <LayoutGrid size={16} className="text-orange-600" />
                  ) : currentRole === "vendor" ? (
                    <Store size={16} className="text-orange-600" />
                  ) : (
                    <UserRound size={16} className="text-orange-600" />
                  )}
                  <span>
                    {currentRole === "admin"
                      ? "Admin Dashboard"
                      : currentRole === "vendor"
                        ? currentUser?.shopName || "Vendor Studio"
                        : currentUser?.fullName || "My Account"}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeMenus();
                  }}
                  className="text-xs text-red-500 font-semibold hover:underline"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex flex-col gap-2">
            <span className="text-xs uppercase font-bold text-orange-600 dark:text-orange-400">
              Portals
            </span>
            <Link
              to="/customer"
              onClick={closeMenus}
              className="flex items-center gap-2 py-1"
            >
              <UserRound size={16} className="text-orange-600" /> Customer
              Account
            </Link>
            <Link
              to="/vendor"
              onClick={closeMenus}
              className="flex items-center gap-2 py-1"
            >
              <Store size={16} className="text-orange-600" /> Vendor Studio
            </Link>
            <Link
              to="/admin"
              onClick={closeMenus}
              className="flex items-center gap-2 py-1"
            >
              <ShieldCheck size={16} className="text-orange-600" /> Admin
              Overview
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
