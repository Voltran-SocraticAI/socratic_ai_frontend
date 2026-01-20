'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { useUIStore } from '@/stores'
import { useTranslation } from '@/lib/i18n'
import { Menu, Settings, HelpCircle, LogOut } from 'lucide-react'

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{t.common.user}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  user@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>{t.common.settings}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t.common.logout}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
