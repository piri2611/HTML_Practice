import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BackendAPI } from '../../backend/api';

interface AuthProps {
  onAuthSuccess: () => void;
}

export const Auth = ({ onAuthSuccess }: AuthProps) => {
  const [view, setView] = useState<'choice' | 'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup } = useAuth();

  const validatePassword = (pwd: string): string => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters';
    }
    return '';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      if (result.success) {
        setEmail('');
        setPassword('');
        onAuthSuccess();
      } else {
        setError(result.error || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsLoading(true);
    
    try {
      const fullName = firstName.trim();
      const result = await signup(fullName, email, email, password);
      
      if (result.success) {
        setEmail('');
        setPassword('');
        setFirstName('');
        onAuthSuccess();
      } else {
        setError(result.error || 'Signup failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordError = (view === 'signup' && password) ? validatePassword(password) : '';

  // LOGIN VIEW
  if (view === 'login') {
    return (
      <div className="auth-container">
        <div className="auth-visual">
          <div className="auth-visual-content">
            <span className="auth-visual-icon">📚</span>
            <div className="auth-visual-text">Master Web Basics</div>
            <div className="auth-visual-subtext">
              Learn HTML fundamentals with our interactive practice platform
            </div>
          </div>
        </div>
        <div className="auth-card">
          <div className="auth-header">
            <h1>Login</h1>
            <p>Sign in to your account</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group password-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="toggle-text">
            Don't have an account? 
            <button
              type="button"
              className="toggle-btn"
              onClick={() => {
                setView('signup');
                setError('');
                setEmail('');
                setPassword('');
              }}
            >
              Create one now
            </button>
          </p>
        </div>
      </div>
    );
  }

  // SIGNUP VIEW
  return (
    <div className="auth-container">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <span className="auth-visual-icon">🚀</span>
          <div className="auth-visual-text">Start Learning Today</div>
          <div className="auth-visual-subtext">
            Join thousands of students mastering web development basics
          </div>
        </div>
      </div>
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join our quiz platform</p>
        </div>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group password-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {passwordError && <p className="error-message password-error">{passwordError}</p>}
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-btn" disabled={isLoading || !!passwordError}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="toggle-text">
          Already have an account? 
          <button
            type="button"
            className="toggle-btn"
            onClick={() => {
              setView('login');
              setError('');
              setEmail('');
              setPassword('');
            }}
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};
