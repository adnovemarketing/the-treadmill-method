import React from "react";

export function Header() {
  return (
    <header className="w-full py-6 px-6 flex items-center justify-between border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
      <div className="flex items-center gap-1.5 select-none">
        <span className="font-heading font-extrabold text-lg md:text-xl tracking-wider text-zinc-50">
          THE <span className="text-brand-lime">TREADMILL</span> METHOD
        </span>
      </div>
    </header>
  );
}
