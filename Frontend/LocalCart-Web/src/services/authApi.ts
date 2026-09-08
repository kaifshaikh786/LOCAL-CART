import { apiClient } from "./apiClient";
import {
  AuthResponseDto,
  AuthUserResponseDto,
  LoginRequestDto,
  RegisterRequestDto,
  RegisterVendorRequestDto,
} from "../types";

export const authApi = {
  login: async (dto: LoginRequestDto): Promise<AuthResponseDto> => {
    return apiClient.post<AuthResponseDto>("/auth/login", dto);
  },

  register: async (dto: RegisterRequestDto): Promise<AuthResponseDto> => {
    return apiClient.post<AuthResponseDto>("/auth/register", dto);
  },

  registerVendor: async (
    dto: RegisterVendorRequestDto,
  ): Promise<AuthResponseDto> => {
    const payload = {
      storeName: (dto.storeName || dto.shopName || "").trim(),
      shopName: (dto.shopName || dto.storeName || "").trim(),
      ownerName: (dto.ownerName || dto.fullName || "").trim(),
      fullName: (dto.fullName || dto.ownerName || "").trim(),
      email: dto.email.trim(),
      password: dto.password,
      phoneNumber: dto.phoneNumber.trim(),
      address: (dto.address || "Local Market").trim(),
      city: (dto.city || "Mumbai").trim(),
    };
    return apiClient.post<AuthResponseDto>("/auth/register-vendor", payload);
  },

  getCurrentUser: async (): Promise<AuthUserResponseDto> => {
    return apiClient.get<AuthUserResponseDto>("/auth/me");
  },
};
