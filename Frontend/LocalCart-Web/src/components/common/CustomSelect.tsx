import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type CustomSelectOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

type CustomSelectProps = {
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  ariaLabel?: string;
  placeholder?: string;
  className?: string;
};

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  icon,
  ariaLabel = "Select option",
  placeholder = "Select...",
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    if (open) {
      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left select-none ${className}`}
      style={{ minWidth: "150px" }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="flex items-center justify-between gap-2 px-3 py-1.5 border text-xs font-semibold rounded-full transition-all duration-150 cursor-pointer w-full"
        style={{
          borderColor: open ? "var(--rust)" : "var(--line)",
          background: "var(--paper)",
          color: "var(--ink)",
          boxShadow: open ? "0 0 0 2px rgba(212, 98, 42, 0.15)" : "none",
        }}
      >
        <span className="flex items-center gap-1.5 truncate">
          {icon && <span style={{ color: "var(--rust)" }}>{icon}</span>}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown
          size={13}
          className="shrink-0 transition-transform duration-200"
          style={{
            color: "var(--muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Dropdown Menu Popover */}
      {open && (
        <div
          role="listbox"
          className="custom-scroll absolute right-0 mt-1.5 py-1.5 z-50 overflow-auto border shadow-xl animate-fadeIn"
          style={{
            background: "var(--paper)",
            borderColor: "var(--line)",
            borderRadius: "16px",
            boxShadow: "0 14px 38px rgba(0, 0, 0, 0.12)",
            minWidth: "180px",
            maxHeight: "260px",
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-left font-medium transition-colors cursor-pointer"
                style={{
                  color: isSelected ? "var(--rust)" : "var(--ink)",
                  background: isSelected
                    ? "var(--rust-light)"
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "var(--cream)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <span className="flex items-center gap-2 truncate">
                  {opt.icon && <span>{opt.icon}</span>}
                  <span className={isSelected ? "font-bold" : ""}>
                    {opt.label}
                  </span>
                </span>
                {isSelected && (
                  <Check
                    size={14}
                    className="shrink-0 ml-2"
                    style={{ color: "var(--rust)" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
