"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  emoji?: string;
  image?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  multiSelect?: boolean;
}

export function OptionCard({
  title,
  description,
  icon,
  emoji,
  image,
  selected,
  onClick,
  multiSelect = false,
}: OptionCardProps) {
  return (
     <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full text-left rounded-2xl border bg-zinc-900/60 backdrop-blur-sm select-none transition-all cursor-pointer flex min-w-0",
        image ? "flex-col items-stretch p-0 overflow-hidden" : "items-center justify-between p-4 sm:p-4.5 gap-3.5",
        selected
          ? "border-brand-lime bg-zinc-900 shadow-lg shadow-lime-500/10"
          : "border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/30"
      )}
    >
      {image && (
        <div className="w-full aspect-[16/10] relative bg-zinc-950/60 overflow-hidden border-b border-zinc-800/60 flex items-center justify-center shrink-0">
          {image}
        </div>
      )}

      <div className={cn("flex items-center justify-between gap-3.5 flex-1 min-w-0", image ? "p-4 md:p-5" : "")}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Ícone ou Emoji */}
          {icon && (
            <div
              className={cn(
                "w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors shrink-0",
                selected
                  ? "bg-brand-lime/10 text-brand-lime"
                  : "bg-zinc-950 text-zinc-400"
              )}
            >
              {icon}
            </div>
          )}

          {emoji && (
            <div className="text-lg sm:text-xl w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-zinc-950 rounded-xl select-none shrink-0 border border-zinc-900">
              {emoji}
            </div>
          )}

          {/* Texto do Card */}
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "text-[13px] sm:text-sm font-semibold transition-colors leading-snug whitespace-normal break-words",
                selected ? "text-brand-lime" : "text-zinc-100"
              )}
            >
              {title}
            </h3>
            {description && (
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 font-medium leading-normal break-words">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Caixa de seleção/Status Check */}
        <div className="flex items-center justify-center shrink-0">
          {multiSelect ? (
            <div
              className={cn(
                "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                selected
                  ? "bg-brand-lime border-brand-lime text-zinc-950"
                  : "border-zinc-700 bg-zinc-950"
              )}
            >
              {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          ) : (
            <div
              className={cn(
                "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                selected
                  ? "border-brand-lime"
                  : "border-zinc-700 bg-zinc-950"
              )}
            >
              {selected && (
                <div className="w-2.5 h-2.5 rounded-full bg-brand-lime" />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}
