"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Calendar, Plus, Menu } from "lucide-react";
import { Button } from "@/lib/../components/ui/Button";
import { MonthPicker } from "@/components/ui/MonthPicker";
import { LogOut } from "lucide-react";
import { logout } from "@/app/login/actions";

interface TopbarProps {
  title?: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  title = "Vue d'ensemble",
  subtitle = "Bienvenue sur votre espace de facturation en FCFA",
  onOpenMobileMenu,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 1, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    }
    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDatePicker]);

  const formatMonthLabel = (date: Date) =>
    date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });

  return (
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md bg-white/90 dark:bg-slate-900/90">
      
      {/* Title / Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Center Search + Actions */}
      <div className="flex items-center gap-3">
        {/* Search with ⌘K */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher client, facture..."
            className="w-full pl-9 pr-10 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 text-[10px] font-mono text-slate-400 border border-slate-200 dark:border-slate-600 shadow-2xs">
            ⌘K
          </span>
        </div>

        {/* Date Filter Pill */}
        <div className="relative hidden sm:block" ref={datePickerRef}>
          <button
            type="button"
            onClick={() => setShowDatePicker((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-200/80 bg-white/70 backdrop-blur-md text-xs font-semibold text-emerald-900 shadow-[0_10px_25px_rgba(16,185,129,0.10)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-[0_14px_30px_rgba(16,185,129,0.18)]"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>{formatMonthLabel(selectedDate)}</span>
          </button>

          {showDatePicker && (
            <div className="absolute right-0 z-50 mt-2">
              <MonthPicker
                value={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setShowDatePicker(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Create Invoice Primary Action */}
        <Link href="/invoices/new">
          <Button size="sm" className="hidden sm:inline-flex">
            <Plus className="w-4 h-4" />
            <span>Nouvelle Facture</span>
          </Button>
        </Link>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white dark:ring-slate-800 shadow">
            AD
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              Mon Profil
            </p>
            <form action={logout}>
              <button type="submit" className="text-[10px] text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1 mt-0.5 transition-colors">
                <LogOut className="w-3 h-3" />
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </div>

    </header>
  );
};
