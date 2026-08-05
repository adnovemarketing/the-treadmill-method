"use client";

import React from "react";
import Image from "next/image";
import { useQuizStore } from "@/core/store/quizStore";
import { QuizStep, WaterIntake } from "@/core/types/quiz";
import { OptionCard } from "../OptionCard";
import { useTranslations } from "@/core/i18n/translations";
import { useLocale } from "@/core/i18n/useLocale";
import { Droplet } from "lucide-react";
import { VISUAL_ASSETS } from "@/config/visualAssets";

interface StepProps {
  onNext: (nextStep: QuizStep) => void;
}

export function StepWaterIntake({ onNext }: StepProps) {
  const { data, updateData } = useQuizStore();
  const locale = useLocale();
  const t = useTranslations(locale);

  const waterOptions: { value: WaterIntake; label: string; desc: string; emoji: string }[] = [
    { value: "less_1L", label: t.quiz.steps.waterIntake.options["less_1L"].label, desc: t.quiz.steps.waterIntake.options["less_1L"].desc, emoji: "💧" },
    { value: "1_to_2L", label: t.quiz.steps.waterIntake.options["1_to_2L"].label, desc: t.quiz.steps.waterIntake.options["1_to_2L"].desc, emoji: "🥤" },
    { value: "2_to_3L", label: t.quiz.steps.waterIntake.options["2_to_3L"].label, desc: t.quiz.steps.waterIntake.options["2_to_3L"].desc, emoji: "🥛" },
    { value: "more_3L", label: t.quiz.steps.waterIntake.options["more_3L"].label, desc: t.quiz.steps.waterIntake.options["more_3L"].desc, emoji: "🔋" },
  ];

  const handleSelect = (value: WaterIntake) => {
    updateData({ waterIntake: value });
    onNext("daily-activity");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
      {/* Coluna Esquerda: Texto e Opções */}
      <div className="md:col-span-7 flex flex-col gap-5">
        <div className="text-left md:text-left">
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-brand-teal" />
            <h2 className="text-sm font-heading font-extrabold text-zinc-100 uppercase tracking-wide">
              {t.quiz.steps.waterIntake.title}
            </h2>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed mt-2">
            {t.quiz.steps.waterIntake.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 mt-1">
          {waterOptions.map((opt) => (
            <OptionCard
              key={opt.value}
              title={opt.label}
              description={opt.desc}
              emoji={opt.emoji}
              selected={data.waterIntake === opt.value}
              onClick={() => handleSelect(opt.value)}
            />
          ))}
        </div>
      </div>

      {/* Coluna Direita: Ilustração Visual (Layout A) */}
      <div className="md:col-span-5 hidden md:flex flex-col justify-end p-6 bg-zinc-950/40 rounded-2xl border border-zinc-900/60 aspect-square relative overflow-hidden group select-none">
        <Image
          src={VISUAL_ASSETS.lifestyle.waterIntake}
          alt={locale === "pt-br" ? "Água acelera a queima calórica em 30%" : "Water boosts caloric oxidation by 30%"}
          fill
          sizes="33vw"
          className="object-contain object-bottom transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        <div className="relative z-10 flex flex-col gap-1">
          <span className="text-[10px] font-heading font-black text-brand-teal uppercase tracking-widest">
            {locale === "pt-br" ? "OTIMIZAÇÃO METABÓLICA" : "METABOLIC BOOST"}
          </span>
          <span className="text-[9px] text-zinc-300 font-medium leading-normal">
            {locale === "pt-br" ? "Água acelera a queima calórica em 30%" : "Water boosts caloric oxidation by 30%"}
          </span>
        </div>
      </div>
    </div>
  );
}
