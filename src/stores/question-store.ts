import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Question, GenerationSession } from '@/types'

interface QuestionState {
  // Current session
  currentSession: GenerationSession | null

  // All generated questions (flat list for easy access)
  questions: Question[]

  // Selected question for refinement
  selectedQuestion: Question | null

  // Generation history
  sessions: GenerationSession[]

  // Hydration state
  _hasHydrated: boolean

  // Actions
  setCurrentSession: (session: GenerationSession | null) => void
  addSession: (session: GenerationSession) => void
  selectQuestion: (question: Question | null) => void
  updateQuestion: (id: string, updates: Partial<Question>) => void
  deleteQuestion: (id: string) => void
  clearCurrentSession: () => void
  setHasHydrated: (state: boolean) => void
}

export const useQuestionStore = create<QuestionState>()(
  persist(
    (set) => ({
      currentSession: null,
      questions: [],
      selectedQuestion: null,
      sessions: [],
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state })
      },

      setCurrentSession: (session) => {
        set({
          currentSession: session,
          questions: session?.questions || [],
        })
      },

      addSession: (session) => {
        set((state) => ({
          sessions: [session, ...state.sessions].slice(0, 50), // Keep last 50 sessions
          currentSession: session,
          questions: session.questions,
        }))
      },

      selectQuestion: (question) => {
        set({ selectedQuestion: question })
      },

      updateQuestion: (id, updates) => {
        set((state) => {
          const updatedQuestions = state.questions.map((q) =>
            q.id === id ? { ...q, ...updates } : q
          )

          const updatedSelectedQuestion =
            state.selectedQuestion?.id === id
              ? { ...state.selectedQuestion, ...updates }
              : state.selectedQuestion

          return {
            questions: updatedQuestions,
            selectedQuestion: updatedSelectedQuestion,
            currentSession: state.currentSession
              ? { ...state.currentSession, questions: updatedQuestions }
              : null,
          }
        })
      },

      deleteQuestion: (id) => {
        set((state) => {
          const updatedQuestions = state.questions.filter((q) => q.id !== id)
          return {
            questions: updatedQuestions,
            selectedQuestion:
              state.selectedQuestion?.id === id ? null : state.selectedQuestion,
            currentSession: state.currentSession
              ? { ...state.currentSession, questions: updatedQuestions }
              : null,
          }
        })
      },

      clearCurrentSession: () => {
        set({
          currentSession: null,
          questions: [],
          selectedQuestion: null,
        })
      },
    }),
    {
      name: 'socratic-questions',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessions: state.sessions,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
