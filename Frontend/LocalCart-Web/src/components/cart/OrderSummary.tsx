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
    <aside
      className="summary"
      style={{
        position: "sticky",
        top: "96px",
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: "20px",
        padding: "32px",
      }}
    >
      <h2 style={{ color: "var(--ink)" }}>Order summary</h2>
      <div style={{ color: "var(--muted)" }}>
        <span>Subtotal</span>
        <b style={{ color: "var(--ink)" }}>{money(subtotal)}</b>
      </div>
      <div style={{ color: "var(--muted)" }}>
        <span>Local delivery</span>
        <b style={{ color: "var(--ink)" }}>{money(deliveryFee)}</b>
      </div>
      <div
        className="summary-total"
        style={{
          borderTop: "2px solid var(--line)",
          paddingTop: "16px",
          color: "var(--ink)",
          fontWeight: 700,
        }}
      >
        <span>Total</span>
        <b style={{ color: "var(--rust)", fontSize: "22px", fontWeight: 800 }}>
          {money(total)}
        </b>
      </div>
      {showCheckoutButton && (
        <Link
          to="/checkout"
          className="btn btn-dark full"
          style={{ width: "100%", justifyContent: "center" }}
        >
          Continue to checkout <ArrowRight size={17} />
        </Link>
      )}
      <small className="secure" style={{ color: "var(--muted)" }}>
        <Check size={13} style={{ color: "var(--green)" }} /> Secure checkout · No hidden fees
      </small>
    </aside>
  );
};
