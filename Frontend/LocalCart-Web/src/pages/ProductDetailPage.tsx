import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Heart,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Truck,
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { money } from "../utils/formatters";
import { ProductArtwork } from "../components/product/ProductArtwork";
import { ProductGrid } from "../components/product/ProductGrid";

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { catalog, getProductById } = useProducts();
  const { addToCart } = useCart();

  const product = (id ? getProductById(Number(id)) : undefined) ?? catalog[0];

  if (!product) {
    return (
      <main className="page detail-page">
        <Link className="back-link" to="/products">
          <ArrowLeft size={16} /> Back to catalog
        </Link>
        <div className="empty-state">
          <h2>Product Not Found</h2>
          <p>The requested product is not available in our local catalog.</p>
          <Link to="/products" className="btn btn-dark">
            Browse All Products
          </Link>
        </div>
      </main>
    );
  }

  const savings = product.oldPrice - product.price;
  const similarProducts = catalog
    .filter(
      (item) => item.id !== product.id && item.category === product.category,
    )
    .slice(0, 4);

  return (
    <main className="page detail-page">
      <Link className="back-link" to="/products">
        <ArrowLeft size={16} /> Back to local shop
      </Link>

      <div className="detail-layout">
        {/* Product Visual */}
        <div className="flex flex-col gap-4">
          <ProductArtwork product={product} large />
          <div className="flex items-center justify-between text-xs text-slate-500 px-2">
            <span>SKU: LC-{product.id}-LOCAL</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Check size={14} /> In Stock ({product.stock ?? 15} units left)
            </span>
          </div>
        </div>

        {/* Product Information */}
        <div className="detail-copy">
          <div className="flex items-center gap-2">
            <span className="kicker">
              <Sparkles size={14} /> {product.category} · {product.tag}
            </span>
          </div>

          <h1>{product.name}</h1>

          <div className="detail-rating">
            <span>
              <Star size={16} fill="currentColor" /> {product.rating}
            </span>
            <span>38 verified neighborhood reviews</span>
          </div>

          <div className="detail-price">
            <b>{money(product.price)}</b>
            <del>{money(product.oldPrice)}</del>
            <span>Save {money(savings)}</span>
          </div>

          <p className="detail-description">
            Handpicked quality, supplied directly by your neighborhood merchant.
            When you purchase this item, your order is dispatched immediately
            from <b>{product.vendor}</b> located just <b>{product.distance}</b>{" "}
            from your location.
          </p>

          {/* Seller Card */}
          <div className="seller">
            <span className="seller-avatar">{product.vendor.slice(0, 1)}</span>
            <div>
              <b>{product.vendor}</b>
              <small>
                <MapPin size={13} className="text-orange-600" />{" "}
                {product.distance} away · Ready in ~20 minutes
              </small>
            </div>
            <span className="verified">
              <ShieldCheck size={14} /> Verified Merchant
            </span>
          </div>

          {/* Action Buttons */}
          <div className="detail-actions">
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => addToCart(product)}
            >
              Add to bag <ShoppingBag size={17} />
            </button>
            <Link className="btn btn-outline" to="/cart">
              View shopping bag
            </Link>
          </div>

          {/* Delivery & Assurance Perks */}
          <div className="detail-perks">
            <span>
              <Truck size={18} />
              <b>Fast Local Delivery</b>
              <small>Same day, from ₹50</small>
            </span>
            <span>
              <Heart size={18} />
              <b>Easy Local Returns</b>
              <small>Within 7 days</small>
            </span>
            <span>
              <Store size={18} />
              <b>In-Store Pickup</b>
              <small>Instant & Free</small>
            </span>
          </div>
        </div>
      </div>

      {/* Similar Neighborhood Finds */}
      {similarProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-slate-200 dark:border-slate-800">
          <div className="section-heading">
            <div>
              <span className="kicker">
                MORE IN {product.category.toUpperCase()}
              </span>
              <h2>Similar neighborhood finds</h2>
            </div>
            <Link to={`/products?category=${product.category}`}>
              See all {product.category}
            </Link>
          </div>
          <ProductGrid products={similarProducts} />
        </section>
      )}
    </main>
  );
};
