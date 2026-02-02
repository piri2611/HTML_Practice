import React, { useState, useEffect } from 'react';

interface ProgressStats {
  totalLessons: number;
  completedLessons: number;
  totalQuestions: number;
  solvedQuestions: number;
  currentStreak: number;
  bestStreak: number;
  totalTimeSpent: number; // in minutes
}

interface ProgressDashboardProps {
  lessons: Array<{ id: string; title: string }>;
  completedLessonIds: string[];
  solvedQuestionIds: number[];
  totalQuestions: number;
  onClose: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  lessons,
  completedLessonIds,
  solvedQuestionIds,
  totalQuestions,
  onClose
}) => {
  const [stats, setStats] = useState<ProgressStats>({
    totalLessons: lessons.length,
    completedLessons: completedLessonIds.length,
    totalQuestions: totalQuestions,
    solvedQuestions: solvedQuestionIds.length,
    currentStreak: 0,
    bestStreak: 0,
    totalTimeSpent: 0
  });

  useEffect(() => {
    // Calculate completion percentage and other stats
    const completed = completedLessonIds.length;
    const solved = solvedQuestionIds.length;
    
    // Get stats from localStorage
    const savedStats = localStorage.getItem('learningStats');
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      setStats(prev => ({
        ...prev,
        currentStreak: parsed.currentStreak || 0,
        bestStreak: parsed.bestStreak || 0,
        totalTimeSpent: parsed.totalTimeSpent || 0
      }));
    }
  }, [completedLessonIds, solvedQuestionIds]);

  const completionPercentage = Math.round(
    ((stats.completedLessons + stats.solvedQuestions / stats.totalQuestions) / (stats.totalLessons + 1)) * 100
  );
  const quizCompletionPercentage = Math.round(
    (stats.solvedQuestions / stats.totalQuestions) * 100
  );

  return (
    <div className="progress-dashboard-overlay" onClick={onClose}>
      <div className="progress-dashboard" onClick={(e) => e.stopPropagation()}>
        <div className="dashboard-header">
          <h2>📊 Learning Progress</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="dashboard-content">
          {/* Overall Progress */}
          <div className="progress-section">
            <h3>Overall Progress</h3>
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <span className="progress-percentage">{completionPercentage}%</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <div className="stat-value">{stats.completedLessons}/{stats.totalLessons}</div>
                <div className="stat-label">Lessons Completed</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-value">{stats.solvedQuestions}/{stats.totalQuestions}</div>
                <div className="stat-label">Questions Solved</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <div className="stat-value">{stats.currentStreak}</div>
                <div className="stat-label">Current Streak</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-value">{stats.bestStreak}</div>
                <div className="stat-label">Best Streak</div>
              </div>
            </div>
          </div>

          {/* Detailed Progress */}
          <div className="progress-section">
            <h3>Lessons Progress</h3>
            <div className="lessons-progress">
              {lessons.map((lesson, index) => (
                <div 
                  key={lesson.id} 
                  className={`lesson-progress-item ${
                    completedLessonIds.includes(lesson.id) ? 'completed' : ''
                  }`}
                >
                  <span className="lesson-number">{index + 1}</span>
                  <span className="lesson-name">{lesson.title}</span>
                  <span className="lesson-status">
                    {completedLessonIds.includes(lesson.id) ? '✓' : '○'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz Progress */}
          <div className="progress-section">
            <h3>Quiz Performance</h3>
            <div className="quiz-progress-bar-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill quiz-fill" 
                  style={{ width: `${quizCompletionPercentage}%` }}
                ></div>
              </div>
              <span className="progress-percentage">{quizCompletionPercentage}%</span>
            </div>
          </div>

          {/* Achievements */}
          <div className="progress-section">
            <h3>🏆 Achievements</h3>
            <div className="achievements-grid">
              {stats.completedLessons >= 5 && (
                <div className="achievement">
                  <div className="achievement-icon">🌟</div>
                  <div className="achievement-text">Quick Learner<br /><small>5 Lessons Done</small></div>
                </div>
              )}
              {stats.completedLessons >= 10 && (
                <div className="achievement">
                  <div className="achievement-icon">🚀</div>
                  <div className="achievement-text">Rocket Start<br /><small>10 Lessons Done</small></div>
                </div>
              )}
              {stats.solvedQuestions >= 10 && (
                <div className="achievement">
                  <div className="achievement-icon">🎯</div>
                  <div className="achievement-text">Quiz Master<br /><small>10 Questions</small></div>
                </div>
              )}
              {stats.currentStreak >= 5 && (
                <div className="achievement">
                  <div className="achievement-icon">🔥</div>
                  <div className="achievement-text">On Fire<br /><small>5 Day Streak</small></div>
                </div>
              )}
              {completionPercentage === 100 && (
                <div className="achievement">
                  <div className="achievement-icon">👑</div>
                  <div className="achievement-text">Legend<br /><small>100% Complete</small></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
