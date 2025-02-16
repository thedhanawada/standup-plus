"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { 
  PenLine, 
  Calendar, 
  ListTodo, 
  Menu, 
  X, 
  Github, 
  LogOut,
  Sparkles,
  Info,
  LayoutDashboard,
  Code,
  Tag,
  Briefcase,
  Search,
  Cloud,
  Badge
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import StandupForm from "../StandupForm"
import StandupList from "../StandupList"
import ContributionCalendar from "../ContributionCalendar"
import { AuthOverlay } from "@/components/AuthOverlay"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useStandup } from "@/contexts/StandupContext"
import { TimeDisplay } from "@/components/TimeDisplay"
import { badgeVariants } from "@/components/ui/badge"

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: ListTodo, label: "Entries", id: "entries" },
  { icon: Calendar, label: "Calendar", id: "calendar" },
]

function Overview() {
  const { user } = useAuth()
  const { entries } = useStandup()
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-100">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome to StandUp+</h1>
          <p className="text-gray-600 text-lg">Effortlessly track your daily standup updates and maintain a comprehensive log of your progress.</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <PenLine className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{entries.length}</h3>
              <p className="text-gray-600">Total Entries</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-pink-100 p-3 rounded-lg">
              <Tag className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {Array.from(new Set(entries.flatMap(e => e.tags || []))).length}
              </h3>
              <p className="text-gray-600">Unique Tags</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Briefcase className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {Array.from(new Set(entries.flatMap(e => e.projects || []))).length}
              </h3>
              <p className="text-gray-600">Active Projects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <PenLine className="h-8 w-8 text-purple-600 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Log Your Progress</h2>
          <p className="text-gray-600 text-sm">Write daily updates with tags and project categorization to track your achievements and tasks.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <Search className="h-8 w-8 text-pink-600 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Smart Search</h2>
          <p className="text-gray-600 text-sm">Easily find past entries with powerful search capabilities across text, tags, and projects.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <Calendar className="h-8 w-8 text-indigo-600 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Visual Timeline</h2>
          <p className="text-gray-600 text-sm">View your contribution patterns and track consistency with an interactive calendar view.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <Tag className="h-8 w-8 text-purple-600 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Tag Organization</h2>
          <p className="text-gray-600 text-sm">Organize entries with custom tags to categorize and group related updates.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <Briefcase className="h-8 w-8 text-pink-600 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Project Tracking</h2>
          <p className="text-gray-600 text-sm">Associate entries with specific projects to maintain clear project-based progress logs.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <Cloud className="h-8 w-8 text-indigo-600 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Cloud Sync</h2>
          <p className="text-gray-600 text-sm">Your entries are automatically synced and backed up when signed in with your account.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <Code className="h-8 w-8 text-purple-600 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Open Source</h2>
          <p className="text-gray-600 text-sm">StandUp+ is an open-source project. Contribute on GitHub and help us improve!</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      {entries.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y">
            {entries.slice(-3).reverse().map((entry) => (
              <div key={entry.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <TimeDisplay date={entry.date} />
                  <div className="flex gap-2">
                    {entry.tags?.map((tag) => (
                      <Badge key={tag} className={cn(badgeVariants({ variant: "secondary" }), "flex items-center gap-1 text-xs")}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{entry.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function AppLayout({ children }: { children?: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [activeView, setActiveView] = useState("overview")
  const { user, signInWithGithub, logout, isAuthenticating, signInWithGoogle } = useAuth()

  useEffect(() => {
    console.log("AppLayout auth state:", user?.uid, isAuthenticating)
  }, [user, isAuthenticating])

  const handleCalendarClick = (date: string) => {
    // Your logic for handling the date click
    console.log("Date clicked:", date);
  }

  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return <Overview />
      case "entries":
        return <StandupList />
      case "calendar":
        return <ContributionCalendar onDateClick={handleCalendarClick} />
      default:
        return <Overview />
    }
  }

  return (
    <>
      <AuthOverlay show={isAuthenticating} />
      <div className="flex h-screen">
        {/* Sidebar */}
        <motion.div 
          className={cn(
            "fixed left-0 top-0 h-full bg-white shadow-xl z-50 transition-all",
            isSidebarOpen ? "w-64" : "w-20"
          )}
          animate={{ width: isSidebarOpen ? 256 : 80 }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-600" />
                {isSidebarOpen && <span className="font-bold text-xl">StandUp+</span>}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>

            <div className="mt-8 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                    activeView === item.id 
                      ? "bg-purple-100 text-purple-700" 
                      : "hover:bg-gray-100"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {isSidebarOpen && <span>{item.label}</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            {user ? (
              <Button 
                variant="outline" 
                onClick={logout}
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isSidebarOpen && "Sign Out"}
              </Button>
            ) : (
              <Button 
                onClick={signInWithGithub}
                className="w-full"
                disabled={isAuthenticating}
              >
                {isAuthenticating ? (
                  <LoadingSpinner className="h-4 w-4 mr-2" />
                ) : (
                  <Github className="h-4 w-4 mr-2" />
                )}
                {isSidebarOpen && (isAuthenticating ? "Signing in..." : "Sign In")}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Main Content Wrapper */}
        <div className={cn(
          "flex flex-col min-h-screen w-full",
          isSidebarOpen ? "ml-64" : "ml-20"
        )}>
          {/* Content Area */}
          <div className="flex-grow p-8 pb-32">
            <div className="max-w-6xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <footer className="py-8 border-t bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 relative z-0">
            <div className="container mx-auto max-w-5xl px-4">
              <div className="flex flex-col items-center space-y-6">
                <p className="text-center text-sm text-muted-foreground">
                  <Code className="inline h-5 w-5 text-purple-600" /> StandUp+ is an open source project
                </p>
                <a
                  href="https://github.com/thedhanawada/standup-plus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-purple-600 hover:bg-purple-700 px-4 py-2 text-sm font-medium text-white transition-all shadow-lg"
                >
                  <Github className="h-5 w-5" />
                  <span>View on GitHub</span>
                </a>
              </div>
            </div>
          </footer>
        </div>

        {/* StandupForm rendered outside main content */}
        <StandupForm isSidebarOpen={isSidebarOpen} />
      </div>
    </>
  )
}
