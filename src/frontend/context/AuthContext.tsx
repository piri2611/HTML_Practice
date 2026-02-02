import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../../backend/config/database';

interface User {
  email: string;
  name: string;
  id?: string;
}

interface SignupResult {
  success: boolean;
  error?: string;
}

interface LoginResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  signup: (name: string, email: string, username: string, password: string) => Promise<SignupResult>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        // For custom auth, we'll use localStorage to persist session
        const savedUser = localStorage.getItem('quiz_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signup = async (name: string, email: string, username: string, password: string): Promise<SignupResult> => {
    try {
      // Use Supabase's built-in signUp
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) {
        console.error('Signup error:', error.message);
        
        // Check for specific error messages
        if (error.message?.includes('already registered')) {
          return { 
            success: false, 
            error: 'This email is already registered. Please login instead.' 
          };
        }
        
        return { 
          success: false, 
          error: error.message || 'Signup failed. Please try again.' 
        };
      }

      if (data.user) {
        // Create user profile in profiles table
        // The trigger will auto-create it, but we'll upsert to ensure it exists
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: name,
          email: email
        }, { onConflict: 'id' });

        const userData = {
          email: email,
          name: name,
          id: data.user.id
        };
        setUser(userData);
        localStorage.setItem('quiz_user', JSON.stringify(userData));
        
        console.log('✓ User created and profile saved:', email);
        return { success: true };
      }
      return { success: false, error: 'Signup failed. Please try again.' };
    } catch (error: any) {
      console.error('Signup exception:', error?.message);
      return { 
        success: false, 
        error: error?.message || 'Signup failed. Please try again.' 
      };
    }
  };

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      // Use Supabase's built-in signInWithPassword
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        console.error('Login error:', error?.message);
        return { 
          success: false, 
          error: 'Invalid email or password' 
        };
      }

      if (data.user) {
        const userData = {
          email: data.user.email || '',
          name: data.user.user_metadata?.full_name || email,
          id: data.user.id
        };
        setUser(userData);
        localStorage.setItem('quiz_user', JSON.stringify(userData));
        
        console.log('✓ Logged in:', data.user.email);
        return { success: true };
      }
      
      return { 
        success: false, 
        error: 'Invalid email or password' 
      };
    } catch (error: any) {
      console.error('Login exception:', error?.message);
      return { 
        success: false, 
        error: error?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const loginWithGoogle = async (email: string, name: string): Promise<boolean> => {
    try {
      setUser({ email, name });
      return true;
    } catch (error: any) {
      alert(error?.message || 'Google login failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('quiz_user');
    } catch (error: any) {
      alert(error?.message || 'Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
