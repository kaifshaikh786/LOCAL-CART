import React, { createContext, useContext, useEffect, useState } from "react";
import { CreateOrderDto, Order, mapBackendOrderToFrontend } from "../types";
import { readStoredOrders } from "../data/mockData";
import { orderApi } from "../services/orderApi";

type OrderContextType = {
  orders: Order[];
  lastOrder: Order | null;
  bookOrder: (dto: CreateOrderDto) => Promise<Order>;
  lookupOrder: (orderNumber: string) => Promise<Order>;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  syncOrders: () => Promise<void>;
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

  // Sync stored orders with the live backend database on startup
  const syncOrders = async () => {
    const currentOrders = readStoredOrders();
    if (!currentOrders || currentOrders.length === 0) return;

    try {
      const refreshed = await Promise.all(
        currentOrders.map(async (ord) => {
          try {
            const backendOrder = await orderApi.lookupOrder(ord.orderNumber);
            return mapBackendOrderToFrontend(backendOrder);
          } catch {
            return ord;
          }
        }),
      );
      setOrders(refreshed);
      localStorage.setItem("localcart-orders", JSON.stringify(refreshed));
    } catch (err) {
      console.warn("Could not sync orders with backend:", err);
    }
  };

  useEffect(() => {
    syncOrders();
  }, []);

  const bookOrder = async (dto: CreateOrderDto): Promise<Order> => {
    try {
      const backendOrder = await orderApi.bookOrder(dto);
      const mapped = mapBackendOrderToFrontend(backendOrder);
      setOrders((prev) => [mapped, ...prev]);
      setLastOrder(mapped);
      localStorage.setItem("localcart-last-order", JSON.stringify(mapped));
      return mapped;
    } catch (err) {
      console.warn("Backend order booking failed, trying local fallback:", err);
      throw err;
    }
  };

  const lookupOrder = async (orderNumber: string): Promise<Order> => {
    try {
      const backendOrder = await orderApi.lookupOrder(orderNumber);
      const mapped = mapBackendOrderToFrontend(backendOrder);
      setLastOrder(mapped);
      localStorage.setItem("localcart-last-order", JSON.stringify(mapped));
      // Also link to user's orders history so it reflects in their customer dashboard
      setOrders((prev) => {
        const exists = prev.some(
          (o) =>
            o.orderNumber.toLowerCase() === mapped.orderNumber.toLowerCase(),
        );
        const updated = exists
          ? prev.map((o) =>
              o.orderNumber.toLowerCase() === mapped.orderNumber.toLowerCase()
                ? mapped
                : o,
            )
          : [mapped, ...prev];
        localStorage.setItem("localcart-orders", JSON.stringify(updated));
        return updated;
      });
      return mapped;
    } catch (err) {
      // Return local match if exists
      const local = orders.find(
        (o) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase(),
      );
      if (local) return local;
      throw err;
    }
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setLastOrder(order);
    localStorage.setItem("localcart-last-order", JSON.stringify(order));
  };

  const updateOrder = (order: Order) => {
    setOrders((prev) => {
      const exists = prev.some((o) => o.orderNumber === order.orderNumber);
      const updated = exists
        ? prev.map((o) => (o.orderNumber === order.orderNumber ? order : o))
        : [order, ...prev];
      localStorage.setItem("localcart-orders", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        lastOrder,
        bookOrder,
        lookupOrder,
        addOrder,
        updateOrder,
        syncOrders,
      }}
    >
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
