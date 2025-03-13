import { Question, Subject, AnalyticsData } from "@/types"

export const subjects: Subject[] = [
  { id: "1", name: "Mathematics", code: "MATH", questionCount: 45 },
  { id: "2", name: "Physics", code: "PHY", questionCount: 32 },
  { id: "3", name: "Chemistry", code: "CHEM", questionCount: 28 },
  { id: "4", name: "Biology", code: "BIO", questionCount: 23 },
]

export const questions: Question[] = [
  {
    id: "1",
    text: "What is the capital of France?",
    difficulty: "Easy",
    subject: "Geography",
    type: "MCQ",
    marks: 2,
    createdAt: new Date("2024-01-15"),
    tags: ["capitals", "europe"],
    options: ["London", "Paris", "Berlin", "Madrid"],
    answer: "Paris"
  },
  {
    id: "2",
    text: "Explain Newton's First Law of Motion.",
    difficulty: "Medium",
    subject: "Physics",
    type: "Written",
    marks: 5,
    createdAt: new Date("2024-01-16"),
    tags: ["newton", "laws", "motion"],
  },
  // Add more questions...
]

export const analyticsData: AnalyticsData = {
  totalQuestions: 128,
  processedToday: 24,
  recentUploads: 12,
  accuracy: 98,
  processingSpeed: 1.2,
  subjectDistribution: {
    Mathematics: 35,
    Physics: 28,
    Chemistry: 22,
    Biology: 18,
    Geography: 15,
    History: 10,
  }
}