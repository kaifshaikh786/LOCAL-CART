import React, { useState } from "react";
import { Product } from "../../types";

type ProductArtworkProps = {
  product: Product;
  large?: boolean;
};

export const ProductArtwork: React.FC<ProductArtworkProps> = ({
  product,
  large = false,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(product.image && !imageFailed);

  return (
    <div
      className={`product-art ${large ? "large" : ""} ${hasImage ? "has-image" : ""}`}
      style={{
        background: product.color || "#f1f5f9",
        color: product.accent || "#1e293b",
        aspectRatio: large ? "1 / 1" : "4 / 3",
      }}
    >
      {hasImage && (
        <img
          className="product-art-image"
          src={product.image}
          alt={`${product.name} from ${product.vendor}`}
          loading={large ? "eager" : "lazy"}
          onError={() => setImageFailed(true)}
        />
      )}
      {product.tag?.trim() ? (
        <span className="art-tag">{product.tag.trim()}</span>
      ) : null}
      {!hasImage && (
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
