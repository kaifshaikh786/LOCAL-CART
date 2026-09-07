import React from "react";

type MetricCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
};

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  label,
  value,
  detail,
}) => {
  return (
    <div className="metric">
      <span className="metric-icon">{icon}</span>
      <small>{label}</small>
      <b>{value}</b>
      <em>{detail}</em>
    </div>
  );
};
