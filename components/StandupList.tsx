"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useStandup } from "@/contexts/StandupContext"
import { Edit2, Trash2, Save, X, Clock } from "lucide-react"
import { format, parseISO } from "date-fns"
import { TimeDisplay } from "./TimeDisplay"
import { SearchBar } from "./SearchBar"

export default function StandupList() {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const { entries, updateEntry, deleteEntry } = useStandup()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Filter entries based on search query
  const filteredEntries = entries.filter(entry =>
    entry.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group filtered entries by date
  const groupedEntries = filteredEntries.reduce((groups, entry) => {
    const date = format(parseISO(entry.date), 'yyyy-MM-dd')
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(entry)
    return groups
  }, {} as Record<string, typeof entries>)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleEdit = (id: string, text: string) => {
    setEditingId(id)
    setEditText(text)
  }

  const handleSave = (id: string) => {
    updateEntry(id, editText)
    setEditingId(null)
    toast({
      title: "Entry updated",
      description: "Your progress update has been revised successfully.",
    })
  }

  const handleDelete = (id: string) => {
    deleteEntry(id)
    toast({
      title: "Entry deleted",
      description: "Your progress update has been removed.",
    })
  }

  if (!mounted) {
    return null // or a loading skeleton
  }

  return (
    <div className="space-y-6">
      <SearchBar onSearch={handleSearch} />
      {Object.keys(groupedEntries).length === 0 ? (
        <Card className="p-4">
          <p className="text-center text-muted-foreground">
            {searchQuery ? "No entries found matching your search." : "No entries yet."}
          </p>
        </Card>
      ) : (
        Object.entries(groupedEntries)
          .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
          .map(([date, dayEntries]) => (
            <div key={date} className="space-y-3">
              <h2 className="text-xl font-semibold sticky top-0 py-3 z-10">
                {format(parseISO(date), 'EEEE d MMMM yyyy')}
              </h2>
              <div className="space-y-3">
                {dayEntries.map((entry) => (
                  <Card key={entry.id} className="group overflow-hidden transition-all hover:shadow-md bg-white/50 backdrop-blur-sm border-0">
                    <div className="p-6">
                      {editingId === entry.id ? (
                        <div className="space-y-4">
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="min-h-[100px] resize-none p-4"
                          />
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleSave(entry.id)}
                              className="gap-2"
                            >
                              <Save className="h-4 w-4" />
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setEditingId(null)}
                              className="gap-2"
                            >
                              <X className="h-4 w-4" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <TimeDisplay date={entry.date} />
                            <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(entry.id, entry.text)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(entry.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm leading-relaxed">
                            {entry.text.split('\n').map((line, i) => (
                              <p key={i} className="mt-1 first:mt-0">
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))
      )}
    </div>
  )
}

