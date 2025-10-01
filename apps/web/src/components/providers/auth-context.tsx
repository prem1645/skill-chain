'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

type UserRole = 'learner' | 'issuer'

interface AuthState {
  isLoggedIn: boolean
  role: UserRole | null
  learnerId: string | null
}

interface AuthContextValue extends AuthState {
  loginLearner: (learnerId: string) => void
  loginIssuer: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoggedIn: false,
    role: null,
    learnerId: null,
  })

  const loginLearner = useCallback((learnerId: string) => {
    setState({ isLoggedIn: true, role: 'learner', learnerId })
  }, [])

  const loginIssuer = useCallback(() => {
    setState({ isLoggedIn: true, role: 'issuer', learnerId: null })
  }, [])

  const logout = useCallback(() => {
    setState({ isLoggedIn: false, role: null, learnerId: null })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, loginLearner, loginIssuer, logout }),
    [state, loginLearner, loginIssuer, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
