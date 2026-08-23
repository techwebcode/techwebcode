"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Minimize2 } from "lucide-react";

interface FullScreenWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  badge?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function FullScreenWorkspace({
  isOpen,
  onClose,
  title,
  badge = "Full Screen Workspace",
  actions,
  children,
}: FullScreenWorkspaceProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Body Scroll Locking & Position Restoration upon Enter/Exit
  useEffect(() => {
    if (!isOpen) return;

    const savedScrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.scrollTo({ top: savedScrollY, behavior: "instant" });
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[999999] w-screen h-[100dvh] bg-slate-950 text-slate-100 flex flex-col overflow-hidden select-text border-0 m-0 p-0 shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Full Screen Workspace"}
    >
      {/* Viewport-Level Workspace Header */}
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-900/90 shrink-0 select-none">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-100 truncate">
            {title}
          </span>
          {badge && (
            <span className="hidden sm:inline-flex text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
              {badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {actions}

          <kbd className="hidden md:inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400">
            ESC to exit
          </kbd>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 px-3 text-xs font-bold gap-1.5 rounded-xl border-rose-900/60 text-rose-400 bg-rose-950/20 hover:bg-rose-950/50 hover:text-rose-300 focus-visible:ring-2 focus-visible:ring-primary"
            title="Exit Workspace (Esc)"
            aria-label="Exit workspace mode"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit Workspace</span>
          </Button>
        </div>
      </div>

      {/* Dynamic Viewport Workspace Content Container */}
      <div className="flex-1 min-h-0 w-full overflow-y-auto flex flex-col p-3 sm:p-5 bg-slate-950 text-slate-100">
        {children}
      </div>
    </div>,
    document.body
  );
}
