export type Category = string;

export type Product = {
  id: number;
  productId?: number;
  vendorId?: number;
  name: string;
  category: Category;
  vendor: string;
  vendorPhone?: string;
  vendorAddress?: string;
  vendorPincode?: string;
  distanceKm?: number;
  price: number;
  oldPrice: number;
  rating: number;
  distance: string;
  color: string;
  accent: string;
  tag: string;
  image?: string;
  stock?: number;
  description?: string;
  unit?: string;
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
  orderId?: number;
  orderNumber: string;
  vendorId?: number;
  vendorName?: string;
  customer: CustomerInfo;
  items: CartItem[];
  total: number;
  timestamp: string;
  status?:
    | "Pending"
    | "Accepted"
    | "ReadyForPickup"
    | "Completed"
    | "Cancelled"
    | string;
};

export type UserRole = "vendor" | "admin" | "customer";

export type JwtClaims = {
  role?: string;
  roles?: string[];
  user?: { role?: string };
};

// ==========================================
// ASP.NET Core API DTO Interfaces
// ==========================================

export interface BackendProductImageDto {
  productImageId: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface BackendProductDto {
  productId: number;
  vendorId: number;
  vendorName: string;
  vendorAddress: string;
  vendorPhone: string;
  vendorPincode: string;
  productCategoryId: number;
  categoryName: string;
  name: string;
  description?: string | null;
  price: number;
  unit?: string | null;
  stockQuantity: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt?: string | null;
  images: BackendProductImageDto[];
}

export interface BackendCategoryDto {
  productCategoryId: number;
  categoryName: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface BackendVendorDto {
  vendorId: number;
  shopName: string;
  ownerName: string;
  phoneNumber: string;
  email?: string | null;
  address: string;
  city: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface BackendOrderItemDto {
  orderItemId: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface BackendOrderDto {
  orderId: number;
  orderNumber: string;
  vendorId: number;
  vendorShopName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: string;
  deliveryAddress?: string | null;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  updatedAt?: string | null;
  items: BackendOrderItemDto[];
}

export interface CreateOrderItemDto {
  productId: number;
  quantity: number;
}

export interface CreateOrderDto {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: "Home Delivery" | "Pickup";
  deliveryAddress?: string | null;
  items: CreateOrderItemDto[];
}

export interface UpdateOrderStatusDto {
  status: string;
}

export interface CreateProductDto {
  productCategoryId: number;
  name: string;
  description?: string | null;
  price: number;
  unit?: string | null;
  stockQuantity: number;
  imageUrls?: string[];
}

export interface UpdateProductDto {
  productCategoryId: number;
  name: string;
  description?: string | null;
  price: number;
  unit?: string | null;
  stockQuantity: number;
  isAvailable: boolean;
  imageUrls?: string[];
}

export interface AuthUserResponseDto {
  appUserId: number;
  fullName: string;
  email: string;
  profileImageUrl?: string | null;
  phoneNumber?: string | null;
  emailConfirmed: boolean;
  roles: string[];
  vendorId?: number | null;
  shopName?: string | null;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  user: AuthUserResponseDto;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface RegisterVendorRequestDto {
  ownerName?: string;
  fullName?: string;
  storeName?: string;
  shopName?: string;
  email: string;
  password: string;
  phoneNumber: string;
  address?: string;
  city?: string;
}

// ==========================================
// Mappers between Backend DTOs & Frontend Models
// ==========================================

const CATEGORY_COLORS: Record<string, { color: string; accent: string }> = {
  Electronics: { color: "#e8d8c2", accent: "#262521" },
  "Gaming Accessories": { color: "#e0d9f0", accent: "#3e2768" },
  Fashion: { color: "#d7e1de", accent: "#26433c" },
  Grocery: { color: "#e7e0ba", accent: "#576d35" },
  "Fruits & Vegetables": { color: "#e3edd3", accent: "#3b6028" },
  "Dairy & Eggs": { color: "#fef3c7", accent: "#854d0e" },
  Bakery: { color: "#ffedd5", accent: "#9a3412" },
  Beauty: { color: "#ead7d2", accent: "#995f5f" },
  Home: { color: "#d9d7c8", accent: "#6c6b4d" },
};

export function mapBackendProductToFrontend(dto: BackendProductDto): Product {
  const primaryImg =
    dto.images?.find((img) => img.isPrimary)?.imageUrl ||
    dto.images?.[0]?.imageUrl;
  const palette = CATEGORY_COLORS[dto.categoryName] || {
    color: "#f1f5f9",
    accent: "#1e293b",
  };

  return {
    id: dto.productId,
    productId: dto.productId,
    vendorId: dto.vendorId,
    name: dto.name,
    category: dto.categoryName,
    vendor: dto.vendorName || "Verified Merchant",
    vendorAddress: dto.vendorAddress || undefined,
    vendorPhone: dto.vendorPhone || undefined,
    vendorPincode: dto.vendorPincode || undefined,
    price: dto.price,
    oldPrice: Math.round(dto.price * 1.15),
    rating: 4.8,
    distance: dto.vendorPincode ? `Pincode ${dto.vendorPincode}` : "Distance unavailable",
    color: palette.color,
    accent: palette.accent,
    tag: dto.stockQuantity > 0 ? "In Stock" : "Out of Stock",
    image: primaryImg,
    stock: dto.stockQuantity,
    description: dto.description || undefined,
    unit: dto.unit || undefined,
  };
}

export function mapBackendOrderToFrontend(dto: BackendOrderDto): Order {
  return {
    orderId: dto.orderId,
    orderNumber: dto.orderNumber,
    vendorId: dto.vendorId,
    vendorName: dto.vendorShopName,
    customer: {
      name: dto.customerName,
      email: dto.customerEmail,
      phone: dto.customerPhone,
      address: dto.deliveryAddress || "",
      deliveryType: dto.deliveryMethod?.toLowerCase().includes("pickup")
        ? "pickup"
        : "delivery",
    },
    items: dto.items.map((i) => ({
      id: i.productId,
      productId: i.productId,
      vendorId: dto.vendorId,
      name: i.productName,
      category: "General",
      vendor: dto.vendorShopName,
      price: i.unitPrice,
      oldPrice: i.unitPrice,
      rating: 5.0,
      distance: "1.0 km",
      color: "#e2e8f0",
      accent: "#1e293b",
      tag: "Ordered",
      quantity: i.quantity,
    })),
    total: dto.totalAmount,
    timestamp: dto.createdAt,
    status: dto.orderStatus,
  };
}
