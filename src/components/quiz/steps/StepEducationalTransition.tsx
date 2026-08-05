"use client";

import React from "react";
import Image from "next/image";
import { QuizStep } from "@/core/types/quiz";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/core/i18n/translations";
import { useLocale } from "@/core/i18n/useLocale";
import { Award, ShieldCheck, Zap } from "lucide-react";

interface StepProps {
  onNext: (nextStep: QuizStep) => void;
}

export function StepEducationalTransition({ onNext }: StepProps) {
  const locale = useLocale();
  const t = useTranslations(locale);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
      {/* Coluna Esquerda: Texto e Citações */}
      <div className="md:col-span-6 flex flex-col gap-5">
        <div className="text-left md:text-left">
          <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full">
            {t.transitions.educational.badge}
          </span>
          <h2 className="text-xl md:text-2xl font-heading font-extrabold text-zinc-50 mt-3 leading-tight uppercase">
            {t.transitions.educational.title}
          </h2>
        </div>

        {/* Box do Gráfico de Zona Aeróbica */}
        <div className="bg-zinc-950/40 border border-zinc-900/60 p-5 rounded-2xl flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-brand-lime" />
            <h3 className="text-xs font-bold font-heading text-zinc-100 tracking-wider">
              {t.transitions.educational.scientificBase}
            </h3>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            {t.transitions.educational.fatBurningZone}
          </p>

          {/* Citação Científica */}
          <div className="border-l-2 border-brand-teal pl-4 py-1.5 mt-1 bg-brand-teal/5 rounded-r-xl">
            <p className="text-[10px] italic text-zinc-300 leading-relaxed">
              &ldquo;{t.transitions.educational.harvardQuote}&rdquo;
            </p>
          </div>
        </div>

        {/* Vantagens Ativas */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-start gap-3 bg-zinc-900/20 p-3.5 rounded-xl border border-zinc-900/40">
            <ShieldCheck className="w-4 h-4 text-brand-teal mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-zinc-200">{t.transitions.educational.aerobicCapacities}</h4>
              <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">
                {locale === "pt-br" 
                  ? "O amortecimento da esteira aliado ao plano de caminhada protege seus joelhos e coluna de impactos secos."
                  : "Treadmill deck cushioning aligned with the custom walking protocol shields knees and lower back from harsh impact."}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-zinc-900/20 p-3.5 rounded-xl border border-zinc-900/40">
            <Award className="w-4 h-4 text-brand-lime mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-zinc-200">{t.transitions.educational.metabolismBoost}</h4>
              <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">
                {locale === "pt-br"
                  ? "Ajuste de esforço baseado na sua resposta cardíaca atual para ganho de fôlego sustentável."
                  : "Effort levels calibrated according to your current heart response for steady and sustainable stamina gains."}
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => onNext("loading-calculation")}
          className="w-full mt-1 bg-brand-lime text-zinc-950 hover:bg-brand-lime-hover font-heading font-bold text-sm tracking-wide py-6 rounded-2xl transition-all cursor-pointer"
        >
          {t.transitions.educational.cta}
        </Button>
      </div>

      {/* Coluna Direita: Comparativo Calórico Incline vs Flat (Layout A grande) */}
      <div className="md:col-span-6 flex flex-col p-5 bg-zinc-950/40 rounded-3xl border border-zinc-900/60 aspect-square justify-center relative overflow-hidden group select-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-lime/5 via-transparent to-brand-teal/5 opacity-80" />
        
        {/* Título do Gráfico */}
        <div className="mb-4 text-center z-10 relative">
          <span className="text-[10px] font-heading font-black text-brand-lime uppercase tracking-wider">
            {locale === "pt-br" ? "QUEIMA CALÓRICA COMPARATIVA" : "METABOLIC COMPARATIVE BURN"}
          </span>
          <p className="text-[9px] text-zinc-500 font-medium mt-0.5">
            {locale === "pt-br" ? "Caminhada Plana vs. Método de Inclinação Ativa" : "Flat Walking vs. Incline Interval Method"}
          </p>
        </div>

        {/* SVG Gráfico de Curva de Combustão */}
        <svg className="w-full h-44 relative z-10 drop-shadow-[0_0_20px_rgba(20,184,166,0.08)]" viewBox="0 0 150 80" fill="none">
          {/* Grid lines */}
          <line x1="10" y1="70" x2="140" y2="70" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <line x1="10" y1="50" x2="140" y2="50" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <line x1="10" y1="30" x2="140" y2="30" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <line x1="10" y1="10" x2="140" y2="10" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

          {/* Curva A: Caminhada Plana (Linha de baixo) */}
          <path d="M 10 70 Q 75 60 140 50" stroke="#71717a" strokeWidth="2.5" strokeLinecap="round" />
          <text x="142" y="52" fill="#71717a" fontSize="5" fontWeight="bold">Flat</text>

          {/* Curva B: Método de Inclinação (Linha de cima) */}
          <path d="M 10 70 Q 75 35 140 12" stroke="#bef264" strokeWidth="3" strokeLinecap="round" />
          <text x="142" y="14" fill="#bef264" fontSize="5" fontWeight="black">Incline +60%</text>

          {/* Sombreado de área Incline */}
          <defs>
            <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bef264" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#bef264" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M 10 70 Q 75 35 140 12 L 140 70 Z" fill="url(#incGrad)" />

          {/* Pontos Indicadores */}
          <circle cx="140" cy="12" r="3" fill="#14b8a6" stroke="#09090b" strokeWidth="1" />
          <circle cx="140" cy="50" r="3" fill="#71717a" stroke="#09090b" strokeWidth="1" />
        </svg>

        <div className="flex justify-between items-center text-[9px] text-zinc-500 font-bold tracking-wider px-2 mt-4 z-10 relative">
          <span>0 MIN</span>
          <span>15 MIN</span>
          <span>30 MIN</span>
        </div>
      </div>

      {/* Bloco Ilustrativo de Comparação Antes e Depois (Local A: Denise 45-65) */}
      <div className="md:col-span-12 mt-2 bg-zinc-950/60 border border-zinc-900 p-4 rounded-2xl flex flex-col items-center gap-3">
        <span className="text-[10px] font-heading font-black text-brand-lime uppercase tracking-widest">
          {locale === "pt-br" ? "EVOLUÇÃO ILUSTRATIVA DE ADAPTAÇÃO METABÓLICA" : "ILLUSTRATIVE METABOLIC PROGRESSION"}
        </span>
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
              <Image
                src="/assets/characters/denise/before/denise-before.png"
                alt="Initial baseline illustration"
                fill
                sizes="(max-width: 768px) 45vw, 180px"
                className="object-contain object-bottom"
              />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              {locale === "pt-br" ? "Início" : "Initial State"}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden border border-brand-lime/30 bg-zinc-900 shadow-md shadow-lime-500/5">
              <Image
                src="/assets/characters/denise/after/denise-after.png"
                alt="Progressive adaptation illustration"
                fill
                sizes="(max-width: 768px) 45vw, 180px"
                className="object-contain object-bottom"
              />
            </div>
            <span className="text-[10px] font-bold text-brand-lime uppercase tracking-wider">
              {locale === "pt-br" ? "Resultado Pretendido" : "Target Progression"}
            </span>
          </div>
        </div>
        <p className="text-[9px] text-zinc-500 text-center italic mt-0.5">
          Illustrative transformation. Individual results vary.
        </p>
      </div>
    </div>
  );
}
