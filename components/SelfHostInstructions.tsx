import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

export function SelfHostInstructions({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Self-Hosting Instructions</AlertDialogTitle>
          <AlertDialogDescription>
            To self-host StandUp+, follow these steps:
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <h3>1. Clone the repository:</h3>
          <p><code>git clone https://github.com/thedhanawada/standup-plus</code></p>
          <h3>2. Install dependencies:</h3>
          <p><code>npm install</code></p>
          <h3>3. Configure Firebase:</h3>
          <ul>
            <li>Create a Firebase project.</li>
            <li>Enable Firestore and Authentication.</li>
            <li>Set up environment variables with your Firebase credentials.</li>
          </ul>
          <h3>4. Run the application:</h3>
          <p><code>npm run dev</code></p>
          <p>For detailed instructions, refer to the project documentation.</p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
