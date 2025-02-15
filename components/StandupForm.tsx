"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useStandup } from "@/contexts/StandupContext"
import { PlusCircle, Loader2 } from "lucide-react"

export default function StandupForm() {
  const [entry, setEntry] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { addEntry } = useStandup()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!entry.trim()) return

    console.log("Submitting new entry:", entry)

    setIsLoading(true)
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    addEntry(entry)
    setEntry("")
    setIsLoading(false)
    toast({
      title: "Entry saved",
      description: "Your progress update has been saved successfully.",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card text-card-foreground p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-foreground mb-4">Log Your Progress</h2>
      <Textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="What did you accomplish today? What's your plan for tomorrow?"
        className="min-h-[150px]"
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
        Save Update
      </Button>
    </form>
  )
}

