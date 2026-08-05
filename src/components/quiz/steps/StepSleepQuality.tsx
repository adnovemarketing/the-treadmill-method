"use client";

import React from "react";
import Image from "next/image";
import { useQuizStore } from "@/core/store/quizStore";
import { QuizStep, SleepDuration } from "@/core/types/quiz";
import { OptionCard } from "../OptionCard";
import { useTranslations } from "@/core/i18n/translations";
import { useLocale } from "@/core/i18n/useLocale";
import { Moon } from "lucide-react";
import { VISUAL_ASSETS } from "@/config/visualAssets";

interface StepProps {
  onNext: (nextStep: QuizStep) => void;
}

export function StepSleepQuality({ onNext }: StepProps) {
  const { data, updateData } = useQuizStore();
  const locale = useLocale();
  const t = useTranslations(locale);

  const sleepOptions: { value: SleepDuration; label: string; desc: string; emoji: string }[] = [
    { value: "less_5h", label: t.quiz.steps.sleepQuality.options["less_5h"].label, desc: t.quiz.steps.sleepQuality.options["less_5h"].desc, emoji: "🥵" },
    { value: "5_to_6h", label: t.quiz.steps.sleepQuality.options["5_to_6h"].label, desc: t.quiz.steps.sleepQuality.options["5_to_6h"].desc, emoji: "🥱" },
    { value: "6_to_7h", label: t.quiz.steps.sleepQuality.options["6_to_7h"].label, desc: t.quiz.steps.sleepQuality.options["6_to_7h"].desc, emoji: "🧘" },
    { value: "7_to_8h", label: t.quiz.steps.sleepQuality.options["7_to_8h"].label, desc: t.quiz.steps.sleepQuality.options["7_to_8h"].desc, emoji: "⚡" },
    { value: "more_8h", label: t.quiz.steps.sleepQuality.options["more_8h"].label, desc: t.quiz.steps.sleepQuality.options["more_8h"].desc, emoji: "💪" },
  ];

  const handleSelect = (value: SleepDuration) => {
    updateData({ sleepDuration: value });
    onNext("water-intake");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
      {/* Coluna Esquerda: Texto e Opções */}
      <div className="md:col-span-7 flex flex-col gap-5">
        <div className="text-left md:text-left">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-brand-lime" />
            <h2 className="text-sm font-heading font-extrabold text-zinc-100 uppercase tracking-wide">
              {t.quiz.steps.sleepQuality.title}
            </h2>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed mt-2">
            {t.quiz.steps.sleepQuality.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 mt-1">
          {sleepOptions.map((opt) => (
            <OptionCard
              key={opt.value}
              title={opt.label}
              description={opt.desc}
              emoji={opt.emoji}
              selected={data.sleepDuration === opt.value}
              onClick={() => handleSelect(opt.value)}
            />
          ))}
        </div>
      </div>

      {/* Coluna Direita: Ilustração Visual (Layout A) */}
      <div className="md:col-span-5 hidden md:flex flex-col justify-end p-6 bg-zinc-950/40 rounded-2xl border border-zinc-900/60 aspect-square relative overflow-hidden group select-none">
        <Image
          src={VISUAL_ASSETS.lifestyle.sleepDuration}
          alt={locale === "pt-br" ? "Sono calibra a síntese de proteínas" : "Sleep structures protein synthesis"}
          fill
          sizes="33vw"
          className="object-contain object-bottom transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        <div className="relative z-10 flex flex-col gap-1">
          <span className="text-[10px] font-heading font-black text-brand-lime uppercase tracking-widest">
            {locale === "pt-br" ? "MÉTRICAS METABÓLICAS" : "METABOLIC METRICS"}
          </span>
          <span className="text-[9px] text-zinc-300 font-medium leading-normal">
            {locale === "pt-br" ? "Sono calibra a síntese de proteínas" : "Sleep structures protein synthesis"}
          </span>
        </div>
      </div>
    </div>
  );
}
