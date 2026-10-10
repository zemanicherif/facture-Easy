"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthPickerProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
}

export const MonthPicker: React.FC<MonthPickerProps> = ({ value, onChange, className }) => {
  const [viewYear, setViewYear] = useState(value.getFullYear());

  useEffect(() => {
    setViewYear(value.getFullYear());
  }, [value]);

  const handlePrevYear = () => {
    setViewYear(viewYear - 1);
  };

  const handleNextYear = () => {
    setViewYear(viewYear + 1);
  };

  const handleMonthClick = (monthIndex: number) => {
    onChange(new Date(viewYear, monthIndex, 1));
  };

  const shortMonthNames = [
    "Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin",
    "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."
  ];

  const currentMonthIndex = value.getMonth();
  const currentSelectedYear = value.getFullYear();

  return (
    <div
      className={cn(
        "w-[340px] max-w-full rounded-[30px] border border-emerald-200/80 bg-white/75 p-6 shadow-[0_18px_40px_rgba(16,185,129,0.12)] backdrop-blur-xl animate-[fadeIn_0.22s_ease-out]",
        className
      )}
    >
      <div className="mb-6 flex items-center justify-between px-2">
        <button
          type="button"
          onClick={handlePrevYear}
          className="flex h-10 w-10 items-center justify-center rounded-full text-emerald-700 transition-all duration-200 hover:-translate-x-0.5 hover:bg-emerald-100 hover:text-emerald-800 active:scale-95"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <h3 className="text-2xl font-black tracking-[-0.04em] text-emerald-900">
          {viewYear}
        </h3>

        <button
          type="button"
          onClick={handleNextYear}
          className="flex h-10 w-10 items-center justify-center rounded-full text-emerald-700 transition-all duration-200 hover:translate-x-0.5 hover:bg-emerald-100 hover:text-emerald-800 active:scale-95"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-x-2 gap-y-3 text-center">
        {shortMonthNames.map((month, idx) => {
          const isSelected = idx === currentMonthIndex && viewYear === currentSelectedYear;
          const isCurrentMonth = idx === new Date().getMonth() && viewYear === new Date().getFullYear();

          return (
            <button
              key={month}
              type="button"
              onClick={() => handleMonthClick(idx)}
              className={cn(
                "flex h-12 items-center justify-center rounded-xl text-base font-semibold transition-all duration-200 ease-out transform-gpu hover:-translate-y-0.5 hover:scale-105 active:scale-95",
                isSelected
                  ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-[0_8px_16px_rgba(16,185,129,0.38)] ring-2 ring-emerald-100"
                  : "text-emerald-900 hover:bg-emerald-100 hover:text-emerald-700",
                isCurrentMonth && !isSelected && "border-2 border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_2px_8px_rgba(16,185,129,0.10)]"
              )}
            >
              {month}
            </button>
          );
        })}
      </div>
    </div>
  );
};