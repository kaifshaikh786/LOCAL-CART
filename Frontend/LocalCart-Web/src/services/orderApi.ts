import { apiClient } from "./apiClient";
import {
  BackendOrderDto,
  CreateOrderDto,
  UpdateOrderStatusDto,
} from "../types";

export const orderApi = {
  bookOrder: async (dto: CreateOrderDto): Promise<BackendOrderDto> => {
    return apiClient.post<BackendOrderDto>("/orders", dto);
  },

  lookupOrder: async (orderNumber: string): Promise<BackendOrderDto> => {
    return apiClient.get<BackendOrderDto>(
      `/orders/lookup/${encodeURIComponent(orderNumber)}`,
    );
  },

  getMyVendorOrders: async (status?: string): Promise<BackendOrderDto[]> => {
    const endpoint = status
      ? `/orders/my-orders?status=${encodeURIComponent(status)}`
      : "/orders/my-orders";
    return apiClient.get<BackendOrderDto[]>(endpoint);
  },

  getOrderById: async (id: number): Promise<BackendOrderDto> => {
    return apiClient.get<BackendOrderDto>(`/orders/${id}`);
  },

  updateOrderStatus: async (
    id: number,
    status: string,
  ): Promise<BackendOrderDto> => {
    const dto: UpdateOrderStatusDto = { status };
    return apiClient.put<BackendOrderDto>(`/orders/${id}/status`, dto);
  },
};
