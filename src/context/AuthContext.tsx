// AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  setToken: (token: string | null) => void;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated,setIsAutheticated] = useState<boolean>(false)
  console.log(token)
  useEffect(() => {
    // Initialize token from local storage
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAutheticated(true)
    }
  }, []);

 console.log(isAuthenticated)
  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken); // Store token in local storage
    setIsAutheticated(true)
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken'); // Remove token from local storage
    setIsAutheticated(false)
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, setToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
