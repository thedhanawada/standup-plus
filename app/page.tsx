"use client"

import { StandupProvider } from "@/contexts/StandupContext"
import { MinimalLayout } from "@/components/layouts/MinimalLayout"

export default function Home() {
  return (
    <StandupProvider>
      <MinimalLayout />
    </StandupProvider>
  )
}

