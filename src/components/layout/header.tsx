'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { useUIStore } from '@/stores'
import { useTranslation } from '@/lib/i18n'
import { durations, easings, fadeIn } from '@/lib/animations'
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
    <header
      data-testid="header"
      className="flex h-14 items-center justify-between border-b border-border bg-card/30 backdrop-blur-xl px-4"
    >
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <motion.div {...fadeIn}>
            <Button
              data-testid="header-menu-button"
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 hover:bg-accent press-effect"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: durations.fast, ease: easings.smooth }}
          className="flex items-center"
        >
          <h1 data-testid="view-title" className="text-sm font-medium">
            {viewTitles[viewMode]}
          </h1>
        </motion.div>
      </div>

      <motion.div
        className="flex items-center gap-1"
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: durations.normal, delay: 0.05 }}
      >
        <LanguageToggle />
        <ThemeToggle />

        <div className="w-px h-5 bg-border mx-1.5" />

        <Button
          data-testid="help-button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-accent press-effect"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
        <Button
          data-testid="settings-button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-accent press-effect"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </motion.div>
    </header>
  )
}
