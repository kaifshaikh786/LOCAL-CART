import React from "react";
import { Link } from "react-router-dom";

type PanelShellProps = {
  role: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export const PanelShell: React.FC<PanelShellProps> = ({
  role,
  title,
  description,
  children,
}) => {
  return (
    <main className="page panel-page">
      <div className="panel-heading">
        <div>
          <span className="kicker">{role} WORKSPACE</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <Link className="btn btn-outline" to="/">
          Back to storefront
        </Link>
      </div>
      {children}
    </main>
  );
};
