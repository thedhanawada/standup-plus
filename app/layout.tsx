import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/AuthContext"
import { Suspense } from 'react'
import Loading from './loading'

export const metadata: Metadata = {
  title: 'StandUp+',
  description: 'Track your daily standup updates',
  icons: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      url: '/favicon.svg',
    }
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <title>StandUp+</title>
      </head>
      <body>
        <AuthProvider>
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
