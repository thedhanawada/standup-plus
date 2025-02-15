"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface StandupEntry {
  id: number
  text: string
  date: string
}

interface StandupContextType {
  entries: StandupEntry[]
  addEntry: (text: string) => void
  updateEntry: (id: number, text: string) => void
  deleteEntry: (id: number) => void
}

const StandupContext = createContext<StandupContextType | undefined>(undefined)

export function StandupProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<StandupEntry[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedEntries = JSON.parse(localStorage.getItem("standupEntries") || "[]")
    setEntries(savedEntries)
  }, [])

  const addEntry = (text: string) => {
    if (!mounted) return
    const newEntry = {
      id: Date.now(),
      text: text.trim(),
      date: new Date().toISOString(),
    }
    const updatedEntries = [newEntry, ...entries]
    setEntries(updatedEntries)
    localStorage.setItem("standupEntries", JSON.stringify(updatedEntries))
  }

  const updateEntry = (id: number, text: string) => {
    if (!mounted) return
    const updatedEntries = entries.map((entry) => (entry.id === id ? { ...entry, text } : entry))
    setEntries(updatedEntries)
    localStorage.setItem("standupEntries", JSON.stringify(updatedEntries))
  }

  const deleteEntry = (id: number) => {
    if (!mounted) return
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    setEntries(updatedEntries)
    localStorage.setItem("standupEntries", JSON.stringify(updatedEntries))
  }

  if (!mounted) {
    return null
  }

  return (
    <StandupContext.Provider value={{ entries, addEntry, updateEntry, deleteEntry }}>
      {children}
    </StandupContext.Provider>
  )
}

export function useStandup() {
  const context = useContext(StandupContext)
  if (context === undefined) {
    throw new Error("useStandup must be used within a StandupProvider")
  }
  return context
}

