import React from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "../../types";
import { money } from "../../utils/formatters";
import { ProductArtwork } from "../product/ProductArtwork";

type CartItemRowProps = {
  item: CartItem;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
};

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <div
      className="cart-item"
      style={{
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: "18px",
        padding: "20px",
        gap: "16px",
      }}
    >
      <ProductArtwork product={item} />
      <div className="cart-item-main">
        <Link to={`/products/${item.id}`}>
          <h3 style={{ color: "var(--ink)" }}>{item.name}</h3>
        </Link>
        <p style={{ color: "var(--muted)" }}>{item.vendor}</p>
        <div className="quantity">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, -1)}
            aria-label="Decrease quantity"
            style={{
              width: "40px",
              height: "40px",
              border: "1px solid var(--line)",
              borderRadius: "10px",
              display: "grid",
              placeItems: "center",
              background: "var(--paper)",
              color: "var(--ink)",
            }}
          >
            <Minus size={14} />
          </button>
          <b
            style={{
              color: "var(--ink)",
              minWidth: "24px",
              textAlign: "center",
            }}
          >
            {item.quantity}
          </b>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, 1)}
            aria-label="Increase quantity"
            style={{
              width: "40px",
              height: "40px",
              border: "1px solid var(--line)",
              borderRadius: "10px",
              display: "grid",
              placeItems: "center",
              background: "var(--paper)",
              color: "var(--ink)",
            }}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      <b
        className="cart-item-price"
        style={{ fontWeight: 800, color: "var(--ink)" }}
      >
        {money(item.price * item.quantity)}
      </b>
      <button
        type="button"
        className="remove"
        onClick={() => onRemove(item.id)}
        aria-label="Remove item"
        style={{ color: "var(--muted)" }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};
