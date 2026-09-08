import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AuthUserResponseDto,
  RegisterRequestDto,
  RegisterVendorRequestDto,
  UserRole,
} from "../types";
import { roleFromToken } from "../utils/formatters";
import { authApi } from "../services/authApi";

type AuthContextType = {
  currentUser: AuthUserResponseDto | null;
  currentRole: UserRole | null;
  token: string | null;
  login: (email: string, password: string) => Promise<AuthUserResponseDto>;
  register: (dto: RegisterRequestDto) => Promise<AuthUserResponseDto>;
  registerVendor: (
    dto: RegisterVendorRequestDto,
  ) => Promise<AuthUserResponseDto>;
  loginWithToken: (
    token: string,
    fallbackRole?: "vendor" | "admin",
    user?: AuthUserResponseDto,
  ) => void;
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
  const [currentUser, setCurrentUser] = useState<AuthUserResponseDto | null>(
    () => {
      try {
        const stored = sessionStorage.getItem("localcart-user-profile");
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    },
  );

  const getActiveRole = (): UserRole | null => {
    if (currentUser?.roles?.length) {
      if (currentUser.roles.some((r) => r.toLowerCase() === "admin"))
        return "admin";
      if (currentUser.roles.some((r) => r.toLowerCase() === "vendor"))
        return "vendor";
      return "customer";
    }
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

  // Fetch /auth/me on mount if token is present
  useEffect(() => {
    if (token && !currentUser) {
      authApi
        .getCurrentUser()
        .then((profile) => {
          setCurrentUser(profile);
          sessionStorage.setItem(
            "localcart-user-profile",
            JSON.stringify(profile),
          );
          if (profile.roles?.some((r) => r.toLowerCase() === "admin")) {
            setCurrentRole("admin");
          } else if (profile.roles?.some((r) => r.toLowerCase() === "vendor")) {
            setCurrentRole("vendor");
          }
        })
        .catch(() => {
          // Token expired or invalid
          logout();
        });
    }
  }, [token]);

  const login = async (
    email: string,
    password: string,
  ): Promise<AuthUserResponseDto> => {
    const res = await authApi.login({ email, password });
    sessionStorage.setItem("localcart-auth-token", res.accessToken);
    sessionStorage.setItem("localcart-user-profile", JSON.stringify(res.user));
    setToken(res.accessToken);
    setCurrentUser(res.user);

    let role: UserRole = "customer";
    if (res.user.roles?.some((r) => r.toLowerCase() === "admin")) {
      role = "admin";
      sessionStorage.setItem("localcart-admin-auth", "true");
    } else if (res.user.roles?.some((r) => r.toLowerCase() === "vendor")) {
      role = "vendor";
      sessionStorage.setItem("localcart-vendor-auth", "true");
    }
    setCurrentRole(role);
    return res.user;
  };

  const register = async (
    dto: RegisterRequestDto,
  ): Promise<AuthUserResponseDto> => {
    const res = await authApi.register(dto);
    sessionStorage.setItem("localcart-auth-token", res.accessToken);
    sessionStorage.setItem("localcart-user-profile", JSON.stringify(res.user));
    setToken(res.accessToken);
    setCurrentUser(res.user);
    setCurrentRole("customer");
    return res.user;
  };

  const registerVendor = async (
    dto: RegisterVendorRequestDto,
  ): Promise<AuthUserResponseDto> => {
    const res = await authApi.registerVendor(dto);
    sessionStorage.setItem("localcart-auth-token", res.accessToken);
    sessionStorage.setItem("localcart-user-profile", JSON.stringify(res.user));
    sessionStorage.setItem("localcart-vendor-auth", "true");
    setToken(res.accessToken);
    setCurrentUser(res.user);
    setCurrentRole("vendor");
    return res.user;
  };

  const loginWithToken = (
    jwtToken: string,
    fallbackRole?: "vendor" | "admin",
    user?: AuthUserResponseDto,
  ) => {
    sessionStorage.setItem("localcart-auth-token", jwtToken);
    setToken(jwtToken);
    if (user) {
      setCurrentUser(user);
      sessionStorage.setItem("localcart-user-profile", JSON.stringify(user));
    }
    const parsedRole =
      (user?.roles?.[0]?.toLowerCase() as UserRole) ||
      roleFromToken(jwtToken) ||
      fallbackRole;
    if (parsedRole) {
      sessionStorage.setItem(`localcart-${parsedRole}-auth`, "true");
      setCurrentRole(parsedRole);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("localcart-auth-token");
    sessionStorage.removeItem("localcart-user-profile");
    sessionStorage.removeItem("localcart-vendor-auth");
    sessionStorage.removeItem("localcart-admin-auth");
    setToken(null);
    setCurrentUser(null);
    setCurrentRole(null);
  };

  const hasAccess = (role: "vendor" | "admin"): boolean => {
    if (currentUser?.roles?.some((r) => r.toLowerCase() === role)) return true;
    if (token) {
      const parsedRole = roleFromToken(token);
      if (parsedRole === role) return true;
    }
    return sessionStorage.getItem(`localcart-${role}-auth`) === "true";
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        token,
        login,
        register,
        registerVendor,
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
