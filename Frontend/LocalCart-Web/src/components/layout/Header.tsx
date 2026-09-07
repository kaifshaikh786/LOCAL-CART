import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Moon,
  Search,
  ShoppingBag,
  Store,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { CATEGORIES } from "../../data/mockData";

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { darkMode, toggleTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [query, setQuery] = useState("");

  const closeMenus = () => {
    setOpen(false);
    setCategoriesOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      closeMenus();
    }
  };

  return (
    <header className="site-header">
      {/* Brand Logo */}
      <Link to="/" className="logo" onClick={closeMenus}>
        <img src="/localcart-logo.svg" alt="LocalCart logo" />
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
          Discover
        </Link>

        {/* Categories Dropdown */}
        <div className="nav-category">
          <button
            type="button"
            className={`nav-category-button ${categoriesOpen ? "open" : ""}`}
            onClick={() => setCategoriesOpen(!categoriesOpen)}
            aria-expanded={categoriesOpen}
          >
            Categories <span>⌄</span>
          </button>

          {categoriesOpen && (
            <div
              className="category-menu"
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              {CATEGORIES.map((category) => (
                <Link
                  to={`/products?category=${category.label}`}
                  onClick={closeMenus}
                  key={category.label}
                >
                  <span>{category.icon}</span>
                  <div>
                    <b>{category.label}</b>
                    <small>Shop nearby</small>
                  </div>
                </Link>
              ))}
              <Link className="menu-all" to="/products" onClick={closeMenus}>
                <span>View all categories</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        <a href="/#how-it-works">How it works</a>
      </nav>

      {/* Header Actions: Search, Theme Toggle, Customer, Bag, Mobile Toggle */}
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

        {/* Vendor Quick Link */}
        <Link
          to="/vendor"
          className="icon-btn hidden md:grid"
          title="Vendor Studio"
          aria-label="Vendor Studio"
        >
          <Store size={18} />
        </Link>

        {/* Customer Account */}
        <Link
          to="/customer"
          className="icon-btn account-link"
          title="Customer Account"
          aria-label="Customer Account"
        >
          <UserRound size={19} />
        </Link>

        {/* Cart Bag */}
        <Link
          className="bag-btn"
          to="/cart"
          aria-label={`Bag with ${itemCount} items`}
        >
          <ShoppingBag size={17} />
          <span>{itemCount}</span>
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="mobile-menu icon-btn"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X size={20} /> : <span>☰</span>}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="mobile-nav">
          <Link to="/" onClick={closeMenus}>
            Home
          </Link>
          <Link to="/products" onClick={closeMenus}>
            Discover Catalog
          </Link>
          <button
            type="button"
            className="flex items-center gap-2 py-2 text-left"
            onClick={toggleTheme}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}{" "}
            <span>{darkMode ? "Light mode" : "Dark mode"}</span>
          </button>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
            <span className="text-xs uppercase font-bold text-orange-600 dark:text-orange-400">
              Browse Categories
            </span>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {CATEGORIES.map((category) => (
                <Link
                  to={`/products?category=${category.label}`}
                  onClick={closeMenus}
                  key={category.label}
                  className="flex items-center gap-2 py-1 text-sm"
                >
                  <span>{category.icon}</span> {category.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex flex-col gap-2">
            <span className="text-xs uppercase font-bold text-orange-600 dark:text-orange-400">
              Portals
            </span>
            <Link to="/customer" onClick={closeMenus}>
              👤 Customer Account
            </Link>
            <Link to="/vendor" onClick={closeMenus}>
              🏪 Vendor Studio
            </Link>
            <Link to="/admin" onClick={closeMenus}>
              🛡️ Admin Overview
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
