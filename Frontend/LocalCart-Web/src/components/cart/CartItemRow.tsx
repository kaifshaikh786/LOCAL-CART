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
    <div className="cart-item">
      <ProductArtwork product={item} />
      <div className="cart-item-main">
        <Link to={`/products/${item.id}`}>
          <h3>{item.name}</h3>
        </Link>
        <p>{item.vendor}</p>
        <div className="quantity">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, -1)}
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <b>{item.quantity}</b>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, 1)}
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      <b className="cart-item-price">{money(item.price * item.quantity)}</b>
      <button
        type="button"
        className="remove"
        onClick={() => onRemove(item.id)}
        aria-label="Remove item"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};
