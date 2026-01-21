import { create } from 'zustand';

export type Language = 'CN' | 'EN';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'EN' as Language,
  setLanguage: (lang: Language) => set({ language: lang }),
  toggleLanguage: () =>
    set((state: LanguageState) => ({ 
      language: state.language === 'CN' ? 'EN' : 'CN' 
    })),
}));
