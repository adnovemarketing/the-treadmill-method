"use client";

import React from "react";
import { Sparkles, Activity, Calendar, Compass, Info } from "lucide-react";
import { PersonalisedPlanDisplayLabels } from "@/core/types/personalisation";

interface PersonalisationProofSectionProps {
  locale: string;
  labels: PersonalisedPlanDisplayLabels;
}

export function PersonalisationProofSection({
  locale,
  labels,
}: PersonalisationProofSectionProps) {
  const isPtBr = locale.toLowerCase() === "pt-br";

  return (
    <section aria-label="Personalisation Proof" className="w-full flex flex-col gap-4">
      {/* SECTION HEADER */}
      <div className="bg-zinc-900/40 border border-zinc-900/90 rounded-3xl p-5 md:p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 border border-brand-lime/20 px-3 py-1 rounded-full w-fit">
            {isPtBr ? "COM BASE NAS SUAS RESPOSTAS" : "BASED ON YOUR QUIZ ANSWERS"}
          </span>
          <h2 className="text-xl md:text-2xl font-heading font-black text-zinc-50 uppercase tracking-tight mt-1">
            {isPtBr ? "COMO PERSONALIZAMOS O SEU PLANO" : "HERE'S HOW WE PERSONALISED YOUR PLAN"}
          </h2>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {isPtBr
              ? "Usamos suas respostas para adaptar seu programa inicial, intensidade e cronograma semanal ao seu condicionamento e rotina atuais."
              : "We used your answers to match your starting programme, intensity and weekly schedule to your current fitness and routine."}
          </p>
        </div>

        {/* 4 DYNAMIC CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* CARD 1 — MATCHED PROGRAMME */}
          <div className="bg-zinc-950/80 border border-zinc-900 p-4 rounded-2xl flex flex-col justify-between gap-2.5 hover:border-zinc-800 transition-colors">
            <div className="flex items-center gap-2 text-zinc-500">
              <Sparkles className="w-3.5 h-3.5 text-brand-lime shrink-0" />
              <span className="text-[9px] font-heading font-extrabold uppercase tracking-wider text-zinc-400">
                {isPtBr ? "SEU PROGRAMA CORRESPONDENTE" : "YOUR MATCHED PROGRAMME"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-base font-heading font-black text-brand-lime uppercase tracking-tight">
                {labels.programmeLabel}
              </span>
              <span className="text-[11px] text-zinc-400 leading-snug">
                {isPtBr
                  ? "Selecionado a partir do seu condicionamento, acesso à esteira e conforto articular."
                  : "Selected from your fitness, treadmill access and movement comfort."}
              </span>
            </div>
          </div>

          {/* CARD 2 — STARTING LEVEL */}
          <div className="bg-zinc-950/80 border border-zinc-900 p-4 rounded-2xl flex flex-col justify-between gap-2.5 hover:border-zinc-800 transition-colors">
            <div className="flex items-center gap-2 text-zinc-500">
              <Activity className="w-3.5 h-3.5 text-brand-teal shrink-0" />
              <span className="text-[9px] font-heading font-extrabold uppercase tracking-wider text-zinc-400">
                {isPtBr ? "SEU NÍVEL INICIAL" : "YOUR STARTING LEVEL"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-base font-heading font-black text-zinc-100 uppercase tracking-tight">
                {labels.startingLevelLabel}
              </span>
              <span className="text-[11px] text-zinc-400 leading-snug">
                {isPtBr
                  ? "Ajustado ao seu nível cardiorrespiratório e conforto articular."
                  : "Adjusted to your current cardio fitness and movement comfort."}
              </span>
            </div>
          </div>

          {/* CARD 3 — WEEKLY SCHEDULE */}
          <div className="bg-zinc-950/80 border border-zinc-900 p-4 rounded-2xl flex flex-col justify-between gap-2.5 hover:border-zinc-800 transition-colors">
            <div className="flex items-center gap-2 text-zinc-500">
              <Calendar className="w-3.5 h-3.5 text-brand-teal shrink-0" />
              <span className="text-[9px] font-heading font-extrabold uppercase tracking-wider text-zinc-400">
                {isPtBr ? "SEU CRONOGRAMA SEMANAL" : "YOUR WEEKLY SCHEDULE"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-base font-heading font-black text-zinc-100 uppercase tracking-tight">
                {labels.sessionsPerWeekLabel}
              </span>
              <span className="text-[11px] text-zinc-400 leading-snug">
                {isPtBr
                  ? "Estruturado de acordo com os dias que você pode se comprometer de forma realista."
                  : "Built around the number of days you can realistically commit to."}
              </span>
            </div>
          </div>

          {/* CARD 4 — PERSONAL STRATEGY */}
          <div className="bg-zinc-950/80 border border-zinc-900 p-4 rounded-2xl flex flex-col justify-between gap-2.5 hover:border-zinc-800 transition-colors">
            <div className="flex items-center gap-2 text-zinc-500">
              <Compass className="w-3.5 h-3.5 text-brand-lime shrink-0" />
              <span className="text-[9px] font-heading font-extrabold uppercase tracking-wider text-zinc-400">
                {isPtBr ? "SUA ESTRATÉGIA PESSOAL" : "YOUR PERSONAL STRATEGY"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-base font-heading font-black text-brand-lime uppercase tracking-tight">
                {labels.personalStrategyLabel}
              </span>
              <span className="text-[11px] text-zinc-400 leading-snug">
                {isPtBr
                  ? "Escolhida com base no principal obstáculo que você nos relatou."
                  : "Chosen around the biggest challenge you told us about."}
              </span>
            </div>
          </div>
        </div>

        {/* DYNAMIC EXPLANATION CARD */}
        <div className="w-full bg-zinc-950/90 border border-brand-teal/20 p-4.5 sm:p-5 rounded-2xl flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-brand-teal">
            <Info className="w-4 h-4 shrink-0" />
            <span className="text-[10px] font-heading font-black uppercase tracking-wider text-zinc-200">
              {isPtBr ? "POR QUE ESTE PLANO COMBINA COM VOCÊ" : "WHY THIS MATCHES YOU"}
            </span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-normal">
            {labels.personalisedExplanation}
          </p>
        </div>
      </div>
    </section>
  );
}
