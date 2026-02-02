/**
 * Quiz Service - Handles quiz attempts, results, and user progress
 */
import { supabase } from '../config/database';
import { QuizResult } from '../types';

class QuizService {
  /**
   * Save user progress for a specific question
   */
  async saveUserProgress(
    userId: string,
    userEmail: string,
    questionId: number,
    status: 'correct' | 'wrong'
  ): Promise<boolean> {
    try {
      const updateData: any = {
        user_id: userId,
        user_email: userEmail,
      };

      updateData[`question_${questionId}_status`] = status;

      const { error } = await supabase
        .from('user_progress')
        .upsert(updateData, { onConflict: 'user_id' });

      if (error) {
        console.error('Error saving user progress:', error.message);
        return false;
      }

      console.log(`✓ Question ${questionId} marked as ${status}`);
      return true;
    } catch (error: any) {
      console.error('Error saving user progress:', error?.message);
      return false;
    }
  }

  /**
   * Save quiz result
   */
  async saveQuizResult(userId: string, result: QuizResult): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('quiz_results')
        .insert({
          user_id: userId,
          question_id: result.questionId,
          total_blanks: result.totalBlanks,
          correct_answers: result.correctAnswers,
          percentage: result.percentage,
          completed_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving quiz result:', error.message);
        return false;
      }

      console.log('✓ Quiz result saved:', result);
      return true;
    } catch (error: any) {
      console.error('Error saving quiz result:', error?.message);
      return false;
    }
  }

  /**
   * Save quiz attempt with detailed answers
   */
  async saveQuizAttempt(
    userId: string,
    questionId: number,
    answers: Record<string, string>,
    score: number,
    totalPoints: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: userId,
          question_id: questionId,
          answers: answers,
          score: score,
          total_points: totalPoints,
          submitted_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving quiz attempt:', error.message);
        return false;
      }

      console.log('✓ Quiz attempt saved');
      return true;
    } catch (error: any) {
      console.error('Error saving quiz attempt:', error?.message);
      return false;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user stats:', error.message);
        return null;
      }

      return data;
    } catch (error: any) {
      console.error('Error fetching user stats:', error?.message);
      return null;
    }
  }

  /**
   * Get user quiz results history
   */
  async getUserResults(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching user results:', error.message);
        return [];
      }

      return data || [];
    } catch (error: any) {
      console.error('Error fetching user results:', error?.message);
      return [];
    }
  }
}

// Export singleton instance
export default new QuizService();
