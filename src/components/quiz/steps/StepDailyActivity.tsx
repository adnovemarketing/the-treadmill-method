"use client";

import React from "react";
import Image from "next/image";
import { useQuizStore } from "@/core/store/quizStore";
import { QuizStep, JobActivity } from "@/core/types/quiz";
import { OptionCard } from "../OptionCard";
import { useTranslations } from "@/core/i18n/translations";
import { useLocale } from "@/core/i18n/useLocale";
import { Briefcase } from "lucide-react";
import { VISUAL_ASSETS } from "@/config/visualAssets";

interface StepProps {
  onNext: (nextStep: QuizStep) => void;
}

export function StepDailyActivity({ onNext }: StepProps) {
  const { data, updateData } = useQuizStore();
  const locale = useLocale();
  const t = useTranslations(locale);

  const activityOptions: { value: JobActivity; label: string; desc: string; emoji: string }[] = [
    { value: "sedentary", label: t.quiz.steps.dailyActivity.options["sedentary"].label, desc: t.quiz.steps.dailyActivity.options["sedentary"].desc, emoji: "🖥️" },
    { value: "light_movement", label: t.quiz.steps.dailyActivity.options["light_movement"].label, desc: t.quiz.steps.dailyActivity.options["light_movement"].desc, emoji: "🚶" },
    { value: "moderate", label: t.quiz.steps.dailyActivity.options["moderate"].label, desc: t.quiz.steps.dailyActivity.options["moderate"].desc, emoji: "🏃" },
    { value: "very_active", label: t.quiz.steps.dailyActivity.options["very_active"].label, desc: t.quiz.steps.dailyActivity.options["very_active"].desc, emoji: "🏋️" },
  ];

  const handleSelect = (value: JobActivity) => {
    updateData({ jobActivity: value });
    onNext("daily-nutrition");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
      {/* Coluna Esquerda: Conteúdo e Opções */}
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        <div className="flex flex-col gap-1 px-1">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-brand-lime" />
            <h2 className="text-sm font-heading font-extrabold text-zinc-100 uppercase tracking-wide">
              {t.quiz.steps.dailyActivity.title}
            </h2>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed mt-1">
            {t.quiz.steps.dailyActivity.subtitle}
          </p>
        </div>

        {/* Grid de Opções 2x2 no Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          {activityOptions.map((opt) => (
            <OptionCard
              key={opt.value}
              title={opt.label}
              description={opt.desc}
              emoji={opt.emoji}
              selected={data.jobActivity === opt.value}
              onClick={() => handleSelect(opt.value)}
            />
          ))}
        </div>
      </div>

      {/* Coluna Direita: Ilustração contextual — imagem própria + legenda abaixo */}
      <div className="hidden lg:flex flex-col w-56 xl:w-64 shrink-0 rounded-2xl border border-zinc-900/60 overflow-hidden bg-zinc-950/40 select-none group">
        <div className="relative h-52 xl:h-60 overflow-hidden">
          <Image
            src={VISUAL_ASSETS.lifestyle.workActivityModeratelyActive}
            alt={locale === "pt-br" ? "Nível de Atividade Diária" : "Daily Activity Level"}
            fill
            sizes="280px"
            className="object-contain object-bottom transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="p-3 flex flex-col gap-0.5 border-t border-zinc-900 bg-zinc-900/20">
          <span className="text-[10px] font-heading font-black text-brand-lime uppercase tracking-widest">
            {locale === "pt-br" ? "NÍVEL DE ATIVIDADE DIÁRIA" : "DAILY MOVEMENT LEVEL"}
          </span>
          <span className="text-[9px] text-zinc-300 font-medium leading-normal">
            {locale === "pt-br" ? "A atividade diária (NEAT) determina sua taxa metabólica base antes dos treinos." : "Physical daily activity sets your baseline metabolic output before structured walks."}
          </span>
        </div>
      </div>
    </div>
  );
}
