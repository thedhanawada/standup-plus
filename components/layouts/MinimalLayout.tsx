"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useStandup } from "@/contexts/StandupContext"
import { 
  LogOut,
  Github,
  Calendar,
  List,
  User,
  Settings,
  ChevronDown,
  Flame
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AuthOverlay } from "@/components/AuthOverlay"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import QuickEntry from "../QuickEntry"
import StandupList from "../StandupList"
import ContributionCalendar from "../ContributionCalendar"
import { ExportButton } from "@/components/ExportButton"
import { motion, AnimatePresence } from "framer-motion"

type ViewMode = "quick" | "calendar" | "list"

export function MinimalLayout({ children }: { children?: React.ReactNode }) {
  const { user, loading, isAuthenticating, signInWithGoogle, signInWithGithub, logout } = useAuth()
  const { entries } = useStandup()
  const [currentView, setCurrentView] = useState<ViewMode>("quick")
  const [streak, setStreak] = useState(0)

  // Debug logging
  useEffect(() => {
    console.log('MinimalLayout state:', { user: !!user, loading, isAuthenticating })
  }, [user, loading, isAuthenticating])

  // Calculate streak
  useEffect(() => {
    if (entries.length === 0) {
      setStreak(0)
      return
    }

    const today = new Date()
    const sortedEntries = entries
      .map(entry => new Date(entry.date))
      .sort((a, b) => b.getTime() - a.getTime())

    let currentStreak = 0
    let checkDate = new Date(today)
    
    for (const entryDate of sortedEntries) {
      const entryDay = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate())
      const checkDay = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate())
      
      if (entryDay.getTime() === checkDay.getTime()) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else if (entryDay.getTime() < checkDay.getTime()) {
        break
      }
    }
    
    setStreak(currentStreak)
  }, [entries])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return <AuthOverlay show={true} />
  }

  const todayEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date)
    const today = new Date()
    return entryDate.toDateString() === today.toDateString()
  }).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S+</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">StandUp+</span>
            </div>

            {/* Quick Stats & Navigation */}
            <div className="flex items-center space-x-6">
              {/* Streak */}
              {streak > 0 && (
                <div className="flex items-center space-x-2 text-sm">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-medium text-gray-700">{streak} day streak</span>
                </div>
              )}

              {/* Today's count */}
              <div className="text-sm text-gray-600">
                <span className="font-medium">{todayEntries}</span> logged today
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView("quick")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    currentView === "quick" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Quick
                </button>
                <button
                  onClick={() => setCurrentView("list")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    currentView === "list" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentView("calendar")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    currentView === "calendar" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 p-2">
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                      <AvatarFallback>
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2 text-sm">
                    <div className="font-medium">{user.displayName}</div>
                    <div className="text-gray-500 text-xs">{user.email}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <ExportButton />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {currentView === "quick" && (
            <motion.div
              key="quick"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Quick Entry */}
              <div className="text-center mb-8">
                <QuickEntry />
              </div>

              {/* Recent Entries Preview */}
              {entries.length > 0 && (
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Recent Entries</h2>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setCurrentView("list")}
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {entries.slice(0, 3).map((entry) => (
                      <div 
                        key={entry.id}
                        className="bg-white p-4 rounded-lg border border-gray-200 text-sm"
                      >
                        <div className="flex items-start justify-between">
                          <p className="text-gray-700 flex-1">{entry.text}</p>
                          <span className="text-xs text-gray-500 ml-4">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                        </div>
                        {(entry.tags?.length || entry.projects?.length) && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {entry.tags?.map((tag) => (
                              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                #{tag}
                              </span>
                            ))}
                            {entry.projects?.map((project) => (
                              <span key={project} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                {project}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {currentView === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <StandupList />
            </motion.div>
          )}

          {currentView === "calendar" && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ContributionCalendar onDateClick={(date) => {}} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}