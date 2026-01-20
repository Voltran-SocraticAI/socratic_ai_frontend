'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { translations, type Locale, type TranslationKeys } from './translations'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationKeys
}

const I18nContext = createContext<I18nContextType | null>(null)

const STORAGE_KEY = 'socratic-locale'

interface I18nProviderProps {
  children: ReactNode
  defaultLocale?: Locale
}

export function I18nProvider({ children, defaultLocale = 'en' }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored && translations[stored]) {
      setLocaleState(stored)
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)
  }, [])

  const t = translations[locale]

  // Prevent hydration mismatch by using default locale during SSR
  const value: I18nContextType = {
    locale: mounted ? locale : defaultLocale,
    setLocale,
    t: mounted ? t : translations[defaultLocale],
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

export function useTranslation() {
  const { t } = useI18n()
  return t
}
