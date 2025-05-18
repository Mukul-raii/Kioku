import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  retention: number
  missedReviewCount: number
}

export default function DashboardHeader({ retention, missedReviewCount }: DashboardHeaderProps) {
  console.log(retention);
  
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learning Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your progress and upcoming reviews</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-muted-foreground">Retention Score</div>
            <div className="text-2xl font-bold">{retention.toFixed(1)}/5.0</div>
          </div>
          <Button>Start Review Session</Button>
        </div>
      </div>

      {missedReviewCount > 0 && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Attention needed</AlertTitle>
          <AlertDescription>
            You have {missedReviewCount} missed reviews. Completing these will help maintain your retention.
            <Button variant="outline" size="sm" className="ml-2 mt-2">
              Review Now
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
