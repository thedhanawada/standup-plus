import StandupForm from "@/components/StandupForm"
import StandupList from "@/components/StandupList"
import ContributionCalendar from "@/components/ContributionCalendar"
import { StandupProvider } from "@/contexts/StandupContext"
import Header from "@/components/Header"

export default function Home() {
  return (
    <StandupProvider>
      <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8 pb-16">
        <div className="container mx-auto max-w-5xl">
          <Header />
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

