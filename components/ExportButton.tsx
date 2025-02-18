import { Download } from "lucide-react"
import { Button } from "./ui/button"
import { useStandup } from "@/contexts/StandupContext"
import { format, parseISO } from "date-fns"
import { pdf } from "@react-pdf/renderer"
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#6B21A8', // Purple color
  },
  entry: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#F9FAFB',
  },
  entryTime: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 5,
  },
  entryText: {
    fontSize: 12,
    marginBottom: 5,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  tag: {
    fontSize: 10,
    color: '#7C3AED',
    backgroundColor: '#F3E8FF',
    padding: '3 6',
    borderRadius: 4,
  },
});

export function ExportButton() {
  const { entries } = useStandup()

  const handleExport = async () => {
    // Group entries by date
    const groupedEntries = entries.reduce((groups, entry) => {
      const date = format(parseISO(entry.date), 'yyyy-MM-dd')
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(entry)
      return groups
    }, {} as Record<string, typeof entries>)

    // Create PDF Document
    const MyDocument = () => (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>StandUp+ Entries Export</Text>
          
          {Object.entries(groupedEntries)
            .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
            .map(([date, dayEntries]) => (
              <View key={date} style={styles.dateGroup}>
                <Text style={styles.dateTitle}>
                  {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                </Text>
                
                {dayEntries.map((entry) => (
                  <View key={entry.id} style={styles.entry}>
                    <Text style={styles.entryTime}>
                      {format(parseISO(entry.date), 'h:mm a')}
                    </Text>
                    <Text style={styles.entryText}>{entry.text}</Text>
                    
                    {((entry.tags ?? []).length > 0 || (entry.projects ?? []).length > 0) && (
                      <View style={styles.tags}>
                        {(entry.tags ?? []).map((tag) => (
                          <Text key={tag} style={styles.tag}>
                            #{tag}
                          </Text>
                        ))}
                        {entry.projects?.map((project) => (
                          <Text key={project} style={styles.tag}>
                            @{project}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ))}
        </Page>
      </Document>
    );

    try {
      const blob = await pdf(<MyDocument />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `standup-entries-${format(new Date(), 'yyyy-MM-dd')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  return (
    <Button
      variant="outline"
      className="w-full justify-start"
      onClick={handleExport}
    >
      <Download className="mr-2 h-4 w-4" />
      Export Entries
    </Button>
  )
} 