import React from "react";
import { Check } from "lucide-react";

type ToastProps = {
  message: string;
};

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      <Check size={17} /> {message}
    </div>
  );
};
