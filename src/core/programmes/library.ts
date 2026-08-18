import { ProgrammeType } from '../types/personalisation';

export interface WalkingBlock {
  name: string;
  durationMinutes: number;
  effort: string;
  notes?: string;
}

export interface ProgrammeSession {
  id: string;
  programme: ProgrammeType;
  week: 1 | 2 | 3;
  sessionNumber: 1 | 2 | 3;
  title: string;
  durationMinutes: number;
  effort: string;
  summary: string;
  blocks: WalkingBlock[];
}

export interface ProgrammeWeek {
  week: 1 | 2 | 3;
  title: string;
  sessions: ProgrammeSession[];
}

export interface ProgrammeDefinition {
  key: ProgrammeType;
  name: string;
  tagline: string;
  description: string;
  weeks: ProgrammeWeek[];
}

export const PROGRAMME_LIBRARY: Record<ProgrammeType, ProgrammeDefinition> = {
  gentle_start: {
    key: 'gentle_start',
    name: 'Gentle Start',
    tagline: 'Comfortable movement built to protect your joints and establish a stress-free routine.',
    description:
      'Gentle Start is designed to build your physical baseline safely without overwhelming your body. Every session prioritises joint comfort, gradual pacing, and consistent habit formation.',
    weeks: [
      {
        week: 1,
        title: 'Just Get Moving',
        sessions: [
          {
            id: 'gentle-w1-s1',
            programme: 'gentle_start',
            week: 1,
            sessionNumber: 1,
            title: 'First Step Walk',
            durationMinutes: 10,
            effort: 'Easy',
            summary: 'A short, comfortable 10-minute walk to establish your daily movement routine.',
            blocks: [
              { name: 'Warm-up & Baseline Walk', durationMinutes: 10, effort: 'Easy (2–3/10)' },
            ],
          },
          {
            id: 'gentle-w1-s2',
            programme: 'gentle_start',
            week: 1,
            sessionNumber: 2,
            title: 'Steady Pace Walk',
            durationMinutes: 12,
            effort: 'Easy',
            summary: '12 minutes of relaxed walking focused on posture and easy breathing.',
            blocks: [
              { name: 'Continuous Walk', durationMinutes: 12, effort: 'Easy (2–3/10)' },
            ],
          },
          {
            id: 'gentle-w1-s3',
            programme: 'gentle_start',
            week: 1,
            sessionNumber: 3,
            title: 'Comfort Walk',
            durationMinutes: 15,
            effort: 'Easy',
            summary: 'Building up to 15 minutes while maintaining total joint comfort.',
            blocks: [
              { name: 'Continuous Easy Walk', durationMinutes: 15, effort: 'Easy (2–3/10)' },
            ],
          },
        ],
      },
      {
        week: 2,
        title: 'Build Consistency',
        sessions: [
          {
            id: 'gentle-w2-s1',
            programme: 'gentle_start',
            week: 2,
            sessionNumber: 1,
            title: 'Rhythm Walk',
            durationMinutes: 15,
            effort: 'Easy',
            summary: '15 minutes of steady walking to open Week 2 with confidence.',
            blocks: [
              { name: 'Steady Easy Walk', durationMinutes: 15, effort: 'Easy (2–3/10)' },
            ],
          },
          {
            id: 'gentle-w2-s2',
            programme: 'gentle_start',
            week: 2,
            sessionNumber: 2,
            title: 'Gradual Progression',
            durationMinutes: 18,
            effort: 'Easy → Comfortable',
            summary: '18 minutes introducing a gentle increase in pacing toward the middle.',
            blocks: [
              { name: 'Easy Start', durationMinutes: 6, effort: 'Easy (2–3/10)' },
              { name: 'Comfortable Rhythm', durationMinutes: 6, effort: 'Comfortable (3–4/10)' },
              { name: 'Cool-down Walk', durationMinutes: 6, effort: 'Easy (2–3/10)' },
            ],
          },
          {
            id: 'gentle-w2-s3',
            programme: 'gentle_start',
            week: 2,
            sessionNumber: 3,
            title: 'Milestone Walk',
            durationMinutes: 20,
            effort: 'Comfortable',
            summary: 'A full 20-minute continuous walk marking a major milestone in your consistency.',
            blocks: [
              { name: 'Continuous Walk', durationMinutes: 20, effort: 'Comfortable (3–4/10)' },
            ],
          },
        ],
      },
      {
        week: 3,
        title: 'Build Confidence',
        sessions: [
          {
            id: 'gentle-w3-s1',
            programme: 'gentle_start',
            week: 3,
            sessionNumber: 1,
            title: 'Endurance Foundation',
            durationMinutes: 20,
            effort: 'Comfortable',
            summary: 'Opening your final week with a strong, confident 20-minute walk.',
            blocks: [
              { name: 'Continuous Comfortable Walk', durationMinutes: 20, effort: 'Comfortable (3–4/10)' },
            ],
          },
          {
            id: 'gentle-w3-s2',
            programme: 'gentle_start',
            week: 3,
            sessionNumber: 2,
            title: 'Confidence Builder',
            durationMinutes: 22,
            effort: 'Comfortable',
            summary: '22 minutes of smooth walking reinforcing your stamina and endurance.',
            blocks: [
              { name: 'Continuous Walk', durationMinutes: 22, effort: 'Comfortable (3–4/10)' },
            ],
          },
          {
            id: 'gentle-w3-s3',
            programme: 'gentle_start',
            week: 3,
            sessionNumber: 3,
            title: '21-Day Capstone Walk',
            durationMinutes: 25,
            effort: 'Comfortable',
            summary: '25 minutes celebrating the completion of your 21-Day Gentle Start foundation.',
            blocks: [
              { name: 'Capstone Walk', durationMinutes: 25, effort: 'Comfortable (3–4/10)' },
            ],
          },
        ],
      },
    ],
  },

  pace_builder: {
    key: 'pace_builder',
    name: 'Pace Builder',
    tagline: 'Structured walking intervals designed to elevate stamina and cardiovascular fitness.',
    description:
      'Pace Builder balances Easy recovery periods with purposeful Comfortable and Brisk walking blocks. It progressively enhances your walking pace and stamina without exhausting your recovery capacity.',
    weeks: [
      {
        week: 1,
        title: 'Find Your Rhythm',
        sessions: [
          {
            id: 'pace-w1-s1',
            programme: 'pace_builder',
            week: 1,
            sessionNumber: 1,
            title: 'Rhythm Baseline',
            durationMinutes: 15,
            effort: 'Easy',
            summary: '15-minute introductory walk setting your initial walking rhythm.',
            blocks: [
              { name: 'Baseline Walk', durationMinutes: 15, effort: 'Easy (2–3/10)' },
            ],
          },
          {
            id: 'pace-w1-s2',
            programme: 'pace_builder',
            week: 1,
            sessionNumber: 2,
            title: 'Rhythm Progression',
            durationMinutes: 18,
            effort: 'Easy / Comfortable',
            summary: '18 minutes introducing 5 minutes of purposeful Comfortable walking.',
            blocks: [
              { name: 'Easy Walk', durationMinutes: 13, effort: 'Easy (2–3/10)' },
              { name: 'Comfortable Tempo', durationMinutes: 5, effort: 'Comfortable (3–4/10)' },
            ],
          },
          {
            id: 'pace-w1-s3',
            programme: 'pace_builder',
            week: 1,
            sessionNumber: 3,
            title: 'Pace Integration',
            durationMinutes: 20,
            effort: 'Easy / Comfortable / Easy',
            summary: '20 minutes featuring a 10-minute Comfortable core block sandwiched between Easy periods.',
            blocks: [
              { name: 'Easy Warm-up', durationMinutes: 5, effort: 'Easy (2–3/10)' },
              { name: 'Comfortable Block', durationMinutes: 10, effort: 'Comfortable (3–4/10)' },
              { name: 'Easy Cool-down', durationMinutes: 5, effort: 'Easy (2–3/10)' },
            ],
          },
        ],
      },
      {
        week: 2,
        title: 'Build Your Pace',
        sessions: [
          {
            id: 'pace-w2-s1',
            programme: 'pace_builder',
            week: 2,
            sessionNumber: 1,
            title: 'Interval Introduction',
            durationMinutes: 20,
            effort: 'Easy / Comfortable / Easy',
            summary: '20 minutes reopening Week 2 with a solid 10-minute Comfortable focus block.',
            blocks: [
              { name: 'Warm-up', durationMinutes: 5, effort: 'Easy (2–3/10)' },
              { name: 'Comfortable Walk', durationMinutes: 10, effort: 'Comfortable (3–4/10)' },
              { name: 'Cool-down', durationMinutes: 5, effort: 'Easy (2–3/10)' },
            ],
          },
          {
            id: 'pace-w2-s2',
            programme: 'pace_builder',
            week: 2,
            sessionNumber: 2,
            title: 'Controlled Tempo',
            durationMinutes: 22,
            effort: 'Easy / Comfortable / Easy',
            summary: '22 minutes extending your central Comfortable block to 12 continuous minutes.',
            blocks: [
              { name: 'Warm-up', durationMinutes: 5, effort: 'Easy (2–3/10)' },
              { name: 'Comfortable Focus', durationMinutes: 12, effort: 'Comfortable (3–4/10)' },
              { name: 'Cool-down', durationMinutes: 5, effort: 'Easy (2–3/10)' },
            ],
          },
          {
            id: 'pace-w2-s3',
            programme: 'pace_builder',
            week: 2,
            sessionNumber: 3,
            title: 'Dynamic Rhythm',
            durationMinutes: 25,
            effort: 'Intervals',
            summary: '25 minutes featuring 3 rounds of 3 min Comfortable / 2 min Easy intervals.',
            blocks: [
              { name: 'Warm-up', durationMinutes: 5, effort: 'Easy (2–3/10)' },
              { name: 'Interval Block (3x 3m Comfort / 2m Easy)', durationMinutes: 15, effort: 'Varied (3–4/10)' },
              { name: 'Cool-down', durationMinutes: 5, effort: 'Easy (2–3/10)' },
            ],
          },
        ],
      },
      {
        week: 3,
        title: 'Build Capacity',
        sessions: [
          {
            id: 'pace-w3-s1',
            programme: 'pace_builder',
            week: 3,
            sessionNumber: 1,
            title: 'Capacity Builder',
            durationMinutes: 25,
            effort: 'Easy / Comfortable / Easy',
            summary: '25 minutes with 15 full minutes at a steady Comfortable pace.',
            blocks: [
              { name: 'Warm-up', durationMinutes: 5, effort: 'Easy (2–3/10)' },
              { name: 'Comfortable Endurance', durationMinutes: 15, effort: 'Comfortable (3–4/10)' },
              { name: 'Cool-down', durationMinutes: 5, effort: 'Easy (2–3/10)' },
            ],
          },
          {
            id: 'pace-w3-s2',
            programme: 'pace_builder',
            week: 3,
            sessionNumber: 2,
            title: 'Brisk Surge Walk',
            durationMinutes: 27,
            effort: 'Brisk Intervals',
            summary: '27 minutes introducing controlled Brisk surges (2 min Brisk / 3 min Comfortable).',
            blocks: [
              { name: 'Warm-up', durationMinutes: 5, effort: 'Easy (2–3/10)' },
              { name: 'Brisk Intervals (3x 2m Brisk / 3m Comfort)', durationMinutes: 15, effort: 'Brisk (4–5/10)' },
              { name: 'Cool-down', durationMinutes: 7, effort: 'Easy (2–3/10)' },
            ],
          },
          {
            id: 'pace-w3-s3',
            programme: 'pace_builder',
            week: 3,
            sessionNumber: 3,
            title: 'Pace Capstone Walk',
            durationMinutes: 30,
            effort: 'Comfortable',
            summary: '30 minutes reaching your 21-Day Pace Builder milestone with a 20-minute Comfortable core.',
            blocks: [
              { name: 'Warm-up', durationMinutes: 5, effort: 'Easy (2–3/10)' },
              { name: 'Comfortable Core', durationMinutes: 20, effort: 'Comfortable (3–4/10)' },
              { name: 'Cool-down', durationMinutes: 5, effort: 'Easy (2–3/10)' },
            ],
          },
        ],
      },
    ],
  },

  progressive_incline: {
    key: 'progressive_incline',
    name: 'Progressive Incline',
    tagline: 'Controlled incline variations to maximise energy expenditure and leg stamina safely.',
    description:
      'Progressive Incline utilises gentle treadmill inclines to increase muscular engagement and calorie burn while keeping overall walking speeds safe and controlled.',
    weeks: [
      {
        week: 1,
        title: 'Introduce Incline',
        sessions: [
          {
            id: 'incline-w1-s1',
            programme: 'progressive_incline',
            week: 1,
            sessionNumber: 1,
            title: 'Incline Baseline',
            durationMinutes: 20,
            effort: 'Incline Comfortable',
            summary: '20 minutes introducing 10 minutes of gentle incline walking.',
            blocks: [
              { name: 'Flat Warm-up', durationMinutes: 5, effort: 'Easy (2–3/10)' },
              { name: 'Gentle Incline Walk', durationMinutes: 10, effort: 'Comfortable Incline (3–4/10)' },
              { name: 'Flat Cool-down', durationMinutes: 5, effort: 'Easy (2–3/10)' },
            ],
          },
          {
            id: 'incline-w1-s2',
            programme: 'progressive_incline',
            week: 1,
            sessionNumber: 2,
            title: 'Controlled Waves',
            durationMinutes: 22,
            effort: 'Incline Waves',
            summary: '22 minutes alternating between gentle incline and flat recovery blocks.',
            blocks: [
              { name: 'Flat Warm-up', durationMinutes: 5, effort: 'Easy (2–3/10)' },
              { name: 'Incline Waves (3x 3m Incline / 2m Flat)', durationMinutes: 15, effort: 'Comfortable (3–4/10)' },
              { name: 'Flat Cool-down', durationMinutes: 2, effort: 'Easy (2–3/10)' },
            ],
          },
          {
            id: 'incline-w1-s3',
            programme: 'progressive_incline',
            week: 1,
            sessionNumber: 3,
            title: 'Incline Rhythm',
            durationMinutes: 25,
            effort: 'Comfortable',
            summary: '25 minutes of steady walking with occasional gentle incline periods.',
            blocks: [
              { name: 'Warm-up', durationMinutes: 5, effort: 'Easy (2–3/10)' },
              { name: 'Incline & Flat Rhythm', durationMinutes: 15, effort: 'Comfortable (3–4/10)' },
              { name: 'Cool-down', durationMinutes: 5, effort: 'Easy (2–3/10)' },
            ],
          },
        ],
      },
      {
        week: 2,
        title: 'Build Control',
        sessions: [
          {
            id: 'incline-w2-s1',
            programme: 'progressive_incline',
            week: 2,
            sessionNumber: 1,
            title: 'Strength Waves',
            durationMinutes: 25,
            effort: 'Incline Waves',
            summary: '25 minutes featuring 3 rounds of 3 min Incline / 2 min Flat.',
            blocks: [
              { name: 'Warm-up', durationMinutes: 5, effort: 'Easy (2–3/10)' },
              { name: 'Incline Waves (3x 3m Incline / 2m Flat)', durationMinutes: 15, effort: 'Comfortable (3–4/10)' },
              { name: 'Cool-down', durationMinutes: 5, effort: 'Easy (2–3/10)' },
            ],
          },
          {
            id: 'incline-w2-s2',
            programme: 'progressive_incline',
            week: 2,
            sessionNumber: 2,
            title: 'Steady Hill Climb',
            durationMinutes: 28,
            effort: 'Continuous Incline',
            summary: '28 minutes of continuous comfortable walking with periodic gentle incline.',
            blocks: [
              { name: 'Continuous Hill Walk', durationMinutes: 28, effort: 'Comfortable Incline (3–4/10)' },
            ],
          },
          {
            id: 'incline-w2-s3',
            programme: 'progressive_incline',
            week: 2,
            sessionNumber: 3,
            title: 'Incline Capacity',
            durationMinutes: 30,
            effort: 'Incline Waves',
            summary: '30 minutes with 4 rounds of incline intervals.',
            blocks: [
              { name: 'Warm-up', durationMinutes: 5, effort: 'Easy (2–3/10)' },
              { name: 'Incline Waves (4x 3m Incline / 2m Flat)', durationMinutes: 20, effort: 'Comfortable (3–4/10)' },
              { name: 'Cool-down', durationMinutes: 5, effort: 'Easy (2–3/10)' },
            ],
          },
        ],
      },
      {
        week: 3,
        title: 'Build Capacity',
        sessions: [
          {
            id: 'incline-w3-s1',
            programme: 'progressive_incline',
            week: 3,
            sessionNumber: 1,
            title: 'Pyramid Climb',
            durationMinutes: 30,
            effort: 'Progressive Incline',
            summary: '30-minute pyramid walk transitioning from flat to gentle incline and back.',
            blocks: [
              { name: 'Flat Baseline', durationMinutes: 10, effort: 'Easy (2–3/10)' },
              { name: 'Incline Climb', durationMinutes: 10, effort: 'Comfortable Incline (3–4/10)' },
              { name: 'Flat Descent', durationMinutes: 10, effort: 'Easy (2–3/10)' },
            ],
          },
          {
            id: 'incline-w3-s2',
            programme: 'progressive_incline',
            week: 3,
            sessionNumber: 2,
            title: 'Metabolic Incline',
            durationMinutes: 30,
            effort: 'Incline Waves',
            summary: '30 minutes containing 4 rounds of structured incline intervals.',
            blocks: [
              { name: 'Warm-up', durationMinutes: 5, effort: 'Easy (2–3/10)' },
              { name: 'Incline Intervals (4x 3m Incline / 2m Flat)', durationMinutes: 20, effort: 'Comfortable (3–4/10)' },
              { name: 'Cool-down', durationMinutes: 5, effort: 'Easy (2–3/10)' },
            ],
          },
          {
            id: 'incline-w3-s3',
            programme: 'progressive_incline',
            week: 3,
            sessionNumber: 3,
            title: 'Incline Capstone Walk',
            durationMinutes: 32,
            effort: 'Controlled Incline Variations',
            summary: '32-minute final capstone walk mastering controlled incline variations.',
            blocks: [
              { name: 'Warm-up', durationMinutes: 5, effort: 'Easy (2–3/10)' },
              { name: 'Incline Variation Block', durationMinutes: 22, effort: 'Comfortable Incline (3–4/10)' },
              { name: 'Cool-down', durationMinutes: 5, effort: 'Easy (2–3/10)' },
            ],
          },
        ],
      },
    ],
  },
};
