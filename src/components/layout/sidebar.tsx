'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useUIStore } from '@/stores'
import { useTranslation } from '@/lib/i18n'
import { durations, easings, activeIndicator } from '@/lib/animations'
import {
  FileText,
  GitCompare,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  Circle,
} from 'lucide-react'
import type { ViewMode } from '@/types'

export function Sidebar() {
  const { viewMode, setViewMode, sidebarOpen, toggleSidebar } = useUIStore()
  const t = useTranslation()

  const navItems: { mode: ViewMode; label: string; icon: React.ReactNode; description: string }[] = [
    {
      mode: 'pdf-workspace',
      label: t.nav.pdfWorkspace,
      icon: <FileText className="h-4 w-4" />,
      description: t.nav.pdfWorkspaceDesc,
    },
    {
      mode: 'similarity',
      label: t.nav.similarQuestions,
      icon: <GitCompare className="h-4 w-4" />,
      description: t.nav.similarQuestionsDesc,
    },
    {
      mode: 'studio',
      label: t.nav.interactiveStudio,
      icon: <Sparkles className="h-4 w-4" />,
      description: t.nav.interactiveStudioDesc,
    },
  ]

  return (
    <motion.aside
      data-testid="sidebar"
      initial={false}
      animate={{ width: sidebarOpen ? 256 : 64 }}
      transition={{ duration: durations.normal, ease: easings.smooth }}
      className={cn(
        'relative flex flex-col border-r border-border bg-card/50 backdrop-blur-xl overflow-hidden',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Subtle edge highlight */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-foreground/[0.03]" />

      {/* Header */}
      <div className="flex h-14 items-center justify-between px-3 border-b border-border">
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: durations.fast, ease: easings.smooth }}
              className="flex items-center gap-2.5"
            >
              {/* Logo mark - Clean monochrome */}
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
                <span className="text-sm font-semibold">S</span>
              </div>
              <div data-testid="sidebar-logo" className="flex flex-col">
                <span className="font-semibold text-sm leading-tight">Socratic</span>
                <span className="text-[10px] text-muted-foreground leading-tight">AI Platform</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          data-testid="sidebar-toggle"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            'h-8 w-8 rounded-md hover:bg-accent press-effect',
            !sidebarOpen && 'mx-auto'
          )}
        >
          <motion.div
            animate={{ rotate: sidebarOpen ? 0 : 180 }}
            transition={{ duration: durations.fast }}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
          </motion.div>
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="flex flex-col gap-1">
          {navItems.map((item, index) => {
            const isActive = viewMode === item.mode

            return (
              <motion.div
                key={item.mode}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: durations.fast }}
              >
                <button
                  data-testid={`nav-${item.mode}`}
                  data-active={isActive}
                  onClick={() => setViewMode(item.mode)}
                  className={cn(
                    'group relative w-full flex items-center gap-2.5 rounded-lg p-2 transition-all duration-150',
                    'hover:bg-accent',
                    isActive && 'bg-accent',
                    !sidebarOpen && 'justify-center px-2'
                  )}
                >
                  {/* Active indicator - Clean vertical bar */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="sidebarActiveIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-foreground"
                        {...activeIndicator}
                      />
                    )}
                  </AnimatePresence>

                  {/* Icon - Monochrome with subtle background */}
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-all duration-150',
                      isActive
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  >
                    {item.icon}
                  </div>

                  {/* Text content */}
                  <AnimatePresence mode="wait">
                    {sidebarOpen && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: durations.fast }}
                        className="flex flex-col items-start overflow-hidden min-w-0"
                      >
                        <span
                          className={cn(
                            'font-medium text-xs whitespace-nowrap transition-colors duration-150',
                            isActive
                              ? 'text-foreground'
                              : 'text-muted-foreground group-hover:text-foreground'
                          )}
                        >
                          {item.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground/70 whitespace-nowrap">
                          {item.description}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer - System status */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: durations.fast }}
            className="border-t border-border p-3"
          >
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-accent/50">
              <Circle className="h-1.5 w-1.5 fill-current text-foreground/60 animate-pulse-subtle" />
              <span className="text-[10px] text-muted-foreground">
                {t.common.poweredByAI}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  )
}
