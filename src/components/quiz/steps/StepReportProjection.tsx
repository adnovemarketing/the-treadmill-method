"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useQuizStore } from "@/core/store/quizStore";
import { QuizStep } from "@/core/types/quiz";
import { Button } from "@/components/ui/button";
import { calculateTargetDate, calculateIMC, getIMCCategoryKey, getIMCCategoryColor } from "@/core/utils/calculations";
import { useTranslations } from "@/core/i18n/translations";
import { useLocale } from "@/core/i18n/useLocale";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { VISUAL_ASSETS } from "@/config/visualAssets";
import { trackEvent } from "@/core/utils/analytics";

interface StepProps {
  onNext: (nextStep: QuizStep) => void;
}

export function StepReportProjection({ onNext }: StepProps) {
  const { data } = useQuizStore();
  const locale = useLocale();
  const t = useTranslations(locale);

  useEffect(() => {
    trackEvent("intermediate_result_viewed", { locale });
  }, [locale]);

  const cWeight = data.weight || 75;
  const tWeight = data.targetWeight || 68;
  const unit = data.weightUnit || "kg";

  const { dateString, weeks } = calculateTargetDate(cWeight, tWeight, unit, locale);
  const imc = calculateIMC(cWeight, data.height || 170, data.heightUnit || "cm", unit);
  
  const imcCatKey = getIMCCategoryKey(imc);
  const imcCatColor = getIMCCategoryColor(imcCatKey);
  const imcCatLabel = t.report[imcCatKey];

  // Geração de pontos para um gráfico SVG suave de queda de peso
  const startWeight = cWeight;
  const endWeight = tWeight;
  const midWeight = parseFloat(((startWeight + endWeight) / 2 + 1.5).toFixed(1));

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
      {/* Coluna Esquerda: Dados e Gráfico */}
      <div className="flex-1 min-w-0 flex flex-col gap-6">
        <div className="text-left md:text-center px-1">
          <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full">
            {t.transitions.reportPreview.badge}
          </span>
          <h2 className="text-xl md:text-2xl font-heading font-extrabold text-zinc-50 mt-3 leading-tight uppercase">
            {t.transitions.reportPreview.title}
          </h2>
          <p className="text-xs text-zinc-400 mt-2">
            {t.transitions.reportPreview.subtitle}
          </p>
        </div>

        {/* Box de Resumo da Meta */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl flex flex-col gap-4 text-center">
          <p className="text-xs font-semibold text-zinc-400">
            {locale === "pt-br" ? "Chegue aos" : "Reach"} <span className="text-zinc-50 font-bold">{tWeight} {unit}</span> {locale === "pt-br" ? "até" : "by"}:
          </p>
          <h3 className="text-lg md:text-xl font-heading font-black text-brand-lime tracking-wide">
            {dateString}
          </h3>

          {/* Gráfico SVG de Projeção */}
          <div className="w-full h-36 bg-zinc-950/60 border border-zinc-900 rounded-xl relative overflow-hidden mt-2 p-3 flex flex-col justify-end">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
              <div className="border-b border-zinc-800 w-full" />
              <div className="border-b border-zinc-800 w-full" />
              <div className="border-b border-zinc-800 w-full" />
            </div>

            {/* Curva SVG */}
            <svg className="w-full h-24 overflow-visible z-10 drop-shadow-[0_0_15px_rgba(190,242,100,0.25)]" viewBox="0 0 300 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#bef264" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.0" />
                </linearGradient>
                <filter id="neonGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Área sombreada */}
              <path
                d="M 0 10 Q 150 40 300 80 L 300 100 L 0 100 Z"
                fill="url(#gradient)"
              />
              {/* Linha principal */}
              <path
                d="M 0 10 Q 150 40 300 80"
                fill="none"
                stroke="#bef264"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#neonGlow)"
              />
              {/* Pontos indicadores */}
              <circle cx="0" cy="10" r="5" fill="#bef264" stroke="#09090b" strokeWidth="2" />
              <circle cx="150" cy="40" r="5" fill="#14b8a6" stroke="#09090b" strokeWidth="2" />
              <circle cx="300" cy="80" r="5" fill="#14b8a6" stroke="#09090b" strokeWidth="2" />
            </svg>

            {/* Rótulos do Gráfico */}
            <div className="flex justify-between items-center text-[9px] text-zinc-500 font-bold tracking-wider px-1 mt-3 z-20">
              <div className="flex flex-col items-start">
                <span>{locale === "pt-br" ? "HOJE" : "TODAY"}</span>
                <span className="text-zinc-300">{startWeight} {unit}</span>
              </div>
              <div className="flex flex-col items-center">
                <span>{locale === "pt-br" ? "METADE" : "MIDPOINT"}</span>
                <span className="text-zinc-300">{midWeight} {unit}</span>
              </div>
              <div className="flex flex-col items-end">
                <span>{locale === "pt-br" ? "META" : "TARGET"}</span>
                <span className="text-brand-lime font-black">{endWeight} {unit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Caixa de Métricas Adicionais */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-xl flex flex-col justify-center transition-all hover:bg-zinc-900/60 hover:scale-[1.01] duration-200">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
              {locale === "pt-br" ? "Seu IMC Atual" : "Your Current BMI"}
            </span>
            <span className="text-lg font-heading font-black text-zinc-200 mt-1">{imc}</span>
            <span className={cn("text-[9px] font-extrabold uppercase tracking-wide mt-0.5", imcCatColor)}>
              {imcCatLabel}
            </span>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-xl flex flex-col justify-center transition-all hover:bg-zinc-900/60 hover:scale-[1.01] duration-200">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
              {locale === "pt-br" ? "Período Estimado" : "Estimated Time"}
            </span>
            <span className="text-lg font-heading font-black text-zinc-200 mt-1">
              {weeks} {locale === "pt-br" ? "semanas" : "weeks"}
            </span>
            <span className="text-[9px] font-bold text-brand-teal uppercase tracking-wide mt-0.5">
              {locale === "pt-br" ? "Ritmo Seguro e Saudável" : "Safe & Healthy Pacing"}
            </span>
          </div>
        </div>

        {/* Selo de Prevenção de Efeito Sanfona */}
        <div className="flex items-start gap-3 bg-brand-teal/5 border border-brand-teal/10 p-3.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
          <p className="text-[10px] text-zinc-400 leading-normal">
            <strong className="text-zinc-300 font-bold block mb-0.5">
              {locale === "pt-br" ? "Estabilização pós-perda inclusa" : "Post-loss stabilization included"}
            </strong>
            {t.transitions.reportPreview.safeRateDesc}
          </p>
        </div>

        <Button
          onClick={() => onNext("email-capture")}
          className="w-full bg-brand-lime text-zinc-950 hover:bg-brand-lime-hover font-heading font-bold text-sm tracking-wide py-6 rounded-2xl transition-all cursor-pointer"
        >
          {t.transitions.reportPreview.cta}
        </Button>
      </div>

      {/* Coluna Direita: Ilustração Visual — imagem com legenda abaixo */}
      <div className="hidden lg:flex flex-col w-56 xl:w-64 shrink-0 rounded-2xl border border-zinc-900/60 overflow-hidden bg-zinc-950/40 select-none group">
        <div className="w-full aspect-[4/3] relative overflow-hidden">
          <Image
            src={VISUAL_ASSETS.results.resultProjection}
            alt={locale === "pt-br" ? "Sua projeção de perda de peso saudável baseada no método da esteira" : "Your healthy weight loss projection based on treadmill walking milestones"}
            fill
            sizes="280px"
            priority
            className="object-contain object-bottom transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="p-3 flex flex-col gap-0.5 border-t border-zinc-900 bg-zinc-900/20">
          <span className="text-[10px] font-heading font-black text-brand-lime uppercase tracking-widest">
            {locale === "pt-br" ? "PROJEÇÃO DE RESULTADOS" : "TARGET TIMELINE"}
          </span>
          <span className="text-[9px] text-zinc-300 font-medium leading-normal">
            {locale === "pt-br" ? "Projeção estimada de acordo com o nível metabólico e frequência selecionados." : "Estimated target trajectory based on walking intervals and initial body metrics."}
          </span>
        </div>
      </div>
    </div>
  );
}
