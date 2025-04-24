"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      // console.log('Starting token verification...');
      const token = localStorage.getItem("token");
      // console.log('Token from localStorage:', token ? 'exists' : 'not found');

      if (!token) {
        // console.log('No token found, skipping verification');
        setIsLoading(false);
        return;
      }

      try {
        // console.log('Sending verification request...');
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
        //   console.log('Response not OK:', res.status);
          throw new Error('Token verification failed');
        }

        const data = await res.json();
        // console.log('Verification response:', data);

        if (data.user) {
        //   console.log('Setting user data:', data.user);
          setUser(data.user);
        } else {
          // console.log('No user data in response');
          throw new Error('No user data received');
        }
      } catch (error) {
        // console.error('Auth error:', error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoading(false);
        // console.log('Token verification completed');
      }
    };

    verifyToken();
  }, []);

  const login = async (email: string, password: string) => {
    // console.log('Starting login process...');
    try {
      // console.log('Sending login request...');
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      // console.log('Login response:', { ok: res.ok, status: res.status });

      if (!res.ok) {
        // console.log('Login failed:', data.error);
        throw new Error(data.error || 'Login failed');
      }

      if (!data.token || !data.user) {
        // console.log('Invalid response:', data);
        throw new Error('Invalid response from server');
      }

      // console.log('Login successful, storing token and user data');
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (error) {
      // console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');

      if (!data.token || !data.user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
