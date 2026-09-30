import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { I18nManager } from 'react-native';
import { en, TranslationKey } from './translations/en';
import { fa } from './translations/fa';
import { toPersianDigits } from '../utils/timeUtils';

export type Locale = 'fa' | 'en';

interface I18nContextType {
  locale: Locale;
  isRTL: boolean;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  formatNumber: (value: number | string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const dictionaries = {
  en,
  fa,
};

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  initialLocale = 'fa', // Default to Persian as requested by user
}) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const isRTL = locale === 'fa';

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const toggleLocale = () => {
    setLocaleState((prev) => (prev === 'fa' ? 'en' : 'fa'));
  };

  const formatNumber = (value: number | string): string => {
    if (locale === 'fa') {
      return toPersianDigits(value);
    }
    return String(value);
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const dictionary = dictionaries[locale] || dictionaries.fa;
    let template = dictionary[key] || dictionaries.en[key] || String(key);

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        const displayVal = locale === 'fa' && typeof paramVal === 'number'
          ? toPersianDigits(paramVal)
          : String(paramVal);
        template = template.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), displayVal);
      });
    }

    return template;
  };

  const contextValue = useMemo<I18nContextType>(
    () => ({
      locale,
      isRTL,
      setLocale,
      toggleLocale,
      t,
      formatNumber,
    }),
    [locale, isRTL]
  );

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
