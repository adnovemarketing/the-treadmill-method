"use client";

import React, { useRef, useEffect } from "react";
import { useQuizNavigation } from "@/core/hooks/useQuizNavigation";
import { ProgressBar } from "./ProgressBar";
import { QuizLayout } from "./QuizLayout";
import { useLocale } from "@/core/i18n/useLocale";
import { cn } from "@/lib/utils";
import { trackEvent, sendQuizAnalyticsEvent } from "@/core/utils/analytics";
import { useQuizStore } from "@/core/store/quizStore";
import { QuizData, QuizStep } from "@/core/types/quiz";

function getAnsweredValueForStep(step: QuizStep, data: QuizData) {
  switch (step) {
    case 'onboarding-basics':
      return data.primaryGoal;
    case 'age-selection':
      return data.ageGroup;
    case 'gender-selection':
      return data.biomechanicsGender;
    case 'treadmill-frequency':
      return data.weeklyAccess;
    case 'cardio-level':
      return data.cardioFitnessLevel;
    case 'incline-profile':
      return data.hasInclineAccess;
    case 'injury-triage':
      return data.jointSensitivities;
    case 'sleep-quality':
      return data.sleepDuration;
    case 'water-intake':
      return data.waterIntake;
    case 'daily-activity':
      return data.jobActivity;
    case 'daily-nutrition':
      return data.nutritionBaseline;
    case 'antropometria':
      return { weight: data.weight, height: data.height, targetWeight: data.targetWeight };
    case 'important-event':
      return data.importantEvent;
    case 'mindset-blockers':
      return data.mainBlocker;
    case 'educational-transition':
      return "understood";
    case 'loading-calculation':
      return { preferredWorkoutTime: data.preferredWorkoutTime, readyToChange: data.readyToChange };
    case 'report-projection':
      return "continued";
    case 'email-capture':
      return data.email;
    default:
      return null;
  }
}

// Importações dos Componentes Físicos de Etapa
import { StepOnboardingBasics } from "./steps/StepOnboardingBasics";
import { StepAgeSelection } from "./steps/StepAgeSelection";
import { StepGenderSelection } from "./steps/StepGenderSelection";
import { StepTreadmillFrequency } from "./steps/StepTreadmillFrequency";
import { StepCardioLevel } from "./steps/StepCardioLevel";
import { StepInclineProfile } from "./steps/StepInclineProfile";
import { StepInjuryTriage } from "./steps/StepInjuryTriage";
import { StepSleepQuality } from "./steps/StepSleepQuality";
import { StepWaterIntake } from "./steps/StepWaterIntake";
import { StepDailyActivity } from "./steps/StepDailyActivity";
import { StepDailyNutrition } from "./steps/StepDailyNutrition";
import { StepAntropometria } from "./steps/StepAntropometria";
import { StepImportantEvent } from "./steps/StepImportantEvent";
import { StepMindsetBlockers } from "./steps/StepMindsetBlockers";
import { StepEducationalTransition } from "./steps/StepEducationalTransition";
import { StepLoadingCalculation } from "./steps/StepLoadingCalculation";
import { StepReportProjection } from "./steps/StepReportProjection";
import { StepEmailCapture } from "./steps/StepEmailCapture";

export function QuizContainer() {
  const {
    currentStep,
    activeDotIndex,
    showProgressBar,
    stepNumber,
    totalSteps,
    navigateTo,
    navigateBack,
    navigateForward,
  } = useQuizNavigation();

  const locale = useLocale();

  const prevStepRef = useRef<QuizStep | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    // 1. Meta Pixel event
    trackEvent("quiz_step_viewed", {
      step: currentStep,
      stepNumber,
      totalSteps,
      locale,
    });

    // Supabase Funnel Analytics
    const store = useQuizStore.getState();
    const sessionId = store.getOrCreateSessionId();

    if (stepNumber === 1 && !store.trackedViewedSteps.includes("onboarding-basics")) {
      sendQuizAnalyticsEvent({
        sessionId,
        eventType: "quiz_started",
        stepSlug: "onboarding-basics",
        stepNumber: 1,
      });
    }

    const isNewStepView = store.markStepViewedTracked(currentStep);
    if (isNewStepView) {
      sendQuizAnalyticsEvent({
        sessionId,
        eventType: "step_viewed",
        stepSlug: currentStep,
        stepNumber,
      });
    }

    // 2. Log question_answered if we moved from a previous step
    if (prevStepRef.current && prevStepRef.current !== currentStep) {
      const state = useQuizStore.getState().data;
      const answeredValue = getAnsweredValueForStep(prevStepRef.current, state);

      if (answeredValue !== null && answeredValue !== undefined) {
        trackEvent("question_answered", {
          step: prevStepRef.current,
          answer: answeredValue,
          locale,
        });

        sendQuizAnalyticsEvent({
          sessionId,
          eventType: "question_answered",
          stepSlug: prevStepRef.current,
          payload: { answer: answeredValue },
        });
      }
    }

    prevStepRef.current = currentStep;

    // Se o usuário chegar no email-capture ou report-projection, ele concluiu o quiz
    if (currentStep === "email-capture" || currentStep === "report-projection") {
      completedRef.current = true;
    }
  }, [currentStep, stepNumber, totalSteps, locale]);

  useEffect(() => {
    return () => {
      // Se desmontou e completedRef.current for falso, foi um abandono
      if (!completedRef.current) {
        trackEvent("quiz_abandoned", {
          lastStep: useQuizStore.getState().currentStep,
          activeDotIndex: useQuizStore.getState().history.length,
          locale,
        });
      }
    };
  }, [locale]);

  // Dynamic card widths to support side-by-side structures on desktop
  const getCardWidthClass = () => {
    switch (currentStep) {
      case "onboarding-basics":
      case "treadmill-frequency":
      case "sleep-quality":
      case "water-intake":
      case "daily-nutrition":
      case "mindset-blockers":
      case "email-capture":
        return "max-w-3xl"; // Layout A: Lateral right image on desktop
      case "educational-transition":
      case "cardio-level":
      case "daily-activity":
      case "injury-triage":
      case "report-projection":
        return "max-w-4xl"; // Wide educational layout and side-image steps
      case "age-selection":
        return "max-w-2xl"; // Layout B: Header image/grid options
      case "gender-selection":
      case "important-event":
        return "max-w-3xl"; // Layout C: Cards in grids with images
      case "incline-profile":
      case "antropometria":
        return "max-w-2xl"; // Layout D: Side icon/smaller forms
      default:
        return "max-w-md"; // Fallback standard
    }
  };

  // Mapeador do motor de renderização das etapas reais do quiz
  const renderStepContent = () => {
    switch (currentStep) {
      case "onboarding-basics":
        return <StepOnboardingBasics onNext={navigateTo} />;
      case "age-selection":
        return <StepAgeSelection onNext={navigateTo} />;
      case "gender-selection":
        return <StepGenderSelection onNext={navigateTo} />;
      case "treadmill-frequency":
        return <StepTreadmillFrequency onNext={navigateTo} />;
      case "cardio-level":
        return <StepCardioLevel onNext={navigateTo} />;
      case "incline-profile":
        return <StepInclineProfile onNext={navigateTo} />;
      case "injury-triage":
        return <StepInjuryTriage onNext={navigateTo} />;
      case "sleep-quality":
        return <StepSleepQuality onNext={navigateTo} />;
      case "water-intake":
        return <StepWaterIntake onNext={navigateTo} />;
      case "daily-activity":
        return <StepDailyActivity onNext={navigateTo} />;
      case "daily-nutrition":
        return <StepDailyNutrition onNext={navigateTo} />;
      case "antropometria":
        return <StepAntropometria onNext={navigateTo} />;
      case "important-event":
        return <StepImportantEvent onNext={navigateTo} />;
      case "mindset-blockers":
        return <StepMindsetBlockers onNext={navigateTo} />;
      case "educational-transition":
        return <StepEducationalTransition onNext={navigateTo} />;
      case "loading-calculation":
        return <StepLoadingCalculation onNext={navigateTo} />;
      case "report-projection":
        return <StepReportProjection onNext={navigateTo} />;
      case "email-capture":
        return <StepEmailCapture />;
      default:
        return (
          <div className="text-center p-4">
            <h2 className="text-lg font-bold text-zinc-300">
              {locale === "pt-br" ? "Etapa não encontrada" : "Step not found"}
            </h2>
          </div>
        );
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between">
      {/* Barra de Progresso superior */}
      <ProgressBar
        activeDotIndex={activeDotIndex}
        stepNumber={stepNumber}
        totalSteps={totalSteps}
        onBack={navigateBack}
        onForward={navigateForward}
        showProgress={showProgressBar}
      />

      {/* Container de transição de tela animada com layout centralizado */}
      <QuizLayout stepKey={currentStep}>
        <div className={cn(
          "w-full p-5 md:p-8 bg-zinc-900/30 rounded-3xl border border-zinc-900/60 mx-auto shadow-2xl transition-all duration-300",
          getCardWidthClass()
        )}>
          {renderStepContent()}
        </div>
      </QuizLayout>

      {/* Espaçamento estético inferior para empurrar o layout */}
      <div className="h-6" />
    </div>
  );
}
