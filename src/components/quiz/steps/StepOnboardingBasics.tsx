"use client";

import React from "react";
import Image from "next/image";
import { useQuizStore } from "@/core/store/quizStore";
import { PrimaryGoal, QuizStep } from "@/core/types/quiz";
import { OptionCard } from "../OptionCard";
import { useTranslations } from "@/core/i18n/translations";
import { useLocale } from "@/core/i18n/useLocale";
import { Flame, Heart, Calendar, Brain, Activity } from "lucide-react";
import { VISUAL_ASSETS } from "@/config/visualAssets";

interface StepProps {
  onNext: (nextStep: QuizStep) => void;
}

export function StepOnboardingBasics({ onNext }: StepProps) {
  const { data, updateData } = useQuizStore();
  const locale = useLocale();
  const t = useTranslations(locale);

  const options: { value: PrimaryGoal; title: string; description: string; icon: React.ReactNode }[] = [
    {
      value: "weight_loss",
      title: t.quiz.steps.onboardingBasics.weightLoss.title,
      description: t.quiz.steps.onboardingBasics.weightLoss.desc,
      icon: <Flame className="w-5 h-5" />,
    },
    {
      value: "cardio_endurance",
      title: t.quiz.steps.onboardingBasics.cardioEndurance.title,
      description: t.quiz.steps.onboardingBasics.cardioEndurance.desc,
      icon: <Activity className="w-5 h-5" />,
    },
    {
      value: "consistency",
      title: t.quiz.steps.onboardingBasics.consistency.title,
      description: t.quiz.steps.onboardingBasics.consistency.desc,
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      value: "stress_relief",
      title: t.quiz.steps.onboardingBasics.stressRelief.title,
      description: t.quiz.steps.onboardingBasics.stressRelief.desc,
      icon: <Brain className="w-5 h-5" />,
    },
    {
      value: "general_health",
      title: t.quiz.steps.onboardingBasics.generalHealth.title,
      description: t.quiz.steps.onboardingBasics.generalHealth.desc,
      icon: <Heart className="w-5 h-5" />,
    },
  ];

  const handleSelect = (val: PrimaryGoal) => {
    updateData({ primaryGoal: val });
    onNext("age-selection");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
      {/* Coluna Esquerda: Conteúdo e Opções */}
      <div className="md:col-span-7 flex flex-col gap-5">
        <div className="text-left md:text-left">
          <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full">
            {t.quiz.steps.onboardingBasics.badge}
          </span>
          <h2 className="text-xl md:text-2xl font-heading font-extrabold text-zinc-50 mt-3 leading-tight uppercase">
            {t.quiz.steps.onboardingBasics.title}
          </h2>
          <p className="text-xs text-zinc-400 mt-2">
            {t.quiz.steps.onboardingBasics.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-1">
          {options.map((opt) => (
            <OptionCard
              key={opt.value}
              title={opt.title}
              description={opt.description}
              icon={opt.icon}
              selected={data.primaryGoal === opt.value}
              onClick={() => handleSelect(opt.value)}
            />
          ))}
        </div>
      </div>

      {/* Coluna Direita: Ilustração Visual (Oculta em mobile pequeno, visível em md+) */}
      <div className="md:col-span-5 hidden md:flex flex-col justify-end p-6 bg-zinc-950/40 rounded-2xl border border-zinc-900/60 aspect-square relative overflow-hidden group select-none">
        <Image
          src={VISUAL_ASSETS.lifestyle.weightGoalProgress}
          alt={locale === "pt-br" ? "Metas calculadas biologicamente" : "Goals biologically calculated"}
          fill
          sizes="33vw"
          priority
          className="object-contain object-bottom transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        <div className="relative z-10 flex flex-col gap-1">
          <span className="text-[10px] font-heading font-black text-brand-lime uppercase tracking-widest">
            {locale === "pt-br" ? "MÉTODO CALIBRADO" : "CALIBRATED METHOD"}
          </span>
          <span className="text-[9px] text-zinc-300 font-medium leading-normal">
            {locale === "pt-br" ? "Metas calculadas biologicamente" : "Goals biologically calculated"}
          </span>
        </div>
      </div>
    </div>
  );
}
