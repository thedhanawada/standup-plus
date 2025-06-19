"use client"

import { Button } from "@/components/ui/button"
import { Github, Mail, Play } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginForm() {
  const { signInWithGithub, signInWithGoogle, startGuestMode } = useAuth()

  return (
    <div className="flex flex-col space-y-4">
      <Button
        onClick={startGuestMode}
        className="w-full flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
      >
        <Play className="h-5 w-5" />
        Try as Guest
      </Button>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or sign in to sync</span>
        </div>
      </div>
      
      <Button
        onClick={signInWithGithub}
        className="w-full flex items-center gap-2"
        variant="outline"
      >
        <Github className="h-5 w-5" />
        Continue with GitHub
      </Button>
      
      <Button
        onClick={signInWithGoogle}
        className="w-full flex items-center gap-2"
        variant="outline"
      >
        <Mail className="h-5 w-5" />
        Continue with Google
      </Button>
    </div>
  )
} 