import { Locale } from './config';

export interface TranslationSchema {
  metadata: {
    home: { title: string; description: string };
    quiz: { title: string; description: string };
    report: { title: string; description: string };
    checkout: { title: string; description: string };
  };
  common: {
    brandName: string;
    next: string;
    back: string;
    startQuiz: string;
    terms: string;
    privacy: string;
    support: string;
    language: string;
    loading: string;
    unauthorized: string;
  };
  landing: {
    badge: string;
    bridgeEyebrow: string;
    bridgeTitle: string;
    bridgeDesc: string;
    titleFirstPart: string;
    titleLime: string;
    titleAnd: string;
    titleTeal: string;
    subtitle: string;
    benefit1: string;
    benefit2: string;
    benefit3: string;
    cta: string;
    rating: string;
    activeUsers: string;
    workoutOfTheDay: string;
    treadmillHiit: string;
    workoutTitle: string;
    duration: string;
    stepWarmup: string;
    stepFirme: string;
    stepPico: string;
    cardioEffort: string;
    fcMax: string;
  };
  quiz: {
    steps: {
      onboardingBasics: {
        badge: string;
        title: string;
        subtitle: string;
        helperTap: string;
        weightLoss: { title: string; desc: string };
        cardioEndurance: { title: string; desc: string };
        consistency: { title: string; desc: string };
        stressRelief: { title: string; desc: string };
        generalHealth: { title: string; desc: string };
      };
      ageSelection: {
        title: string;
        subtitle: string;
        options: {
          '18_24': { label: string; desc: string };
          '25_34': { label: string; desc: string };
          '35_44': { label: string; desc: string };
          '45_54': { label: string; desc: string };
          '55_plus': { label: string; desc: string };
        };
      };
      genderSelection: {
        badge: string;
        title: string;
        subtitle: string;
        male: { label: string; desc: string };
        female: { label: string; desc: string };
        other: { label: string; desc: string };
      };
      treadmillFrequency: {
        badge: string;
        title: string;
        subtitle: string;
        oneTwo: { label: string; desc: string };
        threeFour: { label: string; desc: string };
        fivePlus: { label: string; desc: string };
        noneYet: { label: string; desc: string };
      };
      cardioLevel: {
        badge: string;
        title: string;
        subtitle: string;
        beginner: { label: string; desc: string };
        intermediate: { label: string; desc: string };
        advanced: { label: string; desc: string };
        poor: { label: string; desc: string };
      };
      inclineProfile: {
        badge: string;
        title: string;
        subtitle: string;
        yes: { label: string; desc: string };
        no: { label: string; desc: string };
      };
      injuryTriage: {
        badge: string;
        title: string;
        subtitle: string;
        knees: { title: string; desc: string };
        ankles: { title: string; desc: string };
        lowerBack: { title: string; desc: string };
        none: { title: string; desc: string };
        cta: string;
      };
      sleepQuality: {
        title: string;
        subtitle: string;
        options: {
          'less_5h': { label: string; desc: string };
          '5_to_6h': { label: string; desc: string };
          '6_to_7h': { label: string; desc: string };
          '7_to_8h': { label: string; desc: string };
          'more_8h': { label: string; desc: string };
        };
      };
      waterIntake: {
        title: string;
        subtitle: string;
        options: {
          'less_1L': { label: string; desc: string };
          '1_to_2L': { label: string; desc: string };
          '2_to_3L': { label: string; desc: string };
          'more_3L': { label: string; desc: string };
        };
      };
      dailyActivity: {
        title: string;
        subtitle: string;
        options: {
          'sedentary': { label: string; desc: string };
          'light_movement': { label: string; desc: string };
          'moderate': { label: string; desc: string };
          'very_active': { label: string; desc: string };
        };
      };
      dailyNutrition: {
        badge: string;
        title: string;
        subtitle: string;
        carbsHeavy: { label: string; desc: string };
        balanced: { label: string; desc: string };
        lowCarb: { label: string; desc: string };
        unstructured: { label: string; desc: string };
      };
      antropometria: {
        badge: string;
        title: string;
        subtitle: string;
        heightLabel: string;
        weightLabel: string;
        targetWeightLabel: string;
        errorInvalid: string;
        errorHeight: string;
        errorHeightRange: string;
        errorWeight: string;
        errorWeightRange: string;
        cta: string;
      };
      importantEvent: {
        title: string;
        subtitle: string;
        options: {
          'wedding': { label: string; desc: string };
          'vacation': { label: string; desc: string };
          'birthday': { label: string; desc: string };
          'health_goal': { label: string; desc: string };
          'no_specific_date': { label: string; desc: string };
        };
      };
      mindsetBlockers: {
        badge: string;
        title: string;
        subtitle: string;
        boredom: { label: string; desc: string };
        timeConstraint: { label: string; desc: string };
        jointPain: { label: string; desc: string };
        lackGuidance: { label: string; desc: string };
        none: { label: string; desc: string };
      };
    };
  };
  transitions: {
    educational: {
      badge: string;
      title: string;
      scientificBase: string;
      harvardQuote: string;
      fatBurningZone: string;
      aerobicCapacities: string;
      metabolismBoost: string;
      cta: string;
    };
    loading: {
      title: string;
      statusA: string;
      statusB: string;
      statusC: string;
      statusD: string;
      modalSchedule: {
        title: string;
        desc: string;
        morning: string;
        midday: string;
        evening: string;
        notSure: string;
      };
      modalCommit: {
        title: string;
        desc: string;
        yes: string;
        no: string;
      };
    };
    reportPreview: {
      badge: string;
      title: string;
      subtitle: string;
      targetWeightTitle: string;
      weeksDesc: string;
      safeRateDesc: string;
      disclaimer: string;
      cta: string;
    };
  };
  emailCapture: {
    badge: string;
    title: string;
    subtitle: string;
    placeholder: string;
    consent: string;
    errorInvalid: string;
    cta: string;
  };
  report: {
    badge: string;
    title: string;
    subtitle: string;
    bodyStatus: string;
    calorieTarget: string;
    hydration: string;
    targetForecast: string;
    underweight: string;
    normal: string;
    overweight: string;
    obese: string;
    targetRecommended: string;
    recommendedZone: string;
    recommendedCups: string;
    estimatedInWeeks: string;
    jointSensitivityActive: string;
    jointSensitivityDesc: string;
    planTitle: string;
    planSub: string;
    inclineHiitName: string;
    inclineHiitDesc: string;
    activeRecoveryName: string;
    activeRecoveryDesc: string;
    paceBuilderName: string;
    paceBuilderDesc: string;
    weeksList: {
      week: string;
      w1Focus: string;
      w1Detail: string;
      w2Focus: string;
      w2Detail: string;
      w3Focus: string;
      w3Detail: string;
      w4Focus: string;
      w4Detail: string;
    };
    instructionsTitle: string;
    instructions: string[];
    ctaCardTitle: string;
    ctaCardDesc: string;
    ctaButton: string;
    ctaPriceMicroCopy: string;
  };
  offer: {
    congratsBadge: string;
    urgencyTitle: string;
    planSectionTitle: string;
    singleLabel: string;
    singleBadge: string;
    singleSub: string;
    totalAmountLabel: string;
    totalLabel: string;
    quarterlyLabel: string;
    quarterlyBadge: string;
    monthlyLabel: string;
    quarterlySub: string;
    monthlySub: string;
    quarterlyPerDay: string;
    monthlyPerDay: string;
    ctaButton: string;
    secureCheckout: string;
    sslEncrypted: string;
    guaranteeTitle: string;
    guaranteeDesc: string;
    whatYouGetTitle: string;
    whatYouGetItems: string[];
    testimonialsTitle: string;
    testimonials: { name: string; text: string }[];
    faqTitle: string;
    faq: { q: string; a: string }[];
    legalDisclaimer: string;
    footerRights: string;
  };
}

export const translations: Record<Locale | 'pt-br', TranslationSchema> = {
  'en-gb': {
    metadata: {
      home: {
        title: 'The Treadmill Method | Personalised Weight Loss Plan',
        description: 'Lose weight sustainably and improve your cardiovascular fitness with custom treadmill walking workouts.'
      },
      quiz: {
        title: 'Treadmill Method | Take the Quiz',
        description: 'Complete our scientific triage to obtain your custom treadmill training protocol.'
      },
      report: {
        title: 'Your Performance Report | Treadmill Method',
        description: 'View your metabolic metrics, estimated success date, and custom 4-week workout calendar.'
      },
      checkout: {
        title: 'Get Your Custom Plan | Treadmill Method',
        description: 'Unlock your daily minute-by-minute treadmill speeds, incline targets, and audio guides.'
      }
    },
    common: {
      brandName: 'THE TREADMILL METHOD',
      next: 'Next',
      back: 'Back',
      startQuiz: 'Start Quiz',
      terms: 'Terms',
      privacy: 'Privacy',
      support: 'Support',
      language: 'Language',
      loading: 'Loading...',
      unauthorized: 'Redirecting to quiz...'
    },
    landing: {
      badge: 'HIGH-PERFORMANCE JOINT PROTECTION METHOD',
      bridgeEyebrow: "ONE WALKING TARGET DOESN'T FIT EVERYONE",
      bridgeTitle: '10,000 steps is a generic target. Your treadmill plan should start with you.',
      bridgeDesc: "Take the 1-minute quiz and we'll use your current fitness, treadmill access, movement comfort and routine to match you with a personalised starting programme.",
      titleFirstPart: 'Burn body fat on the treadmill',
      titleLime: 'without running',
      titleAnd: ' and ',
      titleTeal: 'without boredom',
      subtitle: 'Forget hours of flat, monotonous walking. The Treadmill Method calibrates personalized speeds and incline intervals tailored to your biological rhythm, protecting your knees and spine.',
      benefit1: 'High-calorie workouts lasting from 15 to 35 minutes',
      benefit2: 'Active protocol against impact and knee strain',
      benefit3: 'Dynamic intervals that banish treadmill boredom',
      cta: 'SEE MY PERSONALISED PLAN',
      rating: '4.9/5.0 rating',
      activeUsers: 'OVER 45,000 ACTIVE USERS',
      workoutOfTheDay: 'WORKOUT OF THE DAY',
      treadmillHiit: 'TREADMILL HIIT',
      workoutTitle: 'Incline Interval A',
      duration: 'Recommended duration: 25 minutes',
      stepWarmup: '00:00 - 03:00 (Warm-up)',
      stepFirme: '03:00 - 08:00 (Steady Pace)',
      stepPico: '08:00 - 12:00 (Peak Effort)',
      cardioEffort: 'Cardiovascular Effort',
      fcMax: '78% of Max Heart Rate'
    },
    quiz: {
      steps: {
        onboardingBasics: {
          badge: 'STEP 1: OBJECTIVE',
          title: 'What is your main goal on the treadmill?',
          subtitle: 'Your plan will be structured around this central target.',
          helperTap: 'Tap your main goal to begin',
          weightLoss: {
            title: 'Lose weight sustainably',
            desc: 'Burn more through walking'
          },
          cardioEndurance: {
            title: 'Improve fitness & stamina',
            desc: 'Feel fitter in everyday life'
          },
          consistency: {
            title: 'Build a walking habit',
            desc: 'Create a routine you can stick to'
          },
          stressRelief: {
            title: 'Reduce stress',
            desc: 'Use walking to clear your head'
          },
          generalHealth: {
            title: 'Improve overall health',
            desc: 'Move more and feel better'
          }
        },
        ageSelection: {
          title: 'What is your age group?',
          subtitle: 'Age directly influences cardiovascular recovery rate and safe treadmill intensities.',
          options: {
            '18_24': { label: '18 – 24 years', desc: 'High cardiopulmonary capacity and fast recovery.' },
            '25_34': { label: '25 – 34 years', desc: 'Active metabolism with great response to interval workouts.' },
            '35_44': { label: '35 – 44 years', desc: 'Optimization phase: focus on consistency and joint protection.' },
            '45_54': { label: '45 – 54 years', desc: 'Intensity adaptation to protect joints and lower back.' },
            '55_plus': { label: '55 years or older', desc: 'Safe low-impact workouts focusing on mobility.' }
          }
        },
        genderSelection: {
          badge: 'STEP 3: BIOMECHANICS',
          title: 'How should we calibrate your biomechanics?',
          subtitle: 'Biological markers help calculate target calorie burns.',
          male: { label: 'Male Biomechanics', desc: 'Calibrated for testosterone-influenced basal metabolic rate.' },
          female: { label: 'Female Biomechanics', desc: 'Calibrated for estrogen-influenced fat burning pathways.' },
          other: { label: 'Non-Binary / Neutral', desc: 'Standardized median metabolic formulas.' }
        },
        treadmillFrequency: {
          badge: 'STEP 4: FREQUENCY',
          title: 'How often do you have access to a treadmill?',
          subtitle: 'We will create a calendar that fits your routine.',
          oneTwo: { label: '1 to 2 days per week', desc: 'Good for active recovery and metabolic maintenance.' },
          threeFour: { label: '3 to 4 days per week', desc: 'Ideal for fat loss and cardiovascular adaptation.' },
          fivePlus: { label: '5 or more days per week', desc: 'Advanced metabolic training for rapid conditioning.' },
          noneYet: { label: 'No access yet (planning to join)', desc: 'We will set up an adaptation routine to start.' }
        },
        cardioLevel: {
          badge: 'STEP 5: CONDITIONING',
          title: 'How does your heart respond to brisk walking?',
          subtitle: 'Be honest. This avoids cardiovascular overstrain.',
          beginner: { label: 'Slightly Winded', desc: 'Can speak in full sentences, but breathing is noticeably faster.' },
          intermediate: { label: 'Firme and Steady', desc: 'Sweating slightly, heart rate elevated, but fully in control.' },
          advanced: { label: 'Athletic Response', desc: 'Can easily maintain speeds over 6.0 km/h with low heart rate.' },
          poor: { label: 'Exhausted Quickly', desc: 'Get tired within 5-10 minutes, joints ache, need frequent stops.' }
        },
        inclineProfile: {
          badge: 'STEP 6: INCLINE',
          title: 'Does your treadmill have adjustable incline?',
          subtitle: 'Incline is a powerful metabolic booster without joint impact.',
          yes: { label: 'Yes, it has adjustable incline', desc: 'Activates glutes and hamstrings, increasing calorie burn.' },
          no: { label: 'No, it only goes flat', desc: 'We will use speed-based interval walking templates.' }
        },
        injuryTriage: {
          badge: 'STEP 7: SAFETY',
          title: 'Do you experience sensitivity in any of these joints?',
          subtitle: 'Select all that apply. We will adjust the incline curve to prevent joint stress.',
          knees: { title: 'Knee Sensitivity', desc: 'We will limit steep declines and prioritize flat warm-ups.' },
          ankles: { title: 'Ankle Instability', desc: 'Focus on firm strides and active ankle stabilizers.' },
          lowerBack: { title: 'Lower Back Discomfort', desc: 'Prevents excessive strides to avoid spinal compression.' },
          none: { title: 'No joint sensitivities (100% free)', desc: 'Your plan can include any incline and speed challenge.' },
          cta: 'Next: Sleep Quality'
        },
        sleepQuality: {
          title: 'How do you rate your sleep quality?',
          subtitle: 'Sleep affects hormone balance, muscle recovery, and energy levels.',
          options: {
            'less_5h': { label: 'Less than 5 hours', desc: 'High fatigue. Plan will keep sessions shorter.' },
            '5_to_6h': { label: '5 to 6 hours', desc: 'Partial recovery. Focus on moderate pacing.' },
            '6_to_7h': { label: '6 to 7 hours', desc: 'Healthy baseline. Good energy for conditioning.' },
            '7_to_8h': { label: '7 to 8 hours', desc: 'Optimal window. Maximum training adaptation.' },
            'more_8h': { label: 'More than 8 hours', desc: 'Deep recovery. Perfect muscle rebuilding.' }
          }
        },
        waterIntake: {
          title: 'What is your average daily water intake?',
          subtitle: 'Proper hydration accelerates fat metabolism by up to 30% during treadmill sessions.',
          options: {
            'less_1L': { label: 'Less than 1 litre', desc: 'Dehydrated. Metabolism might be sluggish.' },
            '1_to_2L': { label: '1 to 2 litres', desc: 'Below target. Room to optimize metabolic speed.' },
            '2_to_3L': { label: '2 to 3 litres', desc: 'Optimal. Keeps joints lubricated and body active.' },
            'more_3L': { label: 'More than 3 litres', desc: 'Superhydrated. Excellent cellular detoxification.' }
          }
        },
        dailyActivity: {
          title: 'How active is your daily routine at work?',
          subtitle: 'Non-exercise physical activity (NEAT) scales your daily caloric output.',
          options: {
            'sedentary': { label: 'Sedentary (desk job)', desc: 'Mostly sitting. High need for structured walking.' },
            'light_movement': { label: 'Light standing', desc: 'On your feet occasionally (teaching, retail).' },
            'moderate': { label: 'Moderately active', desc: 'Frequently walking or moving (healthcare, service).' },
            'very_active': { label: 'Highly active (manual labor)', desc: 'Hard physical work. Treadmill will focus on recovery.' }
          }
        },
        dailyNutrition: {
          badge: 'STEP 11: NUTRITION',
          title: 'What is your usual pre-workout meal pattern?',
          subtitle: 'We will suggest when to schedule your treadmill walks for maximum fat oxidisation.',
          carbsHeavy: { label: 'High Carbohydrate', desc: 'Quick energy. Best for intense workouts.' },
          balanced: { label: 'Protein & Healthy Fats', desc: 'Sustained energy. Ideal for long walking intervals.' },
          lowCarb: { label: 'Low Carb / Ketogenic', desc: 'Fat-adapted. High efficiency during fasted walking.' },
          unstructured: { label: 'No set pattern / Snacking', desc: 'We will help establish a stable metabolic routine.' }
        },
        antropometria: {
          badge: 'STEP 12: ANTHROPOMETRY',
          title: 'What are your current physical measurements?',
          subtitle: 'Used for BMI calculations and the dynamic weight loss forecast graph.',
          heightLabel: 'Height',
          weightLabel: 'Current Weight',
          targetWeightLabel: 'Target Weight',
          errorInvalid: 'Please enter valid, safe physical measurements.',
          errorHeight: 'Please enter your height',
          errorHeightRange: 'Please enter a valid height (between 3–8 ft / 100–250 cm)',
          errorWeight: 'Please enter your current weight',
          errorWeightRange: 'Please enter a valid weight (between 4.5–39 st / 30–250 kg)',
          cta: 'Next: Goals Timeline'
        },
        importantEvent: {
          title: 'Do you have an upcoming date or milestone?',
          subtitle: 'A target event significantly increases mental commitment and adherence to the program.',
          options: {
            'wedding': { label: '💍 Wedding or formal event', desc: 'Accelerated pacing to look your best.' },
            'vacation': { label: '🏖️ Vacation or travel', desc: 'Beach or outdoor activity ready.' },
            'birthday': { label: '🎂 Milestone birthday', desc: 'Celebrate a healthier version of yourself.' },
            'health_goal': { label: '🩺 Medical or health target', desc: 'Focus on cardiovascular markers and vitals.' },
            'no_specific_date': { label: '📅 General improvement', desc: 'Consistency over speed, no fixed deadline.' }
          }
        },
        mindsetBlockers: {
          badge: 'STEP 14: BARRIERS',
          title: 'What has stopped you from succeeding in the past?',
          subtitle: 'We will build mini-habit loops to bypass this exact blocker.',
          boredom: { label: 'Boredom & Monotonia', desc: 'Tired of staring at a wall while walking.' },
          timeConstraint: { label: 'Time Constraints', desc: 'Cannot spend an hour a day on workouts.' },
          jointPain: { label: 'Joint Pain & Discomfort', desc: 'Walking hurts knees or lower back.' },
          lackGuidance: { label: 'Lack of Structure', desc: 'Not knowing what speeds and inclines to set.' },
          none: { label: 'None of the above', desc: 'Ready to start with no major obstacles.' }
        }
      }
    },
    transitions: {
      educational: {
        badge: 'SCIENTIFIC CALIBRATION',
        title: 'Why The Treadmill Method Works',
        scientificBase: 'BIOMECHANICAL ALIGNMENT',
        harvardQuote: '"Walking at an incline burns up to 60% more calories than flat walking, while reducing knee impact by 40%." — Harvard Medical School',
        fatBurningZone: 'Fat-Burning Zone (Active)',
        aerobicCapacities: 'Cardiovascular Strength',
        metabolismBoost: 'Post-Workout Metabolic Burn',
        cta: 'Understand. Proceed to Calculations'
      },
      loading: {
        title: 'CALCULATING YOUR PLAN',
        statusA: 'Analyzing biomechanics...',
        statusB: 'Assessing joint sensitivities...',
        statusC: 'Structuring incline interval blocks...',
        statusD: 'Generating 4-week workout calendar...',
        modalSchedule: {
          title: 'What is your preferred time of day to train?',
          desc: 'This allows us to calibrate your pre-workout energy windows.',
          morning: 'Morning',
          midday: 'Mid-day',
          evening: 'Evening',
          notSure: 'Not sure / Varies'
        },
        modalCommit: {
          title: 'Are you ready to commit to walking 15-30 minutes daily?',
          desc: 'Consistency is the absolute driver of metabolic change.',
          yes: 'Yes, I am 100% committed!',
          no: 'I want to start slowly (2-3x a week)'
        }
      },
      reportPreview: {
        badge: 'PREDICTIVE PROJECTION',
        title: 'Your Weight Loss Timeline',
        subtitle: 'Based on your starting metrics and the dynamic incline protocol.',
        targetWeightTitle: 'Target Weight reached:',
        weeksDesc: 'in {weeks} weeks of walking',
        safeRateDesc: 'Sustainable rate: 0.5kg/week. No extreme caloric restriction.',
        disclaimer: '*Results may vary depending on individual consistency, metabolic starting point, and daily diet.',
        cta: 'Continue to Access Plan'
      }
    },
    emailCapture: {
      badge: 'FINAL STEP',
      title: 'Where should we send your Personalised Plan?',
      subtitle: 'We will save your fat-burning calculations to this email for future access.',
      placeholder: 'Your best email address',
      consent: 'I want to receive weekly treadmill tips, healthy recipes and updates from The Treadmill Method.',
      errorInvalid: 'Please enter a valid email address.',
      cta: 'Continue to Access Report'
    },
    report: {
      badge: 'DIAGNOSTIC REPORT',
      title: 'YOUR PERFORMANCE PLAN',
      subtitle: 'Health metrics and training structure calculated for {email}.',
      bodyStatus: 'Body Status',
      calorieTarget: 'Caloric Target',
      hydration: 'Hydration',
      targetForecast: 'Forecast Date',
      underweight: 'Underweight',
      normal: 'Normal Weight',
      overweight: 'Overweight',
      obese: 'Obese',
      targetRecommended: 'Fat-Burning Zone',
      recommendedZone: 'Aerobic Target Zones',
      recommendedCups: 'Recommended ({cups} cups)',
      estimatedInWeeks: 'Estimated in {weeks} weeks',
      jointSensitivityActive: 'Joint Protection Protocol: Active',
      jointSensitivityDesc: 'Sensitivities detected. We adjusted the incline profile to protect your joints, focusing on biomechanically safe stride patterns.',
      planTitle: 'RECOMMENDED PROTOCOL',
      planSub: 'Tailored treadmill walk program based on your inputs.',
      inclineHiitName: 'Incline HIIT Method',
      inclineHiitDesc: 'Intense incline intervals to maximize calorie burn and activate glute structures.',
      activeRecoveryName: 'Active Recovery Method (Flat)',
      activeRecoveryDesc: 'Cadence variation on a flat deck to shield knee joints and lower back.',
      paceBuilderName: 'Pace Builder Method',
      paceBuilderDesc: 'Speed-based intervals on a flat deck to build cardiovascular conditioning and burn fat.',
      weeksList: {
        week: 'Week',
        w1Focus: 'Postural Adaptation',
        w1Detail: '20 min. Alternate slow and steady walking (4.0 to 5.0 km/h). Focus on short strides.',
        w2Focus: 'Base Aerobic Capacity',
        w2Detail: '25 min. Steady walk at 4.8 km/h focusing on nasal breathing.',
        w3Focus: 'Speed Intervals',
        w3Detail: '30 min. Alternate 1 min fast (5.8 km/h) and 2 min recovery (4.5 km/h).',
        w4Focus: 'Metabolic Consolidation',
        w4Detail: '35 min. Steady elevated walk (5.2 km/h). Excellent fat oxidation.'
      },
      instructionsTitle: 'Initial Instructions',
      instructions: [
        'Cot Elbows at 90 degrees and avoid holding onto side rails. This engages core stabilization and boosts calorie expenditure by up to 15%.',
        'When walking on an incline, lean forward slightly from the ankles, not the waist, to protect the lower back.',
        'Always warm up for the first 3 minutes at a slow pace (3.5 - 4.0 km/h) to lubricate joint capsules.'
      ],
      ctaCardTitle: 'Ready to unlock your detailed day-by-day guides?',
      ctaCardDesc: 'This diagnostic provides the overall structure. Unlock the full program to get minute-by-minute speed and incline charts, audio guides, and nutritional guidelines.',
      ctaButton: 'Get My Personalised Plan',
      ctaPriceMicroCopy: 'One-time payment {price}',
    },
    offer: {
      congratsBadge: 'ONE-TIME PAYMENT · IMMEDIATE ACCESS',
      urgencyTitle: 'ONE-TIME PAYMENT · IMMEDIATE ACCESS',
      planSectionTitle: 'YOUR PERSONALISED OFFER:',
      singleLabel: 'The Treadmill Method — Full Access',
      singleBadge: 'ONE-TIME PAYMENT',
      singleSub: 'Single one-time payment. Instant access to interactive digital protocols, video/audio guides, and printable charts directly on your phone, tablet, or computer.',
      totalAmountLabel: 'Total Amount:',
      totalLabel: 'Total: {price}',
      quarterlyLabel: '3-Month Membership',
      quarterlyBadge: 'MOST POPULAR / BEST VALUE',
      monthlyLabel: '1-Month Membership',
      quarterlySub: 'Single payment every 3 months. Cancel anytime.',
      monthlySub: 'Recurring monthly plan. Cancel anytime.',
      quarterlyPerDay: 'Only {price} / day',
      monthlyPerDay: 'Only {price} / day',
      ctaButton: 'GET MY PERSONALISED PLAN — {price}',
      secureCheckout: 'SECURE CHECKOUT',
      sslEncrypted: 'SSL ENCRYPTED',
      guaranteeTitle: '30-DAY REFUND POLICY',
      guaranteeDesc: "Try The Treadmill Method for 30 days. If it's not right for you, email us within 30 days of purchase and we'll refund your programme purchase. No performance targets or complicated conditions.",
      whatYouGetTitle: 'What is included in your plan:',
      whatYouGetItems: [
        'Instant Digital Web App & PDF Protocol Access (No waiting, access anywhere)',
        'Minute-by-minute speed & incline treadmill charts.',
        'Target metabolic heart rate zone calculators.',
        'Companion training audio guides for the treadmill.',
        'Nutritional energy guide for pre & post-workout.'
      ],
      testimonialsTitle: 'Results from our members:',
      testimonials: [
        {
          name: 'Sarah R., 34',
          text: 'I used to find the treadmill incredibly boring. With the interval plans of The Treadmill Method, time flies by. I lost 4.8 kg in 5 weeks and feel much stronger.'
        },
        {
          name: 'Mark V., 47',
          text: 'The joint protection adjustments were essential for me. I can do high-calorie workouts without feeling any lower back strain. Posture advice is spot on.'
        }
      ],
      faqTitle: 'Frequently Asked Questions',
      faq: [
        {
          q: 'Do I need an advanced treadmill for this?',
          a: 'No. Any basic commercial or home treadmill works. If your machine lacks incline, the Pace Builder flat-deck protocol will be assigned.'
        },
        {
          q: 'I have knee pain. Can I do this program?',
          a: 'Yes. The joint protection protocol avoids high-incline stress and focuses on short stride cadences to protect knees.'
        },
        {
          q: 'How does the refund guarantee work?',
          a: "Try The Treadmill Method for 30 days. If it's not right for you, email us within 30 days of purchase and we'll refund your programme purchase."
        },
        {
          q: 'Is this a recurring subscription?',
          a: 'No. This is a single, one-time payment. There are no recurring fees, hidden charges, or automatic renewals.'
        }
      ],
      legalDisclaimer: 'By clicking "GET MY PERSONALISED PLAN NOW" you agree to our Terms of Use and Privacy Policy. Individual results may vary depending on consistency and starting metabolic condition.',
      footerRights: '© 2026 The Treadmill Method. All rights reserved.'
    }
  },
  'pt-br': {
    metadata: {
      home: {
        title: 'The Treadmill Method | Plano de Emagrecimento Personalizado',
        description: 'Emagreça de forma sustentável e melhore seu condicionamento físico com treinos de caminhada personalizados na esteira.'
      },
      quiz: {
        title: 'Treadmill Method | Responda o Quiz',
        description: 'Complete nossa triagem científica para obter seu protocolo de treinamento exclusivo para esteira.'
      },
      report: {
        title: 'Seu Relatório de Performance | Treadmill Method',
        description: 'Veja suas métricas metabólicas, data estimada de sucesso e calendário de treinos de 4 semanas personalizado.'
      },
      checkout: {
        title: 'Obter Seu Plano Personalizado | Treadmill Method',
        description: 'Libere seu guia minuto a minuto de velocidades, metas de inclinação e áudios instrutivos de esteira.'
      }
    },
    common: {
      brandName: 'THE TREADMILL METHOD',
      next: 'Avançar',
      back: 'Voltar',
      startQuiz: 'Iniciar Quiz',
      terms: 'Termos',
      privacy: 'Privacidade',
      support: 'Suporte',
      language: 'Idioma',
      loading: 'Carregando...',
      unauthorized: 'Redirecionando para o quiz...'
    },
    landing: {
      badge: 'MÉTODO DE ALTA PERFORMANCE ARTICULAR',
      bridgeEyebrow: 'UMA ÚNICA META DE PASSOS NÃO SERVE PARA TODO MUNDO',
      bridgeTitle: '10.000 passos é uma meta genérica. Seu plano de esteira deve começar por você.',
      bridgeDesc: 'Faça o quiz de 1 minuto e usaremos seu condicionamento atual, acesso à esteira, conforto articular e rotina para encontrar seu programa inicial personalizado.',
      titleFirstPart: 'Queime gordura na esteira ',
      titleLime: 'sem correr',
      titleAnd: ' e ',
      titleTeal: 'sem tédio',
      subtitle: 'Esqueça horas de caminhada plana e monótona. O The Treadmill Method calibra velocidades e inclinações personalizadas para o seu ritmo biológico, protegendo joelhos e coluna.',
      benefit1: 'Planos de 15 a 35 minutos altamente calóricos',
      benefit2: 'Protocolo ativo contra impactos e dores nos joelhos',
      benefit3: 'Intervalados dinâmicos que cortam a monotonia',
      cta: 'VER MEU PLANO PERSONALIZADO',
      rating: 'Avaliação de 4.9/5.0',
      activeUsers: 'MAIS DE 45.000 ALUNOS ATIVOS',
      workoutOfTheDay: 'TREINO DO DIA',
      treadmillHiit: 'ESTEIRA HIIT',
      workoutTitle: 'Intervalado Inclinado A',
      duration: 'Duração recomendada: 25 minutos',
      stepWarmup: '00:00 - 03:00 (Aquecimento)',
      stepFirme: '03:00 - 08:00 (Ritmo Firme)',
      stepPico: '08:00 - 12:00 (Pico Esforço)',
      cardioEffort: 'Esforço Cardiovascular',
      fcMax: '78% da F.C. Máx'
    },
    quiz: {
      steps: {
        onboardingBasics: {
          badge: 'ETAPA 1: OBJETIVO',
          title: 'Qual o seu objetivo principal ao treinar na esteira?',
          subtitle: 'Seu plano será estruturado em torno desta meta central.',
          helperTap: 'Toque no seu objetivo principal para começar',
          weightLoss: {
            title: 'Emagrecimento sustentável',
            desc: 'Queime mais calorias caminhando'
          },
          cardioEndurance: {
            title: 'Mais condicionamento e fôlego',
            desc: 'Sinta-se com mais energia no dia a dia'
          },
          consistency: {
            title: 'Criar o hábito de caminhar',
            desc: 'Construa uma rotina consistente'
          },
          stressRelief: {
            title: 'Reduzir estresse e ansiedade',
            desc: 'Use a caminhada para clarear a mente'
          },
          generalHealth: {
            title: 'Melhorar a saúde geral',
            desc: 'Movimente-se mais e viva melhor'
          }
        },
        ageSelection: {
          title: 'Qual a sua faixa etária?',
          subtitle: 'A idade influencia diretamente a taxa de recuperação cardiovascular e a intensidade segura do treino na esteira.',
          options: {
            '18_24': { label: '18 – 24 anos', desc: 'Alta capacidade cardiopulmonar e recuperação rápida.' },
            '25_34': { label: '25 – 34 anos', desc: 'Metabolismo ativo com boa resposta ao treino intervalado.' },
            '35_44': { label: '35 – 44 anos', desc: 'Fase de otimização: foco em consistência e proteção articular.' },
            '45_54': { label: '45 – 54 anos', desc: 'Adaptação de intensidades para proteger articulações e coluna.' },
            '55_plus': { label: '55 anos ou mais', desc: 'Treinos seguros de baixo impacto com foco em mobilidade.' }
          }
        },
        genderSelection: {
          badge: 'ETAPA 3: BIOMECÂNICA',
          title: 'Como você prefere que calibremos a biomecânica?',
          subtitle: 'Indicadores biológicos ajudam a calcular metas de queima de gordura.',
          male: { label: 'Biomecânica Masculina', desc: 'Calibrado para taxa metabólica basal sob influência de testosterona.' },
          female: { label: 'Biomecânica Feminina', desc: 'Calibrado para queima calórica otimizada sob perfil de estrogênio.' },
          other: { label: 'Não-Binário / Neutro', desc: 'Fórmulas metabólicas médias padronizadas.' }
        },
        treadmillFrequency: {
          badge: 'ETAPA 4: FREQUÊNCIA',
          title: 'Quantas vezes por semana você tem acesso a uma esteira?',
          subtitle: 'Criaremos um calendário que se ajuste à sua rotina real.',
          oneTwo: { label: '1 a 2 dias por semana', desc: 'Ideal para recuperação ativa e manutenção metabólica.' },
          threeFour: { label: '3 a 4 dias por semana', desc: 'Excelente para perda de peso e adaptação cardíaca.' },
          fivePlus: { label: '5 ou mais dias por semana', desc: 'Treino metabólico avançado para condicionamento rápido.' },
          noneYet: { label: 'Sem acesso ainda (planejo começar)', desc: 'Estruturaremos uma rotina de adaptação inicial.' }
        },
        cardioLevel: {
          badge: 'ETAPA 5: CONDICIONAMENTO',
          title: 'Qual a sua resposta cardiovascular atual ao caminhar rápido?',
          subtitle: 'Seja sincero(a). Isso previne sobrecarga cardíaca.',
          beginner: { label: 'Levemente ofegante', desc: 'Consigo falar frases completas, mas a respiração é visivelmente mais rápida.' },
          intermediate: { label: 'Firme e estável', desc: 'Suando levemente, batimentos elevados, mas totalmente sob controle.' },
          advanced: { label: 'Resposta atlética', desc: 'Caminho acima de 6.0 km/h com facilidade e frequência cardíaca baixa.' },
          poor: { label: 'Exaustão precoce', desc: 'Sinto cansaço extremo em 5-10 minutos de caminhada rápida.' }
        },
        inclineProfile: {
          badge: 'ETAPA 6: INCLINAÇÃO',
          title: 'Sua esteira possui ajuste de inclinação ativa?',
          subtitle: 'A inclinação potencializa a queima calórica sem impactar as articulações.',
          yes: { label: 'Sim, possui inclinação regulável', desc: 'Ativa glúteos e posterior de coxa, aumentando o gasto calórico.' },
          no: { label: 'Não, ela é apenas plana', desc: 'Utilizaremos variações de velocidade no plano para intervalados.' }
        },
        injuryTriage: {
          badge: 'ETAPA 7: SEGURANÇA',
          title: 'Você possui sensibilidade ou dor em alguma dessas articulações?',
          subtitle: 'Selecione todas as opções aplicáveis. Ajustaremos a inclinação para proteger suas articulações.',
          knees: { title: 'Sensibilidade nos Joelhos', desc: 'Evitaremos inclinações severas e subidas sem aquecimento.' },
          ankles: { title: 'Instabilidade nos Tornoselos', desc: 'Foco em estabilidade lateral e cadência firme de passada.' },
          lowerBack: { title: 'Desconforto na Lombar', desc: 'Evita passadas excessivas que possam comprimir a coluna.' },
          none: { title: 'Sem dores articulares (100% livre)', desc: 'Sua esteira pode ser calibrada para qualquer desafio.' },
          cta: 'Avançar para Qualidade do Sono'
        },
        sleepQuality: {
          title: 'Como você avalia a qualidade do seu sono recente?',
          subtitle: 'O sono afeta o equilíbrio hormonal, a recuperação muscular e a queima de gordura.',
          options: {
            'less_5h': { label: 'Menos de 5 horas', desc: 'Fadiga alta. Os treinos serão mais curtos.' },
            '5_to_6h': { label: '5 a 6 horas', desc: 'Recuperação parcial. Foco em ritmo moderado.' },
            '6_to_7h': { label: '6 a 7 horas', desc: 'Linha de base saudável. Bom nível de energia.' },
            '7_to_8h': { label: '7 a 8 horas', desc: 'Janela ideal. Máxima adaptação ao treinamento.' },
            'more_8h': { label: 'Mais de 8 horas', desc: 'Recuperação profunda. Excelente reconstrução muscular.' }
          }
        },
        waterIntake: {
          title: 'Qual o seu nível de hidratação diária estimado?',
          subtitle: 'Uma hidratação adequada pode acelerar o metabolismo de queima calórica em até 30% na esteira.',
          options: {
            'less_1L': { label: 'Menos de 1 litro', desc: 'Desidratado. O metabolismo pode estar lento.' },
            '1_to_2L': { label: '1 a 2 litros', desc: 'Abaixo da meta. Espaço para otimizar queima calórica.' },
            '2_to_3L': { label: '2 a 3 litros', desc: 'Excelente. Mantém articulações lubrificadas e ativas.' },
            'more_3L': { label: 'Mais de 3 litros', desc: 'Superhidratado. Ótima desintoxicação celular.' }
          }
        },
        dailyActivity: {
          title: 'Como descreve o nível de movimento físico no seu trabalho?',
          subtitle: 'A atividade física não relacionada ao exercício (NEAT) molda sua queima metabólica diária.',
          options: {
            'sedentary': { label: 'Sedentário (trabalho de escritório)', desc: 'Passo o dia sentado. Alta necessidade de caminhada estruturada.' },
            'light_movement': { label: 'Leve (de pé ocasionalmente)', desc: 'Algum movimento ao longo do dia (professor, comércio).' },
            'moderate': { label: 'Moderadamente ativo', desc: 'Ando ou me movo frequentemente (saúde, atendimento).' },
            'very_active': { label: 'Altamente ativo (trabalho braçal)', desc: 'Esforço físico diário. O plano na esteira focará em recuperação.' }
          }
        },
        dailyNutrition: {
          badge: 'ETAPA 11: NUTRIÇÃO',
          title: 'Como é o seu padrão alimentar básico de combustível pré-treino?',
          subtitle: 'Ajudaremos a posicionar seus treinos no horário de melhor oxidação de gorduras.',
          carbsHeavy: { label: 'Alto teor de Carboidratos', desc: 'Energia rápida. Bom para treinos intervalados intensos.' },
          balanced: { label: 'Proteína e Gorduras Saudáveis', desc: 'Energia duradoura. Excelente para caminhadas de inclinação.' },
          lowCarb: { label: 'Low Carb / Cetogênica', desc: 'Corpo adaptado a gordura. Alta eficiência em treinos em jejum.' },
          unstructured: { label: 'Sem padrão definido / Beliscando', desc: 'Ajudaremos a criar consistência no seu ciclo alimentar.' }
        },
        antropometria: {
          badge: 'ETAPA 12: ANTROPOMETRIA',
          title: 'Quais são as suas métricas físicas atuais?',
          subtitle: 'Estes valores serão usados no cálculo do IMC e no gráfico de projeção de metas.',
          heightLabel: 'Altura',
          weightLabel: 'Peso Atual',
          targetWeightLabel: 'Peso Meta',
          errorInvalid: 'Por favor, preencha valores físicos válidos e seguros.',
          errorHeight: 'Por favor, informe sua altura',
          errorHeightRange: 'Por favor, informe uma altura válida (entre 100 e 250 cm / 3–8 ft)',
          errorWeight: 'Por favor, informe seu peso atual',
          errorWeightRange: 'Por favor, informe um peso válido (entre 30 e 250 kg / 4.5–39 st)',
          cta: 'Avançar para Data Meta'
        },
        importantEvent: {
          title: 'Você tem alguma data especial como meta?',
          subtitle: 'Ter um evento-alvo aumenta a aderência mental ao programa em até 3 vezes.',
          options: {
            'wedding': { label: '💍 Casamento ou evento formal', desc: 'Ritmo otimizado para que você esteja impecável.' },
            'vacation': { label: '🏖️ Férias ou viagem programada', desc: 'Foco em condicionamento para aproveitar a praia.' },
            'birthday': { label: '🎂 Aniversário marcante', desc: 'Um marco pessoal para comemorar em plena forma.' },
            'health_goal': { label: '🩺 Recomendação médica/saúde', desc: 'Foco estrito em melhorar marcadores cardíacos.' },
            'no_specific_date': { label: '📅 Melhora contínua', desc: 'Consistência no meu próprio tempo, sem prazo fixo.' }
          }
        },
        mindsetBlockers: {
          badge: 'ETAPA 14: BARREIRAS',
          title: 'Qual barreira mais atrapalhou seus treinos passados?',
          subtitle: 'Desenharemos o plano para evitar que você caia nesta mesma armadilha.',
          boredom: { label: 'Tédio e Monotonia', desc: 'Não suporto caminhar olhando para o mesmo ponto.' },
          timeConstraint: { label: 'Falta de Tempo', desc: 'Não tenho 1 hora livre por dia para treinar.' },
          jointPain: { label: 'Dores Articulares', desc: 'Caminhar rápido incomoda joelhos ou lombar.' },
          lackGuidance: { label: 'Falta de Orientação', desc: 'Não sei quais velocidades ou inclinações usar.' },
          none: { label: 'Nenhuma das alternativas', desc: 'Pronto(a) para começar sem grandes barreiras.' }
        }
      }
    },
    transitions: {
      educational: {
        badge: 'CALIBRAÇÃO CIENTÍFICA',
        title: 'Por Que o Método Funciona',
        scientificBase: 'ALINHAMENTO BIOMECÂNICO',
        harvardQuote: '"Caminhar inclinado queima até 60% mais calorias do que caminhada plana, enquanto reduz o impacto no joelho em 40%." — Harvard Medical School',
        fatBurningZone: 'Zona de Queima Ativa (Lipo)',
        aerobicCapacities: 'Resistência Cardiovascular',
        metabolismBoost: 'Aceleração do Metabolismo pós-treino',
        cta: 'Entendi. Prosseguir para o Cálculo'
      },
      loading: {
        title: 'CALCULANDO SEU PLANO',
        statusA: 'Analisando biomecânica...',
        statusB: 'Avaliando sensibilidades articulares...',
        statusC: 'Estruturando blocos de inclinação...',
        statusD: 'Gerando calendário de 4 semanas...',
        modalSchedule: {
          title: 'Qual o seu horário preferencial para caminhar?',
          desc: 'Isso nos ajuda a calibrar suas janelas de alimentação pré-treino.',
          morning: 'Manhã',
          midday: 'Meio-dia / Tarde',
          evening: 'Noite',
          notSure: 'Variável / Não sei'
        },
        modalCommit: {
          title: 'Você se compromete a caminhar de 15 a 30 minutos por dia?',
          desc: 'A constância diária é o fator principal da aceleração metabólica.',
          yes: 'Sim, estou 100% comprometido!',
          no: 'Quero começar devagar (2-3x na semana)'
        }
      },
      reportPreview: {
        badge: 'PROJEÇÃO PREVISIVA',
        title: 'Seu Cronograma de Emagrecimento',
        subtitle: 'Baseado no seu perfil físico inicial e protocolo de esteira calibrado.',
        targetWeightTitle: 'Peso meta alcançado:',
        weeksDesc: 'em {weeks} semanas de treino',
        safeRateDesc: 'Taxa segura: 0.5kg/semana. Sem restrições alimentares extremas.',
        disclaimer: '*Os resultados podem variar dependendo da consistência individual, ponto de partida metabólico e alimentação diária.',
        cta: 'Prosseguir para Acessar Plano'
      }
    },
    emailCapture: {
      badge: 'ETAPA FINAL',
      title: 'Onde devemos enviar seu Plano Personalizado?',
      subtitle: 'Salvaremos seus cálculos de queima lipídica neste e-mail para acesso futuro.',
      placeholder: 'Seu melhor e-mail',
      consent: 'Quero receber orientações semanais de esteira, receitas saudáveis e novidades do The Treadmill Method.',
      errorInvalid: 'Por favor, insira um e-mail válido.',
      cta: 'Avançar para Relatório de Zonas'
    },
    report: {
      badge: 'RELATÓRIO DIAGNÓSTICO',
      title: 'SEU PLANO DE PERFORMANCE',
      subtitle: 'Métricas de saúde e grade de treinos calculadas para {email}.',
      bodyStatus: 'Status Corporal',
      calorieTarget: 'Alvo Calórico',
      hydration: 'Hidratação',
      targetForecast: 'Previsão de Meta',
      underweight: 'Abaixo do peso',
      normal: 'Peso ideal',
      overweight: 'Sobrepeso',
      obese: 'Obesidade',
      targetRecommended: 'Zona de Queima Lipídica',
      recommendedZone: 'Zonas Aeróbicas Alvo',
      recommendedCups: 'Recomendado ({cups} copos)',
      estimatedInWeeks: 'Estimado em {weeks} semanas',
      jointSensitivityActive: 'Protocolo de Proteção Articular: Ativo',
      jointSensitivityDesc: 'Identificamos sensibilidade em articulações. Ajustamos a grade para proteger seus joelhos e coluna, com passadas biomecanicamente seguras.',
      planTitle: 'PROTOCOLO RECOMENDADO',
      planSub: 'Estrutura de caminhada intervalada sugerida para o seu perfil.',
      inclineHiitName: 'Método Incline HIIT',
      inclineHiitDesc: 'Intervalos ativos de inclinação na esteira para queima acelerada e ativação de glúteos.',
      activeRecoveryName: 'Método Active Recovery (Plano)',
      activeRecoveryDesc: 'Variações de velocidade em esteira plana para proteger articulações e lombar.',
      paceBuilderName: 'Método Pace Builder',
      paceBuilderDesc: 'Intervalados de velocidade no plano para condicionar fôlego e queimar calorias de forma constante.',
      weeksList: {
        week: 'Semana',
        w1Focus: 'Adaptação Postural',
        w1Detail: '20 min. Caminhadas alternando ritmos (4.0 a 5.0 km/h). Foco na passada curta.',
        w2Focus: 'Resistência Aeróbica de Base',
        w2Detail: '25 min contínuos a 4.8 km/h com foco em respiração nasal.',
        w3Focus: 'Intervalados de Velocidade',
        w3Detail: '30 min alternando 1 min rápido (5.8 km/h) e 2 min moderado (4.5 km/h).',
        w4Focus: 'Consolidação Aeróbica',
        w4Detail: '35 min em ritmo estável acelerado (5.2 km/h). Excelente oxidação lipídica.'
      },
      instructionsTitle: 'Instruções Iniciais',
      instructions: [
        'Mantenha os cotovelos a 90 graus e evite segurar nos apoios laterais. Isso recruta o core profundamente e aumenta o gasto calórico em até 15%.',
        'Ao caminhar inclinado, incline levemente o corpo para frente a partir dos tornozelos (não da cintura) para alinhar a coluna.',
        'Sempre faça os primeiros 3 minutos de cada sessão em velocidade lenta (3.5 - 4.0 km/h) para aquecer as articulações.'
      ],
      ctaCardTitle: 'Pronto para liberar suas planilhas de treino minuto-a-minuto?',
      ctaCardDesc: 'Este relatório oferece a estrutura geral. Libere o plano completo para receber tabelas exatas de velocidade/inclinação, áudio-guias e acompanhamento de dieta.',
      ctaButton: 'Obter Meu Plano Personalizado',
      ctaPriceMicroCopy: 'Pagamento único de {price}',
    },
    offer: {
      congratsBadge: 'PAGAMENTO ÚNICO · ACESSO IMEDIATO',
      urgencyTitle: 'PAGAMENTO ÚNICO · ACESSO IMEDIATO',
      planSectionTitle: 'SUA OFERTA PERSONALIZADA:',
      singleLabel: 'The Treadmill Method — Acesso Completo',
      singleBadge: 'PAGAMENTO ÚNICO',
      singleSub: 'Pagamento único. Acesso instantâneo aos protocolos digitais interativos, guias de vídeo/áudio e tabelas para impressão diretamente no seu celular, tablet ou computador.',
      totalAmountLabel: 'Valor Total:',
      totalLabel: 'Total: {price}',
      quarterlyLabel: 'Acesso por 3 Meses',
      quarterlyBadge: 'MAIS POPULAR / MELHOR CUSTO',
      monthlyLabel: 'Acesso por 1 Mês',
      quarterlySub: 'Pagamento único recorrente a cada 3 meses. Cancele quando quiser.',
      monthlySub: 'Pagamento mensal recorrente. Cancele quando quiser.',
      quarterlyPerDay: 'Apenas {price} / dia',
      monthlyPerDay: 'Apenas {price} / dia',
      ctaButton: 'OBTER MEU PLANO PERSONALIZADO — {price}',
      secureCheckout: 'CHECKOUT SEGURO',
      sslEncrypted: 'SSL ENCRIPTADO',
      guaranteeTitle: 'POLÍTICA DE REEMBOLSO DE 30 DIAS',
      guaranteeDesc: 'Experimente o The Treadmill Method por 30 dias. Se não for ideal para você, envie um e-mail em até 30 dias após a compra e reembolsaremos a compra do seu programa. Sem metas de desempenho ou condições complicadas.',
      whatYouGetTitle: 'O que você vai receber hoje:',
      whatYouGetItems: [
        'Acesso Instantâneo ao Web App Digital e Protocolos PDF (Sem espera, acesse de qualquer lugar)',
        'Tabela minuto a minuto de velocidades e inclinações.',
        'Calculadora de faixas cardíacas de queima metabólica.',
        'Áudios instrutivos de apoio para ouvir na esteira.',
        'Manual de nutrição energética pré e pós-treino.'
      ],
      testimonialsTitle: 'Resultados de alunos do método:',
      testimonials: [
        {
          name: 'Roberta S., 34 anos',
          text: 'Eu achava esteira a atividade mais monótona do mundo. Com os treinos intervalados do The Treadmill Method, o tempo passa voando. Perdi 4,8 kg em 5 semanas e sinto minhas pernas muito mais firmes.'
        },
        {
          name: 'Marcos V., 47 anos',
          text: 'O treino adaptado para lombar foi essencial para mim. Consigo fazer caminhada inclinada de alta queima calórica sem sentir nenhuma fisgada nas costas. Excelente suporte postural.'
        }
      ],
      faqTitle: 'Perguntas Frequentes',
      faq: [
        {
          q: 'Preciso de uma esteira avançada para fazer os treinos?',
          a: 'Não. Qualquer esteira básica comercial ou residencial atende perfeitamente. Se sua esteira não possuir inclinação, o método Pace Builder (no plano) será ativado.'
        },
        {
          q: 'Tenho dores nos joelhos, posso seguir o método?',
          a: 'Sim. Durante o quiz, ativamos o mapeamento de sensibilidades. O algoritmo exclui impactos desnecessários e focará em passadas curtas de active recovery na esteira plana para proteger suas articulações.'
        },
        {
          q: 'Como funciona a garantia de reembolso?',
          a: 'Experimente o The Treadmill Method por 30 dias. Se não for ideal para você, basta nos enviar um e-mail para suporte@thetreadmillmethod.com em até 30 dias após a compra e reembolsaremos a compra do seu programa.'
        },
        {
          q: 'Este pagamento é uma assinatura recorrente?',
          a: 'Não. Este é um pagamento único. Não há cobranças mensais, renovações automáticas nem taxas ocultas.'
        }
      ],
      legalDisclaimer: 'Ao clicar em "OBTER MEU PLANO PERSONALIZADO AGORA" você concorda com nossos Termos de Uso e Política de Privacidade. Resultados individuais podem variar dependendo da consistência e taxa metabólica inicial.',
      footerRights: '© 2026 The Treadmill Method. Todos os direitos reservados.'
    }
  }
};

// Hook simples para consumir as traduções em componentes React (Client Components)
export function useTranslations(locale: string) {
  const normalized = (locale || '').toLowerCase();
  if (normalized === 'pt-br') {
    return translations['pt-br'];
  }
  return translations['en-gb'];
}
