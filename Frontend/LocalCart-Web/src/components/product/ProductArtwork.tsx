import React from "react";
import { Product } from "../../types";

type ProductArtworkProps = {
  product: Product;
  large?: boolean;
};

export const ProductArtwork: React.FC<ProductArtworkProps> = ({
  product,
  large = false,
}) => {
  return (
    <div
      className={`product-art ${large ? "large" : ""}`}
      style={{
        background: product.color,
        color: product.accent,
        backgroundImage: product.image ? `url(${product.image})` : undefined,
      }}
    >
      <span className="art-tag">{product.tag}</span>
      {!product.image && <div className={`shape shape-${product.id}`}></div>}
      <strong>
        {product.category === "Electronics"
          ? "LOCAL TECH"
          : product.category.toUpperCase()}
      </strong>
    </div>
  );
};
