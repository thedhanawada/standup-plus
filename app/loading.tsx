import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function Loading() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <LoadingSpinner className="h-8 w-8 text-purple-600" />
    </div>
  )
} 