"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  flag?: string; // URL du drapeau pour la variante 'country'
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  variant?: 'default' | 'country' | 'category';
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Sélectionner",
  className,
  variant = 'default',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative inline-block text-left", className)} ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 text-xs font-semibold transition-all duration-200 rounded-xl border shadow-sm",
          "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200",
          "border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-400",
          "focus:outline-none focus:ring-2 focus:ring-brand-500/20",
          isOpen && "border-brand-500 dark:border-brand-400 ring-2 ring-brand-500/20"
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.flag && (
            <img src={selectedOption.flag} alt="" className="w-4 h-3 object-cover rounded-sm" />
          )}
          {selectedOption?.icon && <span className="flex-shrink-0">{selectedOption.icon}</span>}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={cn(
          "w-3.5 h-3.5 text-slate-400 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className={cn(
          "absolute z-50 w-full mt-2 p-1.5 overflow-hidden bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200",
          "max-h-60 overflow-y-auto"
        )}>
          <div className="space-y-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2 text-xs font-medium rounded-lg transition-all duration-150 group",
                  value === option.value
                    ? "bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-brand-50/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white hover:translate-x-1"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  {option.flag && (
                    <img src={option.flag} alt="" className="w-4 h-3 object-cover rounded-sm" />
                  )}
                  {option.icon && <span className="flex-shrink-0 group-hover:scale-110 transition-transform duration-150">{option.icon}</span>}
                  <span className="truncate">{option.label}</span>
                </div>
                {value === option.value && (
                  <Check className="w-3 h-3 flex-shrink-0 text-brand-600 dark:text-brand-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
