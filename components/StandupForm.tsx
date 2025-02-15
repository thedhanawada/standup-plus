"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useStandup } from "@/contexts/StandupContext"
import { PlusCircle, Loader2, Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { CurrentTime } from "./CurrentTime"

export default function StandupForm() {
  const [entry, setEntry] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const { toast } = useToast()
  const { addEntry } = useStandup()

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!entry.trim()) {
      toast({
        title: "Entry required",
        description: "Please enter your progress update before saving.",
      })
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

    addEntry(entry)
    setEntry("")
    setIsLoading(false)
    toast({
      title: "Entry saved",
      description: "Your progress update has been saved successfully.",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Log Your Progress</CardTitle>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(currentDateTime, "EEEE, MMMM d, yyyy")}
          </span>
          <CurrentTime />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="update">Today's Update</Label>
            <Textarea
              id="update"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="What did you accomplish today? What's your plan for tomorrow? Any blockers?"
              className="min-h-[150px] resize-none p-4 text-base"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || !entry.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Save Update
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setEntry("")}
              disabled={isLoading || !entry.trim()}
            >
              Clear
            </Button>
          </div>

          {entry.trim().length > 0 && (
            <div className="text-xs text-muted-foreground text-right">
              {entry.trim().length} characters
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

