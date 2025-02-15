"use client"

import { useState, useEffect } from "react"
import { Calendar } from "lucide-react"
import { format } from "date-fns"

export function CurrentDate() {
  const [mounted, setMounted] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) return null

  return (
    <span className="flex items-center gap-1">
      <Calendar className="h-4 w-4" />
      {format(currentDate, "EEEE, MMMM d, yyyy")}
    </span>
  )
} 