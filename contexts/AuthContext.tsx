"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User, signInWithPopup, signOut } from "firebase/auth"
import { auth, googleProvider, githubProvider } from "@/lib/firebase"
import { useToast } from "@/components/ui/use-toast"

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      toast({
        title: "Welcome!",
        description: "Successfully signed in with Google.",
      })
    } catch (error) {
      console.error('Google sign in error:', error)
      toast({
        title: "Sign in failed",
        description: "Could not sign in with Google. Please try again."
      })
    }
  }

  const signInWithGithub = async () => {
    try {
      await signInWithPopup(auth, githubProvider)
      // Clean URL parameters after successful login
      if (window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname)
      }
      toast({
        title: "Welcome!",
        description: "Successfully signed in with GitHub.",
      })
    } catch (error) {
      console.error('GitHub sign in error:', error)
      toast({
        title: "Sign in failed",
        description: "Could not sign in with GitHub. Please try again."
      })
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      toast({
        title: "Signed out",
        description: "Successfully signed out. Your data is still available locally.",
      })
    } catch (error) {
      console.error('Sign out error:', error)
      toast({
        title: "Sign out failed",
        description: "Could not sign out. Please try again."
      })
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signInWithGoogle,
      signInWithGithub,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}