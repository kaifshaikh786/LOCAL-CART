export type Category =
  | "Electronics"
  | "Fashion"
  | "Grocery"
  | "Beauty"
  | "Home";

export type Product = {
  id: number;
  name: string;
  category: Category;
  vendor: string;
  vendorPhone?: string;
  price: number;
  oldPrice: number;
  rating: number;
  distance: string;
  color: string;
  accent: string;
  tag: string;
  image?: string;
  stock?: number;
};

export type CartItem = Product & {
  quantity: number;
};

export type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  deliveryType: "delivery" | "pickup";
  notes?: string;
};

export type Order = {
  orderNumber: string;
  customer: CustomerInfo;
  items: CartItem[];
  total: number;
  timestamp: string;
  status?:
    | "Pending"
    | "Accepted"
    | "ReadyForPickup"
    | "Completed"
    | "Cancelled";
};

export type UserRole = "vendor" | "admin" | "customer";

export type JwtClaims = {
  role?: string;
  roles?: string[];
  user?: { role?: string };
};
