import React, { createContext, useContext, useEffect, useState } from "react";
import {
  BackendCategoryDto,
  CreateProductDto,
  Product,
  mapBackendProductToFrontend,
} from "../types";
import { readStoredProducts } from "../data/mockData";
import { productApi } from "../services/productApi";

type ProductContextType = {
  catalog: Product[];
  categories: BackendCategoryDto[];
  loading: boolean;
  refreshProducts: () => Promise<void>;
  addProduct: (product: Product | CreateProductDto) => Promise<Product>;
  getProductById: (id: number) => Product | undefined;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [catalog, setCatalog] = useState<Product[]>(readStoredProducts);
  const [categories, setCategories] = useState<BackendCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshProducts = async () => {
    try {
      setLoading(true);
      const [backendProducts, backendCategories] = await Promise.allSettled([
        productApi.getProducts(),
        productApi.getCategories(),
      ]);

      if (
        backendProducts.status === "fulfilled" &&
        backendProducts.value.length > 0
      ) {
        const mapped = backendProducts.value.map(mapBackendProductToFrontend);
        setCatalog(mapped);
        localStorage.setItem("localcart-products", JSON.stringify(mapped));
      }

      if (
        backendCategories.status === "fulfilled" &&
        backendCategories.value.length > 0
      ) {
        setCategories(backendCategories.value);
      }
    } catch {
      // Fallback to local stored products
      setCatalog(readStoredProducts());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const addProduct = async (
    item: Product | CreateProductDto,
  ): Promise<Product> => {
    // If it's a CreateProductDto or has categoryId, try posting to backend
    if ("productCategoryId" in item) {
      try {
        const created = await productApi.createProduct(
          item as CreateProductDto,
        );
        const mapped = mapBackendProductToFrontend(created);
        setCatalog((prev) => [mapped, ...prev]);
        return mapped;
      } catch (err) {
        console.warn(
          "Backend product creation error, falling back to local:",
          err,
        );
      }
    }

    const localProduct: Product =
      "id" in item
        ? (item as Product)
        : {
            id: Date.now(),
            productId: Date.now(),
            name: item.name,
            category: "General",
            vendor: "My Store",
            price: item.price,
            oldPrice: Math.round(item.price * 1.15),
            rating: 5.0,
            distance: "0.5 km",
            color: "#f1f5f9",
            accent: "#1e293b",
            tag: "Store Fresh",
            stock: item.stockQuantity,
            description: item.description || undefined,
          };

    setCatalog((prev) => [localProduct, ...prev]);
    localStorage.setItem(
      "localcart-products",
      JSON.stringify([localProduct, ...catalog]),
    );
    return localProduct;
  };

  const getProductById = (id: number) => {
    return catalog.find((item) => item.id === id || item.productId === id);
  };

  return (
    <ProductContext.Provider
      value={{
        catalog,
        categories,
        loading,
        refreshProducts,
        addProduct,
        getProductById,
      }}
    >
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
