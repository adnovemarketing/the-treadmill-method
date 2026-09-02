"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2, ArrowRight, Sparkles, Calendar, Layers, ShieldCheck, Lock, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductPreviewSectionProps {
  locale: string;
  singlePrice: string;
  ctaButtonText: string;
  ctaPriceMicroCopy: string;
  onCheckout: () => void;
}

interface PreviewImageCardProps {
  src: string;
  alt: string;
  aspectClass?: string;
  caption?: string;
  imageClassName?: string;
  containerBgClass?: string;
  badge?: string;
}

function PreviewImageCard({
  src,
  alt,
  aspectClass = "aspect-[16/10]",
  caption,
  imageClassName = "object-cover object-top",
  containerBgClass = "bg-zinc-950",
  badge,
}: PreviewImageCardProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className={`w-full ${aspectClass} relative rounded-2xl overflow-hidden ${containerBgClass} border border-zinc-800 shadow-xl shadow-black/40 flex items-center justify-center`}>
        {badge && (
          <span className="absolute top-3 left-3 z-10 text-[9px] font-heading font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md bg-zinc-950/85 border border-zinc-700/60 text-zinc-300 backdrop-blur-sm shadow-md">
            {badge}
          </span>
        )}
        {!hasError ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 640px"
            className={`${imageClassName} transition-opacity duration-300`}
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-zinc-900 text-zinc-500">
            <Smartphone className="w-8 h-8 text-zinc-600 mb-2" />
            <span className="text-[11px] font-heading font-medium text-zinc-400">{alt}</span>
            <span className="text-[9px] text-zinc-600 mt-1">Real member area screenshot</span>
          </div>
        )}
      </div>
      {caption && (
        <span className="text-[10px] text-zinc-500 font-medium px-1">
          {caption}
        </span>
      )}
    </div>
  );
}

export function ProductPreviewSection({
  locale,
  singlePrice,
  ctaButtonText,
  ctaPriceMicroCopy,
  onCheckout,
}: ProductPreviewSectionProps) {
  const isPtBr = locale.toLowerCase() === "pt-br";

  return (
    <section aria-label="Product Preview" className="w-full flex flex-col gap-6 pt-2">
      {/* SECTION INTRO */}
      <div className="text-center flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 border border-brand-lime/20 px-3 py-1 rounded-full">
          {isPtBr ? "PRÉVIA REAL DA ÁREA DE MEMBROS" : "REAL MEMBER AREA PREVIEW"}
        </span>
        <h2 className="text-2xl md:text-3xl font-heading font-black text-zinc-50 uppercase tracking-tight leading-tight mt-1">
          {isPtBr ? "VEJA EXATAMENTE O QUE VOCÊ VAI RECEBER" : "SEE EXACTLY WHAT YOU'LL GET"}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-md leading-relaxed">
          {isPtBr
            ? "Suas respostas no quiz ajudam a definir um programa de esteira de 21 dias adaptado ao seu ponto de partida — com um plano claro para o que fazer a seguir."
            : "Your quiz answers help match you to a 21-day treadmill programme built around your starting point — with a clear plan for what to do next."}
        </p>
        <span className="text-[10px] sm:text-[11px] text-zinc-500 font-medium italic">
          {isPtBr
            ? "Capturas de tela reais da área de membros The Treadmill Method."
            : "Real screenshots from The Treadmill Method member area."}
        </span>
      </div>

      {/* PREVIEW BLOCK 1 — PERSONALISATION */}
      <div className="bg-zinc-900/40 border border-zinc-900/90 rounded-3xl p-5 md:p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-heading font-extrabold text-brand-lime uppercase tracking-wider">
            {isPtBr ? "SEU PLANO, PERSONALIZADO" : "YOUR PLAN, PERSONALISED"}
          </span>
          <h3 className="text-lg font-heading font-black text-zinc-50 uppercase tracking-tight">
            {isPtBr ? "Construído a partir das suas respostas" : "Built around your answers"}
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed mt-0.5">
            {isPtBr
              ? "Veja seu programa, nível inicial, cronograma semanal e estratégia pessoal — tudo organizado em um só lugar."
              : "See your programme, starting level, weekly schedule and personal strategy — all organised in one place."}
          </p>
        </div>

        {/* Screenshot 1 */}
        <PreviewImageCard
          src="/assets/product-preview/product-preview-plan.webp"
          alt="The Treadmill Method personalised plan overview"
          aspectClass="aspect-[16/10] sm:aspect-[16/9]"
          badge={isPtBr ? "EXEMPLO ILUSTRATIVO DE MEMBRO" : "EXAMPLE MEMBER VIEW"}
        />

        {/* Supporting bullet points */}
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
          <li className="flex items-start gap-2 bg-zinc-950/70 border border-zinc-900 p-2.5 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-lime shrink-0 mt-0.5" />
            <span className="text-zinc-300 leading-snug">
              {isPtBr ? "Programa adaptado ao seu ponto de partida" : "Programme matched to your starting point"}
            </span>
          </li>
          <li className="flex items-start gap-2 bg-zinc-950/70 border border-zinc-900 p-2.5 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-lime shrink-0 mt-0.5" />
            <span className="text-zinc-300 leading-snug">
              {isPtBr ? "Cronograma semanal realista" : "A realistic weekly schedule"}
            </span>
          </li>
          <li className="flex items-start gap-2 bg-zinc-950/70 border border-zinc-900 p-2.5 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-lime shrink-0 mt-0.5" />
            <span className="text-zinc-300 leading-snug">
              {isPtBr ? "Estratégia pessoal de consistência" : "A personal consistency strategy"}
            </span>
          </li>
        </ul>
      </div>

      {/* PREVIEW BLOCK 2 — 21-DAY ROADMAP (2 SCREENSHOTS) */}
      <div className="bg-zinc-900/40 border border-brand-lime/20 rounded-3xl p-5 md:p-6 flex flex-col gap-4 relative overflow-hidden">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-heading font-extrabold text-brand-lime uppercase tracking-wider">
            {isPtBr ? "SUA JORNADA DE 21 DIAS" : "YOUR 21-DAY ROADMAP"}
          </span>
          <h3 className="text-lg font-heading font-black text-zinc-50 uppercase tracking-tight">
            {isPtBr ? "Saiba exatamente o que fazer a seguir" : "Know exactly what to do next"}
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed mt-0.5">
            {isPtBr
              ? "Siga seu roteiro de 21 dias com 9 treinos orientados na esteira. Abra seu plano e veja sua próxima caminhada, duração e nível de esforço."
              : "Follow your 21-day roadmap with 9 guided treadmill sessions. Open your plan and see your next walk, duration and effort level."}
          </p>
        </div>

        {/* Side-by-side on desktop / stack on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <PreviewImageCard
            src="/assets/product-preview/product-preview-home.webp"
            alt="The Treadmill Method today's walk dashboard"
            aspectClass="aspect-[16/10]"
            imageClassName="object-contain object-center"
            caption={isPtBr ? "1. Painel diário: Treino de Hoje" : "1. Daily view: Today's Walk"}
          />
          <PreviewImageCard
            src="/assets/product-preview/product-preview-journey.webp"
            alt="The Treadmill Method 21-day journey roadmap"
            aspectClass="aspect-[16/10]"
            imageClassName="object-contain object-center"
            caption={isPtBr ? "2. Grade completa dos 21 Dias" : "2. Full 21-Day roadmap"}
          />
        </div>

        {/* Supporting items */}
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
          <li className="flex items-start gap-2 bg-zinc-950/70 border border-zinc-900 p-2.5 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-lime shrink-0 mt-0.5" />
            <span className="text-zinc-300 leading-snug">
              {isPtBr ? "9 treinos orientados na esteira" : "9 guided treadmill sessions"}
            </span>
          </li>
          <li className="flex items-start gap-2 bg-zinc-950/70 border border-zinc-900 p-2.5 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-lime shrink-0 mt-0.5" />
            <span className="text-zinc-300 leading-snug">
              {isPtBr ? "Progressão clara treino a treino" : "Clear session-by-session progression"}
            </span>
          </li>
          <li className="flex items-start gap-2 bg-zinc-950/70 border border-zinc-900 p-2.5 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-lime shrink-0 mt-0.5" />
            <span className="text-zinc-300 leading-snug">
              {isPtBr ? "Orientação simples de duração e esforço" : "Simple duration and effort guidance"}
            </span>
          </li>
        </ul>
      </div>

      {/* PREVIEW BLOCK 3 — SESSION DETAIL */}
      <div className="bg-zinc-900/40 border border-zinc-900/90 rounded-3xl p-5 md:p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-heading font-extrabold text-brand-lime uppercase tracking-wider">
            {isPtBr ? "CADA TREINO EXPLICADO" : "EVERY WALK EXPLAINED"}
          </span>
          <h3 className="text-lg font-heading font-black text-zinc-50 uppercase tracking-tight">
            {isPtBr ? "Veja o treino antes de começar" : "See the session before you start"}
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed mt-0.5">
            {isPtBr
              ? "Cada sessão dá a você uma duração clara, estrutura de blocos de caminhada e guia de esforço simples para que você suba na esteira sabendo exatamente o que fazer."
              : "Each session gives you a clear duration, walking-block structure and simple effort guidance so you can step onto the treadmill knowing what comes next."}
          </p>
        </div>

        {/* Screenshot 3 */}
        <PreviewImageCard
          src="/assets/product-preview/product-preview-session.webp"
          alt="The Treadmill Method session detail and walking blocks breakdown"
          aspectClass="aspect-[16/10] sm:aspect-[16/9]"
        />

        {/* Supporting items */}
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
          <li className="flex items-start gap-2 bg-zinc-950/70 border border-zinc-900 p-2.5 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-lime shrink-0 mt-0.5" />
            <span className="text-zinc-300 leading-snug">
              {isPtBr ? "Duração da sessão" : "Session duration"}
            </span>
          </li>
          <li className="flex items-start gap-2 bg-zinc-950/70 border border-zinc-900 p-2.5 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-lime shrink-0 mt-0.5" />
            <span className="text-zinc-300 leading-snug">
              {isPtBr ? "Divisão em blocos de caminhada" : "Walking-block breakdown"}
            </span>
          </li>
          <li className="flex items-start gap-2 bg-zinc-950/70 border border-zinc-900 p-2.5 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-lime shrink-0 mt-0.5" />
            <span className="text-zinc-300 leading-snug">
              {isPtBr ? "Guia de esforço fácil de acompanhar" : "Easy-to-follow effort guidance"}
            </span>
          </li>
        </ul>
      </div>

      {/* PREVIEW BLOCK 4 — PERSONAL STRATEGY */}
      <div className="bg-zinc-900/40 border border-zinc-900/90 rounded-3xl p-5 md:p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-heading font-extrabold text-brand-lime uppercase tracking-wider">
            {isPtBr ? "FEITO PARA A VIDA REAL" : "BUILT FOR REAL LIFE"}
          </span>
          <h3 className="text-lg font-heading font-black text-zinc-50 uppercase tracking-tight">
            {isPtBr ? "Orientações para manter sua consistência" : "Guidance to help you stay consistent"}
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed mt-0.5">
            {isPtBr
              ? "Receba orientações práticas para os momentos em que a consistência fica difícil — incluindo alternativas simples para manter sua rotina mesmo quando a vida fica corrida."
              : "Get practical guidance based on what can make consistency difficult for you — including simple ways to keep your routine going when life gets busy."}
          </p>
        </div>

        {/* Screenshot 4 */}
        <PreviewImageCard
          src="/assets/product-preview/product-preview-strategy.webp"
          alt="The Treadmill Method personal consistency strategy guide"
          aspectClass="aspect-[16/10] sm:aspect-[16/9]"
          imageClassName="object-contain object-center"
        />

        {/* Supporting items */}
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
          <li className="flex items-start gap-2 bg-zinc-950/70 border border-zinc-900 p-2.5 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-lime shrink-0 mt-0.5" />
            <span className="text-zinc-300 leading-snug">
              {isPtBr ? "Orientação prática de consistência" : "Practical consistency guidance"}
            </span>
          </li>
          <li className="flex items-start gap-2 bg-zinc-950/70 border border-zinc-900 p-2.5 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-lime shrink-0 mt-0.5" />
            <span className="text-zinc-300 leading-snug">
              {isPtBr ? "Estratégias simples de contingência" : "Simple fallback strategies"}
            </span>
          </li>
          <li className="flex items-start gap-2 bg-zinc-950/70 border border-zinc-900 p-2.5 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-lime shrink-0 mt-0.5" />
            <span className="text-zinc-300 leading-snug">
              {isPtBr ? "Desenhado para rotinas reais" : "Designed around realistic routines"}
            </span>
          </li>
        </ul>
      </div>

      {/* 9. PRODUCT SUMMARY CARD */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 md:p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
          <Sparkles className="w-4 h-4 text-brand-lime shrink-0" />
          <span className="text-xs font-heading font-extrabold text-zinc-100 uppercase tracking-wide">
            {isPtBr ? "SEU PROGRAMA DE 21 DIAS INCLUI" : "YOUR 21-DAY PROGRAMME INCLUDES"}
          </span>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <li className="flex items-center gap-2 text-zinc-200">
            <CheckCircle2 className="w-4 h-4 text-brand-lime shrink-0" />
            <span>{isPtBr ? "Programa adaptado ao seu ponto de partida" : "A programme matched to your starting point"}</span>
          </li>
          <li className="flex items-center gap-2 text-zinc-200">
            <CheckCircle2 className="w-4 h-4 text-brand-lime shrink-0" />
            <span>{isPtBr ? "9 treinos orientados na esteira" : "9 guided treadmill sessions"}</span>
          </li>
          <li className="flex items-center gap-2 text-zinc-200">
            <CheckCircle2 className="w-4 h-4 text-brand-lime shrink-0" />
            <span>{isPtBr ? "Roteiro claro de 21 dias" : "A clear 21-day roadmap"}</span>
          </li>
          <li className="flex items-center gap-2 text-zinc-200">
            <CheckCircle2 className="w-4 h-4 text-brand-lime shrink-0" />
            <span>{isPtBr ? "Guia de duração e esforço das sessões" : "Session duration & effort guidance"}</span>
          </li>
          <li className="flex items-center gap-2 text-zinc-200">
            <CheckCircle2 className="w-4 h-4 text-brand-lime shrink-0" />
            <span>{isPtBr ? "Divisão em blocos de caminhada" : "Walking-block breakdowns"}</span>
          </li>
          <li className="flex items-center gap-2 text-zinc-200">
            <CheckCircle2 className="w-4 h-4 text-brand-lime shrink-0" />
            <span>{isPtBr ? "Seu cronograma semanal" : "Your weekly schedule"}</span>
          </li>
          <li className="flex items-center gap-2 text-zinc-200">
            <CheckCircle2 className="w-4 h-4 text-brand-lime shrink-0" />
            <span>{isPtBr ? "Sua estratégia pessoal de consistência" : "Your personal consistency strategy"}</span>
          </li>
          <li className="flex items-center gap-2 text-zinc-200">
            <CheckCircle2 className="w-4 h-4 text-brand-lime shrink-0" />
            <span>{isPtBr ? "Acesso digital imediato após a compra" : "Instant digital access after purchase"}</span>
          </li>
        </ul>
      </div>

      {/* 10. PURCHASE CTA */}
      <div className="bg-brand-lime/10 border border-brand-lime/30 p-5 md:p-6 rounded-3xl text-center flex flex-col gap-3.5 shadow-xl shadow-lime-500/5">
        <div className="flex flex-col items-center gap-2 w-full">
          <Button
            onClick={onCheckout}
            className="w-full bg-brand-lime text-zinc-950 hover:bg-brand-lime-hover font-heading font-bold text-sm sm:text-base tracking-wide py-6 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-lime-500/10"
          >
            <span>{ctaButtonText}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <div className="flex flex-col items-center gap-0.5 mt-0.5">
            <span className="text-xs text-zinc-300 font-medium">
              {ctaPriceMicroCopy.replace("{price}", singlePrice)}
            </span>
            <span className="text-[11px] text-zinc-400 font-normal">
              {isPtBr ? "Pagamento único · Acesso digital imediato" : "One-time payment · Instant digital access"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
