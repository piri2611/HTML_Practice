/**
 * Shared type definitions for the backend
 */

export interface BlankDetail {
  id: string;
  correctAnswer: string;
  explanation?: string;
  hints?: string[];
}

export interface QuestionData {
  id: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  htmlContent: string;
  blanksCount: number;
  blanks: BlankDetail[];
}

export interface QuizResult {
  questionId: number;
  totalBlanks: number;
  correctAnswers: number;
  percentage: number;
}

export interface QuizAttempt {
  userId: string;
  questionId: number;
  answers: Record<string, string>;
  score: number;
  totalPoints: number;
  submittedAt: string;
}

export interface UserStats {
  id: string;
  totalAttempts: number;
  correctAnswers: number;
  averageScore: number;
}

export interface UserProgress {
  userId: string;
  userEmail: string;
  questionStatus: Record<number, 'correct' | 'wrong' | null>;
}
