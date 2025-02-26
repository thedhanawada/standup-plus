import { useState, useEffect } from "react"
import { useStandup } from "@/contexts/StandupContext"
import { format, parseISO, isToday } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"
import { X, Sparkles, Clock, Tag, Briefcase } from "lucide-react"
import { generateStandupSummary } from "@/lib/gemini"
import { LoadingSpinner } from "./ui/loading-spinner"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"

interface PresentationWizardProps {
  isOpen: boolean
  onClose: () => void
}

// Add new types for summary options
interface SummaryOptions {
  style: "concise" | "detailed" | "casual" | "formal"
  includeMetrics: boolean
  focusAreas: ("accomplishments" | "blockers" | "next-steps")[]
}

export function PresentationWizard({ isOpen, onClose }: PresentationWizardProps) {
  const { entries } = useStandup()
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [summaryOptions, setSummaryOptions] = useState<SummaryOptions>({
    style: "concise",
    includeMetrics: true,
    focusAreas: ["accomplishments", "blockers", "next-steps"]
  })
  
  // Filter entries for today
  const todayEntries = entries.filter(entry => isToday(parseISO(entry.date)))

  const generateSummary = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const generatedSummary = await generateStandupSummary(todayEntries, summaryOptions)
      setSummary(generatedSummary)
    } catch (err) {
      setError('Failed to generate summary. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 p-6 relative max-h-[80vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center sticky top-0 bg-white pb-4 z-10">
            <div>
              <h2 className="text-2xl font-bold">Today's Updates</h2>
              <p className="text-gray-500">
                {todayEntries.length} entries from today
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6 mt-4">
            {/* Summary Options Section - Show when no summary or when summary exists */}
            {!isLoading && (
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="font-medium text-lg">
                  {summary ? "Regenerate Summary" : "Generate AI Summary"}
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Summary Style</Label>
                    <Select
                      value={summaryOptions.style}
                      onValueChange={(value: SummaryOptions["style"]) => 
                        setSummaryOptions(prev => ({ ...prev, style: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concise">Concise</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Include Metrics</Label>
                    <Switch
                      checked={summaryOptions.includeMetrics}
                      onCheckedChange={(checked) =>
                        setSummaryOptions(prev => ({ ...prev, includeMetrics: checked }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Focus Areas</Label>
                    <div className="flex flex-wrap gap-2">
                      {["accomplishments", "blockers", "next-steps"].map((area) => (
                        <Button
                          key={area}
                          variant={summaryOptions.focusAreas.includes(area as any) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSummaryOptions(prev => ({
                              ...prev,
                              focusAreas: prev.focusAreas.includes(area as any)
                                ? prev.focusAreas.filter(a => a !== area)
                                : [...prev.focusAreas, area as any]
                            }))
                          }}
                        >
                          {area.charAt(0).toUpperCase() + area.slice(1).replace("-", " ")}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={generateSummary}
                    className="w-full mt-4"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {summary ? "Regenerate Summary" : "Generate Summary"}
                  </Button>
                </div>
              </div>
            )}

            {/* AI Summary Section */}
            {(isLoading || summary) && (
              <div className="bg-purple-50 rounded-lg p-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-[100px] space-y-4">
                    <LoadingSpinner />
                    <p className="text-sm text-gray-500">
                      {summary ? "Regenerating summary..." : "Generating AI summary..."}
                    </p>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center">
                    <p>{error}</p>
                    <Button
                      variant="outline"
                      onClick={generateSummary}
                      className="mt-4"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <div className="prose prose-purple max-w-none">
                    {summary && summary.split('\n').map((line, i) => {
                      // Handle headers
                      if (line.startsWith('##')) {
                        return <h2 key={i} className="text-xl font-bold mt-4 mb-2">{line.replace('##', '')}</h2>
                      }
                      // Handle bold sections
                      if (line.startsWith('**')) {
                        return <h3 key={i} className="font-bold text-purple-700 mt-4 mb-2">
                          {line.replace(/\*\*/g, '')}
                        </h3>
                      }
                      // Handle bullet points
                      if (line.startsWith('*')) {
                        return <li key={i} className="ml-4 mt-1">{line.replace('*', '').trim()}</li>
                      }
                      // Regular text
                      return <p key={i} className="mt-2 first:mt-0">{line}</p>
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Original Entries Section */}
            <div className="space-y-4">
              {todayEntries.map((entry, index) => (
                <div key={entry.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {format(parseISO(entry.date), 'h:mm a')}
                  </div>
                  
                  <p className="text-gray-700">{entry.text}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {entry.tags?.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                    {entry.projects?.map(project => (
                      <Badge key={project} variant="outline" className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {project}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 