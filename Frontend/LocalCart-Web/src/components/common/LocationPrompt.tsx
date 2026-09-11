import React, { useState } from "react";
import { MapPin, Navigation, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

type LocationPromptProps = {
  onClose: () => void;
};

export const LocationPrompt: React.FC<LocationPromptProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const route = useLocation();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const location = value.trim();
    if (!location) {
      setError("Enter your area or six-digit pincode.");
      return;
    }

    localStorage.setItem("localcart-location", location);
    onClose();
    if (route.pathname === "/") {
      navigate(`/products?pincode=${encodeURIComponent(location)}`);
    }
  };

  return (
    <div className="location-prompt-backdrop" role="presentation">
      <section className="location-prompt" role="dialog" aria-modal="true" aria-labelledby="location-prompt-title">
        <button className="location-prompt-close" type="button" onClick={onClose} aria-label="Close location prompt">
          <X size={18} />
        </button>
        <div className="location-prompt-icon"><MapPin size={25} /></div>
        <span className="kicker">SHOP WHAT IS NEARBY</span>
        <h2 id="location-prompt-title">Where should we deliver?</h2>
        <p>Enter your area or pincode to put nearby stores and products first.</p>
        <form onSubmit={submit}>
          <label className="location-prompt-input">
            <Navigation size={16} />
            <input
              autoFocus
              value={value}
              onChange={(event) => { setValue(event.target.value); setError(""); }}
              placeholder="e.g. 400050 or Bandra West"
              aria-label="Your area or pincode"
            />
          </label>
          {error && <small className="location-prompt-error">{error}</small>}
          <button className="btn btn-dark location-prompt-submit" type="submit">Show nearby stores</button>
        </form>
        <button className="location-prompt-skip" type="button" onClick={onClose}>Browse without location</button>
      </section>
    </div>
  );
};