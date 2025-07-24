import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  username: string
  avatar: string
  isVip: boolean
  tier: 'basic' | 'premium' | 'vip' | 'admin'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('cabana_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (err) {
        localStorage.removeItem('cabana_user')
      }
    }
    setIsLoading(false)
  }, [])

  const generateAvatar = (username: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&backgroundColor=9333ea,7c3aed,8b5cf6`
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock authentication - in real app, this would be an API call
      if (password.length < 6) {
        throw new Error('Invalid credentials')
      }
      
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        username: email.split('@')[0],
        avatar: generateAvatar(email.split('@')[0]),
        isVip: email.includes('vip') || email.includes('admin'),
        tier: email.includes('admin') ? 'admin' : email.includes('vip') ? 'vip' : 'premium'
      }
      
      setUser(mockUser)
      localStorage.setItem('cabana_user', JSON.stringify(mockUser))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, username: string, password: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }
      
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        username,
        avatar: generateAvatar(username),
        isVip: false,
        tier: 'basic'
      }
      
      setUser(mockUser)
      localStorage.setItem('cabana_user', JSON.stringify(mockUser))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('cabana_user')
    setError(null)
  }

  const clearError = () => {
    setError(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}