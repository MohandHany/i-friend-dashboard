"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import "@/services/interceptors";

/* Store authentication token in local storage */
export const setAuthToken = (accessToken: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem("accessToken", accessToken);
    document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
  }
};

/* Retrieve authentication token from local storage */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("accessToken");
  }
  return null;
};

/* Remove authentication token from local storage */
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("rememberMe");
    document.cookie = 'accessToken=; path=/; max-age=0';
  }
};

/* Check if user is authenticated */
export const isAuthenticated = (): boolean => {
  const accessToken = getAuthToken();
  return !!accessToken;
};


interface AuthContextType {
  isAuthenticated: boolean;
  login: (accessToken: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const checkAuth = async () => {
    const accessToken = getAuthToken();
    setIsAuthenticated(!!accessToken);
  };


  useEffect(() => {
    checkAuth();
  }, []);

  const login = (accessToken: string) => {
    console.log("accessToken", accessToken)
    setAuthToken(accessToken);

    toast(`Log-in successfully, hey 👋`);
    router.push("/");

    setIsAuthenticated(true);
  };

  const logout = () => {
    removeAuthToken();

    toast.message(`Log-out successfully, see you soon 🙌`);
    router.push('/sign-in');

    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
