import React from "react";
import { cn } from "@/lib/utils";
import { InvoiceStatus } from "@/lib/types";

interface BadgeProps {
  status: InvoiceStatus | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className }) => {
  let styles = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

  if (status === "Payée" || status === "Payé") {
    styles = "bg-[#D1FADF] text-[#027A48] dark:bg-emerald-950/80 dark:text-emerald-300";
  } else if (status === "Envoyée" || status === "En attente" || status === "Pending") {
    styles = "bg-[#E0F2FE] text-[#0284C7] dark:bg-sky-950/80 dark:text-sky-300";
  } else if (status === "Impayée" || status === "Unpaid" || status === "En retard") {
    styles = "bg-[#FEE4E2] text-[#D92D20] dark:bg-rose-950/80 dark:text-rose-300";
  } else if (status === "Brouillon") {
    styles = "bg-[#F3F4F6] text-[#475467] dark:bg-slate-700 dark:text-slate-200";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold tracking-tight select-none",
        styles,
        className
      )}
    >
      {status}
    </span>
  );
};
