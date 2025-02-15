"use client"

import { useEffect, useState } from "react"
import { format, parseISO } from "date-fns"
import { Clock } from "lucide-react"

export function TimeDisplay({ date }: { date: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Return nothing during SSR
  }

  return (
    <div className="flex items-center gap-1">
      <Clock className="h-4 w-4" />
      {format(parseISO(date), 'h:mm a')}
    </div>
  )
} 