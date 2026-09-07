import { JwtClaims } from "../types";

export const money = (value: number): string => {
  return `₹${value.toLocaleString("en-IN")}`;
};

export const formatDate = (dateStr: string): string => {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export const decodeJwt = (token: string): JwtClaims | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    ) as JwtClaims;
  } catch {
    return null;
  }
};

export const roleFromToken = (
  token: string,
): "vendor" | "admin" | "customer" | null => {
  const claims = decodeJwt(token);
  const role = claims?.role ?? claims?.user?.role ?? claims?.roles?.[0];
  const normalized = role?.toLowerCase();
  if (
    normalized === "vendor" ||
    normalized === "admin" ||
    normalized === "customer"
  ) {
    return normalized;
  }
  return null;
};
