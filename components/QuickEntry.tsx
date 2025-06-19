"use client"

import { useState, useEffect, useRef } from "react"
import { useStandup } from "@/contexts/StandupContext"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Send, Plus, X, Command } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"

export default function QuickEntry() {
  const [entry, setEntry] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [projects, setProjects] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showShortcutHint, setShowShortcutHint] = useState(true)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { addEntry } = useStandup()
  const { user } = useAuth()
  const { toast } = useToast()

  // Global keyboard shortcut handler
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Focus on '/' key (like Google search)
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        textareaRef.current?.focus()
        setIsExpanded(true)
        setShowShortcutHint(false)
      }
      
      // Escape to blur/collapse
      if (e.key === 'Escape') {
        textareaRef.current?.blur()
        if (!entry.trim()) {
          setIsExpanded(false)
        }
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [entry])

  // Auto-focus on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      textareaRef.current?.focus()
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (!entry.trim()) return

    setIsLoading(true)
    try {
      await addEntry(entry.trim(), tags, projects)
      
      // Success feedback
      setEntry("")
      setTags([])
      setProjects([])
      setIsExpanded(false)
      
      toast({
        title: "Entry logged! 🎉",
        description: "Keep the momentum going!",
      })
      
      // Re-focus for next entry
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
      
    } catch (error) {
      toast({
        title: "Failed to save",
        description: "Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter (but allow Shift+Enter for new lines)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
    
    // Quick tag/project creation with # and @
    if (e.key === ' ' && entry.includes('#')) {
      const words = entry.split(' ')
      const lastWord = words[words.length - 1]
      if (lastWord.startsWith('#') && lastWord.length > 1) {
        const tag = lastWord.slice(1)
        addTag(tag)
        setEntry(entry.replace(lastWord, '').trim())
      }
    }
    
    if (e.key === ' ' && entry.includes('@')) {
      const words = entry.split(' ')
      const lastWord = words[words.length - 1]
      if (lastWord.startsWith('@') && lastWord.length > 1) {
        const project = lastWord.slice(1)
        addProject(project)
        setEntry(entry.replace(lastWord, '').trim())
      }
    }
  }

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const addProject = (project: string) => {
    if (project && !projects.includes(project)) {
      setProjects([...projects, project])
    }
  }

  const removeProject = (projectToRemove: string) => {
    setProjects(projects.filter(project => project !== projectToRemove))
  }

  const today = format(new Date(), "EEEE, MMMM d")

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Hero Entry Section */}
      <motion.div 
        className="relative"
        layout
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Main Entry Card */}
        <motion.div
          className={`relative bg-white border rounded-2xl shadow-sm transition-all duration-300 ${
            isExpanded ? 'shadow-lg border-purple-200' : 'shadow-sm hover:shadow-md border-gray-200'
          }`}
          layout
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-lg font-medium text-gray-900">{today}</span>
            </div>
            
            {showShortcutHint && !isExpanded && (
              <motion.div 
                className="flex items-center space-x-2 text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Command className="w-4 h-4" />
                <span>Press</span>
                <kbd className="px-2 py-1 text-xs bg-gray-100 rounded border">/</kbd>
                <span>to focus</span>
              </motion.div>
            )}
          </div>

          {/* Entry Textarea */}
          <div className="px-6">
            <Textarea
              ref={textareaRef}
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsExpanded(true)}
              placeholder="What did you work on today? Use #tags and @projects"
              className={`w-full border-0 resize-none text-lg placeholder:text-gray-400 focus:ring-0 transition-all duration-300 ${
                isExpanded ? 'min-h-[120px]' : 'min-h-[60px]'
              }`}
              style={{ background: 'transparent' }}
            />
          </div>

          {/* Tags and Projects (when expanded) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-6 space-y-4"
              >
                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        #{tag}
                        <button onClick={() => removeTag(tag)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {projects.map((project) => (
                      <Badge key={project} variant="outline" className="gap-1">
                        {project}
                        <button onClick={() => removeProject(project)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Bar */}
          <div className="flex items-center justify-between p-6 pt-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {!isExpanded && entry.trim() && (
                <span>Press Enter to log</span>
              )}
              {isExpanded && (
                <span>⌘+Enter to submit, Escape to minimize</span>
              )}
            </div>
            
            <Button
              onClick={handleSubmit}
              disabled={!entry.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
              size="sm"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Log Entry
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Subtle streak indicator */}
        {user && (
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-500">Ready to log your progress</span>
          </div>
        )}
      </motion.div>
    </div>
  )
}