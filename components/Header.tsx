"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { InfoIcon, Github, LogOut } from "lucide-react"

export default function Header() {
  const { user, signInWithGithub, logout } = useAuth()

  return (
    <header className="mb-12 text-center">
      <div className="flex justify-end mb-4">
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
            variant="outline" 
            onClick={signInWithGithub}
            className="flex items-center gap-2 hover:bg-black hover:text-white transition-colors"
          >
            <Github className="h-5 w-5" />
            Continue with GitHub
          </Button>
        )}
      </div>
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
        StandUp+
      </h1>
      <p className="text-lg text-muted-foreground mb-4">
        Streamline your daily updates, track your progress, and stay in sync with your goals.
      </p>
      <div className="inline-flex items-center bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg">
        <InfoIcon className="mr-2" />
        <span>Your data is stored locally by default. Sign in to enable cloud sync and access your updates from anywhere.</span>
      </div>
    </header>
  )
} 