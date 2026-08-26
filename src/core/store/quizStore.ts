import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { QuizData, QuizStep } from '../types/quiz';

interface QuizState {
  data: QuizData;
  currentStep: QuizStep;
  history: QuizStep[];
  futureSteps: QuizStep[];
  sessionId: string;
  trackedViewedSteps: string[];
  getOrCreateSessionId: () => string;
  markStepViewedTracked: (step: string) => boolean;
  updateData: (newData: Partial<QuizData>) => void;
  goToStep: (step: QuizStep) => void;
  setStep: (step: QuizStep) => void;
  goBack: () => void;
  goForward: () => void;
  resetQuiz: () => void;
}

const initialQuizData: QuizData = {
  primaryGoal: null,
  ageGroup: null,
  biomechanicsGender: null,
  weeklyAccess: null,
  cardioFitnessLevel: null,
  hasInclineAccess: false,
  jointSensitivities: {
    knees: false,
    ankles: false,
    lowerBack: false,
    none: true,
  },
  sleepDuration: null,
  waterIntake: null,
  jobActivity: null,
  nutritionBaseline: null,
  weight: null,
  height: null,
  targetWeight: null,
  weightUnit: 'kg',
  heightUnit: 'cm',
  importantEvent: null,
  mainBlocker: null,
  preferredWorkoutTime: null,
  readyToChange: null,
  email: null,
  profileId: null,
  sessionId: null,
};

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      data: initialQuizData,
      currentStep: 'onboarding-basics',
      history: [],
      futureSteps: [],
      sessionId: '',
      trackedViewedSteps: [],

      getOrCreateSessionId: () => {
        const { sessionId } = get();
        if (sessionId) return sessionId;
        const newSessionId = generateUUID();
        set({ sessionId: newSessionId });
        return newSessionId;
      },

      markStepViewedTracked: (step) => {
        const { trackedViewedSteps } = get();
        if (trackedViewedSteps.includes(step)) {
          return false; // Already tracked
        }
        set({ trackedViewedSteps: [...trackedViewedSteps, step] });
        return true; // First time tracking this step
      },

      updateData: (newData) =>
        set((state) => ({
          data: { ...state.data, ...newData },
        })),

      setStep: (step) => set({ currentStep: step }),

      goToStep: (nextStep) => {
        const { currentStep, history } = get();
        // Evita duplicar etapas seguidas na pilha
        const newHistory = history[history.length - 1] === currentStep 
          ? history 
          : [...history, currentStep];

        set({
          currentStep: nextStep,
          history: newHistory,
          futureSteps: [], // Limpa o futuro ao tomar nova decisão/ramificar
        });
      },

      goBack: () => {
        const { currentStep, history, futureSteps } = get();
        if (history.length === 0) return;

        const newHistory = [...history];
        const prevStep = newHistory.pop()!;

        set({
          currentStep: prevStep,
          history: newHistory,
          futureSteps: [currentStep, ...futureSteps], // Adiciona a atual ao futuro
        });
      },

      goForward: () => {
        const { currentStep, history, futureSteps } = get();
        if (futureSteps.length === 0) return;

        const newFuture = [...futureSteps];
        const nextStep = newFuture.shift()!;

        set({
          currentStep: nextStep,
          history: [...history, currentStep],
          futureSteps: newFuture,
        });
      },

      resetQuiz: () =>
        set({
          data: initialQuizData,
          currentStep: 'onboarding-basics',
          history: [],
          futureSteps: [],
          sessionId: generateUUID(),
          trackedViewedSteps: [],
        }),
    }),
    {
      name: 'treadmill-method-quiz-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

