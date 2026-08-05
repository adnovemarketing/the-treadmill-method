"use client";

import React from "react";
import Image from "next/image";
import { useQuizStore } from "@/core/store/quizStore";
import { QuizStep } from "@/core/types/quiz";
import { OptionCard } from "../OptionCard";
import { useTranslations } from "@/core/i18n/translations";
import { useLocale } from "@/core/i18n/useLocale";
import { TrendingUp } from "lucide-react";
import { VISUAL_ASSETS } from "@/config/visualAssets";

interface StepProps {
  onNext: (nextStep: QuizStep) => void;
}

export function StepInclineProfile({ onNext }: StepProps) {
  const { data, updateData } = useQuizStore();
  const locale = useLocale();
  const t = useTranslations(locale);

  const handleSelect = (hasIncline: boolean) => {
    updateData({ hasInclineAccess: hasIncline });
    onNext("injury-triage");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
      {/* Coluna Esquerda: Texto e Opções */}
      <div className="md:col-span-7 flex flex-col gap-5">
        <div className="text-left md:text-left">
          <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full">
            {t.quiz.steps.inclineProfile.badge}
          </span>
          <h2 className="text-xl md:text-2xl font-heading font-extrabold text-zinc-50 mt-3 leading-tight uppercase">
            {t.quiz.steps.inclineProfile.title}
          </h2>
          <p className="text-xs text-zinc-400 mt-2">
            {t.quiz.steps.inclineProfile.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-1">
          <OptionCard
            title={t.quiz.steps.inclineProfile.yes.label}
            description={t.quiz.steps.inclineProfile.yes.desc}
            icon={<TrendingUp className="w-5 h-5 text-brand-lime" />}
            selected={data.hasInclineAccess === true}
            onClick={() => handleSelect(true)}
          />
          <OptionCard
            title={t.quiz.steps.inclineProfile.no.label}
            description={t.quiz.steps.inclineProfile.no.desc}
            icon={<TrendingUp className="w-5 h-5 rotate-90 text-zinc-600" />}
            selected={data.hasInclineAccess === false}
            onClick={() => handleSelect(false)}
          />
        </div>
      </div>

      {/* Coluna Direita: Ilustração de Inclinação (Layout D) */}
      <div className="md:col-span-5 hidden md:flex flex-col justify-end p-6 bg-zinc-950/40 rounded-2xl border border-zinc-900/60 aspect-square relative overflow-hidden group select-none">
        <Image
          src={VISUAL_ASSETS.treadmill.inclineWalking}
          alt={locale === "pt-br" ? "Queima até 60% mais calorias" : "Burns up to 60% more calories"}
          fill
          sizes="33vw"
          className="object-contain object-bottom transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        <div className="relative z-10 flex flex-col gap-1">
          <span className="text-[10px] font-heading font-black text-brand-lime uppercase tracking-widest">
            {locale === "pt-br" ? "MÉTODO DE INCLINAÇÃO" : "INCLINE WALKING"}
          </span>
          <span className="text-[9px] text-zinc-300 font-medium leading-normal">
            {locale === "pt-br" ? "Queima até 60% mais calorias" : "Burns up to 60% more calories"}
          </span>
        </div>
      </div>
    </div>
  );
}
