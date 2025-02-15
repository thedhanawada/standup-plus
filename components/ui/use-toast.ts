import { useState } from "react"

interface Toast {
  title: string
  description?: string
}

export function useToast() {
  const [toastState, setToastState] = useState<Toast | null>(null)

  const toast = (newToast: Toast) => {
    setToastState(newToast)
    setTimeout(() => setToastState(null), 3000)
  }

  return { toast, toastState }
}

