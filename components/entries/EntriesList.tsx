import { useStandup } from "@/contexts/StandupContext"
import { format, parseISO } from "date-fns"
import { ChevronLeft } from "lucide-react"
import { Button } from "../ui/button"

interface EntriesListProps {
  selectedDate: string | null
  filters: {
    search: string
    tags: string[]
    projects: string[]
  }
  onBack: () => void
}

export function EntriesList({ selectedDate, filters, onBack }: EntriesListProps) {
  const { entries } = useStandup()
  
  // Filter entries based on selectedDate and filters
  const filteredEntries = entries.filter(entry => {
    if (selectedDate && format(parseISO(entry.date), 'yyyy-MM-dd') !== selectedDate) return false
    if (filters.search && !entry.text.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.tags.length && !filters.tags.some(tag => entry.tags?.includes(tag))) return false
    if (filters.projects.length && !filters.projects.some(project => entry.projects?.includes(project))) return false
    return true
  })

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ChevronLeft className="h-4 w-4" />
        Back to Calendar
      </Button>
      {/* Entry list rendering logic */}
    </div>
  )
} 