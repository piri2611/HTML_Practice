/**
 * Question Service - Handles all question-related data operations
 */
import { supabase } from '../config/database';
import { QuestionData, BlankDetail } from '../types';

class QuestionService {
  /**
   * Fetch all questions from the database
   */
  async getAllQuestions(): Promise<QuestionData[]> {
    try {
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .order('id', { ascending: true });

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        return [];
      }

      // Fetch blanks for each question
      const questionsWithBlanks = await Promise.all(
        (questionsData || []).map(async (question) => {
          const blanks = await this.getQuestionBlanks(question.id);
          
          return {
            id: question.id,
            title: question.title,
            difficulty: question.difficulty,
            description: question.description,
            htmlContent: question.html_content,
            blanksCount: question.blanks_count,
            blanks
          };
        })
      );

      return questionsWithBlanks;
    } catch (error: any) {
      console.error('Error in getAllQuestions:', error?.message);
      return [];
    }
  }

  /**
   * Fetch a single question by ID
   */
  async getQuestionById(questionId: number): Promise<QuestionData | null> {
    try {
      const { data: questionData, error: questionError } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .single();

      if (questionError) {
        console.error('Error fetching question:', questionError);
        return null;
      }

      const blanks = await this.getQuestionBlanks(questionId);

      return {
        id: questionData.id,
        title: questionData.title,
        difficulty: questionData.difficulty,
        description: questionData.description,
        htmlContent: questionData.html_content,
        blanksCount: questionData.blanks_count,
        blanks
      };
    } catch (error: any) {
      console.error('Error in getQuestionById:', error?.message);
      return null;
    }
  }

  /**
   * Fetch questions by difficulty level
   */
  async getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<QuestionData[]> {
    try {
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('difficulty', difficulty)
        .order('id', { ascending: true });

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        return [];
      }

      const questionsWithBlanks = await Promise.all(
        (questionsData || []).map(async (question) => {
          const blanks = await this.getQuestionBlanks(question.id);
          
          return {
            id: question.id,
            title: question.title,
            difficulty: question.difficulty,
            description: question.description,
            htmlContent: question.html_content,
            blanksCount: question.blanks_count,
            blanks
          };
        })
      );

      return questionsWithBlanks;
    } catch (error: any) {
      console.error('Error in getQuestionsByDifficulty:', error?.message);
      return [];
    }
  }

  /**
   * Helper method to fetch blanks for a specific question
   */
  private async getQuestionBlanks(questionId: number): Promise<BlankDetail[]> {
    try {
      const { data: blanksData, error: blanksError } = await supabase
        .from('question_blanks')
        .select('blank_id, correct_answer')
        .eq('question_id', questionId)
        .order('position', { ascending: true });

      if (blanksError) {
        console.error(`Error fetching blanks for question ${questionId}:`, blanksError);
        return [];
      }

      return (blanksData || []).map(blank => ({
        id: blank.blank_id,
        correctAnswer: blank.correct_answer
      }));
    } catch (error: any) {
      console.error('Error fetching blanks:', error?.message);
      return [];
    }
  }

  /**
   * Validate user answer against correct answer
   */
  checkAnswer(userAnswer: string, correctAnswer: string): boolean {
    return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
  }

  /**
   * Calculate question score based on correct answers
   */
  calculateScore(correctCount: number, totalBlanks: number): number {
    if (totalBlanks === 0) return 0;
    return Math.round((correctCount / totalBlanks) * 100);
  }
}

// Export singleton instance
export default new QuestionService();
