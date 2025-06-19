import { useState, useEffect } from "react"
import { useStandup } from "@/contexts/StandupContext"
import { 
  Calendar as CalendarIcon, 
  Tag, 
  Briefcase, 
  Search,
  Filter,
  Grid2X2,
  List,
  ChevronDown,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, parseISO } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import ContributionCalendar from "./ContributionCalendar"
import { EntriesList } from "./entries/EntriesList"

export default function EntriesView() {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    search: "",
    tags: [] as string[],
    projects: [] as string[]
  })
  
  const handleCalendarClick = (date: string) => {
    setSelectedDate(date)
    setViewMode("list")
  }

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Progress History</h1>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "calendar" | "list")}>
          <TabsList className="grid w-full max-w-[200px] grid-cols-2">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Advanced Search & Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search entries..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            <span className="bg-purple-100 text-purple-600 rounded-full px-2 py-0.5 text-xs">
              {filters.tags.length + filters.projects.length}
            </span>
          </Button>
        </div>

        {/* Active Filters */}
        {(filters.tags.length > 0 || filters.projects.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {filters.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm">
                <Tag className="h-3 w-3" />
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-purple-900" 
                  onClick={() => setFilters({
                    ...filters,
                    tags: filters.tags.filter(t => t !== tag)
                  })}
                />
              </span>
            ))}
            {filters.projects.map(project => (
              <span key={project} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">
                <Briefcase className="h-3 w-3" />
                {project}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-blue-900"
                  onClick={() => setFilters({
                    ...filters,
                    projects: filters.projects.filter(p => p !== project)
                  })}
                />
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <AnimatePresence mode="wait">
          {viewMode === "calendar" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ContributionCalendar onDateClick={handleCalendarClick} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <EntriesList 
                selectedDate={selectedDate}
                filters={filters}
                onBack={() => setViewMode("calendar")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 