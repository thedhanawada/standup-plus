"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useStandup } from "@/contexts/StandupContext"
import { Edit2, Trash2, Save, X } from "lucide-react"

export default function StandupList() {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState("")
  const { toast } = useToast()
  const { entries, updateEntry, deleteEntry } = useStandup()

  const handleEdit = (id: number, text: string) => {
    setEditingId(id)
    setEditText(text)
  }

  const handleSave = (id: number) => {
    updateEntry(id, editText)
    setEditingId(null)
    toast({
      title: "Entry updated",
      description: "Your progress update has been revised successfully.",
    })
  }

  const handleDelete = (id: number) => {
    deleteEntry(id)
    toast({
      title: "Entry deleted",
      description: "Your progress update has been removed.",
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">Recent Updates</h2>
      {entries.length === 0 ? (
        <Card className="bg-card text-card-foreground">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">No updates yet. Start tracking your progress!</p>
          </CardContent>
        </Card>
      ) : (
        entries.map((entry) => (
          <Card key={entry.id} className="bg-card text-card-foreground">
            <CardHeader className="bg-muted">
              <CardTitle className="text-lg font-semibold">
                {new Date(entry.date).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {editingId === entry.id ? (
                <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="min-h-[100px]" />
              ) : (
                <p className="text-foreground whitespace-pre-wrap">{entry.text}</p>
              )}
            </CardContent>
            <CardFooter className="justify-end space-x-2 bg-muted">
              {editingId === entry.id ? (
                <>
                  <Button onClick={() => handleSave(entry.id)} size="icon" variant="outline">
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => setEditingId(null)} size="icon" variant="outline">
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button onClick={() => handleEdit(entry.id, entry.text)} size="icon" variant="outline">
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              <Button onClick={() => handleDelete(entry.id)} size="icon" variant="destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}

