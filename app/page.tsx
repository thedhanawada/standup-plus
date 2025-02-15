import StandupForm from "@/components/StandupForm"
import StandupList from "@/components/StandupList"
import ContributionCalendar from "@/components/ContributionCalendar"
import { StandupProvider } from "@/contexts/StandupContext"
import { InfoIcon } from "lucide-react"

export default function Home() {
  return (
    <StandupProvider>
      <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8 pb-16">
        <div className="container mx-auto max-w-5xl">
          <header className="mb-12 text-center">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
              StandUp+
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Streamline your daily updates, track your progress, and stay in sync with your goals.
            </p>
            <div className="inline-flex items-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg">
              <InfoIcon className="mr-2" />
              <span>All data is stored locally in your browser. No server-side storage or database is used.</span>
            </div>
          </header>
          <ContributionCalendar />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <StandupForm />
            <StandupList />
          </div>
        </div>
      </main>
    </StandupProvider>
  )
}

