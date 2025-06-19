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
  Badge,
  Mail,
  Presentation,
  Settings,
  ChevronDown
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { PresentationWizard } from "../PresentationWizard"
import { ExportButton } from "@/components/ExportButton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const menuItems = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: ListTodo, label: "Entries", id: "entries" },
  { icon: Calendar, label: "Calendar", id: "calendar" },
]

// Add settings menu items
const settingsMenuItems = [
  { icon: Cloud, label: "Export Entries", id: "export", onClick: () => {} },
  { icon: LogOut, label: "Sign Out", id: "logout", onClick: () => {} },
]

function Overview() {
  const { user, signInWithGithub } = useAuth()
  const { entries } = useStandup()
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-indigo-400/20 backdrop-blur-xl" />
        <div className="absolute inset-0 bg-white/40" />
        <div className="relative px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="bg-white/30 p-3 rounded-2xl backdrop-blur-sm border border-white/40 shadow-xl">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome to StandUp+
              </h1>
              <p className="text-2xl font-medium text-gray-700">
                See Your Progress, Clearly.
              </p>
              <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                StandUp+ is your open-source tool for effortless tracking and real results.
              </p>
              {!user && (
                <div className="flex gap-4 mt-4">
                  <Button 
                    onClick={signInWithGithub}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Github className="mr-2 h-5 w-5" />
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
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

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
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

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
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

      {/* Contribution Calendar Section */}
      <ContributionCalendar onDateClick={(date) => {}} />

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <PenLine className="h-8 w-8 text-purple-600 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Log Your Progress</h2>
          <p className="text-gray-600 text-sm">Write daily updates with tags and project categorization to track your achievements and tasks.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <Search className="h-8 w-8 text-pink-600 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Smart Search</h2>
          <p className="text-gray-600 text-sm">Easily find past entries with powerful search capabilities across text, tags, and projects.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <Calendar className="h-8 w-8 text-indigo-600 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Visual Timeline</h2>
          <p className="text-gray-600 text-sm">View your progress over time with a visual representation of your entries.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <Tag className="h-8 w-8 text-purple-600 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Tag Organization</h2>
          <p className="text-gray-600 text-sm">Organize entries with custom tags to categorize and group related updates.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <Briefcase className="h-8 w-8 text-pink-600 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Project Tracking</h2>
          <p className="text-gray-600 text-sm">Associate entries with specific projects to maintain clear project-based progress logs.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <Cloud className="h-8 w-8 text-indigo-600 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Cloud Sync</h2>
          <p className="text-gray-600 text-sm">Your entries are automatically synced and backed up when signed in with your account.</p>
        </div>
      </div>
    </div>
  )
}

export function AppLayout({ children }: { children?: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [activeView, setActiveView] = useState("overview")
  const { user, signInWithGithub, logout, isAuthenticating, signInWithGoogle } = useAuth()
  const { toast } = useToast()
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  const { entries } = useStandup()

  const handleExport = async () => {
    if (!entries || entries.length === 0) {
      toast({
        title: "No entries to export",
        description: "Create some standup entries first!"
      })
      return
    }

    const csvContent = entries.map(entry => {
      return `"${entry.date}","${entry.text.replace(/"/g, '""')}","${entry.tags?.join(', ') || ''}","${entry.projects?.join(', ') || ''}"`
    }).join('\n')

    const header = '"Date","Entry","Tags","Projects"\n'
    const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `standup-entries-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Entries exported!",
      description: "Your standup entries have been exported to CSV."
    })
  }


  const handleCalendarClick = (date: string) => {
    // Your logic for handling the date click
  }

  const handlePresentClick = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to present your standup"
      })
      return
    }
    setIsPresentationMode(true)
  }

  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return <Overview />
      case "entries":
        return <StandupList />
      default:
        return <Overview />
    }
  }

  return (
    <>
      <AuthOverlay show={isAuthenticating} />
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 flex relative">
            {/* Sidebar */}
            <motion.div 
              className={cn(
                "fixed left-0 top-0 h-full bg-gradient-to-b from-white via-white to-purple-50/30 shadow-[0_0_40px_-15px_rgba(0,0,0,0.2)] z-50 flex flex-col border-r border-purple-100/50",
                isSidebarOpen ? "w-64" : "w-20"
              )}
              animate={{ width: isSidebarOpen ? 256 : 80 }}
            >
              {/* Header */}
              <div className="p-5 border-b border-purple-100/50">
                <div className="flex items-center mb-3">
                  <div className={cn(
                    "relative transition-transform duration-200",
                    !isSidebarOpen && "scale-90"
                  )}>
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-200" />
                    <div className="relative bg-white rounded-lg p-2 ring-1 ring-purple-100">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  {isSidebarOpen && (
                    <span className="ml-3 font-bold text-lg bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                      StandUp+
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-center hover:bg-purple-100/50 rounded-lg transition-all duration-200",
                    !isSidebarOpen && "hover:scale-105"
                  )}
                  onClick={() => setSidebarOpen(!isSidebarOpen)}
                >
                  {isSidebarOpen ? (
                    <div className="flex items-center gap-2">
                      <X className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Collapse Sidebar</span>
                    </div>
                  ) : (
                    <Menu className="h-4 w-4 text-gray-600" />
                  )}
                </Button>
              </div>

              {/* Navigation Menu */}
              <div className={cn(
                "flex-1",
                isSidebarOpen ? "px-3" : "px-2"
              )}>
                <div className="mt-6 space-y-2">
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handlePresentClick}
                        className={cn(
                          "w-full flex items-center transition-all duration-300",
                          isSidebarOpen 
                            ? "px-4 py-6 gap-3" 
                            : "p-3 justify-center",
                          "rounded-xl",
                          user 
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-[0_4px_20px_-8px_rgba(147,51,234,0.5)] hover:shadow-[0_4px_20px_-4px_rgba(147,51,234,0.7)]"
                            : "bg-gray-50 border border-gray-200/50 text-gray-400 hover:bg-gray-100 hover:border-gray-300/50"
                        )}
                      >
                        <Presentation className={cn(
                          "transition-transform duration-200",
                          !isSidebarOpen && "scale-110"
                        )} />
                        {isSidebarOpen && <span className="font-medium">Present Standup</span>}
                      </Button>
                    </TooltipTrigger>
                    {!user && (
                      <TooltipContent 
                        side="right" 
                        className="max-w-[200px] p-3 bg-white shadow-lg border border-gray-200"
                      >
                        <div className="space-y-2">
                          <p className="font-medium text-sm">Sign in Required</p>
                          <div className="text-xs text-gray-500">
                            Sign in to:
                            <ul className="mt-1 ml-4 list-disc">
                              <li>Present your standup updates</li>
                              <li>Generate AI summaries</li>
                              <li>Sync entries across devices</li>
                              <li>Never lose your data</li>
                            </ul>
                          </div>
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>

                  {/* Menu Items */}
                  <div className="mt-6 space-y-1.5">
                    {menuItems.map((item) => (
                      item.id !== "calendar" && (
                        <Tooltip key={item.id} delayDuration={100}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setActiveView(item.id)}
                              className={cn(
                                "w-full flex items-center transition-all duration-200",
                                isSidebarOpen 
                                  ? "px-4 py-3.5 gap-3" 
                                  : "p-3 justify-center",
                                "rounded-xl",
                                activeView === item.id 
                                  ? isSidebarOpen
                                    ? "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 font-medium shadow-sm" 
                                    : "bg-purple-100/50 text-purple-700 font-medium shadow-sm"
                                  : "hover:bg-purple-50/50 text-gray-600 hover:text-purple-600"
                              )}
                            >
                              <item.icon className={cn(
                                "transition-all duration-200 h-5 w-5",
                                !isSidebarOpen && "scale-110",
                                activeView === item.id 
                                  ? "text-purple-600"
                                  : "text-gray-500 group-hover:text-purple-500"
                              )} />
                              {isSidebarOpen && (
                                <span className={cn(
                                  "font-medium text-[15px]",
                                  activeView === item.id 
                                    ? "text-purple-700"
                                    : "text-gray-700"
                                )}>
                                  {item.label}
                                </span>
                              )}
                            </button>
                          </TooltipTrigger>
                          {!isSidebarOpen && (
                            <TooltipContent side="right" className="font-medium">
                              {item.label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      )
                    ))}
                  </div>
                </div>
              </div>

              {/* Auth Section */}
              {!user && (
                <div className={cn(
                  "mt-auto",
                  isSidebarOpen ? "px-3 pb-4" : "px-2 pb-3"
                )}>
                  <div className={cn(
                    "rounded-xl bg-gray-50/80 border border-gray-100",
                    isSidebarOpen ? "p-3" : "p-2"
                  )}>
                    {isSidebarOpen && (
                      <div className="mb-3 px-1">
                        <h3 className="font-medium text-gray-900">Sign in</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Continue with</p>
                      </div>
                    )}
                    <div className={cn(
                      "grid gap-2",
                      isSidebarOpen ? "grid-cols-2" : "grid-cols-1"
                    )}>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={signInWithGithub}
                            variant="outline"
                            className={cn(
                              "transition-all duration-200 border-gray-200/50 hover:border-gray-300 hover:bg-white",
                              isSidebarOpen 
                                ? "h-9 text-sm px-3" 
                                : "h-9 w-9 p-0 flex items-center justify-center"
                            )}
                          >
                            <Github className={cn(
                              "transition-transform duration-200",
                              isSidebarOpen ? "h-4 w-4 mr-2" : "h-4 w-4"
                            )} />
                            {isSidebarOpen && "GitHub"}
                          </Button>
                        </TooltipTrigger>
                        {!isSidebarOpen && (
                          <TooltipContent side="right" className="font-medium">
                            Sign in with GitHub
                          </TooltipContent>
                        )}
                      </Tooltip>

                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={signInWithGoogle}
                            variant="outline"
                            className={cn(
                              "transition-all duration-200 border-gray-200/50 hover:border-gray-300 hover:bg-white",
                              isSidebarOpen 
                                ? "h-9 text-sm px-3" 
                                : "h-9 w-9 p-0 flex items-center justify-center"
                            )}
                          >
                            <Mail className={cn(
                              "transition-transform duration-200",
                              isSidebarOpen ? "h-4 w-4 mr-2" : "h-4 w-4"
                            )} />
                            {isSidebarOpen && "Google"}
                          </Button>
                        </TooltipTrigger>
                        {!isSidebarOpen && (
                          <TooltipContent side="right" className="font-medium">
                            Sign in with Google
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </div>
                  </div>
                </div>
              )}

              {/* User Profile Section */}
              {user && (
                <div className={cn(
                  "mt-auto border-t border-purple-100/50 bg-gradient-to-t from-purple-50/50 to-transparent",
                  isSidebarOpen ? "p-4" : "p-2"
                )}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className={cn(
                        "flex items-center gap-3 rounded-lg bg-white/50 border border-purple-100/50 cursor-pointer hover:bg-white/80 transition-colors duration-200",
                        isSidebarOpen ? "p-2" : "p-1.5 justify-center"
                      )}>
                        <Avatar className={cn(
                          "ring-2 ring-purple-100 ring-offset-2 transition-transform duration-200",
                          isSidebarOpen ? "h-10 w-10" : "h-8 w-8"
                        )}>
                          <AvatarImage src={user.photoURL || ''} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                            {user.email?.[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {isSidebarOpen && (
                          <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-medium text-gray-700">
                              {user.displayName || user.email?.split('@')[0] || 'User'}
                            </p>
                          </div>
                        )}
                        {isSidebarOpen && (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align={isSidebarOpen ? "end" : "start"}
                      className="w-56"
                    >
                      <div className="flex items-center gap-2 p-2">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.displayName || user.email?.split('@')[0] || 'User'}
                          </p>
                          <p className="text-xs leading-none text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={handleExport}
                      >
                        <Cloud className="mr-2 h-4 w-4" />
                        <span>Export Entries</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                        onClick={logout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </motion.div>

            {/* Main Content */}
            <main className={cn("flex-1 p-6", isSidebarOpen ? "ml-64" : "ml-20")}>
              {renderContent()}
            </main>
          </div>

          {/* Footer */}
          <footer className={cn(
            "py-12 mt-auto relative overflow-hidden",
            isSidebarOpen ? "ml-64" : "ml-20"
          )}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-pink-500/5 to-indigo-400/5 backdrop-blur-sm" />
            
            {/* Decorative blobs */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
            
            <div className="max-w-3xl mx-auto px-4 relative">
              <div className="flex flex-col items-center space-y-8">
                {/* Logo Section */}
                <div className="flex items-center gap-3">
                  <div className="bg-white/30 p-2 rounded-xl backdrop-blur-sm border border-white/40 shadow-xl">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                    StandUp+
                  </span>
                </div>

                {/* Open Source Message */}
                <p className="text-center space-y-2">
                  <span className="block text-gray-600 text-sm">
                  Open source and forever free. Accessible to everyone, always.
                  </span>
                </p>

                {/* Links */}
                <div className="flex gap-6 items-center">
                  <a
                    href="https://github.com/thedhanawada/standup-plus"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-gray-50 border border-purple-200 hover:border-purple-300 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Github className="h-5 w-5 text-gray-700 group-hover:text-purple-600 transition-colors" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">Star on GitHub</span>
                  </a>

                  <a
                    href="https://github.com/thedhanawada/standup-plus/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    Report an Issue
                  </a>
                </div>

                {/* Built with message */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Code className="h-4 w-4" />
                  <span>Built for the community</span>
                </div>
              </div>
            </div>
          </footer>

          {/* StandupForm rendered outside main content */}
          <StandupForm isSidebarOpen={isSidebarOpen} />

          {/* Presentation Wizard */}
          <PresentationWizard 
            isOpen={isPresentationMode}
            onClose={() => setIsPresentationMode(false)}
          />
        </div>
      </TooltipProvider>
    </>
  )
}
