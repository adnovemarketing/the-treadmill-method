// Manifesto centralizado e tipado para os assets estáticos do Quiz
export const VISUAL_ASSETS = {
  demographics: {
  age18To24: "/assets/characters/age-groups/age-18-24.png",
  age30_39: "/assets/characters/age-groups/age-25-34.png",
  age40_49: "/assets/characters/emma/after/emma-after.png",
  age50_59: "/assets/characters/denise/after/denise-after.png",
  age60_plus: "/assets/characters/denise/after/denise-after.png",
    genderFemale: "/assets/characters/sarah/after/sarah-after.png",
    genderMale: "/assets/characters/david/after/david-after.png",
  },
  treadmill: {
    experienceMan: "/assets/characters/david/walking/david-walking-natural.png",
    intensityLight: "/assets/characters/david/walking/david-walking-natural.png",
    intensityModerate: "/assets/characters/david/walking/david-walking-natural.png",
    intensityBrisk: "/assets/characters/david/walking/david-walking-natural.png",
    inclineWalking: "/assets/characters/sarah/walking/sarah-walking-natural.png",
    locationHome: "/assets/characters/david/walking/david-walking-natural.png",
    locationGym: "/assets/characters/david/walking/david-walking-natural.png",
    socialProofGroup: "/assets/characters/david/walking/david-walking-natural.png",
  },
  lifestyle: {
    balancedMeal: "/assets/characters/denise/after/denise-after.png",
    bodyTypesDiverse: "/assets/characters/emma/after/emma-after.png",
    currentWeightScale: "/assets/characters/sarah/walking/sarah-walking-natural.png",
    exerciseMotivation: "/assets/characters/emma/after/emma-after.png",
    heightMeasurement: "/assets/characters/sarah/walking/sarah-walking-natural.png",
    importantLifeEvents: "/assets/characters/denise/walking/denise-walking-natural.png",
    sleepDuration: "/assets/characters/denise/after/denise-after.png",
    trainingTimeAfternoon: "/assets/characters/emma/walking/emma-walking-natural.png",
    trainingTimeEvening: "/assets/characters/emma/walking/emma-walking-natural.png",
    trainingTimeMorning: "/assets/characters/emma/walking/emma-walking-natural.png",
    waterIntake: "/assets/characters/emma/after/emma-after.png",
    weightGoalProgress: "/assets/characters/sarah/after/sarah-after.png",
    workActivityMostlySeated: "/assets/characters/emma/walking/emma-walking-natural.png",
    workActivityModeratelyActive: "/assets/characters/emma/walking/emma-walking-natural.png",
    workActivityVeryActive: "/assets/characters/emma/walking/emma-walking-natural.png",
  },
  health: {
    consultation: "/assets/characters/david/after/david-after.png",
  },
  characters: {
    man38: "/assets/characters/david/after/david-after.png",
    man52: "/assets/characters/david/after/david-after.png",
    man66: "/assets/characters/david/after/david-after.png",
    woman35: "/assets/characters/sarah/after/sarah-after.png",
    woman48: "/assets/characters/emma/after/emma-after.png",
    woman63: "/assets/characters/denise/after/denise-after.png",
  },
  results: {
    walkingPlanProcessing: "/assets/characters/sarah/after/sarah-after.png",
    resultProjection: "/assets/characters/sarah/after/sarah-after.png",
    emailCaptureWalkingPlan: "/assets/characters/emma/after/emma-after.png",
  },
  mockups: {
    offerProduct: "/assets/mockups/offer-product-mockup-uk.webp.png",
  },
  offer: {
    benefitPersonalised: "/assets/characters/sarah/after/sarah-after.png",
    benefitProgress: "/assets/characters/emma/after/emma-after.png",
    benefitHome: "/assets/characters/david/walking/david-walking-natural.png",
    benefitFlexible: "/assets/characters/denise/after/denise-after.png",
  },
  trust: {
    securePayment: "/assets/icons/trust/icon-secure-payment.svg.png",
    guarantee: "/assets/icons/trust/icon-guarantee.svg.png",
    instantAccess: "/assets/icons/trust/icon-instant-access.svg.png",
    personalisedPlan: "/assets/icons/trust/icon-personalised-plan.svg.png",
  },
} as const;

export type VisualAssetsType = typeof VISUAL_ASSETS;
