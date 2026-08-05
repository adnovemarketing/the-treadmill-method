"use client";

import React from "react";
import Image from "next/image";
import { useQuizStore } from "@/core/store/quizStore";
import { QuizStep, NutritionBaseline } from "@/core/types/quiz";
import { OptionCard } from "../OptionCard";
import { useTranslations } from "@/core/i18n/translations";
import { useLocale } from "@/core/i18n/useLocale";
import { Apple } from "lucide-react";
import { VISUAL_ASSETS } from "@/config/visualAssets";

interface StepProps {
  onNext: (nextStep: QuizStep) => void;
}

export function StepDailyNutrition({ onNext }: StepProps) {
  const { data, updateData } = useQuizStore();
  const locale = useLocale();
  const t = useTranslations(locale);

  const options: { value: NutritionBaseline; title: string; description: string; emoji: string }[] = [
    {
      value: "balanced",
      title: t.quiz.steps.dailyNutrition.balanced.label,
      description: t.quiz.steps.dailyNutrition.balanced.desc,
      emoji: "🥗",
    },
    {
      value: "carbs_heavy",
      title: t.quiz.steps.dailyNutrition.carbsHeavy.label,
      description: t.quiz.steps.dailyNutrition.carbsHeavy.desc,
      emoji: "🍞",
    },
    {
      value: "low_carb_keto",
      title: t.quiz.steps.dailyNutrition.lowCarb.label,
      description: t.quiz.steps.dailyNutrition.lowCarb.desc,
      emoji: "🥑",
    },
    {
      value: "unstructured",
      title: t.quiz.steps.dailyNutrition.unstructured.label,
      description: t.quiz.steps.dailyNutrition.unstructured.desc,
      emoji: "🍕",
    },
  ];

  const handleSelect = (val: NutritionBaseline) => {
    updateData({ nutritionBaseline: val });
    onNext("antropometria");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
      {/* Coluna Esquerda: Texto e Opções */}
      <div className="md:col-span-7 flex flex-col gap-5">
        <div className="text-left md:text-left">
          <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full">
            {t.quiz.steps.dailyNutrition.badge}
          </span>
          <h2 className="text-xl md:text-2xl font-heading font-extrabold text-zinc-50 mt-3 leading-tight uppercase flex items-center gap-2">
            <Apple className="w-5 h-5 text-brand-lime shrink-0" />
            {t.quiz.steps.dailyNutrition.title}
          </h2>
          <p className="text-xs text-zinc-400 mt-2">
            {t.quiz.steps.dailyNutrition.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-1">
          {options.map((opt) => (
            <OptionCard
              key={opt.value}
              title={opt.title}
              description={opt.description}
              emoji={opt.emoji}
              selected={data.nutritionBaseline === opt.value}
              onClick={() => handleSelect(opt.value)}
            />
          ))}
        </div>
      </div>

      {/* Coluna Direita: Ilustração Visual (Layout A) */}
      <div className="md:col-span-5 hidden md:flex flex-col justify-end p-6 bg-zinc-950/40 rounded-2xl border border-zinc-900/60 aspect-square relative overflow-hidden group select-none">
        <Image
          src={VISUAL_ASSETS.lifestyle.balancedMeal}
          alt={locale === "pt-br" ? "Combustível calibrado para queima máxima" : "Fuel aligned with target walk intervals"}
          fill
          sizes="33vw"
          className="object-contain object-bottom transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        <div className="relative z-10 flex flex-col gap-1">
          <span className="text-[10px] font-heading font-black text-brand-lime uppercase tracking-widest">
            {locale === "pt-br" ? "MÉTODO METABÓLICO" : "METABOLIC TIMING"}
          </span>
          <span className="text-[9px] text-zinc-300 font-medium leading-normal">
            {locale === "pt-br" ? "Combustível calibrado para queima máxima" : "Fuel aligned with target walk intervals"}
          </span>
        </div>
      </div>
    </div>
  );
}
