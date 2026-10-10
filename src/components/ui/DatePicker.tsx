"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, className }) => {
  const [viewDate, setViewDate] = useState(new Date(value.getFullYear(), value.getMonth(), 1));

  useEffect(() => {
    setViewDate(new Date(value.getFullYear(), value.getMonth(), 1));
  }, [value]);

  const daysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    onChange(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
  };

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
  ];

  const weekdayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  const totalDays = daysInMonth(currentYear, currentMonth);
  const startOffset = firstDayOfMonth(currentYear, currentMonth);

  return (
    <div
      className={cn(
        "w-[340px] max-w-full rounded-[24px] border border-emerald-200/80 bg-white/75 p-4 shadow-[0_18px_40px_rgba(16,185,129,0.12)] backdrop-blur-xl animate-[fadeIn_0.22s_ease-out]",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between px-1">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-full text-emerald-700 transition-all duration-200 hover:-translate-x-0.5 hover:bg-emerald-100 hover:text-emerald-800 active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-bold tracking-[-0.02em] text-emerald-900">
          {monthNames[currentMonth]} {currentYear}
        </h3>

        <button
          type="button"
          onClick={handleNextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-full text-emerald-700 transition-all duration-200 hover:translate-x-0.5 hover:bg-emerald-100 hover:text-emerald-800 active:scale-95"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-x-1 gap-y-2 text-center">
        {weekdayNames.map((day) => (
          <div key={day} className="text-xs font-semibold text-emerald-700/80">{day}</div>
        ))}

        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="h-9" />
        ))}

        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1;
          const date = new Date(currentYear, currentMonth, day);
          const isSelected = date.toDateString() === value.toDateString();
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDateClick(day)}
              className={cn(
                "flex h-9 w-9 mx-auto items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ease-out transform-gpu hover:-translate-y-0.5 hover:scale-110 active:scale-95",
                isSelected
                  ? "scale-110 bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-[0_6px_14px_rgba(16,185,129,0.38)] ring-2 ring-emerald-100"
                  : "text-emerald-900 hover:bg-emerald-100 hover:text-emerald-700",
                isToday && !isSelected && "border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};
