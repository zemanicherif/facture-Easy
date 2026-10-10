"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  BarChart3,
  Package,
  ShoppingCart,
  CreditCard,
  Receipt,
  Users,
  Bell,
  Settings,
  Moon,
  Sun,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, onNavigate }) => {
  const pathname = usePathname();
  const [isDark, setIsDark] = React.useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const menuGroups = [
    {
      title: "Menu Principal",
      items: [
        { name: "Vue d'ensemble", href: "/dashboard", icon: LayoutGrid },
        { name: "Analytiques", href: "/dashboard/analytics", icon: BarChart3, badge: "Bientôt" },
        { name: "Articles & Tarifs", href: "/dashboard/products", icon: Package },
        { name: "Ventes", href: "/dashboard/sales", icon: ShoppingCart },
      ],
    },
    {
      title: "Facturation",
      items: [
        { name: "Paiements", href: "/dashboard/payments", icon: CreditCard },
        { name: "Factures", href: "/invoices", icon: Receipt },
        { name: "Clients", href: "/clients", icon: Users },
      ],
    },
    {
      title: "Général",
      items: [
        { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
        { name: "Paramètres", href: "/settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between p-5 min-h-screen select-none",
        className
      )}
    >
      <div>
        {/* Brand Logo Header */}
        <Link href="/dashboard" className="flex items-center gap-3 px-2 mb-8 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-black text-lg shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight leading-tight">
              Facture&apos;<span className="text-brand-500">Easy</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Vos factures en quelques clics.
            </span>
          </div>
        </Link>

        {/* Navigation Groups */}
        <div className="space-y-6">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 px-3">
                {group.title}
              </p>
              <ul className="space-y-1">
                {group.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));

                  return (
                    <li key={itemIdx}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                          "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150",
                          isActive
                            ? "bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={cn(
                              "w-4 h-4",
                              isActive
                                ? "text-brand-600 dark:text-brand-400"
                                : "text-slate-400 dark:text-slate-500"
                            )}
                          />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Footer (Compliance & Theme Switch) */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-brand-500 flex-shrink-0" />
          <span className="truncate">Zone FCFA / TVA 18%</span>
        </div>

        <div className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            {isDark ? <Moon className="w-4 h-4 text-brand-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>Mode Sombre</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={cn(
              "w-9 h-5 rounded-full p-0.5 flex items-center transition-colors duration-200 cursor-pointer",
              isDark ? "bg-brand-500 justify-end" : "bg-slate-200 dark:bg-slate-700 justify-start"
            )}
            aria-label="Changer de thème"
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </button>
        </div>
      </div>
    </aside>
  );
};
