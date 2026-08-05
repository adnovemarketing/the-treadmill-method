"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useQuizStore } from "@/core/store/quizStore";
import { QuizStep, PreferredWorkoutTime } from "@/core/types/quiz";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptionCard } from "../OptionCard";
import { useTranslations } from "@/core/i18n/translations";
import { useLocale } from "@/core/i18n/useLocale";
import { motion, AnimatePresence } from "framer-motion";
import { VISUAL_ASSETS } from "@/config/visualAssets";

interface StepProps {
  onNext: (nextStep: QuizStep) => void;
}

export function StepLoadingCalculation({ onNext }: StepProps) {
  const { data, updateData } = useQuizStore();
  const locale = useLocale();
  const t = useTranslations(locale);

  const [progress, setProgress] = useState(0);
  const [activeModal, setActiveModal] = useState<"time" | "commitment" | null>(null);

  const steps = [
    { label: t.transitions.loading.statusA, minProgress: 0, maxProgress: 25 },
    { label: t.transitions.loading.statusB, minProgress: 25, maxProgress: 55 },
    { label: t.transitions.loading.statusC, minProgress: 55, maxProgress: 80 },
    { label: t.transitions.loading.statusD, minProgress: 80, maxProgress: 100 },
  ];

  useEffect(() => {
    if (activeModal) return; // Pausa o loading se algum modal estiver aberto

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;

        if (next === 25) {
          clearInterval(interval);
          setActiveModal("time");
          return next;
        }

        if (next === 70) {
          clearInterval(interval);
          setActiveModal("commitment");
          return next;
        }

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onNext("report-projection");
          }, 600);
          return 100;
        }

        return next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [activeModal, onNext]);

  const handleSelectWorkoutTime = (time: PreferredWorkoutTime) => {
    updateData({ preferredWorkoutTime: time });
    setActiveModal(null); // Resume o loading
    setProgress((p) => p + 1); // Força avanço
  };

  const handleSelectCommitment = (ready: boolean) => {
    updateData({ readyToChange: ready });
    setActiveModal(null); // Resume o loading
    setProgress((p) => p + 1); // Força avanço
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center relative min-h-[420px] py-6">
      {/* Coluna Esquerda: Loading e Checklist */}
      <div className="md:col-span-7 flex flex-col justify-between h-full w-full gap-5">
        {/* Header Loading */}
        <div className="text-left md:text-center px-1">
          <h2 className="text-xl font-heading font-extrabold text-zinc-100 tracking-wide uppercase">
            {t.transitions.loading.title}
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            {locale === "pt-br" 
              ? "Aguarde enquanto criamos seu plano personalizado..." 
              : "Please wait while we generate your personalized plan..."}
          </p>
        </div>

        {/* Progress Circle & Percent */}
        <div className="flex-1 flex flex-col items-center justify-center my-6 relative">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_20px_rgba(190,242,100,0.2)]">
              <circle
                cx="56"
                cy="56"
                r="48"
                className="stroke-zinc-900 fill-none"
                strokeWidth="6"
              />
              <circle
                cx="56"
                cy="56"
                r="48"
                className="stroke-brand-lime fill-none transition-all duration-75"
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={2 * Math.PI * 48 * (1 - progress / 100)}
              />
            </svg>
            <span className="absolute text-xl font-heading font-extrabold text-zinc-50 tracking-wider">
              {progress}%
            </span>
          </div>
        </div>

        {/* Checklist dos Cálculos */}
        <div className="flex flex-col gap-2 px-2">
          {steps.map((step, idx) => {
            const isDone = progress >= step.maxProgress;
            const isProcessing = progress >= step.minProgress && progress < step.maxProgress;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                  isDone
                    ? "bg-zinc-900/40 border-zinc-900 text-zinc-400"
                    : isProcessing
                    ? "bg-zinc-950 border-brand-teal/20 text-brand-teal"
                    : "bg-zinc-950/20 border-zinc-950 text-zinc-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    isDone
                      ? "bg-brand-teal/10 border-brand-teal text-brand-teal"
                      : isProcessing
                      ? "border-brand-teal border-t-transparent animate-spin"
                      : "border-zinc-800"
                  }`}
                >
                  {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className="text-[11px] font-semibold tracking-wide">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coluna Direita: Ilustração Visual (Layout A) */}
      <div className="md:col-span-5 hidden md:flex flex-col justify-end p-6 bg-zinc-950/40 rounded-2xl border border-zinc-900/60 aspect-square relative overflow-hidden group select-none">
        <Image
          src={VISUAL_ASSETS.results.walkingPlanProcessing}
          alt={locale === "pt-br" ? "Processando seu plano de caminhada personalizado" : "Processing your personalised treadmill walking plan"}
          fill
          sizes="33vw"
          className="object-contain object-bottom transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        <div className="relative z-10 flex flex-col gap-1">
          <span className="text-[10px] font-heading font-black text-brand-lime uppercase tracking-widest">
            {locale === "pt-br" ? "ESTRUTURAÇÃO DO PLANO" : "PLAN TIMELINE"}
          </span>
          <span className="text-[9px] text-zinc-300 font-medium leading-normal">
            {locale === "pt-br" ? "Calibrando velocidades, inclinações e tempos para maximizar a oxidação de gordura." : "Calibrating speed, incline, and durations to maximize fat oxidation safely."}
          </span>
        </div>
      </div>

      {/* Modais Suspensos por Cima */}
      <AnimatePresence>
        {activeModal === "time" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-950/95 flex flex-col justify-center items-center p-4 z-50 rounded-2xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              className="w-full flex flex-col gap-4 text-center"
            >
              <div>
                <span className="text-[9px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-2 py-0.5 rounded-full">
                  {locale === "pt-br" ? "CALIBRAÇÃO ADICIONAL" : "ADDITIONAL CALIBRATION"}
                </span>
                <h3 className="text-base font-heading font-extrabold text-zinc-50 mt-2">
                  {t.transitions.loading.modalSchedule.title}
                </h3>
              </div>

              <div className="flex flex-col gap-2.5">
                <OptionCard
                  title={t.transitions.loading.modalSchedule.morning}
                  description={locale === "pt-br" ? "Aceleração metabólica para começar o dia." : "Metabolic acceleration to start the day."}
                  emoji="🌅"
                  selected={data.preferredWorkoutTime === "morning"}
                  onClick={() => handleSelectWorkoutTime("morning")}
                />
                <OptionCard
                  title={t.transitions.loading.modalSchedule.midday}
                  description={locale === "pt-br" ? "Pausa produtiva para renovar a energia." : "Productive break to renew energy."}
                  emoji="☀️"
                  selected={data.preferredWorkoutTime === "midday"}
                  onClick={() => handleSelectWorkoutTime("midday")}
                />
                <OptionCard
                  title={t.transitions.loading.modalSchedule.evening}
                  description={locale === "pt-br" ? "Descompressão do estresse diário." : "Decompression of daily stress."}
                  emoji="🌙"
                  selected={data.preferredWorkoutTime === "evening"}
                  onClick={() => handleSelectWorkoutTime("evening")}
                />
                <OptionCard
                  title={t.transitions.loading.modalSchedule.notSure}
                  description={locale === "pt-br" ? "Varia de acordo com a rotina do dia." : "Varies according to the day's routine."}
                  emoji="🔄"
                  selected={data.preferredWorkoutTime === "not_sure"}
                  onClick={() => handleSelectWorkoutTime("not_sure")}
                />
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeModal === "commitment" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-950/95 flex flex-col justify-center items-center p-4 z-50 rounded-2xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              className="w-full flex flex-col gap-4 text-center"
            >
              <div>
                <span className="text-[9px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-2 py-0.5 rounded-full">
                  {locale === "pt-br" ? "COMPROMISSO" : "COMMITMENT"}
                </span>
                <h3 className="text-base font-heading font-extrabold text-zinc-50 mt-2">
                  {t.transitions.loading.modalCommit.title}
                </h3>
                <p className="text-[10px] text-zinc-400 mt-1.5 leading-relaxed">
                  {t.transitions.loading.modalCommit.desc}
                </p>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <Button
                  onClick={() => handleSelectCommitment(true)}
                  className="w-full bg-brand-lime text-zinc-950 hover:bg-brand-lime-hover font-heading font-bold text-xs py-5 rounded-xl cursor-pointer"
                >
                  {t.transitions.loading.modalCommit.yes}
                </Button>
                <button
                  type="button"
                  onClick={() => handleSelectCommitment(false)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors py-2 font-medium"
                >
                  {t.transitions.loading.modalCommit.no}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
