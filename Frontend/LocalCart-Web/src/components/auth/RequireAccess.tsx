import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type RequireAccessProps = {
  role: "vendor" | "admin";
  children: React.ReactNode;
};

export const RequireAccess: React.FC<RequireAccessProps> = ({
  role,
  children,
}) => {
  const { hasAccess } = useAuth();

  if (!hasAccess(role)) {
    return <Navigate to={`/signin?role=${role}`} replace />;
  }

  return <>{children}</>;
};
