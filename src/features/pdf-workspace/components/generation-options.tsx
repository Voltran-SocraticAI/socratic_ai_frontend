'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import type { QuestionType, Difficulty } from '@/types'

interface GenerationOptionsProps {
  numQuestions: number
  setNumQuestions: (n: number) => void
  questionTypes: QuestionType[]
  setQuestionTypes: (types: QuestionType[]) => void
  difficulty: Difficulty
  setDifficulty: (d: Difficulty) => void
  topicFocus: string
  setTopicFocus: (t: string) => void
}

export function GenerationOptions({
  numQuestions,
  setNumQuestions,
  questionTypes,
  setQuestionTypes,
  difficulty,
  setDifficulty,
  topicFocus,
  setTopicFocus,
}: GenerationOptionsProps) {
  const t = useTranslation()

  const toggleQuestionType = (type: QuestionType) => {
    if (questionTypes.includes(type)) {
      if (questionTypes.length > 1) {
        setQuestionTypes(questionTypes.filter((t) => t !== type))
      }
    } else {
      setQuestionTypes([...questionTypes, type])
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t.generation.options}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Number of Questions */}
        <div className="space-y-2">
          <Label htmlFor="num-questions">{t.generation.count}</Label>
          <Input
            id="num-questions"
            type="number"
            min={1}
            max={20}
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value) || 5)}
          />
        </div>

        {/* Question Types */}
        <div className="space-y-2">
          <Label>{t.generation.questionType}</Label>
          <div className="flex gap-2">
            <Badge
              variant={questionTypes.includes('mcq') ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer',
                questionTypes.includes('mcq') && 'bg-primary'
              )}
              onClick={() => toggleQuestionType('mcq')}
            >
              {t.generation.mcq}
            </Badge>
            <Badge
              variant={questionTypes.includes('open_ended') ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer',
                questionTypes.includes('open_ended') && 'bg-primary'
              )}
              onClick={() => toggleQuestionType('open_ended')}
            >
              {t.generation.openEnded}
            </Badge>
          </div>
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <Label htmlFor="difficulty">{t.generation.difficulty}</Label>
          <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
            <SelectTrigger id="difficulty">
              <SelectValue placeholder={t.generation.difficulty} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">{t.generation.easy}</SelectItem>
              <SelectItem value="medium">{t.generation.medium}</SelectItem>
              <SelectItem value="hard">{t.generation.hard}</SelectItem>
              <SelectItem value="mixed">{t.generation.mixed}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Topic Focus */}
        <div className="space-y-2">
          <Label htmlFor="topic-focus">{t.generation.topic}</Label>
          <Input
            id="topic-focus"
            placeholder={t.generation.topicPlaceholder}
            value={topicFocus}
            onChange={(e) => setTopicFocus(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
