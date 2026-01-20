'use client'

import { motion } from 'framer-motion'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { durations, easings } from '@/lib/animations'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative flex h-screen overflow-hidden bg-background">
      {/* Subtle background depth */}
      <AnimatedBackground />

      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <motion.main
          className="flex-1 overflow-auto scrollbar-minimal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: durations.normal, ease: easings.smooth }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
