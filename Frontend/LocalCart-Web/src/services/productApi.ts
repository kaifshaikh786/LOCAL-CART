import { apiClient } from "./apiClient";
import {
  BackendCategoryDto,
  BackendProductDto,
  CreateProductDto,
  UpdateProductDto,
} from "../types";

export interface ProductQueryParams {
  vendorId?: number;
  categoryId?: number;
  search?: string;
  includeUnavailable?: boolean;
}

export const productApi = {
  getProducts: async (
    params?: ProductQueryParams,
  ): Promise<BackendProductDto[]> => {
    const query = new URLSearchParams();
    if (params?.vendorId !== undefined)
      query.set("vendorId", String(params.vendorId));
    if (params?.categoryId !== undefined)
      query.set("categoryId", String(params.categoryId));
    if (params?.search) query.set("search", params.search);
    if (params?.includeUnavailable !== undefined)
      query.set("includeUnavailable", String(params.includeUnavailable));

    const queryString = query.toString();
    const endpoint = queryString ? `/products?${queryString}` : "/products";
    return apiClient.get<BackendProductDto[]>(endpoint);
  },

  getProductById: async (id: number): Promise<BackendProductDto> => {
    return apiClient.get<BackendProductDto>(`/products/${id}`);
  },

  getMyProducts: async (): Promise<BackendProductDto[]> => {
    return apiClient.get<BackendProductDto[]>("/products/my-products");
  },

  createProduct: async (dto: CreateProductDto): Promise<BackendProductDto> => {
    return apiClient.post<BackendProductDto>("/products", dto);
  },

  updateProduct: async (
    id: number,
    dto: UpdateProductDto,
  ): Promise<BackendProductDto> => {
    return apiClient.put<BackendProductDto>(`/products/${id}`, dto);
  },

  deleteProduct: async (id: number): Promise<void> => {
    return apiClient.del<void>(`/products/${id}`);
  },

  getCategories: async (
    includeInactive = false,
  ): Promise<BackendCategoryDto[]> => {
    return apiClient.get<BackendCategoryDto[]>(
      `/product-categories?includeInactive=${includeInactive}`,
    );
  },
};
