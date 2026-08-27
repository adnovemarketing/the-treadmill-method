"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQuizStore } from "@/core/store/quizStore";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/core/i18n/useLocale";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { QuizProfileApiResponse } from "@/core/types/quiz";

export function StepEmailCapture() {
  const { updateData } = useQuizStore();
  const locale = useLocale();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const isPtBr = locale === "pt-br";

  const handleAutoSave = useCallback(async () => {
    if (isSubmitting || submittingRef.current) return;

    setError(null);
    setIsSubmitting(true);
    submittingRef.current = true;

    try {
      const storeState = useQuizStore.getState();
      const sessionId = storeState.getOrCreateSessionId();
      const currentStoreData = storeState.data;

      const fullQuizPayload = {
        ...currentStoreData,
        email: null,
        sessionId,
      };

      const response = await fetch("/api/quiz/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: null,
          session_id: sessionId,
          quizData: fullQuizPayload,
        }),
      });

      const result: QuizProfileApiResponse = await response.json();

      if (!response.ok || !result.success || !result.profile_id) {
        throw new Error(
          result.error ||
            (isPtBr
              ? "Ocorreu um erro ao salvar seu perfil. Tente novamente."
              : "An error occurred saving your profile. Please try again.")
        );
      }

      // Salva no estado local do Zustand (preserva profileId e sessionId)
      updateData({
        profileId: result.profile_id,
        sessionId,
      });

      // Redireciona o usuário imediatamente para o Relatório Personalizado (/report)
      router.push(`/${locale}/report`);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : isPtBr
          ? "Erro na conexão ao salvar seu plano. Tente novamente."
          : "Connection error saving your plan. Please try again.";
      setError(errorMessage);
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  }, [isSubmitting, isPtBr, locale, router, updateData]);

  // Executa o salvamento silencioso do perfil na montagem
  useEffect(() => {
    handleAutoSave();
  }, [handleAutoSave]);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center min-h-[350px]">
      {error ? (
        <div className="flex flex-col items-center gap-4 max-w-sm">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-heading font-extrabold text-zinc-100 uppercase">
              {isPtBr ? "Não foi possível finalizar" : "Could not complete plan"}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{error}</p>
          </div>
          <Button
            onClick={() => handleAutoSave()}
            className="mt-2 bg-brand-lime text-zinc-950 hover:bg-brand-lime-hover font-heading font-bold text-xs tracking-wide py-5 px-6 rounded-xl transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isPtBr ? "Tentar Novamente" : "Try Again"}</span>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-zinc-800 border-t-brand-lime rounded-full animate-spin flex items-center justify-center" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full w-fit mx-auto">
              {isPtBr ? "FINALIZANDO DIAGNÓSTICO" : "FINALISING DIAGNOSTIC"}
            </span>
            <h2 className="text-base md:text-lg font-heading font-black text-zinc-100 mt-2 uppercase tracking-wide">
              {isPtBr ? "Gerando seu plano personalizado..." : "Generating your custom plan..."}
            </h2>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto mt-1 leading-normal">
              {isPtBr
                ? "Calculando métricas biológicas e estruturando calendário de 4 semanas..."
                : "Calculating biological metrics and structuring your 4-week calendar..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
