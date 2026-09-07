import { Category, Product, CartItem, Order } from "../types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Studio wireless headphones",
    category: "Electronics",
    vendor: "ABC Electronics",
    price: 1499,
    oldPrice: 2199,
    rating: 4.8,
    distance: "1.2 km",
    color: "#e8d8c2",
    accent: "#262521",
    tag: "Best seller",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "Everyday cotton tee",
    category: "Fashion",
    vendor: "Local Fashion Store",
    price: 599,
    oldPrice: 899,
    rating: 4.5,
    distance: "0.8 km",
    color: "#d7e1de",
    accent: "#26433c",
    tag: "New in",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "Active smart watch",
    category: "Electronics",
    vendor: "Tech World",
    price: 2299,
    oldPrice: 3499,
    rating: 4.7,
    distance: "2.1 km",
    color: "#d9d1c3",
    accent: "#b75c37",
    tag: "Deal of day",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Fresh pantry starter box",
    category: "Grocery",
    vendor: "Fresh Mart",
    price: 799,
    oldPrice: 999,
    rating: 4.6,
    distance: "0.5 km",
    color: "#e7e0ba",
    accent: "#576d35",
    tag: "Fresh today",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    name: "Daily glow care kit",
    category: "Beauty",
    vendor: "Beauty Point",
    price: 799,
    oldPrice: 1199,
    rating: 4.6,
    distance: "1.5 km",
    color: "#ead7d2",
    accent: "#995f5f",
    tag: "Trending",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "Soft linen table set",
    category: "Home",
    vendor: "The Home Edit",
    price: 1249,
    oldPrice: 1799,
    rating: 4.4,
    distance: "1.8 km",
    color: "#d9d7c8",
    accent: "#6c6b4d",
    tag: "Local pick",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85",
  },
];

export const CATEGORIES: { label: Category; icon: string }[] = [
  { label: "Electronics", icon: "✦" },
  { label: "Fashion", icon: "◒" },
  { label: "Grocery", icon: "✿" },
  { label: "Beauty", icon: "◌" },
  { label: "Home", icon: "⌂" },
];

export const readStoredProducts = (): Product[] => {
  try {
    const stored = JSON.parse(
      localStorage.getItem("localcart-products") ?? "null",
    ) as Product[] | null;
    return stored?.length
      ? stored.map((item) => ({
          ...INITIAL_PRODUCTS.find((p) => p.id === item.id),
          ...item,
        }))
      : INITIAL_PRODUCTS;
  } catch {
    return INITIAL_PRODUCTS;
  }
};

export const readStoredCart = (): CartItem[] => {
  try {
    return JSON.parse(
      localStorage.getItem("localcart-cart") ?? "[]",
    ) as CartItem[];
  } catch {
    return [];
  }
};

export const readStoredOrders = (): Order[] => {
  try {
    return JSON.parse(
      localStorage.getItem("localcart-orders") ?? "[]",
    ) as Order[];
  } catch {
    return [];
  }
};
