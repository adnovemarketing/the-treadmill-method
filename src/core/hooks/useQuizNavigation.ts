"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQuizStore } from "../store/quizStore";
import { QuizStep } from "../types/quiz";

export function useQuizNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isNavigatingRef = useRef(false);

  const {
    currentStep,
    history,
    futureSteps,
    goToStep,
    goBack,
    goForward,
    setStep,
  } = useQuizStore();

  // Sincroniza a URL (?step=...) com o estado do Zustand
  useEffect(() => {
    const urlStep = searchParams.get("step") as QuizStep | null;

    if (isNavigatingRef.current) {
      if (urlStep === currentStep) {
        isNavigatingRef.current = false;
      }
      return;
    }

    if (urlStep && urlStep !== currentStep) {
      // Se a URL mudou (por exemplo, botão Voltar do próprio navegador)
      setStep(urlStep);
    } else if (!urlStep) {
      // Se não há step na URL (entrada limpa), força o passo inicial na URL
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", currentStep);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, currentStep, pathname, router, setStep]);

  // Função para transicionar empurrando o parâmetro na URL
  const navigateTo = (step: QuizStep) => {
    isNavigatingRef.current = true;
    goToStep(step);
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", step);
    router.push(`${pathname}?${params.toString()}`);
  };

  const navigateBack = () => {
    if (history.length === 0) return;
    isNavigatingRef.current = true;
    goBack();
    // Pega o estado atualizado do Zustand após o pop
    const prevStep = useQuizStore.getState().currentStep;
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", prevStep);
    router.push(`${pathname}?${params.toString()}`);
  };

  const navigateForward = () => {
    if (futureSteps.length === 0) return;
    isNavigatingRef.current = true;
    goForward();
    const nextStep = useQuizStore.getState().currentStep;
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", nextStep);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Mapeamento de Etapas para o Dot Index da barra de progresso (0 a 4)
  const getStepDotIndex = (step: QuizStep): number => {
    switch (step) {
      case "onboarding-basics":
      case "age-selection":
      case "gender-selection":
        return 0;
      case "treadmill-frequency":
      case "cardio-level":
      case "incline-profile":
        return 1;
      case "injury-triage":
      case "sleep-quality":
      case "water-intake":
        return 2;
      case "daily-activity":
      case "daily-nutrition":
      case "antropometria":
        return 3;
      case "important-event":
      case "mindset-blockers":
      case "educational-transition":
      case "email-capture":
        return 4;
      default:
        return 4;
    }
  };

  // Mapeamento de Etapas para número sequencial visível (1-16)
  const TOTAL_VISIBLE_STEPS = 16;
  const getStepNumber = (step: QuizStep): number => {
    const order: QuizStep[] = [
      "onboarding-basics",
      "age-selection",
      "gender-selection",
      "treadmill-frequency",
      "cardio-level",
      "incline-profile",
      "injury-triage",
      "sleep-quality",
      "water-intake",
      "daily-activity",
      "daily-nutrition",
      "antropometria",
      "important-event",
      "mindset-blockers",
      "educational-transition",
      "email-capture",
    ];
    const idx = order.indexOf(step);
    return idx >= 0 ? idx + 1 : TOTAL_VISIBLE_STEPS;
  };

  // Ocultar barra de progresso em telas de transição e relatórios específicos
  const shouldShowProgressBar = (step: QuizStep): boolean => {
    return ![
      "loading-calculation",
      "report-projection",
    ].includes(step);
  };

  return {
    currentStep,
    history,
    futureSteps,
    activeDotIndex: getStepDotIndex(currentStep),
    showProgressBar: shouldShowProgressBar(currentStep),
    stepNumber: getStepNumber(currentStep),
    totalSteps: TOTAL_VISIBLE_STEPS,
    navigateTo,
    navigateBack: history.length > 0 ? navigateBack : undefined,
    navigateForward: futureSteps.length > 0 ? navigateForward : undefined,
  };
}
