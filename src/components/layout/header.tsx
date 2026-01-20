'use client'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { useUIStore } from '@/stores'
import { useTranslation } from '@/lib/i18n'
import { Menu, Settings, HelpCircle } from 'lucide-react'

export function Header() {
  const { viewMode, toggleSidebar, sidebarOpen } = useUIStore()
  const t = useTranslation()

  const viewTitles = {
    'pdf-workspace': t.nav.pdfWorkspace,
    'similarity': t.nav.similarQuestions,
    'studio': t.nav.interactiveStudio,
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4">
      <div className="flex items-center gap-4">
        {!sidebarOpen && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-xl font-semibold">{viewTitles[viewMode]}</h1>
      </div>

      <div className="flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
        
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
