/**
 * Main Application Component
 * Uses modular frontend components and backend API
 */
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './frontend/context/AuthContext';
import { Auth } from './frontend/components/Auth';
import { Dashboard } from './frontend/components/Dashboard';
import { Quiz } from './frontend/components/Quiz';
import { StudyArea } from './frontend/components/StudyArea';
import './styles.css';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'quiz' | 'study'>('study');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#667eea', marginBottom: '20px' }}>Loading...</div>
          <div style={{ width: '40px', height: '40px', border: '4px solid #f0f0f0', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {!user ? (
        <Auth onAuthSuccess={() => {}} />
      ) : activeView === 'quiz' && selectedQuestionId !== null ? (
        <Quiz
          questionId={selectedQuestionId}
          onBack={() => {
            setSelectedQuestionId(null);
            setActiveView('study');
          }}
        />
      ) : activeView === 'study' ? (
        <StudyArea 
          onBack={() => setActiveView('study')}
          onSelectQuestion={(id) => {
            setSelectedQuestionId(id);
            setActiveView('quiz');
          }}
        />
      ) : (
        <StudyArea 
          onBack={() => setActiveView('study')}
          onSelectQuestion={(id) => {
            setSelectedQuestionId(id);
            setActiveView('quiz');
          }}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
