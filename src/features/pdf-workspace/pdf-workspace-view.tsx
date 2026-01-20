'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useQuestionStore, useUIStore } from '@/stores'
import { useTranslation } from '@/lib/i18n'
import {
  PDFDropzone,
  GenerationOptions,
  TextInputPanel,
  QuestionsList,
} from './components'
import { useGenerateQuestions } from './hooks/use-generate-questions'
import { Sparkles, FileText, Type } from 'lucide-react'
import type { QuestionType, Difficulty, Question } from '@/types'

export function PDFWorkspaceView() {
  const { questions, selectedQuestion, selectQuestion, deleteQuestion } = useQuestionStore()
  const { setViewMode } = useUIStore()
  const t = useTranslation()

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Text input state
  const [textContent, setTextContent] = useState('')

  // Generation options state
  const [numQuestions, setNumQuestions] = useState(5)
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>(['mcq', 'open_ended'])
  const [difficulty, setDifficulty] = useState<Difficulty>('mixed')
  const [topicFocus, setTopicFocus] = useState('')

  // Tab state
  const [inputTab, setInputTab] = useState<'pdf' | 'text'>('pdf')

  const { generateFromPDF, generateFromText, isLoading, progress } = useGenerateQuestions()

  const handleGenerate = () => {
    if (inputTab === 'pdf' && selectedFile) {
      generateFromPDF.mutate({
        file: selectedFile,
        numQuestions,
        questionTypes,
        difficulty,
        topicFocus,
      })
    } else if (inputTab === 'text' && textContent.length >= 50) {
      generateFromText.mutate({
        content: textContent,
        numQuestions,
        questionTypes,
        difficulty,
        topicFocus,
      })
    }
  }

  const canGenerate =
    (inputTab === 'pdf' && selectedFile) ||
    (inputTab === 'text' && textContent.length >= 50)

  const handleRefineQuestion = (question: Question) => {
    selectQuestion(question)
    setViewMode('studio')
  }

  return (
    <div className="flex h-full">
      {/* Left Panel - Input & Options */}
      <div className="w-[400px] border-r flex flex-col">
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Input Source Tabs */}
            <Tabs value={inputTab} onValueChange={(v) => setInputTab(v as 'pdf' | 'text')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pdf" className="gap-2">
                  <FileText className="h-4 w-4" />
                  {t.pdfWorkspace.uploadPdf}
                </TabsTrigger>
                <TabsTrigger value="text" className="gap-2">
                  <Type className="h-4 w-4" />
                  {t.pdfWorkspace.orEnterText}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pdf" className="mt-4">
                <PDFDropzone
                  selectedFile={selectedFile}
                  onFileSelect={setSelectedFile}
                  onClear={() => setSelectedFile(null)}
                  isUploading={isLoading}
                />
              </TabsContent>

              <TabsContent value="text" className="mt-4">
                <TextInputPanel text={textContent} setText={setTextContent} />
              </TabsContent>
            </Tabs>

            <Separator />

            {/* Generation Options */}
            <GenerationOptions
              numQuestions={numQuestions}
              setNumQuestions={setNumQuestions}
              questionTypes={questionTypes}
              setQuestionTypes={setQuestionTypes}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              topicFocus={topicFocus}
              setTopicFocus={setTopicFocus}
            />
          </div>
        </ScrollArea>

        {/* Generate Button */}
        <div className="p-4 border-t">
          {isLoading && progress > 0 && (
            <Progress value={progress} className="mb-3 h-2" />
          )}
          <Button
            className="w-full gap-2"
            size="lg"
            disabled={!canGenerate || isLoading}
            onClick={handleGenerate}
          >
            <Sparkles className="h-5 w-5" />
            {isLoading ? t.pdfWorkspace.generating : t.pdfWorkspace.generateQuestions}
          </Button>
        </div>
      </div>

      {/* Right Panel - Generated Questions */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold">{t.pdfWorkspace.title}</h2>
          <p className="text-sm text-muted-foreground">
            {questions.length} {t.pdfWorkspace.questionsGenerated}
          </p>
        </div>
        <QuestionsList
          questions={questions}
          isLoading={isLoading}
          selectedQuestionId={selectedQuestion?.id}
          onSelectQuestion={selectQuestion}
          onRefineQuestion={handleRefineQuestion}
          onDeleteQuestion={deleteQuestion}
        />
      </div>
    </div>
  )
}
