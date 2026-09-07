import React, { createContext, useContext, useEffect, useState } from "react";
import { Order } from "../types";
import { readStoredOrders } from "../data/mockData";

type OrderContextType = {
  orders: Order[];
  lastOrder: Order | null;
  addOrder: (order: Order) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>(readStoredOrders);
  const [lastOrder, setLastOrder] = useState<Order | null>(() => {
    try {
      const stored = localStorage.getItem("localcart-last-order");
      return stored ? (JSON.parse(stored) as Order) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("localcart-orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setLastOrder(order);
    localStorage.setItem("localcart-last-order", JSON.stringify(order));
  };

  return (
    <OrderContext.Provider value={{ orders, lastOrder, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
