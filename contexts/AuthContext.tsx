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
  isGuest: boolean
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  logout: () => Promise<void>
  startGuestMode: () => void
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
  const [isGuest, setIsGuest] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    console.log('AuthContext: Initializing auth listener, auth object:', !!auth)
    
    // Check for guest mode in localStorage
    const guestMode = localStorage.getItem('guestMode')
    if (guestMode === 'true') {
      setIsGuest(true)
      setLoading(false)
      return
    }
    
    // Listen for auth state changes (client-side only)
    if (!auth) {
      console.log('AuthContext: No auth object, setting loading to false')
      setLoading(false)
      return
    }
    
    console.log('AuthContext: Setting up auth state listener')
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      console.log('AuthContext: Auth state changed, user:', !!user)
      setUser(user)
      if (user) {
        setIsGuest(false)
        localStorage.removeItem('guestMode')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) return
    
    try {
      setIsAuthenticating(true)
      const result = await signInWithPopup(auth, googleProvider)
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
    if (!auth || !githubProvider) return
    
    try {
      setIsAuthenticating(true)
      const result = await signInWithPopup(auth, githubProvider)
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
    if (isGuest) {
      setIsGuest(false)
      localStorage.removeItem('guestMode')
      toast({
        title: "Exited guest mode",
        description: "Your local data has been preserved.",
      })
      return
    }
    
    if (!auth) return
    
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

  const startGuestMode = () => {
    setIsGuest(true)
    localStorage.setItem('guestMode', 'true')
    toast({
      title: "Guest mode activated",
      description: "You can now try all features. Data will be saved locally.",
    })
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticating,
      isGuest,
      signInWithGoogle,
      signInWithGithub,
      logout,
      startGuestMode
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
