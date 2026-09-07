import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ClipboardList,
  MapPin,
  Package,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";
import { useOrders } from "../context/OrderContext";
import { money } from "../utils/formatters";

export const OrderConfirmedPage: React.FC = () => {
  const [params] = useSearchParams();
  const { lastOrder } = useOrders();

  const orderNumber =
    params.get("orderNumber") || lastOrder?.orderNumber || "LC-ORDER";
  const customerName = lastOrder?.customer?.name;
  const deliveryAddress = lastOrder?.customer?.address;
  const storeName = lastOrder?.items[0]?.vendor || "Verified Local Merchant";
  const totalAmount = lastOrder?.total ?? 0;

  return (
    <main className="page confirmed">
      {/* Animated Checkmark */}
      <div className="confirm-mark">
        <Check size={38} />
      </div>

      <span className="kicker">
        <ShieldCheck size={16} /> ORDER CONFIRMED & DISPATCH NOTIFIED
      </span>

      <h1>
        It's on its way
        <br />
        <em>to becoming yours.</em>
      </h1>

      <p>
        Thanks{customerName ? `, ${customerName}` : ""}! Your order has been
        dispatched to <b>{storeName}</b>. The merchant is packing your items
        now.
      </p>

      {/* Order Ticket Card */}
      <div className="order-ticket shadow-sm">
        <div>
          <span>Order Reference</span>
          <b>{orderNumber}</b>
        </div>
        <div>
          <span>Store</span>
          <b className="flex items-center gap-1.5 text-sm">
            <Store size={15} className="text-orange-600" /> {storeName}
          </b>
        </div>
        <div>
          <span>Total Amount</span>
          <b>{money(totalAmount)}</b>
        </div>
      </div>

      {/* Live Order Timeline */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-left my-8">
        <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-4">
          Live Fulfillment Status
        </span>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-sm mb-2">
              <Check size={18} />
            </div>
            <b className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Order Placed
            </b>
            <small className="text-[11px] text-slate-500">Confirmed</small>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center font-bold text-sm mb-2 animate-pulse">
              <Package size={18} />
            </div>
            <b className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Packing
            </b>
            <small className="text-[11px] text-slate-500">At store</small>
          </div>

          <div className="flex flex-col items-center opacity-60">
            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 flex items-center justify-center font-bold text-sm mb-2">
              <Truck size={18} />
            </div>
            <b className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Delivery
            </b>
            <small className="text-[11px] text-slate-500">To your door</small>
          </div>
        </div>

        {deliveryAddress && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 text-xs text-slate-500">
            <MapPin size={14} className="text-orange-600 flex-shrink-0" />
            <span>
              Delivering to: <b>{deliveryAddress}</b>
            </span>
          </div>
        )}
      </div>

      {/* Action CTA Buttons */}
      <div className="hero-actions centered">
        <Link className="btn btn-dark" to="/customer">
          <ClipboardList size={16} /> Track in Customer Portal
        </Link>
        <Link className="btn btn-outline" to="/products">
          Continue Exploring <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
};
