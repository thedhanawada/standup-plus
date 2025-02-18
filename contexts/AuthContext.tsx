"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User, signInWithPopup, signOut } from "firebase/auth"
import { auth, googleProvider, githubProvider } from "@/lib/firebase"
import { useToast } from "@/components/ui/use-toast"
import { Github } from "lucide-react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

type AuthContextType = {
  user: User | null
  loading: boolean
  isAuthenticating: boolean
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed:", user?.uid, user?.email)
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      setIsAuthenticating(true)
      const result = await signInWithPopup(auth, googleProvider)
      console.log("Google sign in success:", result.user.uid)
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
    } finally {
      setIsAuthenticating(false)
    }
  }

  const signInWithGithub = async () => {
    try {
      setIsAuthenticating(true)
      const result = await signInWithPopup(auth, githubProvider)
      console.log("GitHub sign in success:", result.user.uid)
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
    } finally {
      setIsAuthenticating(false)
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
      isAuthenticating,
      signInWithGoogle,
      signInWithGithub,
      logout
    }}>
      {loading ? (
        <div className="h-screen w-screen flex items-center justify-center">
          <LoadingSpinner className="h-8 w-8 text-purple-600" />
        </div>
      ) : (
        <div>
          {children}
        </div>
      )}
    </AuthContext.Provider>
  )
}
