"use client";

import React from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/core/i18n/translations";
import { ArrowRight, Flame, Shield, Star, Trophy, Zap } from "lucide-react";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { CRO_FLAGS } from "@/config/flags";
import { trackEvent } from "@/core/utils/analytics";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "en-gb";
  const t = useTranslations(locale);

  useEffect(() => {
    trackEvent("landing_view", { locale });
  }, [locale]);

  const handleStartQuiz = () => {
    trackEvent("quiz_started", { locale });
    router.push(`/${locale}/quiz`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-between selection:bg-brand-lime selection:text-zinc-950">
      {/* Header */}
      <header className="w-full py-6 px-6 flex items-center justify-between border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-1.5 select-none">
          <span className="font-heading font-extrabold text-base md:text-lg tracking-wider text-zinc-50">
            THE <span className="text-brand-lime">TREADMILL</span> METHOD
          </span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button
            onClick={handleStartQuiz}
            variant="outline"
            className="border-zinc-800 text-zinc-300 hover:text-brand-lime hover:border-brand-lime text-xs font-bold py-4 px-4 rounded-xl cursor-pointer"
          >
            {t.common.startQuiz}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center">
        <div className="max-w-5xl mx-auto px-6 py-8 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center w-full">
          {/* Coluna de Texto */}
          <div className="md:col-span-7 flex flex-col gap-5 text-left order-2 md:order-1">
            <div className="inline-flex items-center gap-2 bg-brand-lime/10 border border-brand-lime/20 px-3 py-1 rounded-full w-fit">
              <Trophy className="w-3.5 h-3.5 text-brand-lime" />
              <span className="text-[10px] font-heading font-black text-brand-lime uppercase tracking-wider">
                {t.landing.badge}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight leading-[1.1] uppercase text-zinc-50">
              {t.landing.titleFirstPart} <br className="hidden md:inline" />
              <span className="text-brand-lime">{t.landing.titleLime}</span>
              {t.landing.titleAnd}
              <span className="text-brand-teal">{t.landing.titleTeal}</span>
            </h1>

            {/* Imagem Mobile (Apenas em dispositivos móveis) */}
            <div className="md:hidden w-full aspect-[16/10] relative rounded-2xl overflow-hidden border border-zinc-900">
              <Image
                src="/assets/characters/sarah/after/sarah-after.png"
                alt={t.landing.titleFirstPart}
                fill
                sizes="(max-width: 768px) 100vw"
                priority
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
            </div>

            <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-xl">
              {t.landing.subtitle}
            </p>

            {/* Vantagens */}
            <div className="flex flex-col gap-3 text-xs text-zinc-400">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-lime/10 flex items-center justify-center text-brand-lime shrink-0">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <span>{t.landing.benefit1}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <span>{t.landing.benefit2}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-lime/10 flex items-center justify-center text-brand-lime shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span>{t.landing.benefit3}</span>
              </div>
            </div>

            <div className="mt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                onClick={handleStartQuiz}
                className="bg-brand-lime text-zinc-950 hover:bg-brand-lime-hover font-heading font-bold text-sm tracking-wide py-7 px-8 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-lime-400/10"
              >
                {t.landing.cta}
                <ArrowRight className="w-4 h-4" />
              </Button>
              {CRO_FLAGS.landingDurationHint && (
                <span className="text-[10px] text-zinc-500 font-semibold tracking-wide text-center sm:text-left">
                  {locale === "pt-br" ? "⏱ Leva ~2 minutos" : "⏱ Takes ~2 minutes"}
                </span>
              )}
            </div>

            {/* Validação Social Rápida */}
            <div className="flex items-center gap-4 mt-2 border-t border-zinc-900 pt-6">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-950 flex items-center justify-center text-[9px] font-bold">R</div>
                <div className="w-7 h-7 rounded-full bg-zinc-700 border border-zinc-950 flex items-center justify-center text-[9px] font-bold">T</div>
                <div className="w-7 h-7 rounded-full bg-zinc-600 border border-zinc-950 flex items-center justify-center text-[9px] font-bold">M</div>
              </div>
              <div className="text-left leading-tight">
                <div className="flex gap-0.5 items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-[10px] font-bold text-zinc-200 ml-1">{t.landing.rating}</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                  {t.landing.activeUsers}
                </span>
              </div>
            </div>
          </div>

          {/* Coluna Decorativa / Mockup e Imagem Desktop */}
          <div className="md:col-span-5 hidden md:flex flex-col gap-6 justify-center order-1 md:order-2">
            <div className="w-full aspect-[4/3] relative rounded-3xl overflow-hidden border border-zinc-900 shadow-2xl">
              <Image
                src="/assets/characters/sarah/after/sarah-after.png"
                alt={t.landing.titleFirstPart}
                fill
                sizes="(min-width: 768px) 33vw"
                priority
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/0 to-transparent" />
            </div>

            {/* Widget de Treino Flutuante */}
            <div className="w-full bg-zinc-900/40 border border-zinc-900 p-5 rounded-3xl relative overflow-hidden shadow-xl flex flex-col gap-4">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-lime/5 rounded-full blur-2xl pointer-events-none" />
              
              {/* Card Header */}
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-brand-lime tracking-widest font-heading uppercase bg-brand-lime/10 px-2 py-0.5 rounded">
                  {t.landing.workoutOfTheDay}
                </span>
                <span className="text-[9px] text-zinc-500 font-bold">{t.landing.treadmillHiit}</span>
              </div>

              {/* Title Workout */}
              <div>
                <h3 className="text-sm font-heading font-extrabold text-zinc-100 uppercase">
                  {t.landing.workoutTitle}
                </h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">{t.landing.duration}</p>
              </div>

              {/* Workout Interval Steps representation */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-900/60">
                  <span className="text-[9px] font-bold text-zinc-400">{t.landing.stepWarmup}</span>
                  <span className="text-[10px] font-black text-zinc-200">Vel: 4.2 | Inc: 0%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-900/60">
                  <span className="text-[9px] font-bold text-zinc-400">{t.landing.stepFirme}</span>
                  <span className="text-[10px] font-black text-brand-lime">Vel: 5.0 | Inc: 4%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-900/60">
                  <span className="text-[9px] font-bold text-zinc-400">{t.landing.stepPico}</span>
                  <span className="text-[10px] font-black text-brand-lime">Vel: 5.5 | Inc: 7%</span>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[9px] font-bold text-zinc-500">
                  <span>{t.landing.cardioEffort}</span>
                  <span>{t.landing.fcMax}</span>
                </div>
                <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-teal to-brand-lime w-[78%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-[10px] text-zinc-600">
          © 2026 The Treadmill Method. All rights reserved.
        </span>
        <div className="flex gap-4 text-[10px] text-zinc-500 font-semibold tracking-wider uppercase">
          <a href="#" className="hover:text-brand-lime transition-colors">{t.common.terms}</a>
          <span>•</span>
          <a href="#" className="hover:text-brand-lime transition-colors">{t.common.privacy}</a>
          <span>•</span>
          <a href="#" className="hover:text-brand-lime transition-colors">{t.common.support}</a>
        </div>
      </footer>
    </div>
  );
}
