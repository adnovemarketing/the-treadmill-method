'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import {
  Home,
  FileText,
  Calendar,
  Activity,
  Compass,
  BookOpen,
  ArrowRightCircle,
  User,
  Menu,
  X,
} from 'lucide-react';

interface MemberNavProps {
  locale: string;
}

export function MemberNav({ locale }: MemberNavProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isPtBr = locale.toLowerCase() === 'pt-br';

  const navItems = [
    { href: `/${locale}/app`, label: isPtBr ? 'Início' : 'Home', icon: Home },
    { href: `/${locale}/app/plan`, label: isPtBr ? 'Meu Plano' : 'My Plan', icon: FileText },
    { href: `/${locale}/app/journey`, label: isPtBr ? 'Jornada 21 Dias' : '21-Day Journey', icon: Calendar },
    { href: `/${locale}/app/progress`, label: isPtBr ? 'Progresso' : 'Progress', icon: Activity },
    { href: `/${locale}/app/strategy`, label: isPtBr ? 'Estratégia' : 'My Strategy', icon: Compass },
    { href: `/${locale}/app/resources`, label: isPtBr ? 'Recursos' : 'Resources', icon: BookOpen },
    { href: `/${locale}/app/next`, label: isPtBr ? 'Após 21 Dias' : 'After Day 21', icon: ArrowRightCircle },
    { href: `/${locale}/app/account`, label: isPtBr ? 'Conta' : 'Account', icon: User },
  ];

  return (
    <header className="w-full bg-zinc-950/90 border-b border-zinc-900 sticky top-0 z-50 backdrop-blur selection:bg-brand-lime selection:text-zinc-950">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href={`/${locale}/app`}
          className="flex items-center gap-1.5 select-none text-zinc-50 hover:opacity-90 transition-opacity"
        >
          <span className="font-heading font-extrabold text-base md:text-lg tracking-wider">
            THE <span className="text-brand-lime">TREADMILL</span> METHOD
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-brand-lime/10 text-brand-lime border border-brand-lime/30'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side: Language Switcher & Mobile Menu Button */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-900 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X className="w-5 h-5 text-brand-lime" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-zinc-900 px-4 py-4 flex flex-col gap-1 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-xl text-xs font-heading font-bold flex items-center gap-3 transition-all ${
                  isActive
                    ? 'bg-brand-lime/10 text-brand-lime border border-brand-lime/30'
                    : 'text-zinc-300 hover:bg-zinc-900/60'
                }`}
              >
                <Icon className="w-4 h-4 text-brand-lime shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
