"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Sparkles, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ModalVariant = "default" | "success" | "error" | "danger";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
  hideCloseButton?: boolean;
  variant?: ModalVariant;
}

const variantStyles: Record<
  ModalVariant,
  {
    glow: string;
    iconWrap: string;
    icon: React.ReactNode;
    accent: string;
  }
> = {
  default: {
    glow: "from-brand-500/25 via-emerald-400/15 to-cyan-400/10",
    iconWrap: "bg-brand-50 text-brand-600 ring-brand-100 dark:bg-brand-950/70 dark:text-brand-300 dark:ring-brand-900/60",
    icon: <Sparkles className="h-5 w-5" />,
    accent: "from-brand-500 via-emerald-400 to-cyan-400",
  },
  success: {
    glow: "from-emerald-400/30 via-brand-400/15 to-teal-300/10",
    iconWrap: "bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-950/70 dark:text-emerald-300 dark:ring-emerald-900/60",
    icon: <CheckCircle2 className="h-5 w-5" />,
    accent: "from-emerald-500 via-brand-400 to-teal-400",
  },
  error: {
    glow: "from-amber-400/25 via-orange-400/15 to-rose-400/10",
    iconWrap: "bg-amber-50 text-amber-600 ring-amber-100 dark:bg-amber-950/70 dark:text-amber-300 dark:ring-amber-900/60",
    icon: <AlertTriangle className="h-5 w-5" />,
    accent: "from-amber-500 via-orange-400 to-rose-400",
  },
  danger: {
    glow: "from-rose-500/30 via-pink-400/15 to-orange-300/10",
    iconWrap: "bg-rose-50 text-rose-600 ring-rose-100 dark:bg-rose-950/70 dark:text-rose-300 dark:ring-rose-900/60",
    icon: <Trash2 className="h-5 w-5" />,
    accent: "from-rose-500 via-pink-400 to-orange-400",
  },
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  className,
  hideCloseButton = false,
  variant = "default",
}: ModalProps) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (open) {
      setMounted(true);
      if (reducedMotion) {
        setVisible(true);
        return;
      }
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    if (reducedMotion) {
      setMounted(false);
      return;
    }
    const timeout = window.setTimeout(() => setMounted(false), 280);
    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
  };

  const look = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className={cn(
          "absolute inset-0 bg-slate-950/60 backdrop-blur-xl transition-opacity duration-300 ease-out",
          visible ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full overflow-hidden rounded-[32px] border border-white/70 bg-white/85 shadow-[0_40px_140px_-24px_rgba(15,23,42,0.55)] backdrop-blur-2xl transition-all duration-300 ease-out dark:border-slate-700/70 dark:bg-slate-900/85",
          sizeClasses[size],
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-[0.96] opacity-0",
          className
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={cn("absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r", look.accent)} />
        <div className={cn("absolute -top-10 left-1/2 h-32 w-64 -translate-x-1/2 bg-gradient-to-r blur-3xl", look.glow)} />

        <div className="relative p-6 sm:p-8">
          {!hideCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-500 transition hover:border-slate-300 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:text-white"
              aria-label="Fermer la modale"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {(title || description) && (
            <div className="mb-6 pr-10">
              <div className={cn("mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1", look.iconWrap)}>
                {look.icon}
              </div>
              {title && (
                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {description}
                </p>
              )}
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
