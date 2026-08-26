"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useQuizStore } from "@/core/store/quizStore";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/core/i18n/translations";
import { useLocale } from "@/core/i18n/useLocale";
import { Mail, Shield, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { VISUAL_ASSETS } from "@/config/visualAssets";
import { trackEvent, sendQuizAnalyticsEvent } from "@/core/utils/analytics";
import { CRO_FLAGS } from "@/config/flags";
import { QuizProfileApiResponse } from "@/core/types/quiz";

export function StepEmailCapture() {
  const { data, updateData } = useQuizStore();
  const locale = useLocale();
  const t = useTranslations(locale);

  const [email, setEmail] = useState(data.email || "");
  const [consent, setConsent] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    trackEvent("lead_form_viewed", { locale });
  }, [locale]);

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleNext = async () => {
    if (isSubmitting || submittingRef.current) return;

    if (!validateEmail(email)) {
      setError(t.emailCapture.errorInvalid);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    setError(null);
    setIsSubmitting(true);
    submittingRef.current = true;

    try {
      const storeState = useQuizStore.getState();
      const sessionId = storeState.getOrCreateSessionId();
      const currentStoreData = storeState.data;
      const fullQuizPayload = {
        ...currentStoreData,
        email: normalizedEmail,
        sessionId,
      };

      const response = await fetch("/api/quiz/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          session_id: sessionId,
          quizData: fullQuizPayload,
        }),
      });

      const result: QuizProfileApiResponse = await response.json();

      if (!response.ok || !result.success || !result.profile_id) {
        throw new Error(
          result.error ||
            (locale === "pt-br"
              ? "Ocorreu um erro ao salvar seu perfil. Tente novamente."
              : "An error occurred saving your profile. Please try again.")
        );
      }

      // Salva no estado local do Zustand (preserva UX e session)
      updateData({
        email: normalizedEmail,
        profileId: result.profile_id,
        sessionId,
      });

      // Envia evento de Meta Analytics
      trackEvent("lead_submitted", {
        email: normalizedEmail,
        consent,
        locale,
        profileId: result.profile_id,
      });

      // Envia evento de Supabase Funnel Analytics
      sendQuizAnalyticsEvent({
        sessionId,
        eventType: "lead_submitted",
        stepSlug: "email-capture",
        stepNumber: 18,
        payload: { profileId: result.profile_id, locale },
      });

      // Redireciona o usuário para o Relatório Personalizado (/report)
      router.push(`/${locale}/report`);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : locale === "pt-br"
          ? "Erro na conexão. Tente novamente."
          : "Connection error. Please try again.";
      setError(errorMessage);
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  };

  const isValid = validateEmail(email);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
      {/* Coluna Esquerda: Texto e Input */}
      <div className="md:col-span-7 flex flex-col gap-6">
        <div className="text-left md:text-left">
          <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full">
            {t.emailCapture.badge}
          </span>
          <h2 className="text-xl md:text-2xl font-heading font-extrabold text-zinc-50 mt-3 leading-tight uppercase">
            {t.emailCapture.title}
          </h2>
          <p className="text-xs text-zinc-400 mt-2">
            {t.emailCapture.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-1">
          {/* Input Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="email"
              disabled={isSubmitting}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder={t.emailCapture.placeholder}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-brand-lime focus:ring-1 focus:ring-brand-lime rounded-xl pl-12 pr-4 py-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-all disabled:opacity-50"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 font-semibold bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center animate-shake">
              {error}
            </p>
          )}

          {/* Consentimento de Marketing */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => setConsent(!consent)}
            className="flex items-start gap-3 text-left hover:text-zinc-300 transition-colors p-1 disabled:opacity-50"
          >
            <div
              className={cn(
                "w-4 h-4 rounded border flex items-center justify-center transition-all mt-0.5 shrink-0",
                consent
                  ? "bg-brand-lime border-brand-lime text-zinc-950"
                  : "border-zinc-700 bg-zinc-950"
              )}
            >
              {consent && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span className="text-[10px] text-zinc-400 font-medium leading-relaxed">
              {t.emailCapture.consent}
            </span>
          </button>
        </div>

        {/* Botão de Envio */}
        <Button
          onClick={handleNext}
          disabled={!isValid || isSubmitting}
          className={cn(
            "w-full font-heading font-bold text-sm tracking-wide py-6 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2",
            isValid && !isSubmitting
              ? "bg-brand-lime text-zinc-950 hover:bg-brand-lime-hover"
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
              <span>{locale === "pt-br" ? "Gerando plano..." : "Saving profile..."}</span>
            </>
          ) : CRO_FLAGS.emailContextualCta ? (
            isValid
              ? t.emailCapture.cta
              : locale === "pt-br"
              ? "Digite seu e-mail para continuar"
              : "Enter your email to continue"
          ) : (
            t.emailCapture.cta
          )}
        </Button>


        {/* Rodapé de Confiança */}
        <div className="flex items-center justify-center gap-2 text-zinc-600 border-t border-zinc-900/60 pt-4">
          <Shield className="w-3.5 h-3.5" />
          <span className="text-[9px] font-semibold tracking-wide uppercase">
            {locale === "pt-br" ? "POLÍTICA ANTI-SPAM COMPATÍVEL COM LGPD" : "GDPR COMPLIANT ANTI-SPAM POLICY"}
          </span>
        </div>
      </div>

      {/* Coluna Direita: Mockup do Relatório de PDF no Smartphone (Layout A) */}
      <div className="md:col-span-5 hidden md:flex flex-col justify-end p-6 bg-zinc-950/40 rounded-2xl border border-zinc-900/60 aspect-square relative overflow-hidden group select-none">
        <Image
          src={VISUAL_ASSETS.results.emailCaptureWalkingPlan}
          alt={locale === "pt-br" ? "Mockup do seu plano de caminhada personalizado na esteira" : "Mockup of your personalised treadmill walking plan"}
          fill
          sizes="33vw"
          priority
          className="object-contain object-bottom transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        <div className="relative z-10 flex flex-col gap-1">
          <span className="text-[10px] font-heading font-black text-brand-lime uppercase tracking-widest">
            {locale === "pt-br" ? "ACESSO INSTANTÂNEO" : "INSTANT DELIVERY"}
          </span>
          <span className="text-[9px] text-zinc-300 font-medium leading-normal">
            {locale === "pt-br" ? "Receba seu relatório detalhado em segundos" : "Personal plan sent straight to your inbox"}
          </span>
        </div>
      </div>
    </div>
  );
}
