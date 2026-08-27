"use client";

import React from "react";
import Image from "next/image";
import { useQuizStore } from "@/core/store/quizStore";
import { QuizStep, ImportantEvent } from "@/core/types/quiz";
import { OptionCard } from "../OptionCard";
import { useTranslations } from "@/core/i18n/translations";
import { useLocale } from "@/core/i18n/useLocale";
import { Heart, Plane, Cake, Activity, Sparkles, CalendarHeart } from "lucide-react";
import { VISUAL_ASSETS } from "@/config/visualAssets";

interface StepProps {
  onNext: (nextStep: QuizStep) => void;
}

export function StepImportantEvent({ onNext }: StepProps) {
  const { data, updateData } = useQuizStore();
  const locale = useLocale();
  const t = useTranslations(locale);

  const eventOptions: { value: ImportantEvent; label: string; desc: string; icon: React.ReactNode }[] = [
    { 
      value: "wedding", 
      label: t.quiz.steps.importantEvent.options["wedding"].label, 
      desc: t.quiz.steps.importantEvent.options["wedding"].desc,
      icon: <Heart className="w-5 h-5 text-brand-lime" />
    },
    { 
      value: "vacation", 
      label: t.quiz.steps.importantEvent.options["vacation"].label, 
      desc: t.quiz.steps.importantEvent.options["vacation"].desc,
      icon: <Plane className="w-5 h-5 text-brand-teal" />
    },
    { 
      value: "birthday", 
      label: t.quiz.steps.importantEvent.options["birthday"].label, 
      desc: t.quiz.steps.importantEvent.options["birthday"].desc,
      icon: <Cake className="w-5 h-5 text-brand-lime" />
    },
    { 
      value: "health_goal", 
      label: t.quiz.steps.importantEvent.options["health_goal"].label, 
      desc: t.quiz.steps.importantEvent.options["health_goal"].desc,
      icon: <Activity className="w-5 h-5 text-brand-teal" />
    },
    { 
      value: "no_specific_date", 
      label: t.quiz.steps.importantEvent.options["no_specific_date"].label, 
      desc: t.quiz.steps.importantEvent.options["no_specific_date"].desc,
      icon: <Sparkles className="w-5 h-5 text-brand-lime" />
    },
  ];

  const handleSelect = (value: ImportantEvent) => {
    updateData({ importantEvent: value });
    onNext("mindset-blockers");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
      {/* Coluna Esquerda: Conteúdo e Opções */}
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        <div className="text-left px-1">
          <div className="flex items-center gap-2">
            <CalendarHeart className="w-4 h-4 text-brand-lime" />
            <h2 className="text-sm font-heading font-extrabold text-zinc-100 uppercase tracking-wide">
              {t.quiz.steps.importantEvent.title}
            </h2>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed mt-2">
            {t.quiz.steps.importantEvent.subtitle}
          </p>
        </div>

        {/* Grid de Cards de Evento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          {eventOptions.map((opt) => (
            <div key={opt.value} className={opt.value === "no_specific_date" ? "sm:col-span-2" : ""}>
              <OptionCard
                title={opt.label}
                description={opt.desc}
                icon={opt.icon}
                selected={data.importantEvent === opt.value}
                onClick={() => handleSelect(opt.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Coluna Direita: Ilustração Visual */}
      <div className="hidden lg:flex flex-col w-56 xl:w-64 shrink-0 rounded-2xl border border-zinc-900/60 overflow-hidden bg-zinc-950/40 select-none group aspect-square relative justify-end p-6">
        <Image
          src={VISUAL_ASSETS.lifestyle.importantLifeEvents}
          alt={locale === "pt-br" ? "Evento importante planejado" : "Planned important event"}
          fill
          sizes="280px"
          className="object-contain object-bottom transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        <div className="relative z-10 flex flex-col gap-1">
          <span className="text-[10px] font-heading font-black text-brand-lime uppercase tracking-widest">
            {locale === "pt-br" ? "OBJETIVO COM DATA" : "TIMED TARGETS"}
          </span>
          <span className="text-[9px] text-zinc-300 font-medium leading-normal">
            {locale === "pt-br" ? "Construindo o ritmo de treino ideal para o seu cronograma." : "Aligning walking milestones with your personal event deadline."}
          </span>
        </div>
      </div>
    </div>
  );
}
