'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * MinimalBackground - Subtle depth layer for professional aesthetic
 * Creates ambient depth without distraction
 */
export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Subtle radial gradients for depth */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-40"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--foreground) / 0.03), transparent),
            radial-gradient(ellipse 60% 40% at 100% 100%, hsl(var(--foreground) / 0.02), transparent),
            radial-gradient(ellipse 50% 30% at 0% 100%, hsl(var(--foreground) / 0.02), transparent)
          `
        }}
      />

      {/* Ultra-subtle animated gradient orbs */}
      <motion.div
        className="absolute top-[20%] left-[30%] w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(var(--foreground) / 0.015), transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, 40, 0],
          y: [0, -20, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(var(--foreground) / 0.01), transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Ultra-subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.012] dark:opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Subtle noise texture for premium feel */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette effect for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, hsl(var(--background) / 0.4) 100%)',
        }}
      />
    </div>
  )
}

/**
 * FloatingParticles - Optional subtle particles effect
 * Use sparingly for specific sections
 */
export function FloatingParticles({ count = 12 }: { count?: number }) {
  const [mounted, setMounted] = useState(false)

  // Generate stable random values on client only to avoid hydration mismatch
  const particles = useMemo(() => {
    if (!mounted) return []
    return [...Array(count)].map((_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      top: 10 + Math.random() * 80,
      duration: 4 + Math.random() * 3,
      delay: Math.random() * 2,
    }))
  }, [mounted, count])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-[2px] h-[2px] rounded-full bg-foreground/10"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
