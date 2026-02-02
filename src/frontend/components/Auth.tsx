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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { error: oauthError } = await BackendAPI.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (oauthError) {
        setError('Google sign-in error: ' + oauthError.message);
      }
    } catch (error: any) {
      setError('Google sign-in failed: ' + error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordError = (view === 'signup' && password) ? validatePassword(password) : '';

  // CHOICE VIEW - Select Login or Signup
  if (view === 'choice') {
    return (
      <div className="auth-container">
        <div className="auth-card choice-card">
          <h1>Quiz Practice Platform</h1>
          <p className="welcome-text">Welcome! Please choose an option below.</p>
          
          <div className="choice-buttons">
            <button 
              className="choice-btn login-choice"
              onClick={() => {
                setView('login');
                setError('');
                setUsername('');
                setPassword('');
              }}
            >
              <span className="choice-icon">🔐</span>
              <span className="choice-title">Already Have Account?</span>
              <span className="choice-desc">Login with your email</span>
            </button>

            <button 
              className="choice-btn signup-choice"
              onClick={() => {
                setView('signup');
                setError('');
                setEmail('');
                setPassword('');
                setUsername('');
                setFirstName('');
                setLastName('');
              }}
            >
              <span className="choice-icon">✨</span>
              <span className="choice-title">New User?</span>
              <span className="choice-desc">Create a new account</span>
            </button>
          </div>

          <div className="oauth-section">
            <p className="oauth-text">Or continue with...</p>
            <button 
              type="button" 
              className="oauth-btn google-btn" 
              onClick={handleGoogleSignIn} 
              disabled={isLoading}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9.003 18z" fill="#34A853"/>
                <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LOGIN VIEW
  if (view === 'login') {
    return (
      <div className="auth-container">
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

        <button
          type="button"
          className="back-to-choice-btn"
          onClick={() => setView('choice')}
        >
          ← Back
        </button>
      </div>
    </div>
  );
};
