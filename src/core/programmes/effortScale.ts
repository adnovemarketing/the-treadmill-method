export interface EffortDefinition {
  key: 'easy' | 'comfortable' | 'brisk';
  name: string;
  rpeScale: string;
  description: string;
}

export const EFFORT_SCALE: Record<'easy' | 'comfortable' | 'brisk', EffortDefinition> = {
  easy: {
    key: 'easy',
    name: 'Easy',
    rpeScale: '2–3 / 10',
    description: 'Very comfortable. Conversation is easy.',
  },
  comfortable: {
    key: 'comfortable',
    name: 'Comfortable',
    rpeScale: '3–4 / 10',
    description: 'Purposeful walking. Breathing is somewhat quicker while conversation remains comfortable.',
  },
  brisk: {
    key: 'brisk',
    name: 'Brisk',
    rpeScale: '4–5 / 10',
    description: 'Noticeably harder walking while remaining controlled.',
  },
};
