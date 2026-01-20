'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LoadingCard } from '@/components/shared/loading-spinner'
import { EmptyState } from '@/components/shared/empty-state'
import { CheckCircle2, Circle, GitCompare } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SimilarQuestion, OriginalAnalysis } from '@/types'

interface SimilarQuestionsListProps {
  questions: SimilarQuestion[]
  analysis: OriginalAnalysis | null
  isLoading: boolean
}

export function SimilarQuestionsList({
  questions,
  analysis,
  isLoading,
}: SimilarQuestionsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <EmptyState
          icon={<GitCompare className="h-8 w-8 text-muted-foreground" />}
          title="No similar questions yet"
          description="Enter a question and click Generate to create similar variations."
        />
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* Original Analysis */}
        {analysis && (
          <Card className="bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Original Question Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Core Concept:</span>
                <span className="font-medium">{analysis.core_concept}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Difficulty:</span>
                <span className="font-medium">{analysis.difficulty_level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Structure:</span>
                <span className="font-medium">{analysis.question_structure}</span>
              </div>
              {analysis.key_distractors && analysis.key_distractors.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Key Distractors:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysis.key_distractors.map((d, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {d}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Similar Questions */}
        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="secondary" className="text-xs">
                  Variation {index + 1}
                </Badge>
                {question.variation_type && (
                  <Badge variant="outline" className="text-xs">
                    {question.variation_type.replace('_', ' ')}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Question Text */}
              <p className="text-sm font-medium leading-relaxed">
                {question.question_text}
              </p>

              {/* Options */}
              {question.options && (
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <div
                      key={option.label}
                      className={cn(
                        'flex items-center gap-2 rounded-md border p-2 text-sm',
                        option.is_correct && 'border-green-500 bg-green-50 dark:bg-green-950'
                      )}
                    >
                      {option.is_correct ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <span className="font-medium">{option.label}.</span>
                      <span>{option.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Explanation */}
              {question.explanation && (
                <div className="rounded-md bg-muted p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    How it differs
                  </p>
                  <p className="text-sm text-muted-foreground">{question.explanation}</p>
                </div>
              )}

              {/* Similarity Score */}
              {question.similarity_score != null && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Similarity</span>
                  <Progress value={question.similarity_score * 100} className="flex-1 h-2" />
                  <span className="text-xs font-medium">
                    {Math.round(question.similarity_score * 100)}%
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
