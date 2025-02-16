"use client"

import { StandupProvider } from "@/contexts/StandupContext"
import { AppLayout } from "@/components/layouts/AppLayout"
import { useAuth } from "@/contexts/AuthContext"

export default function Home() {
  return (
    <StandupProvider>
      <AppLayout>
        {/* AppLayout now handles all the content rendering */}
      </AppLayout>
    </StandupProvider>
  )
}

