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
        background: product.color || "#f1f5f9",
        color: product.accent || "#1e293b",
        backgroundImage: product.image ? `url("${product.image}")` : undefined,
        aspectRatio: large ? "1 / 1" : "4 / 3",
      }}
    >
      {product.tag?.trim() ? (
        <span className="art-tag">{product.tag.trim()}</span>
      ) : null}
      {!product.image && (
        <div className={`shape shape-${product.id ?? 1}`}></div>
      )}
      <strong>
        {product.category === "Electronics"
          ? "LOCAL TECH"
          : (product.category || "STORE FIND").toUpperCase()}
      </strong>
    </div>
  );
};
