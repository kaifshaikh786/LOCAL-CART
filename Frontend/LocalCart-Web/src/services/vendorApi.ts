import { apiClient } from "./apiClient";
import { BackendVendorDto } from "../types";

export const vendorApi = {
  getVendors: async (includeInactive = false): Promise<BackendVendorDto[]> => {
    return apiClient.get<BackendVendorDto[]>(
      `/vendors?includeInactive=${includeInactive}`,
    );
  },

  getVendorById: async (id: number): Promise<BackendVendorDto> => {
    return apiClient.get<BackendVendorDto>(`/vendors/${id}`);
  },
};
