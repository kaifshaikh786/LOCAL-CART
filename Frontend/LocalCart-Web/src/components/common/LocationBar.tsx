import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";

type LocationBarProps = {
  compact?: boolean;
};

export const LocationBar: React.FC<LocationBarProps> = ({ compact = false }) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(
    localStorage.getItem("localcart-location") ?? "",
  );

  const saveLocation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = location.trim();
    if (!trimmed) return;
    localStorage.setItem("localcart-location", trimmed);
    navigate(`/products?pincode=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form className={`location-bar ${compact ? "compact" : ""}`} onSubmit={saveLocation}>
      <MapPin size={compact ? 15 : 17} />
      <input
        value={location}
        onChange={(event) => setLocation(event.target.value)}
        placeholder="Enter your area or pincode"
        aria-label="Area or pincode"
      />
      <button type="submit">
        Find nearby <ArrowRight size={compact ? 12 : 14} />
      </button>
    </form>
  );
};
