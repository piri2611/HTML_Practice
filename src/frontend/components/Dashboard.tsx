import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BackendAPI } from '../../backend/api';
import type { QuestionData } from '../../backend/types';

interface DashboardProps {
  onSelectQuestion: (questionId: number) => void;
  onOpenStudy: () => void;
}

interface UserProgress {
  question_1_status: string | null;
  question_2_status: string | null;
  question_3_status: string | null;
  question_4_status: string | null;
  question_5_status: string | null;
  question_6_status: string | null;
  question_7_status: string | null;
  question_8_status: string | null;
  question_9_status: string | null;
  question_10_status: string | null;
}

export const Dashboard = ({ onSelectQuestion, onOpenStudy }: DashboardProps) => {
  const { user, logout } = useAuth();
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(true);

  // Load questions from database
  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      const allQuestions = await BackendAPI.questions.getAll();
      setQuestions(allQuestions);
      setLoading(false);
      console.log('✓ Questions loaded from database:', allQuestions.length);
    };

    loadQuestions();
  }, []);

  // Load user progress from Supabase
  useEffect(() => {
    const loadUserProgress = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await BackendAPI.supabase
          .from('user_progress')
          .select()
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading user progress:', error.message);
        } else if (data) {
          setUserProgress(data);
          console.log('✓ User progress loaded:', data);
        }
      } catch (error: any) {
        console.error('Error loading user progress:', error?.message);
      }
    };

    loadUserProgress();
  }, [user?.id]);

  const filteredQuestions = difficultyFilter === 'all' 
    ? questions 
    : questions.filter(q => q.difficulty === difficultyFilter);

  // Get question status from user progress
  const getQuestionStatus = (questionId: number): 'correct' | 'wrong' | null => {
    if (!userProgress) return null;
    
    const statusKey = `question_${questionId}_status` as keyof UserProgress;
    const status = userProgress[statusKey];
    
    if (status === 'correct') return 'correct';
    if (status === 'wrong') return 'wrong';
    return null;
  };

  // Get button text based on status
  const getButtonText = (questionId: number): string => {
    const status = getQuestionStatus(questionId);
    
    if (status === 'correct') return '✓ Completed';
    if (status === 'wrong') return 'Not Finished Yet';
    return 'Solve';
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>📚 Quiz Practice</h1>
          <p className="subtitle">Master HTML with fill-in-the-blanks questions</p>
        </div>
        <div className="header-right">
          <button className="study-btn" onClick={onOpenStudy}>HTML Study Area</button>
          <span className="user-info">Welcome, {user?.name}!</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="controls-section">
          <div className="filter-section">
            <h3>Filter by Difficulty</h3>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${difficultyFilter === 'all' ? 'active' : ''}`}
                onClick={() => setDifficultyFilter('all')}
              >
                All Questions ({questions.length})
              </button>
              <button 
                className={`filter-btn easy ${difficultyFilter === 'easy' ? 'active' : ''}`}
                onClick={() => setDifficultyFilter('easy')}
              >
                Easy ({questions.filter(q => q.difficulty === 'easy').length})
              </button>
              <button 
                className={`filter-btn medium ${difficultyFilter === 'medium' ? 'active' : ''}`}
                onClick={() => setDifficultyFilter('medium')}
              >
                Medium ({questions.filter(q => q.difficulty === 'medium').length})
              </button>
              <button 
                className={`filter-btn hard ${difficultyFilter === 'hard' ? 'active' : ''}`}
                onClick={() => setDifficultyFilter('hard')}
              >
                Hard ({questions.filter(q => q.difficulty === 'hard').length})
              </button>
            </div>
          </div>

          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-number">
                {userProgress ? Object.values(userProgress).filter(status => status === 'correct').length : 0}
              </div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{filteredQuestions.length}</div>
              <div className="stat-label">Available</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {questions.length > 0 ? Math.round((Object.values(userProgress || {}).filter(status => status === 'correct').length / questions.length) * 100) : 0}%
              </div>
              <div className="stat-label">Progress</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '16px', color: '#667eea', marginBottom: '20px' }}>Loading questions...</div>
            <div style={{ width: '40px', height: '40px', border: '4px solid #f0f0f0', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <p>No questions available</p>
          </div>
        ) : (
          <div className="questions-grid">
            {filteredQuestions.map((question) => {
              const status = getQuestionStatus(question.id);
              const isCompleted = status === 'correct';
              const isWrong = status === 'wrong';
              
              return (
                <div 
                  key={question.id}
                  className={`question-card ${question.difficulty} ${isCompleted ? 'solved' : ''} ${isWrong ? 'wrong' : ''}`}
                  onClick={() => onSelectQuestion(question.id)}
                >
                  <div className="card-header">
                    <div className="question-title">
                      <h3>Q{question.id}. {question.title}</h3>
                    </div>
                    {isCompleted && (
                      <div className="solved-badge">✓</div>
                    )}
                  </div>

                  <div className="card-body">
                    <p className="description">{question.description}</p>
                    <div className="card-footer">
                      <span className="difficulty-badge" style={{ backgroundColor: question.difficulty === 'easy' ? '#4caf50' : question.difficulty === 'medium' ? '#ff9800' : '#f44336' }}>
                        {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                      </span>
                      <span className="blanks-count">{question.blanksCount} blanks</span>
                    </div>
                  </div>

                  <button className="solve-button">
                    {getButtonText(question.id)}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
