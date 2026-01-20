'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { QuestionInputForm, SimilarQuestionsList } from './components'
import { useGenerateSimilar } from './hooks/use-generate-similar'
import { useTranslation } from '@/lib/i18n'
import { GitCompare } from 'lucide-react'
import type { QuestionOption, QuestionType, SimilarQuestion, OriginalAnalysis } from '@/types'

export function SimilarityView() {
  const t = useTranslation()

  // Input state
  const [questionText, setQuestionText] = useState('')
  const [questionType, setQuestionType] = useState<QuestionType>('mcq')
  const [options, setOptions] = useState<QuestionOption[]>([])
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [numSimilar, setNumSimilar] = useState(3)

  // Results state
  const [similarQuestions, setSimilarQuestions] = useState<SimilarQuestion[]>([])
  const [analysis, setAnalysis] = useState<OriginalAnalysis | null>(null)

  const { generateSimilar, isLoading } = useGenerateSimilar({
    onSuccess: (data) => {
      setSimilarQuestions(data.similar_questions)
      setAnalysis(data.original_analysis)
    },
  })

  const handleGenerate = () => {
    if (!questionText.trim()) return

    generateSimilar({
      question_text: questionText,
      question_type: questionType,
      options: questionType === 'mcq' ? options : undefined,
      correct_answer: correctAnswer || undefined,
      num_similar: numSimilar,
    })
  }

  const canGenerate = questionText.trim().length > 0

  return (
    <div data-testid="view-similarity" className="flex h-full">
      {/* Left Panel - Input Form */}
      <div className="w-[400px] border-r flex flex-col">
        <ScrollArea className="flex-1">
          <div className="p-4">
            <QuestionInputForm
              questionText={questionText}
              setQuestionText={setQuestionText}
              questionType={questionType}
              setQuestionType={setQuestionType}
              options={options}
              setOptions={setOptions}
              correctAnswer={correctAnswer}
              setCorrectAnswer={setCorrectAnswer}
              numSimilar={numSimilar}
              setNumSimilar={setNumSimilar}
            />
          </div>
        </ScrollArea>

        {/* Generate Button */}
        <div className="p-4 border-t">
          {isLoading && <Progress value={50} className="mb-3 h-2 animate-pulse" />}
          <Button
            className="w-full gap-2"
            size="lg"
            disabled={!canGenerate || isLoading}
            onClick={handleGenerate}
          >
            <GitCompare className="h-5 w-5" />
            {isLoading ? t.similarity.generatingVariations : t.similarity.generateVariations}
          </Button>
        </div>
      </div>

      {/* Right Panel - Results */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold">{t.similarity.similarQuestions}</h2>
          <p className="text-sm text-muted-foreground">
            {similarQuestions.length} {t.pdfWorkspace.questionsGenerated}
          </p>
        </div>
        <SimilarQuestionsList
          questions={similarQuestions}
          analysis={analysis}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
