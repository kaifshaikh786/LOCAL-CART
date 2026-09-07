import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { money } from "../../utils/formatters";

type OrderSummaryProps = {
  subtotal: number;
  deliveryFee?: number;
  showCheckoutButton?: boolean;
};

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  deliveryFee = 50,
  showCheckoutButton = true,
}) => {
  const total = subtotal > 0 ? subtotal + deliveryFee : 0;

  return (
    <aside className="summary">
      <h2>Order summary</h2>
      <div>
        <span>Subtotal</span>
        <b>{money(subtotal)}</b>
      </div>
      <div>
        <span>Local delivery</span>
        <b>{money(deliveryFee)}</b>
      </div>
      <div className="summary-total">
        <span>Total</span>
        <b>{money(total)}</b>
      </div>
      {showCheckoutButton && (
        <Link to="/checkout" className="btn btn-dark full">
          Continue to checkout <ArrowRight size={17} />
        </Link>
      )}
      <small className="secure">
        <Check size={13} /> Secure checkout · No hidden fees
      </small>
    </aside>
  );
};
