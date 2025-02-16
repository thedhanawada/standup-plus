"use client"

import { cn } from "@/lib/utils"

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-2 border-purple-200 border-opacity-50"></div>
        <div className="absolute left-0 top-0 h-12 w-12 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
      </div>
    </div>
  )
} 