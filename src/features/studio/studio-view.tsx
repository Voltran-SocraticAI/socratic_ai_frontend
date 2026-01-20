'use client'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable-panels'
import { Button } from '@/components/ui/button'
import { useStudioStore, useQuestionStore, useUIStore } from '@/stores'
import { useTranslation } from '@/lib/i18n'
import { ChatPanel, QuestionPreviewPanel, QuestionSelector } from './components'
import { useRefineQuestion } from './hooks/use-refine-question'
import { RotateCcw, ArrowLeft } from 'lucide-react'
import type { Question } from '@/types'

export function StudioView() {
  const t = useTranslation()
  const {
    question,
    messages,
    turnNumber,
    isRefining,
    initSession,
    resetSession,
  } = useStudioStore()

  const { selectedQuestion } = useQuestionStore()
  const { panelSizes, setPanelSizes } = useUIStore()

  const { refineQuestion } = useRefineQuestion()

  // Use selected question from store if available
  const activeQuestion = question || selectedQuestion

  const handleSelectQuestion = (q: Question) => {
    initSession(q)
  }

  const handleReset = () => {
    if (activeQuestion) {
      initSession(activeQuestion)
    }
  }

  // Get the last assistant message for changes description
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((m) => m.role === 'assistant')

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          {question && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetSession}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.common.close}
            </Button>
          )}
          <div>
            <h2 className="font-semibold">{t.studio.title}</h2>
            <p className="text-sm text-muted-foreground">
              {t.nav.interactiveStudioDesc}
            </p>
          </div>
        </div>

        {question && (
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      {/* Content */}
      {!activeQuestion ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <QuestionSelector
              onSelectQuestion={handleSelectQuestion}
              currentQuestionId={activeQuestion?.id}
            />
          </div>
        </div>
      ) : (
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1"
          onLayout={(sizes: number[]) => {
            setPanelSizes({ chat: sizes[0], preview: sizes[1] })
          }}
        >
          {/* Chat Panel */}
          <ResizablePanel defaultSize={panelSizes.chat} minSize={30}>
            <ChatPanel
              messages={messages}
              onSendMessage={refineQuestion}
              isLoading={isRefining}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Preview Panel */}
          <ResizablePanel defaultSize={panelSizes.preview} minSize={30}>
            <QuestionPreviewPanel
              question={question || activeQuestion}
              changesDescription={lastAssistantMessage?.content}
              turnNumber={turnNumber}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  )
}
