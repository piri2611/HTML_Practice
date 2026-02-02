/**
 * Backend API - Central export point for all backend services
 * This file acts as the API layer between frontend and backend
 */

// Services
import QuestionService from '../services/QuestionService';
import QuizService from '../services/QuizService';
import StorageService from '../services/StorageService';

// Types
export type {
  QuestionData,
  BlankDetail,
  QuizResult,
  QuizAttempt,
  UserStats,
  UserProgress,
} from '../types';

// Database config
export { supabase, dbConfig } from '../config/database';

/**
 * Backend API object - single entry point for all backend operations
 */
export const BackendAPI = {
  // Direct exports
  supabase: null as any, // Will be set below
  dbConfig: null as any, // Will be set below

  // Question operations
  questions: {
    getAll: () => QuestionService.getAllQuestions(),
    getById: (id: number) => QuestionService.getQuestionById(id),
    getByDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => 
      QuestionService.getQuestionsByDifficulty(difficulty),
    checkAnswer: (userAnswer: string, correctAnswer: string) => 
      QuestionService.checkAnswer(userAnswer, correctAnswer),
    calculateScore: (correctCount: number, totalBlanks: number) => 
      QuestionService.calculateScore(correctCount, totalBlanks),
  },

  // Quiz operations
  quiz: {
    saveProgress: (userId: string, userEmail: string, questionId: number, status: 'correct' | 'wrong') =>
      QuizService.saveUserProgress(userId, userEmail, questionId, status),
    saveResult: (userId: string, result: any) => 
      QuizService.saveQuizResult(userId, result),
    saveAttempt: (userId: string, questionId: number, answers: Record<string, string>, score: number, totalPoints: number) =>
      QuizService.saveQuizAttempt(userId, questionId, answers, score, totalPoints),
    getUserStats: (userId: string) => QuizService.getUserStats(userId),
    getUserResults: (userId: string) => QuizService.getUserResults(userId),
  },

  // Storage operations
  storage: {
    markSolved: (userId: string, questionId: number) => 
      StorageService.markQuestionSolved(userId, questionId),
    getSolved: (userId: string) => StorageService.getSolvedQuestions(userId),
    clearSolved: (userId: string) => StorageService.clearSolvedQuestions(userId),
    isSolved: (userId: string, questionId: number) => 
      StorageService.isQuestionSolved(userId, questionId),
  },
};

// Import and assign after BackendAPI is defined
import { supabase as supabaseClient, dbConfig as config } from '../config/database';
BackendAPI.supabase = supabaseClient;
BackendAPI.dbConfig = config;

// Export individual services for advanced use cases
export { QuestionService, QuizService, StorageService };
