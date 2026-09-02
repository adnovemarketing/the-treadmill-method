"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useQuizStore } from "@/core/store/quizStore";
import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { calculateTargetDate, calculateIMC, getIMCCategoryKey, getIMCCategoryColor } from "@/core/utils/calculations";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "@/core/i18n/translations";
import { getMarketConfig, formatCurrency } from "@/core/i18n/config";
import {
  Activity,
  Droplet,
  Compass,
  ArrowRight,
  Calendar,
  Flame,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent, sendQuizAnalyticsEvent } from "@/core/utils/analytics";
import { CRO_FLAGS } from "@/config/flags";
import { generatePersonalisedPlan, getPersonalisedPlanDisplayLabels } from "@/core/personalisation/engine";
import { PROGRAMME_LIBRARY } from "@/core/programmes/library";
import { PersonalisationProofSection } from "@/components/report/PersonalisationProofSection";
import { ProductPreviewSection } from "@/components/report/ProductPreviewSection";

export default function ReportPage() {
  const { data } = useQuizStore();
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "en-gb";
  const isPtBr = locale.toLowerCase() === "pt-br";
  const t = useTranslations(locale);
  const config = getMarketConfig(locale);
  const singlePrice = formatCurrency(config.prices.single, locale);
  // Redireciona de volta para o quiz se não houver dados preenchidos
  useEffect(() => {
    if (!data.weight || !data.height) {
      router.replace(`/${locale}/quiz`);
    } else {
      trackEvent("final_result_viewed", { locale });
    }
  }, [data, router, locale]);

  if (!data.weight || !data.height) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-zinc-800 border-t-brand-lime rounded-full animate-spin" />
        <p className="text-xs text-zinc-500 mt-4 font-heading font-medium tracking-wide">
          {t.common.unauthorized}
        </p>
      </div>
    );
  }

  const cWeight = data.weight;
  const tWeight = data.targetWeight || cWeight;
  const unit = data.weightUnit || "kg";
  const height = data.height;

  const imc = calculateIMC(cWeight, height, data.heightUnit || "cm", unit);
  const imcCatKey = getIMCCategoryKey(imc);
  const imcCatColor = getIMCCategoryColor(imcCatKey);
  const imcCatLabel = t.report[imcCatKey];
  
  const { dateString, weeks } = calculateTargetDate(cWeight, tWeight, unit, locale);

  // Recomendações de água baseadas em biomecânica/gênero
  const isMale = data.biomechanicsGender === "male";
  const waterLiters = isMale 
    ? (locale === "pt-br" ? "3.2 a 3.7 Litros" : "3.2 to 3.7 Litres")
    : (locale === "pt-br" ? "2.2 a 2.7 Litros" : "2.2 to 2.7 Litres");
  const waterCups = isMale ? "12 - 15" : "9 - 11";

  // Alvo calórico por treino baseado no objetivo principal
  const getCalorieTarget = () => {
    switch (data.primaryGoal) {
      case "weight_loss":
        return locale === "pt-br" ? "350 - 500 kcal / treino" : "350 - 500 kcal / session";
      case "cardio_endurance":
        return locale === "pt-br" ? "300 - 450 kcal / treino" : "300 - 450 kcal / session";
      case "consistency":
        return locale === "pt-br" ? "200 - 350 kcal / treino" : "200 - 350 kcal / session";
      default:
        return locale === "pt-br" ? "250 - 400 kcal / treino" : "250 - 400 kcal / session";
    }
  };

  // Motor Central de Personalização (Fonte Única de Verdade)
  const personalisedPlan = generatePersonalisedPlan(data);
  const labels = getPersonalisedPlanDisplayLabels(personalisedPlan, locale);
  const programmeDef = PROGRAMME_LIBRARY[personalisedPlan.programme];

  // Roteiro Factual de 21 Dias (3 Semanas / 9 Sessões) correspondente ao programa
  const programmeSyllabus = {
    gentle_start: [
      {
        week: isPtBr ? "Semana 1" : "Week 1",
        focus: isPtBr ? "Comece a Movimentar" : "Just Get Moving",
        detail: isPtBr
          ? "3 sessões orientadas (10–15 min) com foco em postura, ritmo confortável e proteção articular."
          : "3 guided sessions (10–15 min) focused on posture, easy rhythm and joint protection.",
      },
      {
        week: isPtBr ? "Semana 2" : "Week 2",
        focus: isPtBr ? "Construção de Consistência" : "Build Consistency",
        detail: isPtBr
          ? "3 sessões orientadas (15–20 min) com progressão suave de tempo para consolidar o hábito."
          : "3 guided sessions (15–20 min) with gradual duration increases to build consistency.",
      },
      {
        week: isPtBr ? "Semana 3" : "Week 3",
        focus: isPtBr ? "Confiança e Resistência" : "Build Confidence",
        detail: isPtBr
          ? "3 sessões orientadas (20–25 min) culminando no marco de caminhada de 21 dias."
          : "3 guided sessions (20–25 min) reaching your 21-day capstone foundation milestone.",
      },
    ],
    progressive_incline: [
      {
        week: isPtBr ? "Semana 1" : "Week 1",
        focus: isPtBr ? "Introdução à Inclinação" : "Introduce Incline",
        detail: isPtBr
          ? "3 sessões orientadas (20–25 min) introduzindo blocos suaves de inclinação na esteira."
          : "3 guided sessions (20–25 min) introducing gentle incline walking blocks.",
      },
      {
        week: isPtBr ? "Semana 2" : "Week 2",
        focus: isPtBr ? "Ondas de Resistência" : "Incline Stamina",
        detail: isPtBr
          ? "3 sessões orientadas (22–25 min) alternando ondas de inclinação e recuperação plana."
          : "3 guided sessions (22–25 min) alternating incline waves and flat recovery.",
      },
      {
        week: isPtBr ? "Semana 3" : "Week 3",
        focus: isPtBr ? "Integração e Eficiência" : "Incline Integration",
        detail: isPtBr
          ? "3 sessões orientadas (25–30 min) elevando gasto calórico com velocidade controlada."
          : "3 guided sessions (25–30 min) elevating caloric burn with controlled safe speed.",
      },
    ],
    pace_builder: [
      {
        week: isPtBr ? "Semana 1" : "Week 1",
        focus: isPtBr ? "Encontre seu Ritmo" : "Find Your Rhythm",
        detail: isPtBr
          ? "3 sessões orientadas (15–20 min) estabelecendo cadência base e blocos confortáveis."
          : "3 guided sessions (15–20 min) setting baseline cadence and comfortable tempo.",
      },
      {
        week: isPtBr ? "Semana 2" : "Week 2",
        focus: isPtBr ? "Desenvolvimento de Ritmo" : "Build Your Pace",
        detail: isPtBr
          ? "3 sessões orientadas (20–25 min) introduzindo intervalos progressivos na esteira plana."
          : "3 guided sessions (20–25 min) introducing progressive interval walking blocks.",
      },
      {
        week: isPtBr ? "Semana 3" : "Week 3",
        focus: isPtBr ? "Pico Cardiovascular" : "Consolidate Conditioning",
        detail: isPtBr
          ? "3 sessões orientadas (25–30 min) consolidando seu novo condicionamento de 21 dias."
          : "3 guided sessions (25–30 min) reaching your 21-day conditioning capstone.",
      },
    ],
  }[personalisedPlan.programme];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col pb-12">
      {/* Cabeçalho */}
      <Header />

      <main className="w-full max-w-lg mx-auto px-4 mt-6 flex flex-col gap-6">
        {/* Título Relatório */}
        <div className="text-center">
          <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full">
            {t.report.badge}
          </span>
          <h1 className="text-2xl md:text-3xl font-heading font-black text-zinc-50 mt-3 leading-tight uppercase">
            {t.report.title}
          </h1>
          <p className="text-xs text-zinc-400 mt-2">
            {data.email
              ? t.report.subtitle.replace("{email}", data.email)
              : locale === "pt-br"
              ? "Métricas de saúde e estrutura de treino personalizadas para seu perfil."
              : "Health metrics and training structure calculated for your profile."}
          </p>
        </div>

        {/* CTA âncora para utilizadores de alta intenção */}
        {CRO_FLAGS.reportTopCtaAnchor && (
          <div className="flex flex-col items-center gap-1.5 w-full">
            <button
              onClick={() => {
                trackEvent("checkout_clicked", { source: "report_top_anchor", locale });
                const sessionId = useQuizStore.getState().sessionId;
                if (sessionId) {
                  sendQuizAnalyticsEvent({
                    sessionId,
                    eventType: "offer_cta_clicked",
                    payload: { source: "report_top_anchor", locale },
                  });
                }
                router.push(`/${locale}/checkout`);
              }}
              className="w-full border border-brand-lime/30 text-brand-lime hover:bg-brand-lime/10 font-heading font-bold text-xs tracking-wide py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              aria-label={t.report.ctaButton}
            >
              {t.report.ctaButton}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] sm:text-xs text-zinc-400 font-medium">
              {t.report.ctaPriceMicroCopy.replace("{price}", singlePrice)}
            </span>
          </div>
        )}

        {/* Resumo Biométrico */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="bg-zinc-900/40 border border-zinc-900/80 p-4 rounded-2xl flex flex-col justify-between hover:border-zinc-800 transition-colors">
            <div className="flex items-center gap-2 text-zinc-500">
              <Activity className="w-3.5 h-3.5 text-brand-lime" />
              <span className="text-[9px] font-bold uppercase tracking-wider">{t.report.bodyStatus}</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-heading font-black text-zinc-100">{imc}</span>
                <span className={cn("text-[9px] font-extrabold uppercase tracking-wide block mt-0.5", imcCatColor)}>
                  {imcCatLabel}
                </span>
              </div>
              <span className="text-[10px] text-zinc-600 font-extrabold font-heading">BMI</span>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-900/80 p-4 rounded-2xl flex flex-col justify-between hover:border-zinc-800 transition-colors">
            <div className="flex items-center gap-2 text-zinc-500">
              <Flame className="w-3.5 h-3.5 text-brand-lime" />
              <span className="text-[9px] font-bold uppercase tracking-wider">{t.report.calorieTarget}</span>
            </div>
            <div className="mt-3">
              <span className="text-xs font-heading font-black text-zinc-100 block leading-tight">
                {getCalorieTarget()}
              </span>
              <span className="text-[9px] font-bold text-brand-teal uppercase tracking-wide block mt-1.5">
                {t.report.targetRecommended}
              </span>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-900/80 p-4 rounded-2xl flex flex-col justify-between hover:border-zinc-800 transition-colors">
            <div className="flex items-center gap-2 text-zinc-500">
              <Droplet className="w-3.5 h-3.5 text-brand-teal" />
              <span className="text-[9px] font-bold uppercase tracking-wider">{t.report.hydration}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <div>
                <span className="text-base font-heading font-black text-zinc-100 block">
                  {waterLiters}
                </span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide block mt-0.5">
                  {t.report.recommendedCups.replace("{cups}", waterCups)}
                </span>
              </div>
              
              {/* Copinhos de água visuais */}
              <div className="flex gap-0.5 items-end h-5">
                <div className="w-1.5 h-4 bg-brand-teal rounded-t-sm" />
                <div className="w-1.5 h-4.5 bg-brand-teal rounded-t-sm" />
                <div className="w-1.5 h-5 bg-brand-teal rounded-t-sm animate-pulse" />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-900/80 p-4 rounded-2xl flex flex-col justify-between hover:border-zinc-800 transition-colors">
            <div className="flex items-center gap-2 text-zinc-500">
              <Calendar className="w-3.5 h-3.5 text-brand-lime" />
              <span className="text-[9px] font-bold uppercase tracking-wider">{t.report.targetForecast}</span>
            </div>
            <div className="mt-3">
              <span className="text-xs font-heading font-black text-brand-lime block leading-normal">
                {dateString}
              </span>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide block mt-0.5">
                {t.report.estimatedInWeeks.replace("{weeks}", String(weeks))}
              </span>
            </div>
          </div>
        </div>

        {/* Bloco de Informações sobre Lesões */}
        {(data.jointSensitivities.knees || data.jointSensitivities.ankles || data.jointSensitivities.lowerBack) && (
          <div className="bg-amber-500/5 border border-amber-500/10 p-4.5 rounded-2xl flex gap-4 items-center">
            <div className="p-3 bg-amber-500/10 rounded-xl shrink-0 border border-amber-500/20">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-1.5">
                {t.report.jointSensitivityActive}
              </h3>
              <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                {t.report.jointSensitivityDesc}
              </p>
            </div>
          </div>
        )}

        {/* Grade Curricular do Programa de 21 Dias */}
        <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-3xl flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <span className="text-[9px] font-bold text-brand-teal uppercase tracking-widest block">
              {isPtBr ? "ROTEIRO DE 21 DIAS · 3 SEMANAS · 9 SESSÕES" : "21-DAY PROGRAMME · 3 WEEKS · 9 SESSIONS"}
            </span>
            <h2 className="text-lg font-heading font-extrabold text-zinc-50 mt-1">
              {labels.programmeLabel}
            </h2>
            <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
              {programmeDef.description}
            </p>
          </div>

          {/* Imagem Ilustrativa do Plano (Preset A - Full Body / Portrait) */}
          <div className="w-full h-72 relative rounded-2xl overflow-hidden border border-zinc-900/80 mt-1 bg-zinc-950">
            <Image
              src="/assets/characters/sarah/after/sarah-after.png"
              alt={locale === "pt-br" ? `Ilustração do treino ${labels.programmeLabel}` : `Illustration of the ${labels.programmeLabel} treadmill plan`}
              fill
              sizes="(max-width: 768px) 100vw, 512px"
              className="object-contain object-bottom"
            />
          </div>

          {/* Bloco Ilustrativo de Comparação Antes e Depois (Local B: Sarah 55+) */}
          <div className="bg-zinc-950/80 border border-zinc-900 p-4 rounded-2xl flex flex-col items-center gap-3 mt-1">
            <span className="text-[9px] font-heading font-black text-brand-teal uppercase tracking-widest">
              {locale === "pt-br" ? "PROJEÇÃO VISUAL DE CONDICIONAMENTO" : "VISUAL FITNESS TRAJECTORY"}
            </span>
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                  <Image
                    src="/assets/characters/sarah/before/sarah-before.png"
                    alt="Before walk method baseline"
                    fill
                    sizes="(max-width: 768px) 45vw, 180px"
                    className="object-contain object-bottom"
                  />
                </div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  {locale === "pt-br" ? "Linha de Base" : "Baseline"}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden border border-brand-teal/30 bg-zinc-900 shadow-md shadow-teal-500/5">
                  <Image
                    src="/assets/characters/sarah/after/sarah-after.png"
                    alt="After walk method milestones"
                    fill
                    sizes="(max-width: 768px) 45vw, 180px"
                    className="object-contain object-bottom"
                  />
                </div>
                <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider">
                  {locale === "pt-br" ? "Projeção Final" : "Final Milestone"}
                </span>
              </div>
            </div>
            <p className="text-[9px] text-zinc-500 text-center italic">
              Illustrative transformation. Individual results vary.
            </p>
          </div>

          {/* Cards de Semana com linha conectora (Linha de Tempo) */}
          <div className="flex flex-col gap-4 mt-2 relative pl-3">
            {/* Linha vertical conectora */}
            <div className="absolute left-7 top-6 bottom-6 w-0.5 bg-gradient-to-b from-brand-lime via-brand-teal to-zinc-900 pointer-events-none" />

            {/* Cards de Semana */}
            {programmeSyllabus.map((wk, idx) => (
              <div key={idx} className="bg-zinc-950 border border-zinc-900/80 p-4 rounded-2xl flex gap-4 relative z-10 transition-all hover:bg-zinc-900/40 hover:-translate-x-1 duration-200">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex flex-col items-center justify-center shrink-0 border border-zinc-800 text-[10px] font-heading font-black text-brand-lime shadow-inner shadow-lime-500/5">
                  <span>{locale === "pt-br" ? "S" : "W"}</span>
                  <span>0{idx+1}</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">{wk.focus}</h4>
                  <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                    {wk.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recomendações Iniciais de Performance */}
        <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-3xl flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-brand-lime" />
            <h3 className="text-sm font-heading font-extrabold text-zinc-100 uppercase tracking-wide">
              {t.report.instructionsTitle}
            </h3>
          </div>

          <ul className="flex flex-col gap-3.5 text-xs text-zinc-400 leading-normal pl-1">
            {t.report.instructions.map((inst, idx) => {
              const parts = inst.split(":");
              return (
                <li key={idx} className="flex gap-2">
                  <span className="text-brand-lime font-black shrink-0">•</span>
                  <span>
                    <strong className="text-zinc-300 font-bold block">{parts[0]}:</strong>
                    {parts.slice(1).join(":")}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Seção de Prova Real de Personalização */}
        <PersonalisationProofSection
          locale={locale}
          labels={labels}
        />

        {/* Seção de Demonstração Tangível do Produto (Real Member Area Preview) */}
        <ProductPreviewSection
          locale={locale}
          singlePrice={singlePrice}
          ctaButtonText={t.report.ctaButton}
          ctaPriceMicroCopy={t.report.ctaPriceMicroCopy}
          onCheckout={() => {
            trackEvent("checkout_clicked", { source: "report_bottom_cta", locale });
            const sessionId = useQuizStore.getState().sessionId;
            if (sessionId) {
              sendQuizAnalyticsEvent({
                sessionId,
                eventType: "offer_cta_clicked",
                payload: { source: "report_bottom_cta", locale },
              });
            }
            router.push(`/${locale}/checkout`);
          }}
        />
      </main>
    </div>
  );
}
