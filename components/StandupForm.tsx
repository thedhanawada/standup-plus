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
    if (!entry.trim()) {
      toast({
        title: "Entry required",
        description: "Please enter your progress update before saving.",
      })
      return
    }

    console.log('Form submission - Current state:', {
      entry,
      tags,
      projects
    })

    setIsLoading(true)
    console.log('Calling addEntry with:', {
      entry,
      tags,
      projects
    })
    await addEntry(entry, tags, projects)
    setEntry("")
    setTags([])
    setProjects([])
    setIsLoading(false)
    setIsOpen(false)
    toast({
      title: "Entry saved",
      description: "Your progress update has been saved successfully.",
    })
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg z-50 px-6 py-6 transform hover:scale-105 transition-all duration-200"
      >
        <PlusCircle className="h-6 w-6 mr-2" />
        <span className="font-semibold">
          {user ? `Log Progress, ${user.displayName?.split(' ')[0]}` : 'Log Progress'}
        </span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-[10%] left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-white rounded-xl shadow-2xl z-50 p-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Log Your Progress</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <CurrentTime />
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <Textarea
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  placeholder="What did you accomplish today?"
                  className="min-h-[200px] mb-4"
                  autoFocus
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
                    variant="outline" 
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default form submission
                      setIsOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Entry"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
