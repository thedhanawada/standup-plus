"use client"

import { Github, Code } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-12 border-t bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center space-y-6">
          <p className="text-center text-sm text-muted-foreground">
            <Code className="inline h-5 w-5 text-purple-600" /> StandUp+ is an open source project
          </p>
          <a
            href="https://github.com/thedhanawada/standup-plus"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-purple-600 hover:bg-purple-700 px-4 py-2 text-sm font-medium text-white transition-all shadow-lg"
          >
            <Github className="h-5 w-5" />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  )
} 