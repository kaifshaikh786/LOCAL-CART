import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Phone, Search, Store } from "lucide-react";
import { vendorApi } from "../services/vendorApi";
import { BackendVendorDto } from "../types";

export const StoresPage: React.FC = () => {
  const [vendors, setVendors] = useState<BackendVendorDto[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    vendorApi
      .getVendors()
      .then(setVendors)
      .catch(() => setError("Stores are temporarily unavailable."))
      .finally(() => setLoading(false));
  }, []);

  const filteredVendors = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return vendors;
    return vendors.filter((vendor) =>
      [vendor.shopName, vendor.address, vendor.city, vendor.phoneNumber]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }, [query, vendors]);

  return (
    <main className="page stores-page">
      <section className="page-intro stores-intro">
        <span className="kicker">LOCAL STORES</span>
        <h1>Find a store near you.</h1>
        <p>Browse verified neighborhood stores, then shop their complete live catalog.</p>
        <label className="stores-search">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search store, area, or phone"
            aria-label="Search stores"
          />
        </label>
      </section>

      {loading && <p className="stores-status">Loading local stores...</p>}
      {error && <p className="stores-status stores-error">{error}</p>}
      {!loading && !error && filteredVendors.length === 0 && (
        <p className="stores-status">No stores match your search.</p>
      )}

      <section className="stores-grid" aria-label="Available stores">
        {filteredVendors.map((vendor) => (
          <article className="store-card" key={vendor.vendorId}>
            <div className="store-card-icon"><Store size={22} /></div>
            <div className="store-card-copy">
              <span className="store-card-kicker">VERIFIED LOCAL STORE</span>
              <h2>{vendor.shopName}</h2>
              <p><MapPin size={14} /> {vendor.address}</p>
              <a href={`tel:${vendor.phoneNumber}`}><Phone size={14} /> {vendor.phoneNumber}</a>
            </div>
            <Link
              className="store-card-link"
              to={`/products?vendorId=${vendor.vendorId}&vendor=${encodeURIComponent(vendor.shopName)}`}
            >
              Shop this store <ArrowRight size={15} />
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
};