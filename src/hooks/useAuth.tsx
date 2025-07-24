import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  username: string
  email: string
  displayName: string
  avatar?: string
  isCreator: boolean
  isAdmin: boolean
  isVerified: boolean
  followerCount: number
  followingCount: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

interface RegisterData {
  username: string
  email: string
  password: string
  displayName: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = async () => {
      try {
        // In a real app, you'd check for a stored token and validate it
        const stored = localStorage.getItem('fansworld_user')
        if (stored) {
          setUser(JSON.parse(stored))
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        username: email.split('@')[0],
        email,
        displayName: email.split('@')[0],
        isCreator: true,
        isAdmin: email.includes('admin'),
        isVerified: true,
        followerCount: 1234,
        followingCount: 567
      }
      
      setUser(mockUser)
      localStorage.setItem('fansworld_user', JSON.stringify(mockUser))
    } catch (error) {
      throw new Error('Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newUser: User = {
        id: Date.now().toString(),
        username: data.username,
        email: data.email,
        displayName: data.displayName,
        isCreator: false,
        isAdmin: false,
        isVerified: false,
        followerCount: 0,
        followingCount: 0
      }
      
      setUser(newUser)
      localStorage.setItem('fansworld_user', JSON.stringify(newUser))
    } catch (error) {
      throw new Error('Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('fansworld_user')
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return
    
    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem('fansworld_user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}