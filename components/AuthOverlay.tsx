"use client"

import { motion, AnimatePresence } from "framer-motion"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Sparkles } from "lucide-react"

export function AuthOverlay({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-950/80"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold">StandUp+</span>
            </div>
            <LoadingSpinner />
            <p className="text-sm text-muted-foreground animate-pulse">
              Authenticating...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 