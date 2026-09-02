import { create } from 'zustand';

export type Language = 'CN' | 'EN';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const syncDocumentLanguage = (language: Language) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = language === 'CN' ? 'zh-CN' : 'en';
  }
};

syncDocumentLanguage('EN');

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'EN',
  setLanguage: (lang: Language) => {
    syncDocumentLanguage(lang);
    set({ language: lang });
  },
  toggleLanguage: () =>
    set((state: LanguageState) => {
      const nextLanguage = state.language === 'CN' ? 'EN' : 'CN';
      syncDocumentLanguage(nextLanguage);
      return { language: nextLanguage };
    }),
}));
