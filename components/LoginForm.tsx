"use client"

import { Button } from "@/components/ui/button"
import { Github, Mail } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginForm() {
  const { signInWithGithub, signInWithGoogle } = useAuth()

  return (
    <div className="flex flex-col space-y-4">
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