"use client"

import React, { useEffect, useState } from "react"
import { useStandup } from "@/contexts/StandupContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ContributionDay {
  date: string
  count: number
}

const ContributionCalendar: React.FC = () => {
  const { entries } = useStandup()
  const [contributionData, setContributionData] = useState<ContributionDay[]>([])
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const currentDate = new Date()

  useEffect(() => {
    const processEntries = () => {
      const startDate = new Date(currentYear, 0, 1)
      const endDate = new Date(currentYear, 11, 31)

      // Adjust start date to previous Monday if January 1st is not a Monday
      const dayOfWeek = startDate.getDay()
      if (dayOfWeek !== 1) {
        startDate.setDate(startDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
      }

      const daysArray: ContributionDay[] = []
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        daysArray.push({ date: d.toISOString().split("T")[0], count: 0 })
      }

      const entryCounts = entries.reduce(
        (acc, entry) => {
          const entryDate = new Date(entry.date)
          if (entryDate.getFullYear() === currentYear) {
            const date = entryDate.toISOString().split("T")[0]
            acc[date] = (acc[date] || 0) + 1
          }
          return acc
        },
        {} as Record<string, number>,
      )

      const filledDaysArray = daysArray.map((day) => ({
        ...day,
        count: entryCounts[day.date] || 0,
      }))

      setContributionData(filledDaysArray)
    }

    processEntries()
  }, [entries, currentYear])

  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-100 dark:bg-gray-800"
    if (count < 2) return "bg-green-200 dark:bg-green-900"
    if (count < 4) return "bg-green-300 dark:bg-green-700"
    if (count < 6) return "bg-green-400 dark:bg-green-600"
    return "bg-green-500 dark:bg-green-500"
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const changeYear = (delta: number) => {
    const newYear = currentYear + delta
    if (newYear <= currentDate.getFullYear()) {
      setCurrentYear(newYear)
    }
  }

  const getDayOfWeek = (date: string) => {
    const d = new Date(date)
    return d.getDay()
  }

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Contribution Calendar</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => changeYear(-1)} aria-label="Previous year">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold">{currentYear}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => changeYear(1)}
            aria-label="Next year"
            disabled={currentYear >= currentDate.getFullYear()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="flex justify-start mb-2">
            {months.map((month) => (
              <span key={month} className="text-xs text-muted-foreground flex-1 text-center">
                {month}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-53 gap-1">
            {contributionData.map((day, index) => (
              <React.Fragment key={index}>
                {index % 7 === 0 && index !== 0 && <div className="col-span-1" />}
                <div
                  className={`w-3 h-3 rounded-sm ${getColor(day.count)} relative group`}
                  style={{
                    gridColumnStart: index === 0 ? getDayOfWeek(day.date) + 1 : "auto",
                  }}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-md">
                    {new Date(day.date).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    <br />
                    {day.count} contribution{day.count !== 1 ? "s" : ""}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ContributionCalendar

