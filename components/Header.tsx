"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { InfoIcon, Github, LogOut, Sparkles } from "lucide-react"

export default function Header() {
  const { user, signInWithGithub, logout } = useAuth()

  return (
    <header className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-purple-500" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            StandUp+
          </span>
        </div>
        {user ? (
          <Button 
            variant="outline" 
            onClick={logout}
            className="flex items-center gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        ) : (
          <Button 
            onClick={signInWithGithub}
            className="flex items-center gap-2 bg-black hover:bg-black/90 text-white transition-colors"
          >
            <Github className="h-5 w-5" />
            Continue with GitHub
          </Button>
        )}
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold">
          Track Your Daily Progress with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Ease
          </span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Streamline your daily updates, track your progress, and stay in sync with your goals.
        </p>
        {!user && (
          <div className="inline-flex items-center bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg">
            <InfoIcon className="mr-2 h-5 w-5 flex-shrink-0" />
            <span className="text-sm">
              Your data is stored locally by default. Sign in to enable cloud sync and access your updates from anywhere.
            </span>
          </div>
        )}
      </div>
    </header>
  )
} 