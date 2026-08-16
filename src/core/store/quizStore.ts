import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { QuizData, QuizStep } from '../types/quiz';

interface QuizState {
  data: QuizData;
  currentStep: QuizStep;
  history: QuizStep[];
  futureSteps: QuizStep[];
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
};


export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      data: initialQuizData,
      currentStep: 'onboarding-basics',
      history: [],
      futureSteps: [],

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
        }),
    }),
    {
      name: 'treadmill-method-quiz-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
