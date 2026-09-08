import React from "react";
import { Link } from "react-router-dom";
import { MapPinOff } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  return (
    <main className="not-found">
      <div className="not-found-art" aria-hidden="true">
        404
      </div>

      <div className="not-found-content">
        <div className="not-found-icon">
          <MapPinOff size={36} />
        </div>

        <h1>You&apos;ve gone off the map.</h1>
        <p>
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s
          get you back on track.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="btn btn-dark">
            Back to Home
          </Link>
          <Link to="/products" className="btn btn-outline">
            Browse Products
          </Link>
        </div>

        <div className="not-found-links">
          <Link to="/products">Browse Products</Link>
          <span>·</span>
          <Link to="/signin">Sign In</Link>
          <span>·</span>
          <Link to="/how-it-works">How It Works</Link>
        </div>
      </div>
    </main>
  );
};
