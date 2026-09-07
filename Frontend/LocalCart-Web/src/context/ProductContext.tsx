import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "../types";
import { readStoredProducts } from "../data/mockData";

type ProductContextType = {
  catalog: Product[];
  addProduct: (product: Product) => void;
  getProductById: (id: number) => Product | undefined;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [catalog, setCatalog] = useState<Product[]>(readStoredProducts);

  useEffect(() => {
    localStorage.setItem("localcart-products", JSON.stringify(catalog));
  }, [catalog]);

  const addProduct = (newProduct: Product) => {
    setCatalog((prev) => [newProduct, ...prev]);
  };

  const getProductById = (id: number) => {
    return catalog.find((item) => item.id === id);
  };

  return (
    <ProductContext.Provider value={{ catalog, addProduct, getProductById }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
