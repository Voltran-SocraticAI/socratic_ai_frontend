'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { FileQuestion, Upload, Sparkles } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center',
        className
      )}
    >
      {icon && (
        <div className="mb-4 rounded-full bg-muted p-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  )
}

export function NoQuestionsState({ onGenerate }: { onGenerate?: () => void }) {
  const t = useTranslation()
  return (
    <EmptyState
      icon={<FileQuestion className="h-8 w-8 text-muted-foreground" />}
      title={t.pdfWorkspace.noQuestions}
      description={t.pdfWorkspace.noQuestionsDesc}
      action={onGenerate ? { label: t.pdfWorkspace.generateQuestions, onClick: onGenerate } : undefined}
    />
  )
}

export function UploadPDFState({ onUpload }: { onUpload: () => void }) {
  const t = useTranslation()
  return (
    <EmptyState
      icon={<Upload className="h-8 w-8 text-muted-foreground" />}
      title={t.pdfWorkspace.uploadPdf}
      description={t.pdfWorkspace.dropPdfHere}
      action={{ label: t.pdfWorkspace.uploadPdf, onClick: onUpload }}
    />
  )
}

export function SelectQuestionState() {
  const t = useTranslation()
  return (
    <EmptyState
      icon={<Sparkles className="h-8 w-8 text-muted-foreground" />}
      title={t.studio.selectQuestion}
      description={t.studio.noQuestionSelectedDesc}
    />
  )
}
