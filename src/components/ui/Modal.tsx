import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
  hideCloseButton?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  className,
  hideCloseButton = false,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-xl"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full overflow-hidden rounded-[28px] border border-white/60 bg-white/80 shadow-[0_30px_120px_-20px_rgba(15,23,42,0.45)] backdrop-blur-2xl dark:border-slate-700/70 dark:bg-slate-900/80",
          sizeClasses[size],
          className
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute inset-x-8 top-0 h-24 bg-gradient-to-r from-brand-500/20 via-emerald-400/15 to-cyan-400/10 blur-3xl" />

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
