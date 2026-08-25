export interface MarketConfig {
  locale: string;
  currency: string;
  currencySymbol: string;
  prices: {
    monthly: number;
    monthlyOriginal: number;
    quarterly: number;
    quarterlyOriginal: number;
    single: number;
  };
  dateFormat: string;
  weightUnitDefault: 'kg' | 'lb';
  heightUnitDefault: 'cm' | 'ft';
}

export const locales = ['en-gb'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en-gb';

export const marketConfigs: Record<Locale, MarketConfig> = {
  'en-gb': {
    locale: 'en-GB',
    currency: 'GBP',
    currencySymbol: '£',
    prices: {
      monthly: 14.99,
      monthlyOriginal: 49.99,
      quarterly: 24.99,
      quarterlyOriginal: 99.99,
      single: 9.90,
    },
    dateFormat: 'en-GB',
    weightUnitDefault: 'kg',
    heightUnitDefault: 'cm',
  },
};

// Helper para obter a configuração de mercado a partir do locale
export function getMarketConfig(locale: string): MarketConfig {
  const normalized = (locale || '').toLowerCase() as Locale;
  return marketConfigs[normalized] || marketConfigs[defaultLocale];
}

// Helpers para formatação de moeda
export function formatCurrency(value: number, locale: string): string {
  const config = getMarketConfig(locale);
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
  }).format(value);
}

// Helper para formatar data
export function formatDate(date: Date, locale: string): string {
  const config = getMarketConfig(locale);
  return new Intl.DateTimeFormat(config.locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

// Cookies Client-Side (discretos e simples)
export const localeCookie = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    const name = 'locale=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  },
  set: (locale: string) => {
    if (typeof window === 'undefined') return;
    const date = new Date();
    date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 ano
    document.cookie = `locale=${locale};expires=${date.toUTCString()};path=/`;
  },
};
