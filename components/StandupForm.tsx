"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useStandup } from "@/contexts/StandupContext"
import { PlusCircle, Loader2, Calendar, Clock, Sparkles, Tag, Briefcase, X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { CurrentTime } from "./CurrentTime"
import { useAuth } from "@/contexts/AuthContext"

export default function StandupForm({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [entry, setEntry] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [projects, setProjects] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [currentProject, setCurrentProject] = useState("")
  const { toast } = useToast()
  const { addEntry } = useStandup()
  const { user } = useAuth()

  const addTag = () => {
    const trimmedTag = currentTag.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag]
      console.log('Adding tag:', trimmedTag)
      console.log('Current tags:', tags)
      setTags(newTags)
      setCurrentTag("")
      console.log('Updated tags:', newTags)
    }
  }

  const addProject = () => {
    const trimmedProject = currentProject.trim()
    if (trimmedProject && !projects.includes(trimmedProject)) {
      const newProjects = [...projects, trimmedProject]
      console.log('Adding project:', trimmedProject)
      console.log('Current projects:', projects)
      setProjects(newProjects)
      setCurrentProject("")
      console.log('Updated projects:', newProjects)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!entry.trim()) return

    setIsLoading(true)
    try {
      await addEntry(entry, tags, projects)
      toast({
        title: "Success! 🎉",
        description: `Your standup entry has been logged.`,
      })
      // Reset form
      setEntry("")
      setTags([])
      setProjects([])
      setIsOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log standup. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form
    setEntry("")
    setTags([])
    setProjects([])
    setCurrentTag("")
    setCurrentProject("")
    setIsOpen(false)
  }

  return (
    <div className={cn("relative", isSidebarOpen ? "ml-64" : "ml-20")}>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-xl border p-4 z-50"
          >
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Textarea
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  placeholder="What did you work on?"
                  className="w-full"
                />
                
                <div className="space-y-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">Tags (optional)</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => setTags(tags.filter(t => t !== tag))}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        placeholder="Add a tag"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addTag()
                          }
                        }}
                      />
                      <Button 
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={addTag}
                        disabled={!currentTag.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">Projects (optional)</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {projects.map((project) => (
                        <Badge key={project} variant="secondary" className="gap-1">
                          {project}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => setProjects(projects.filter(p => p !== project))}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={currentProject}
                        onChange={(e) => setCurrentProject(e.target.value)}
                        placeholder="Add a project"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addProject()
                          }
                        }}
                      />
                      <Button 
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={addProject}
                        disabled={!currentProject.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
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
                        Log Entry
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 bg-purple-600 text-white rounded-full p-4 shadow-lg hover:bg-purple-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
