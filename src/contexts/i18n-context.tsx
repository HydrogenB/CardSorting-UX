import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Language } from '@/lib/translations';
import { getTranslation } from '@/lib/translations';

interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function I18nProvider({ children, defaultLanguage = 'en' }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get language from localStorage or browser preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language') as Language;
      if (saved && ['en', 'th'].includes(saved)) {
        return saved;
      }
      // Check browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('th')) {
        return 'th';
      }
    }
    return defaultLanguage;
  });

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage);
      // Update document lang attribute
      document.documentElement.lang = newLanguage;
      // Update document direction (currently no RTL languages supported)
      document.documentElement.dir = 'ltr';
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = getTranslation(language, key);
    
    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, String(value));
      });
    }
    
    return translation;
  };

  const isRTL = false; // Currently no RTL languages, keeping for future expansion

  // Update document lang on mount and language change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    }
  }, [language, isRTL]);

  const value: I18nContextType = {
    language,
    setLanguage,
    t,
    isRTL,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// HOC for components that need translation
export function withTranslation<P extends object>(
  Component: React.ComponentType<P & { t: I18nContextType['t'] }>
) {
  return function TranslatedComponent(props: P) {
    const { t } = useI18n();
    return <Component {...props} t={t} />;
  };
}
