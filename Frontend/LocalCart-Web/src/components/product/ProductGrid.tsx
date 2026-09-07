import React from "react";
import { Product } from "../../types";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: Product[];
  onAdd?: (product: Product) => void;
};

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAdd,
}) => {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
};
