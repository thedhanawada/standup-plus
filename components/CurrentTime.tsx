"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { format } from "date-fns"

export function CurrentTime() {
  const [mounted, setMounted] = useState(false)
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) return null

  return (
    <span className="flex items-center gap-1">
      <Clock className="h-4 w-4" />
      {format(currentDateTime, "h:mm a")}
    </span>
  )
} 