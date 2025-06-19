"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore"
import { useAuth } from "./AuthContext"

interface StandupEntry {
  id: string
  text: string
  date: string
  tags?: string[]
  projects?: string[]
}

interface StandupContextType {
  entries: StandupEntry[]
  addEntry: (text: string, tags?: string[], projects?: string[]) => void
  updateEntry: (id: string, text: string, tags?: string[], projects?: string[]) => void
  deleteEntry: (id: string) => void
}

const StandupContext = createContext<StandupContextType | undefined>(undefined)

export function StandupProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<StandupEntry[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user && db) {
      // Load from Firebase
      const q = query(collection(db, `users/${user.uid}/standups`))
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const firebaseEntries = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            text: data.text,
            date: data.date,
            tags: Array.isArray(data.tags) ? data.tags : [],
            projects: Array.isArray(data.projects) ? data.projects : []
          };
        });
        setEntries(firebaseEntries);
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

  const addEntry = async (text: string, tags?: string[], projects?: string[]) => {
    const newEntry = {
      text,
      date: new Date().toISOString(),
      tags: tags || [],
      projects: projects || []
    }

    if (user && db) {
      // Save to Firebase
      try {
        const entryToSave = {
          text: newEntry.text,
          date: newEntry.date,
          tags: Array.isArray(newEntry.tags) ? newEntry.tags : [],
          projects: Array.isArray(newEntry.projects) ? newEntry.projects : []
        }
        const docRef = await addDoc(collection(db, `users/${user.uid}/standups`), entryToSave);
      } catch (error) {
        console.error("Error adding entry:", error)
      }
    } else {
      // Save to localStorage
      const entry = { ...newEntry, id: Date.now().toString() }
      const updatedEntries = [...entries, entry]
      setEntries(updatedEntries)
      localStorage.setItem("standupEntries", JSON.stringify(updatedEntries))
    }
  }

  const updateEntry = async (id: string, text: string, tags?: string[], projects?: string[]) => {
    if (user && db) {
      // Update in Firebase
      try {
        const updateData = {
          text,
          date: new Date().toISOString(),
          tags: tags || [],
          projects: projects || []
        }
        await updateDoc(doc(db, `users/${user.uid}/standups/${id}`), updateData)
      } catch (error) {
        console.error("Error updating entry:", error)
      }
    } else {
      // Update in localStorage
      const updatedEntries = entries.map(entry =>
        entry.id === id ? { ...entry, text, tags, projects } : entry
      )
      setEntries(updatedEntries)
      localStorage.setItem("standupEntries", JSON.stringify(updatedEntries))
    }
  }

  const deleteEntry = async (id: string) => {
    if (user && db) {
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
