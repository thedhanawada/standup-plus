"use client"

import { Github, Code } from "lucide-react"

export default function Footer() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"; // Default version if not set

  return (
    <footer className="w-full py-8 mt-12 border-t bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center space-y-6">
          <p className="text-center text-sm text-muted-foreground">
            <Code className="inline h-5 w-5 text-purple-600" /> StandUp+ is an open-source tool
          </p>
          <p className="text-center text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
            Progress, open-source, forever free. Accessible to everyone, always.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Version: {version}
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Project: <strong>standup-plus</strong>
          </p>
          <a
            href="https://github.com/thedhanawada/standup-plus"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-2 text-sm font-medium text-white transition-all shadow-lg transform hover:scale-105 duration-200"
          >
            <Github className="h-5 w-5" />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  )
} 