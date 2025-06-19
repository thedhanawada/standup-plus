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
        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Play className="h-5 w-5" />
        Try as Guest - Start Now
      </Button>
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wide">
          <span className="bg-white px-4 text-gray-500 font-medium">Or sign in to sync</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <Button
          onClick={signInWithGithub}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
          variant="outline"
        >
          <Github className="h-5 w-5" />
          <span className="font-medium">Continue with GitHub</span>
        </Button>
        
        <Button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
          variant="outline"
        >
          <Mail className="h-5 w-5" />
          <span className="font-medium">Continue with Google</span>
        </Button>
      </div>
    </div>
  )
} 