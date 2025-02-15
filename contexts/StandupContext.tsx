"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { useAuth } from "./AuthContext"

interface StandupEntry {
  id: string
  text: string
  date: string
}

interface StandupContextType {
  entries: StandupEntry[]
  addEntry: (text: string) => void
  updateEntry: (id: string, text: string) => void
  deleteEntry: (id: string) => void
}

const StandupContext = createContext<StandupContextType | undefined>(undefined)

export function StandupProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<StandupEntry[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // Load from Firebase
      const q = query(collection(db, `users/${user.uid}/standups`))
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const firebaseEntries = snapshot.docs.map(doc => ({
          id: doc.id,
          text: doc.data().text,
          date: doc.data().date
        }))
        setEntries(firebaseEntries)
      })
      return () => unsubscribe()
    } else {
      // Load from localStorage
      const savedEntries = localStorage.getItem("standupEntries")
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries))
      }
    }
  }, [user])

  const addEntry = async (text: string) => {
    const newEntry = {
      text,
      date: new Date().toISOString(),
    }

    if (user) {
      // Save to Firebase
      await addDoc(collection(db, `users/${user.uid}/standups`), newEntry)
    } else {
      // Save to localStorage
      const entry = { ...newEntry, id: Date.now().toString() }
      const updatedEntries = [...entries, entry]
      setEntries(updatedEntries)
      localStorage.setItem("standupEntries", JSON.stringify(updatedEntries))
    }
  }

  const updateEntry = async (id: string, text: string) => {
    if (user) {
      // Update in Firebase
      await updateDoc(doc(db, `users/${user.uid}/standups/${id}`), { text })
    } else {
      // Update in localStorage
      const updatedEntries = entries.map(entry =>
        entry.id === id ? { ...entry, text } : entry
      )
      setEntries(updatedEntries)
      localStorage.setItem("standupEntries", JSON.stringify(updatedEntries))
    }
  }

  const deleteEntry = async (id: string) => {
    if (user) {
      // Delete from Firebase
      await deleteDoc(doc(db, `users/${user.uid}/standups/${id}`))
    } else {
      // Delete from localStorage
      const updatedEntries = entries.filter(entry => entry.id !== id)
      setEntries(updatedEntries)
      localStorage.setItem("standupEntries", JSON.stringify(updatedEntries))
    }
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

