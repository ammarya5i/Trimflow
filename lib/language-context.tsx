'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'tr' | 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Import translations
import trTranslations from '../messages/tr.json'
import enTranslations from '../messages/en.json'
import arTranslations from '../messages/ar.json'

const translations = {
  tr: trTranslations,
  en: enTranslations,
  ar: arTranslations,
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('tr')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check for saved language in localStorage
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
      // Update document direction for Arabic
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = lang
    }
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) {
        // Fallback to Turkish if translation not found
        value = translations.tr
        for (const fallbackKey of keys) {
          value = value?.[fallbackKey]
        }
        break
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
