"use client"

import { useState } from "react"
import { useStandup } from "@/contexts/StandupContext"
import { ChevronLeft, ChevronRight, Clock, Calendar, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { format, parseISO, getYear, formatDistanceToNow } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface ContributionCalendarProps {
  onDateClick: (date: string) => void
}

export default function ContributionCalendar({ onDateClick }: ContributionCalendarProps) {
  const { entries } = useStandup()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Group entries by date with full entry data
  const contributionMap = entries.reduce((acc, entry) => {
    const date = format(parseISO(entry.date), "yyyy-MM-dd")
    if (!acc[date]) {
      acc[date] = {
        count: 1,
        entries: [entry]
      }
    } else {
      acc[date].count += 1
      acc[date].entries.push(entry)
    }
    return acc
  }, {} as Record<string, { count: number; entries: typeof entries }>) 

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]

  // Updated color scheme - purple gradient
  const getContributionColor = (count: number) => {
    if (count === 0) return "bg-gray-100 dark:bg-gray-800"
    if (count === 1) return "bg-purple-200 dark:bg-purple-900"
    if (count === 2) return "bg-fuchsia-300 dark:bg-fuchsia-700"
    if (count === 3) return "bg-pink-400 dark:bg-pink-600"
    return "bg-pink-500 dark:bg-pink-500"
  }
  
  const generateCalendarData = (year: number) => {
    const data = []
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      const days = []
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = format(new Date(year, month, day), "yyyy-MM-dd")
        const dayData = contributionMap[date] || { count: 0, entries: [] }
        days.push({ date, ...dayData })
      }
      
      data.push(days)
    }
    return data
  }

  const calendarData = generateCalendarData(selectedYear)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Contribution Calendar</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSelectedYear(selectedYear - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold">{selectedYear}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSelectedYear(selectedYear + 1)}
            disabled={selectedYear >= new Date().getFullYear()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {months.map((month, monthIndex) => (
          <div key={month} className="space-y-2">
            <div className="text-sm font-medium text-gray-500">{month}</div>
            <div className="grid grid-cols-7 gap-1">
              {calendarData[monthIndex].map(({ date, count, entries }) => (
                <HoverCard key={date} openDelay={200}>
                  <HoverCardTrigger asChild>
                    <div
                      className={`w-3 h-3 rounded-sm cursor-pointer transition-colors ${getContributionColor(count)}`}
                      onClick={() => onDateClick(date)}
                    />
                  </HoverCardTrigger>
                  <HoverCardContent 
                    className="w-96 p-0 shadow-xl" 
                    align="start"
                    sideOffset={5}
                  >
                    <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-t-lg">
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300">
                        <Calendar className="h-4 w-4" />
                        <time className="font-semibold">
                          {format(parseISO(date), "MMMM d, yyyy")}
                        </time>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-300">
                        <MessageSquare className="h-4 w-4" />
                        <span>{count} contribution{count !== 1 ? "s" : ""} on this day</span>
                      </div>
                    </div>

                    <ScrollArea className="max-h-[300px] p-4">
                      {entries.length > 0 ? (
                        <div className="space-y-3">
                          {entries.map((entry, index) => (
                            <div key={entry.id}>
                              {index > 0 && <Separator className="my-3" />}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <Clock className="h-3 w-3" />
                                    <time>{format(parseISO(entry.date), "h:mm a")}</time>
                                  </div>
                                  <span className="text-xs text-gray-400 dark:text-gray-500">
                                    {formatDistanceToNow(parseISO(entry.date), { addSuffix: true })}
                                  </span>
                                </div>
                                <div className="text-sm bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                                  {entry.text.split('\n').map((line, i) => (
                                    <p key={i} className="mt-1 first:mt-0">
                                      {line}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                          <p>No contributions on this day</p>
                        </div>
                      )}
                    </ScrollArea>

                    {entries.length > 0 && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 rounded-b-lg">
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          Showing all entries for {format(parseISO(date), "MMMM d")}
                        </div>
                      </div>
                    )}
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 justify-end">
        <span className="text-sm text-gray-500">Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`w-3 h-3 rounded-sm ${getContributionColor(level)}`}
          />
        ))}
        <span className="text-sm text-gray-500">More</span>
      </div>
    </div>
  )
}

