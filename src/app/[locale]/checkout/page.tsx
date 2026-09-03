"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/core/i18n/translations";
import { getMarketConfig, formatCurrency } from "@/core/i18n/config";
import { useParams } from "next/navigation";
import {
  CreditCard,
  Lock,
  ChevronDown,
  ChevronUp,
  Star,
  Users,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VISUAL_ASSETS } from "@/config/visualAssets";
import { useQuizStore } from "@/core/store/quizStore";
import { CRO_FLAGS } from "@/config/flags";
import { trackEvent, sendQuizAnalyticsEvent } from "@/core/utils/analytics";

// Componente de FAQ Accordion Unitário
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-zinc-900 py-3.5">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-xs font-semibold text-zinc-200 hover:text-brand-lime transition-colors cursor-pointer select-none"
      >
        <span>{question}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-brand-lime shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
        )}
      </button>
      {isOpen && (
        <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const params = useParams();
  const locale = (params.locale as string) || "en-gb";
  const t = useTranslations(locale);
  const config = getMarketConfig(locale);
  const { data: quizData } = useQuizStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const includeMobilityProtocol = false;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackEvent("offer_viewed", { locale });
  }, [locale]);

  const handleCheckout = async () => {
    if (isSubmitting) return;

    const profileId = quizData.profileId;
    if (!profileId) {
      setError(
        locale === "pt-br"
          ? "Perfil do quiz não encontrado. Por favor, refaça o quiz para continuar."
          : "Quiz profile not found. Please complete the quiz first to access your custom plan."
      );
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const selectedPrice = formatCurrency(config.prices.single, locale);

      trackEvent("checkout_clicked", { plan: "single_9_90", price: selectedPrice, locale, profileId, includeMobilityProtocol });

      const sessionId = useQuizStore.getState().sessionId || quizData.sessionId;
      if (sessionId) {
        sendQuizAnalyticsEvent({
          sessionId,
          eventType: "checkout_started",
          payload: { plan: "single_9_90", price: selectedPrice, locale, profileId, includeMobilityProtocol },
        });
      }

      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile_id: profileId,
          locale,
          include_mobility_protocol: includeMobilityProtocol,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success || !resData.url) {
        throw new Error(
          resData.error ||
            (locale === "pt-br"
              ? "Erro ao iniciar o pagamento. Tente novamente."
              : "Failed to create checkout session. Please try again.")
        );
      }

      window.location.assign(resData.url);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : locale === "pt-br"
          ? "Erro de conexão. Tente novamente."
          : "Connection error. Please try again.";
      setError(msg);
      setIsSubmitting(false);
    }
  };


  const singlePrice = formatCurrency(config.prices.single, locale);
  const totalAmount = config.prices.single;
  const currentTotalPrice = formatCurrency(totalAmount, locale);

  // Personalised plan name for the checkout headline
  const getPersonalisedLabel = () => {
    const hasIncline = quizData.hasInclineAccess;
    const level = quizData.cardioFitnessLevel;
    const js = quizData.jointSensitivities;
    const hasJointIssues = js.knees || js.ankles || js.lowerBack;
    if (hasJointIssues) {
      return locale === "pt-br" ? "Protocolo de Recuperação Articular" : "Active Recovery Protocol";
    }
    if (hasIncline && (level === "intermediate" || level === "advanced")) {
      return locale === "pt-br" ? "Método de Inclinação HIIT" : "Incline HIIT Method";
    }
    return locale === "pt-br" ? "Método de Desenvolvimento de Ritmo" : "Pace Builder Method";
  };
  const personalisedPlan = getPersonalisedLabel();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col pb-12">
      {/* Cabeçalho */}
      <Header />

      <main className="w-full max-w-4xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Coluna Esquerda: Informações e Planos (col-span-7) */}
          <div className="md:col-span-7 flex flex-col gap-6">
            {/* Banner de Boas-vindas Personalizado */}
            <div className="border border-brand-lime/20 bg-brand-lime/5 p-4 rounded-2xl text-center">
              <span className="text-[10px] font-bold text-brand-lime tracking-widest uppercase block">
                {t.offer.congratsBadge}
              </span>
              {CRO_FLAGS.checkoutPersonalisedHeadline && personalisedPlan ? (
                <p className="text-xs text-zinc-300 font-semibold mt-1">
                  {locale === "pt-br"
                    ? `Seu plano personalizado — ${personalisedPlan} — está pronto.`
                    : `Your personalised plan — ${personalisedPlan} — is ready below.`}
                </p>
              ) : null}
            </div>

            {/* Oferta Única */}
            <div className="flex flex-col gap-3">
              <h2 className="text-xs font-heading font-extrabold text-zinc-400 uppercase tracking-wide px-1">
                {t.offer.planSectionTitle}
              </h2>

              <div className="w-full text-left p-5 rounded-2xl border bg-zinc-900 border-brand-lime shadow-lg shadow-lime-400/5 relative flex flex-col gap-2 select-none">
                {/* Tag Pagamento Único */}
                <span className="absolute -top-2.5 right-4 bg-brand-lime text-zinc-950 text-[9px] font-black font-heading px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {t.offer.singleBadge}
                </span>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-zinc-100">{t.offer.singleLabel}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-heading font-black text-brand-lime">{singlePrice}</span>
                  </div>
                </div>
                <div className="border-t border-zinc-900 pt-2 flex justify-between items-center text-[10px] text-zinc-400">
                  <span>{t.offer.singleSub}</span>
                </div>
              </div>

              {/* Early Mobile Purchase CTA (Mobile Only: md:hidden) */}
              <div className="flex flex-col gap-2.5 md:hidden mt-1">
                {/* Dynamic Total */}
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-bold text-zinc-400">
                    {t.offer.totalAmountLabel}
                  </span>
                  <span className="text-sm font-heading font-black text-brand-lime">
                    {t.offer.totalLabel.replace("{price}", currentTotalPrice)}
                  </span>
                </div>

                {error && (
                  <p className="text-xs text-red-500 font-semibold bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center animate-shake">
                    {error}
                  </p>
                )}

                <Button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className={cn(
                    "w-full font-heading font-bold text-xs sm:text-sm tracking-wide py-6 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-lime-400/10",
                    isSubmitting
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      : "bg-brand-lime text-zinc-950 hover:bg-brand-lime-hover"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                      <span>{locale === "pt-br" ? "Redirecionando..." : "Redirecting to checkout..."}</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 shrink-0" />
                      <span className="truncate">{t.offer.ctaButton.replace("{price}", currentTotalPrice)}</span>
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 mt-0.5 select-none">
                  <Lock className="w-3 h-3 text-brand-teal shrink-0" />
                  <span>{t.offer.secureCheckout} • {t.offer.sslEncrypted}</span>
                </div>
              </div>
            </div>

             {/* Benefícios Principais (Fase 3) */}
            <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-3xl flex flex-col gap-4">
              <h3 className="text-xs font-heading font-extrabold text-zinc-200 uppercase tracking-wide">
                {locale === "pt-br" ? "BENEFÍCIOS EXCLUSIVOS DO MÉTODO" : "EXCLUSIVE TRAINING BENEFITS"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Benefício 1: Personalização */}
                <div className="bg-zinc-950 border border-zinc-900/80 rounded-2xl overflow-hidden flex flex-col group">
                  <div className="w-full h-32 relative overflow-hidden">
                    <Image
                      src={VISUAL_ASSETS.offer.benefitPersonalised}
                      alt={locale === "pt-br" ? "Plano de caminhada 100% personalizado" : "100% personalised treadmill walking plan"}
                      fill
                      sizes="(max-width: 640px) 100vw, 250px"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-zinc-200">
                      {locale === "pt-br" ? "Plano Sob Medida" : "Customised Plan"}
                    </h4>
                    <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                      {locale === "pt-br"
                        ? "Velocidades e inclinações ajustadas ao seu peso, idade e capacidade cardíaca."
                        : "Interval speed and incline configured to your specific heart rate and body metrics."}
                    </p>
                  </div>
                </div>

                {/* Benefício 2: Acompanhamento de Progresso */}
                <div className="bg-zinc-950 border border-zinc-900/80 rounded-2xl overflow-hidden flex flex-col group">
                  <div className="w-full h-32 relative overflow-hidden">
                    <Image
                      src={VISUAL_ASSETS.offer.benefitProgress}
                      alt={locale === "pt-br" ? "Acompanhamento e evolução de queima calórica" : "Weekly progress and metabolic tracking"}
                      fill
                      sizes="(max-width: 640px) 100vw, 250px"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-zinc-200">
                      {locale === "pt-br" ? "Métricas e Progresso" : "Progress & Metrics"}
                    </h4>
                    <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                      {locale === "pt-br"
                        ? "Acompanhe de forma clara a queima calórica e evolução metabólica a cada semana."
                        : "Weekly projections and caloric oxidation updates keep you motivated and on target."}
                    </p>
                  </div>
                </div>

                {/* Benefício 3: Treino em Casa */}
                <div className="bg-zinc-950 border border-zinc-900/80 rounded-2xl overflow-hidden flex flex-col group">
                  <div className="w-full h-32 relative overflow-hidden">
                    <Image
                      src={VISUAL_ASSETS.offer.benefitHome}
                      alt={locale === "pt-br" ? "Treinos para fazer em casa ou na academia" : "Train at home or your local gym"}
                      fill
                      sizes="(max-width: 640px) 100vw, 250px"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-zinc-200">
                      {locale === "pt-br" ? "Qualquer Esteira" : "Any Treadmill"}
                    </h4>
                    <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                      {locale === "pt-br"
                        ? "Adequado tanto para esteiras residenciais simples quanto para os aparelhos da academia."
                        : "Compatible with basic home equipment or gym setups, with or without incline."}
                    </p>
                  </div>
                </div>

                {/* Benefício 4: Rotina Flexível */}
                <div className="bg-zinc-950 border border-zinc-900/80 rounded-2xl overflow-hidden flex flex-col group">
                  <div className="w-full h-32 relative overflow-hidden">
                    <Image
                      src={VISUAL_ASSETS.offer.benefitFlexible}
                      alt={locale === "pt-br" ? "Rotina flexível para qualquer horário" : "Flexible scheduling for busy lifestyles"}
                      fill
                      sizes="(max-width: 640px) 100vw, 250px"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-zinc-200">
                      {locale === "pt-br" ? "Tempo Otimizado" : "Flexible Schedule"}
                    </h4>
                    <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                      {locale === "pt-br"
                        ? "Sessões dinâmicas que duram entre 20 e 35 minutos, fáceis de encaixar no seu dia."
                        : "Highly efficient 20-to-35 minute walking protocols that fit into any calendar."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Entregáveis da Oferta */}
            <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-3xl flex flex-col gap-4">
              <h3 className="text-xs font-heading font-extrabold text-zinc-200 uppercase tracking-wide">
                {t.offer.whatYouGetTitle}
              </h3>
              <ul className="flex flex-col gap-3 text-xs text-zinc-400 leading-normal pl-1">
                {t.offer.whatYouGetItems.map((item, idx) => {
                  const parts = item.split(":");
                  return (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                      <span>
                        {parts.length > 1 ? (
                          <>
                            <strong className="text-zinc-200 font-bold">{parts[0]}:</strong>
                            {parts.slice(1).join(":")}
                          </>
                        ) : (
                          <span className="text-zinc-300">{item}</span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Prova Social (Depoimentos - Apenas em Desenvolvimento) */}
            {process.env.NODE_ENV === "development" && (
              <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-3xl flex flex-col gap-4 opacity-75 border-dashed">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-lime" />
                  <h3 className="text-xs font-heading font-extrabold text-zinc-200 uppercase tracking-wide">
                    {t.offer.testimonialsTitle} <span className="text-[9px] text-zinc-500 font-normal lowercase">(development preview)</span>
                  </h3>
                </div>

                <div className="flex flex-col gap-4">
                  {t.offer.testimonials.map((testi, idx) => (
                    <div key={idx} className="bg-zinc-950 border border-zinc-900 p-4 rounded-2xl flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-zinc-200">{testi.name}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] text-zinc-400 italic leading-relaxed">
                        &ldquo;{testi.text}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Acordeão */}
            <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-3xl flex flex-col gap-3">
              <h3 className="text-xs font-heading font-extrabold text-zinc-200 uppercase tracking-wide mb-2">
                {t.offer.faqTitle}
              </h3>
              {t.offer.faq.map((item, idx) => (
                <FAQItem key={idx} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>

          {/* Coluna Direita: Box de Fechamento de Compra Fixo (col-span-5) */}
          <div className="md:col-span-5 md:sticky md:top-24 flex flex-col gap-5">
            {/* Box Mockup de Produto Digital */}
            <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden select-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-lime/5 via-transparent to-brand-teal/5 opacity-80" />
              
              {/* Badge / Pill tag de Entrega Digital */}
              <span className="text-[9px] font-heading font-black text-brand-lime uppercase tracking-wider bg-brand-lime/10 border border-brand-lime/20 px-3 py-1 rounded-full mb-3 relative z-10 text-center">
                {locale === "pt-br" ? "⚡ ACESSO DIGITAL INSTANTÂNEO • SEM FRETE FÍSICO" : "⚡ INSTANT DIGITAL ACCESS • NO PHYSICAL SHIPPING"}
              </span>

              <div className="w-48 h-36 relative z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
                <Image
                  src={VISUAL_ASSETS.mockups.offerProduct}
                  alt={locale === "pt-br" ? "Mapeamento Completo do Método de Esteira" : "Complete Treadmill Method Roadmap"}
                  fill
                  sizes="192px"
                  className="object-contain"
                />
              </div>

              <span className="text-[10px] font-heading font-black text-brand-lime uppercase tracking-widest mt-4 relative z-10">
                {locale === "pt-br" ? "MÉTODO DE ESTEIRA COMPLETO" : "COMPLETE TREADMILL METHOD"}
              </span>
              <span className="text-[9px] text-zinc-500 font-medium text-center max-w-[170px] mt-1 relative z-10 leading-normal">
                {locale === "pt-br" ? "Planilha de caminhada + Guia nutricional inclusos" : "Includes walks planner & nutritional guide"}
              </span>
            </div>

            {/* Garantia de 30 dias */}
            <div className="bg-zinc-900/20 border border-zinc-900 p-4.5 rounded-3xl flex gap-3.5 items-center">
              <div className="w-10 h-10 relative shrink-0">
                <Image
                  src={VISUAL_ASSETS.trust.guarantee}
                  alt={locale === "pt-br" ? "Política de Reembolso de 30 Dias" : "30-Day Refund Policy"}
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-200">{t.offer.guaranteeTitle}</h3>
                <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                  {t.offer.guaranteeDesc}
                </p>
              </div>
            </div>

            {/* Botão de Compra CTA principal */}
            <div className="flex flex-col gap-2.5">
              {/* Dynamic Total Box */}
              <div className="flex justify-between items-center px-1 pb-0.5">
                <span className="text-xs font-bold text-zinc-400">
                  {t.offer.totalAmountLabel}
                </span>
                <span className="text-sm font-heading font-black text-brand-lime">
                  {t.offer.totalLabel.replace("{price}", currentTotalPrice)}
                </span>
              </div>

              {error && (
                <p className="text-xs text-red-500 font-semibold bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center animate-shake">
                  {error}
                </p>
              )}
              <Button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className={cn(
                  "w-full font-heading font-bold text-xs sm:text-sm tracking-wide py-7 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-lime-400/10",
                  isSubmitting
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-brand-lime text-zinc-950 hover:bg-brand-lime-hover"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                    <span>{locale === "pt-br" ? "Redirecionando..." : "Redirecting to checkout..."}</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 shrink-0" />
                    <span>{t.offer.ctaButton.replace("{price}", currentTotalPrice)}</span>
                  </>
                )}
              </Button>

              {/* Strip de Métodos de Pagamento e Trust Badges sob o CTA */}
              <div className="flex flex-col items-center gap-2 mt-1.5 w-full select-none">
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-zinc-400 opacity-90 w-full">
                  {/* Apple Pay */}
                  <span className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded-lg text-[10px] font-bold text-zinc-300">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.04.24-9.97-1.78-14.8-6.05-3.18-2.74-7.06-7.38-11.64-13.92-6.61-9.43-11.83-19.98-15.66-31.65-3.83-11.68-5.75-22.95-5.75-33.82 0-15.42 3.84-28.18 11.53-38.27 7.69-10.09 17.51-15.25 29.47-15.48 4.47 0 9.42 1.13 14.85 3.38 5.43 2.25 9.47 3.38 12.12 3.38 2.45 0 6.64-1.18 12.57-3.53 5.93-2.36 10.74-3.44 14.43-3.24 10.37.7 18.99 4.3 25.85 10.8 2.82 2.68 5.15 5.56 6.99 8.64-14.35 8.67-21.36 20.61-21.03 35.82.33 11.66 4.67 21.28 13.02 28.87 5.04 4.54 10.87 7.6 17.49 9.18-1.52 4.48-3.37 9.07-5.55 13.77zM119.22 31.54c0-7.39 2.69-14.35 8.07-20.88 5.38-6.53 12.14-10.45 20.28-11.76.22 1.09.33 2.07.33 2.94 0 7.39-2.77 14.45-8.31 21.18-5.54 6.73-12.35 10.65-20.43 11.76-.11-.98-.17-1.9-.17-2.76z"/>
                    </svg>
                    Apple Pay
                  </span>

                  {/* Google Pay */}
                  <span className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded-lg text-[10px] font-bold text-zinc-300">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.2.0 10.04.0 12s.47 3.8 1.29 5.42l3.99-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    GPay
                  </span>

                  {/* PayPal */}
                  <span className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded-lg text-[10px] font-bold text-zinc-300">
                    <span className="text-blue-400 font-black italic text-xs">P</span>ayPal
                  </span>

                  {/* Visa / Mastercard */}
                  <span className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded-lg text-[10px] font-bold text-zinc-300">
                    Visa / Mastercard
                  </span>

                  {/* Stripe */}
                  <span className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded-lg text-[10px] font-bold text-zinc-300">
                    Stripe 256-Bit
                  </span>
                </div>

                {/* Subline de Segurança */}
                <span className="text-[9px] text-zinc-400 text-center leading-normal mt-0.5 flex items-center justify-center gap-1">
                  🔒 256-Bit Bank-Level Encryption • Guaranteed Safe & Secure Checkout
                </span>
              </div>


              {/* Selos de Confiança (Fase 3) */}
              <div className="grid grid-cols-2 gap-2.5 mt-2 bg-zinc-900/10 border border-zinc-900/60 p-4.5 rounded-3xl">
                {/* Selo 1: Plano Personalizado */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 relative shrink-0">
                    <Image
                      src={VISUAL_ASSETS.trust.personalisedPlan}
                      alt={locale === "pt-br" ? "Plano Personalizado" : "Personalised Plan"}
                      fill
                      sizes="24px"
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[9px] font-black text-zinc-300 leading-tight uppercase tracking-wider">
                    {locale === "pt-br" ? "Plano Pessoal" : "Custom Plan"}
                  </span>
                </div>

                {/* Selo 2: Acesso Instantâneo */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 relative shrink-0">
                    <Image
                      src={VISUAL_ASSETS.trust.instantAccess}
                      alt={locale === "pt-br" ? "Acesso Instantâneo" : "Instant Delivery"}
                      fill
                      sizes="24px"
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[9px] font-black text-zinc-300 leading-tight uppercase tracking-wider">
                    {locale === "pt-br" ? "Entrega Rápida" : "Instant Access"}
                  </span>
                </div>

                {/* Selo 3: Garantia */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 relative shrink-0">
                    <Image
                      src={VISUAL_ASSETS.trust.guarantee}
                      alt={locale === "pt-br" ? "Política de Reembolso de 30 Dias" : "30-Day Refund Policy"}
                      fill
                      sizes="24px"
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[9px] font-black text-zinc-300 leading-tight uppercase tracking-wider">
                    {locale === "pt-br" ? "Garantia 30 D" : "30-Day Policy"}
                  </span>
                </div>

                {/* Selo 4: Pagamento Seguro */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 relative shrink-0">
                    <Image
                      src={VISUAL_ASSETS.trust.securePayment}
                      alt={locale === "pt-br" ? "Pagamento Seguro" : "Secure Checkout"}
                      fill
                      sizes="24px"
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[9px] font-black text-zinc-300 leading-tight uppercase tracking-wider">
                    {locale === "pt-br" ? "Compra Segura" : "Secure Pay"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 text-[9px] text-zinc-500 font-semibold uppercase tracking-wider mt-1.5">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-brand-teal" /> {t.offer.secureCheckout}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                <span>{t.offer.sslEncrypted}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Jurídico */}
        <div className="text-[9px] text-zinc-600 text-center leading-relaxed flex flex-col gap-2 mt-8 px-2">
          <p>{t.offer.legalDisclaimer}</p>
          <p>{t.offer.footerRights}</p>
        </div>
      </main>
    </div>
  );
}
