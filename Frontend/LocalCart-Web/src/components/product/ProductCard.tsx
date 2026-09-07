import React from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Plus, Star } from "lucide-react";
import { Product } from "../../types";
import { useCart } from "../../context/CartContext";
import { money } from "../../utils/formatters";
import { ProductArtwork } from "./ProductArtwork";

type ProductCardProps = {
  product: Product;
  onAdd?: (product: Product) => void;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  const { addToCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAdd) {
      onAdd(product);
    } else {
      addToCart(product);
    }
  };

  const discountPercent = Math.round(
    (1 - product.price / product.oldPrice) * 100,
  );

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`}>
        <ProductArtwork product={product} />
      </Link>
      <div className="product-card-info">
        <div className="card-title">
          <Link to={`/products/${product.id}`}>
            <h3>{product.name}</h3>
          </Link>
          <button type="button" className="heart" aria-label="Save product">
            <Heart size={17} />
          </button>
        </div>
        <p className="vendor">
          <MapPin size={13} /> {product.vendor} · {product.distance}
        </p>
        <div className="rating">
          <Star size={14} fill="currentColor" /> {product.rating}
        </div>
        <div className="price-row">
          <b>{money(product.price)}</b>
          <del>{money(product.oldPrice)}</del>
          <span>{discountPercent}% off</span>
        </div>
        <button type="button" className="add-btn" onClick={handleAdd}>
          Add to bag <Plus size={16} />
        </button>
      </div>
    </article>
  );
};
