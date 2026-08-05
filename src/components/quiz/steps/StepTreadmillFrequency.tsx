"use client";

import React from "react";
import Image from "next/image";
import { useQuizStore } from "@/core/store/quizStore";
import { QuizStep, WeeklyAccess } from "@/core/types/quiz";
import { OptionCard } from "../OptionCard";
import { useTranslations } from "@/core/i18n/translations";
import { useLocale } from "@/core/i18n/useLocale";
import { CalendarRange } from "lucide-react";
import { VISUAL_ASSETS } from "@/config/visualAssets";

interface StepProps {
  onNext: (nextStep: QuizStep) => void;
}

export function StepTreadmillFrequency({ onNext }: StepProps) {
  const { data, updateData } = useQuizStore();
  const locale = useLocale();
  const t = useTranslations(locale);

  const options: { value: WeeklyAccess; title: string; description: string; icon: React.ReactNode }[] = [
    {
      value: "1_2_days",
      title: t.quiz.steps.treadmillFrequency.oneTwo.label,
      description: t.quiz.steps.treadmillFrequency.oneTwo.desc,
      icon: <CalendarRange className="w-5 h-5 text-zinc-400" />,
    },
    {
      value: "3_4_days",
      title: t.quiz.steps.treadmillFrequency.threeFour.label,
      description: t.quiz.steps.treadmillFrequency.threeFour.desc,
      icon: <CalendarRange className="w-5 h-5 text-brand-lime" />,
    },
    {
      value: "5_plus_days",
      title: t.quiz.steps.treadmillFrequency.fivePlus.label,
      description: t.quiz.steps.treadmillFrequency.fivePlus.desc,
      icon: <CalendarRange className="w-5 h-5 text-brand-teal" />,
    },
    {
      value: "no_access_yet",
      title: t.quiz.steps.treadmillFrequency.noneYet.label,
      description: t.quiz.steps.treadmillFrequency.noneYet.desc,
      icon: <CalendarRange className="w-5 h-5 text-zinc-600" />,
    },
  ];

  const handleSelect = (val: WeeklyAccess) => {
    updateData({ weeklyAccess: val });
    onNext("cardio-level");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
      {/* Coluna Esquerda: Conteúdo e Opções */}
      <div className="md:col-span-7 flex flex-col gap-5">
        <div className="text-left md:text-left">
          <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full">
            {t.quiz.steps.treadmillFrequency.badge}
          </span>
          <h2 className="text-xl md:text-2xl font-heading font-extrabold text-zinc-50 mt-3 leading-tight uppercase">
            {t.quiz.steps.treadmillFrequency.title}
          </h2>
          <p className="text-xs text-zinc-400 mt-2">
            {t.quiz.steps.treadmillFrequency.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-1">
          {options.map((opt) => (
            <OptionCard
              key={opt.value}
              title={opt.title}
              description={opt.description}
              icon={opt.icon}
              selected={data.weeklyAccess === opt.value}
              onClick={() => handleSelect(opt.value)}
            />
          ))}
        </div>
      </div>

      {/* Coluna Direita: Ilustração Visual (Layout A) */}
      <div className="md:col-span-5 hidden md:flex flex-col justify-end p-6 bg-zinc-950/40 rounded-2xl border border-zinc-900/60 aspect-square relative overflow-hidden group select-none">
        <Image
          src={VISUAL_ASSETS.treadmill.socialProofGroup}
          alt={locale === "pt-br" ? "Consistência supera intensidade" : "Consistency beats intensity"}
          fill
          sizes="33vw"
          className="object-contain object-bottom transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        <div className="relative z-10 flex flex-col gap-1">
          <span className="text-[10px] font-heading font-black text-brand-teal uppercase tracking-widest">
            {locale === "pt-br" ? "ROTEIRO SEMANAL" : "WEEKLY PATHWAY"}
          </span>
          <span className="text-[9px] text-zinc-300 font-medium leading-normal">
            {locale === "pt-br" ? "Consistência supera intensidade" : "Consistency beats intensity"}
          </span>
        </div>
      </div>
    </div>
  );
}
