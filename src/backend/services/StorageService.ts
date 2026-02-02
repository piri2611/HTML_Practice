/**
 * Storage Service - Handles local storage operations for offline data
 */

class StorageService {
  /**
   * Mark a question as solved for a user
   */
  markQuestionSolved(userId: string, questionId: number): void {
    const saved = localStorage.getItem(`solved_${userId}`);
    const solved = saved ? JSON.parse(saved) : {};
    solved[questionId] = true;
    localStorage.setItem(`solved_${userId}`, JSON.stringify(solved));
  }

  /**
   * Get all solved questions for a user
   */
  getSolvedQuestions(userId: string): { [key: number]: boolean } {
    const saved = localStorage.getItem(`solved_${userId}`);
    return saved ? JSON.parse(saved) : {};
  }

  /**
   * Clear solved questions for a user
   */
  clearSolvedQuestions(userId: string): void {
    localStorage.removeItem(`solved_${userId}`);
  }

  /**
   * Check if a specific question is solved
   */
  isQuestionSolved(userId: string, questionId: number): boolean {
    const solved = this.getSolvedQuestions(userId);
    return solved[questionId] === true;
  }
}

// Export singleton instance
export default new StorageService();
