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

export default function ReportPage() {
  const { data } = useQuizStore();
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "en-gb";
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

  // Determinar o plano de treino adequado
  const getPlanDetails = () => {
    const hasSensitivities =
      data.jointSensitivities.knees ||
      data.jointSensitivities.ankles ||
      data.jointSensitivities.lowerBack;

    const wl = t.report.weeksList;

    if (hasSensitivities) {
      return {
        name: t.report.activeRecoveryName,
        description: t.report.activeRecoveryDesc,
        weeks: [
          { week: `${wl.week} 1`, focus: wl.w1Focus, detail: wl.w1Detail },
          { week: `${wl.week} 2`, focus: wl.w2Focus, detail: wl.w2Detail },
          { week: `${wl.week} 3`, focus: wl.w3Focus, detail: wl.w3Detail },
          { week: `${wl.week} 4`, focus: wl.w4Focus, detail: wl.w4Detail },
        ],
      };
    }

    if (data.hasInclineAccess && (data.cardioFitnessLevel === "intermediate" || data.cardioFitnessLevel === "advanced")) {
      return {
        name: t.report.inclineHiitName,
        description: t.report.inclineHiitDesc,
        weeks: [
          { week: `${wl.week} 1`, focus: locale === "pt-br" ? "Resistência de Inclinação" : "Incline Resistance", detail: locale === "pt-br" ? "20 min. Caminhada a 5.0 km/h alternando 2% e 5% de inclinação a cada 3 min." : "20 min. Alternate 2% and 5% incline every 3 min at 5.0 km/h." },
          { week: `${wl.week} 2`, focus: locale === "pt-br" ? "Pirâmide de Força" : "Strength Pyramid", detail: locale === "pt-br" ? "25 min. Inclinação subindo 1% a cada 2 min (máximo 7%), velocidade 4.5 km/h." : "25 min. Incline climbs 1% every 2 min (max 7%) at 4.5 km/h." },
          { week: `${wl.week} 3`, focus: locale === "pt-br" ? "Método 3-2-1 Incline" : "3-2-1 Incline Method", detail: locale === "pt-br" ? "30 min. Repetições de 3 min plano, 2 min a 6% de inclinação, 1 min a 9% de inclinação." : "30 min. Reps of 3 min flat, 2 min at 6% incline, 1 min at 9% incline." },
          { week: `${wl.week} 4`, focus: locale === "pt-br" ? "Escalada Metabólica" : "Metabolic Climb", detail: locale === "pt-br" ? "35 min. 10 min de aquecimento, seguido de subida contínua a 8% por 15 min, velocidade estável." : "35 min. 10 min warm-up, followed by continuous 8% climb for 15 min at steady speed." },
        ],
      };
    }

    return {
      name: t.report.paceBuilderName,
      description: t.report.paceBuilderDesc,
      weeks: [
        { week: `${wl.week} 1`, focus: locale === "pt-br" ? "Caminhada de Base" : "Base Walk", detail: locale === "pt-br" ? "20 min alternados entre ritmo lento (4.2 km/h) e ritmo firme (5.2 km/h)." : "20 min alternated between slow (4.2 km/h) and firm (5.2 km/h) pacing." },
        { week: `${wl.week} 2`, focus: locale === "pt-br" ? "Intervalados Curtos" : "Short Intervals", detail: locale === "pt-br" ? "25 min. Alternar 1 min rápido (6.0 km/h) por 1 min de recuperação ativa (4.5 km/h)." : "25 min. Alternate 1 min fast (6.0 km/h) with 1 min recovery (4.5 km/h)." },
        { week: `${wl.week} 3`, focus: locale === "pt-br" ? "Ritmo de Endurance" : "Endurance Rhythm", detail: locale === "pt-br" ? "30 min de caminhada constante a 5.2 km/h com acelerações na metade do treino." : "30 min steady walking at 5.2 km/h with short bursts in the middle." },
        { week: `${wl.week} 4`, focus: locale === "pt-br" ? "Pico Cardiovascular" : "Cardiovascular Peak", detail: locale === "pt-br" ? "35 min alternando blocos de 5 min a 5.5 km/h e 2 min de recuperação a 4.0 km/h." : "35 min alternating 5 min blocks at 5.5 km/h and 2 min recovery at 4.0 km/h." },
      ],
    };
  };

  const plan = getPlanDetails();

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

        {/* Grade Curricular do Plano de 4 Semanas */}
        <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-3xl flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <span className="text-[9px] font-bold text-brand-teal uppercase tracking-widest block">{t.report.planTitle}</span>
            <h2 className="text-lg font-heading font-extrabold text-zinc-50 mt-1">
              {plan.name}
            </h2>
            <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
              {plan.description}
            </p>
          </div>

          {/* Imagem Ilustrativa do Plano (Preset A - Full Body / Portrait) */}
          <div className="w-full h-72 relative rounded-2xl overflow-hidden border border-zinc-900/80 mt-1 bg-zinc-950">
            <Image
              src="/assets/characters/sarah/after/sarah-after.png"
              alt={locale === "pt-br" ? `Ilustração do treino ${plan.name}` : `Illustration of the ${plan.name} treadmill plan`}
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
            {plan.weeks.map((wk, idx) => (
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

        {/* Chamada de Conversão CTA */}
        <div className="bg-brand-lime/10 border border-brand-lime/20 p-5 md:p-6 rounded-3xl text-center flex flex-col gap-4 mt-2">
          <div>
            <h3 className="text-base font-heading font-extrabold text-zinc-100">
              {t.report.ctaCardTitle}
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
              {t.report.ctaCardDesc}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 w-full">
            <Button
              onClick={() => {
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
              className="w-full bg-brand-lime text-zinc-950 hover:bg-brand-lime-hover font-heading font-bold text-sm tracking-wide py-6 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {t.report.ctaButton}
              <ArrowRight className="w-4 h-4" />
            </Button>
            <span className="text-[11px] sm:text-xs text-zinc-300 font-medium">
              {t.report.ctaPriceMicroCopy.replace("{price}", singlePrice)}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
