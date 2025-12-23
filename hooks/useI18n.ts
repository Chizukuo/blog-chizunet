import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Locale } from '@/types';

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useI18n = create<I18nState>()(
  persist(
    (set) => ({
      locale: 'zh',
      setLocale: (locale) => set({ locale }),
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'chizunet-blog-locale',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
