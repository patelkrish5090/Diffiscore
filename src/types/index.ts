export type Question = {
  id: string
  text: string
  difficulty: "Easy" | "Medium" | "Hard"
  subject: string
  type: "MCQ" | "Written" | "Numerical"
  marks: number
  createdAt: Date
  tags: string[]
  answer?: string
  options?: string[]
}

export type Subject = {
  id: string
  name: string
  code: string
  questionCount: number
}

export type AnalyticsData = {
  totalQuestions: number
  processedToday: number
  recentUploads: number
  accuracy: number
  processingSpeed: number
  subjectDistribution: Record<string, number>
}