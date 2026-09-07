import React, { createContext, useContext, useState } from "react";
import { UserRole } from "../types";
import { roleFromToken } from "../utils/formatters";

type AuthContextType = {
  currentRole: UserRole | null;
  token: string | null;
  loginAsDemo: (role: "vendor" | "admin") => void;
  loginWithToken: (token: string, fallbackRole?: "vendor" | "admin") => void;
  logout: () => void;
  hasAccess: (role: "vendor" | "admin") => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem("localcart-auth-token"),
  );

  const getActiveRole = (): UserRole | null => {
    if (token) {
      const derived = roleFromToken(token);
      if (derived) return derived;
    }
    if (sessionStorage.getItem("localcart-vendor-auth") === "true")
      return "vendor";
    if (sessionStorage.getItem("localcart-admin-auth") === "true")
      return "admin";
    return null;
  };

  const [currentRole, setCurrentRole] = useState<UserRole | null>(
    getActiveRole,
  );

  const loginAsDemo = (role: "vendor" | "admin") => {
    sessionStorage.setItem(`localcart-${role}-auth`, "true");
    setCurrentRole(role);
  };

  const loginWithToken = (
    jwtToken: string,
    fallbackRole?: "vendor" | "admin",
  ) => {
    sessionStorage.setItem("localcart-auth-token", jwtToken);
    setToken(jwtToken);
    const parsedRole = roleFromToken(jwtToken) || fallbackRole;
    if (parsedRole) {
      sessionStorage.setItem(`localcart-${parsedRole}-auth`, "true");
      setCurrentRole(parsedRole);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("localcart-auth-token");
    sessionStorage.removeItem("localcart-vendor-auth");
    sessionStorage.removeItem("localcart-admin-auth");
    setToken(null);
    setCurrentRole(null);
  };

  const hasAccess = (role: "vendor" | "admin"): boolean => {
    if (token) {
      const parsedRole = roleFromToken(token);
      if (parsedRole === role) return true;
    }
    return sessionStorage.getItem(`localcart-${role}-auth`) === "true";
  };

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        token,
        loginAsDemo,
        loginWithToken,
        logout,
        hasAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
