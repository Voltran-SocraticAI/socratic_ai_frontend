'use client'

import * as React from 'react'
import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n, type Locale } from '@/lib/i18n'

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'tr', label: 'Turkce', flag: 'TR' },
]

export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const currentLanguage = languages.find((l) => l.code === locale) || languages[0]

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Languages className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <span className="text-xs font-medium">{currentLanguage.flag}</span>
          <Languages className="h-4 w-4" />
          <span className="sr-only">{t.language.select}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className={locale === lang.code ? 'bg-accent' : ''}
          >
            <span className="mr-2 font-medium">{lang.flag}</span>
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
