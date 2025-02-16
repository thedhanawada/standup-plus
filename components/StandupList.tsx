"use client"

import { useState, useEffect } from "react"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useStandup } from "@/contexts/StandupContext"
import { Edit2, Trash2, Save, X, Clock, Tag, Briefcase, Filter, Search, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { TimeDisplay } from "./TimeDisplay"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { motion, AnimatePresence } from "framer-motion"
import { StandupEntry } from "../types"

function StandupListContent() {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState<string>('')
  const [editTags, setEditTags] = useState<string[]>([])
  const [editProjects, setEditProjects] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [newProject, setNewProject] = useState("")
  const { toast } = useToast()
  const { entries, updateEntry, deleteEntry } = useStandup()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Debug effect to monitor editingId changes
  useEffect(() => {
    console.log('editingId changed:', editingId);
    
    // Reset form state when closing the edit form
    if (!editingId) {
      setEditText("")
      setEditTags([])
      setEditProjects([])
      setNewTag("")
      setNewProject("")
    }
  }, [editingId])

  // Get unique tags and projects
  const allTags = Array.from(new Set(entries.flatMap(entry => entry.tags || [])))
  const allProjects = Array.from(new Set(entries.flatMap(entry => entry.projects || [])))

  // Filter entries based on search query and selected tags/projects
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      entry.projects?.some(project => project.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => entry.tags?.includes(tag))

    const matchesProjects = selectedProjects.length === 0 || 
      selectedProjects.every(project => entry.projects?.includes(project))

    return matchesSearch && matchesTags && matchesProjects
  })

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

  const handleEdit = (entry: StandupEntry) => {
    setEditingId(entry.id);
    setEditText(entry.text);
    setEditTags(entry.tags || []);
    setEditProjects(entry.projects || []);
  }

  const handleSave = async (id: string) => {
    if (isSaving) return;
    
    // Validate form values
    if (!editText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text for your update.",
      });
      return;
    }

    // Verify the entry still exists
    const entry = entries.find(e => e.id === id);
    if (!entry) {
      toast({
        title: "Error",
        description: "Could not find the entry to update. Please refresh the page and try again.",
      });
      return;
    }
    
    console.log('Save clicked:', { id, editText, editTags, editProjects });
    setIsSaving(true);
    
    try {
      await updateEntry(id, editText.trim(), editTags, editProjects)
      setEditingId(null)
      toast({
        title: "Entry updated",
        description: "Your progress update has been revised successfully.",
      })
    } catch (error) {
      console.error('Error saving entry:', error)
      toast({
        title: "Error updating entry",
        description: "There was a problem saving your changes. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    // Don't show delete confirmation while editing
    if (editingId) {
      toast({
        title: "Error",
        description: "Please finish editing before deleting an entry.",
      });
      return;
    }
    // Show confirmation first
    setShowDeleteConfirm(id)
  }

  const confirmDelete = async (id: string) => {
    // Double check we're not in edit mode
    if (editingId) {
      setShowDeleteConfirm(null);
      return;
    }
    try {
      await deleteEntry(id)
      setShowDeleteConfirm(null)
      toast({
        title: "Entry deleted",
        description: "Your progress update has been removed.",
      })
    } catch (error) {
      console.error('Error deleting entry:', error)
      toast({
        title: "Error",
        description: "Could not delete the entry. Please try again.",
      })
    }
  }

  if (!mounted) {
    return null // or a loading skeleton
  }

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-100 pb-4">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search entries, tags, or projects..."
              className="pl-10 bg-gray-50/50 border-gray-200"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Tag className="h-4 w-4" />
                  Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-3">
                <div className="space-y-2">
                  {allTags.map(tag => (
                    <label key={tag} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedTags.includes(tag)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTags([...selectedTags, tag])
                          } else {
                            setSelectedTags(selectedTags.filter(t => t !== tag))
                          }
                        }}
                      />
                      <span className="text-sm">{tag}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-colors">
                  <Briefcase className="h-4 w-4" />
                  Projects {selectedProjects.length > 0 && `(${selectedProjects.length})`}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  {allProjects.map(project => (
                    <div key={project} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedProjects.includes(project)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProjects([...selectedProjects, project])
                          } else {
                            setSelectedProjects(selectedProjects.filter(p => p !== project))
                          }
                        }}
                      />
                      <span>{project}</span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Entries List */}
      {Object.keys(groupedEntries).length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {searchQuery ? "No matching entries found" : "No entries yet"}
          </h3>
          <p className="text-gray-500 text-sm">
            {searchQuery 
              ? "Try adjusting your search or filters"
              : "Start logging your progress to see entries here"}
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedEntries)
            .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
            .map(([date, dayEntries]) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h2 className="sticky top-24 z-10 bg-white/95 backdrop-blur-md py-2 px-4 rounded-lg shadow-sm border border-gray-100/50 font-medium text-gray-900">
                  {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                </h2>
                
                <div className="space-y-4 pl-4 border-l-2 border-gray-100">
                  {dayEntries.map((entry) => (
                    <AnimatePresence mode="wait" key={entry.id}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="relative"
                      >
                        {/* Entry dot on timeline */}
                        <div className="absolute -left-[37px] top-3 w-4 h-4 rounded-full bg-purple-100 border-4 border-white" />
                        
                        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md bg-white/50 backdrop-blur-sm">
                          <div className="p-6">
                            {editingId === entry.id ? (
                              <div className="space-y-4">
                                <Textarea
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="min-h-[100px] resize-none p-4 bg-white/50"
                                />
                                <Input
                                  type="text"
                                  value={editTags.join(', ')}
                                  onChange={(e) => setEditTags(e.target.value.split(',').map(tag => tag.trim()))}
                                  placeholder="Add tags (comma separated)"
                                />
                                <Input
                                  type="text"
                                  value={editProjects.join(', ')}
                                  onChange={(e) => setEditProjects(e.target.value.split(',').map(project => project.trim()))}
                                  placeholder="Add projects (comma separated)"
                                />
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setEditingId(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => handleSave(entry.id)}
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <TimeDisplay date={entry.date} />
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEdit(entry)}
                                      className="h-8 w-8 p-0 hover:bg-white/60"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                    {showDeleteConfirm === entry.id ? (
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => confirmDelete(entry.id)}
                                          className="h-8 px-2 text-xs"
                                        >
                                          Confirm
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => setShowDeleteConfirm(null)}
                                          className="h-8 px-2 text-xs"
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(entry.id)}
                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div className="text-sm leading-relaxed">
                                    {entry.text.split('\n').map((line, i) => (
                                      <p key={i} className="mt-1.5 first:mt-0">
                                        {line}
                                      </p>
                                    ))}
                                  </div>
                                  
                                  {/* Tags and Projects Section */}
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {entry.tags && entry.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {entry.tags.map((tag) => (
                                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                            <Tag className="h-3 w-3" />
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                    
                                    {entry.projects && entry.projects.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {entry.projects.map((project) => (
                                          <Badge key={project} variant="outline" className="flex items-center gap-1">
                                            <Briefcase className="h-3 w-3" />
                                            {project}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    </AnimatePresence>
                  ))}
                </div>
              </motion.div>
            ))}
        </div>
      )}
    </div>
  )
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('StandupList Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-500">
          Something went wrong in the StandupList component.
        </div>
      )
    }

    return this.props.children
  }
}

export default function StandupList() {
  return (
    <ErrorBoundary>
      <StandupListContent />
    </ErrorBoundary>
  )
}
