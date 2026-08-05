"use client";

import React from "react";
import Image from "next/image";
import { useQuizStore } from "@/core/store/quizStore";
import { QuizStep, BiomechanicsGender } from "@/core/types/quiz";
import { OptionCard } from "../OptionCard";
import { useTranslations } from "@/core/i18n/translations";
import { useLocale } from "@/core/i18n/useLocale";
import { VISUAL_ASSETS } from "@/config/visualAssets";

interface StepProps {
  onNext: (nextStep: QuizStep) => void;
}

export function StepGenderSelection({ onNext }: StepProps) {
  const { data, updateData } = useQuizStore();
  const locale = useLocale();
  const t = useTranslations(locale);

  const options: { value: BiomechanicsGender; title: string; description: string; image: React.ReactNode }[] = [
    {
      value: "female",
      title: t.quiz.steps.genderSelection.female.label,
      description: t.quiz.steps.genderSelection.female.desc,
      image: (
        <Image
          src={VISUAL_ASSETS.demographics.genderFemale}
          alt={t.quiz.steps.genderSelection.female.label}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-contain object-bottom"
        />
      ),
    },
    {
      value: "male",
      title: t.quiz.steps.genderSelection.male.label,
      description: t.quiz.steps.genderSelection.male.desc,
      image: (
        <Image
          src={VISUAL_ASSETS.demographics.genderMale}
          alt={t.quiz.steps.genderSelection.male.label}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-contain object-bottom"
        />
      ),
    },
    {
      value: "other",
      title: t.quiz.steps.genderSelection.other.label,
      description: t.quiz.steps.genderSelection.other.desc,
      image: (
        <Image
          src={VISUAL_ASSETS.lifestyle.bodyTypesDiverse}
          alt={t.quiz.steps.genderSelection.other.label}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-contain object-bottom"
        />
      ),
    },
  ];

  const handleSelect = (val: BiomechanicsGender) => {
    updateData({ biomechanicsGender: val });
    onNext("treadmill-frequency");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full">
          {t.quiz.steps.genderSelection.badge}
        </span>
        <h2 className="text-xl md:text-2xl font-heading font-extrabold text-zinc-50 mt-3 leading-tight uppercase">
          {t.quiz.steps.genderSelection.title}
        </h2>
        <p className="text-xs text-zinc-400 mt-2">
          {t.quiz.steps.genderSelection.subtitle}
        </p>
      </div>

      {/* Grid horizontal no desktop para Layout C */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        {options.map((opt) => (
          <OptionCard
            key={opt.value}
            title={opt.title}
            description={opt.description}
            image={opt.image}
            selected={data.biomechanicsGender === opt.value}
            onClick={() => handleSelect(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}
