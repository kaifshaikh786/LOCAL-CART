import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";

export const LocationBar: React.FC = () => {
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
    <form className="location-bar" onSubmit={saveLocation}>
      <MapPin size={17} />
      <input
        value={location}
        onChange={(event) => setLocation(event.target.value)}
        placeholder="Enter your area or pincode"
        aria-label="Area or pincode"
      />
      <button type="submit">
        Find nearby <ArrowRight size={14} />
      </button>
    </form>
  );
};
