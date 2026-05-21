import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const token = localStorage.getItem('session_token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await api.get('/auth/session', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.user) {
        setUser(response.data.user)
        setSessionId(response.data.sessionId)
      } else {
        localStorage.removeItem('session_token')
      }
    } catch (error) {
      console.error('Session check failed:', error)
      localStorage.removeItem('session_token')
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || ''}/api/auth/google`
  }

  const loginWithDiscord = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || ''}/api/auth/discord`
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem('session_token')
      if (token) {
        await api.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('session_token')
      setUser(null)
      setSessionId(null)
      navigate('/')
    }
  }

  const handleAuthCallback = async (token) => {
    localStorage.setItem('session_token', token)
    await checkSession()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        sessionId,
        loginWithGoogle,
        loginWithDiscord,
        logout,
        handleAuthCallback,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
