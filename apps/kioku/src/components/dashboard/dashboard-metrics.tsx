import { IconAward, IconBook2, IconCalendar, IconClock } from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardMetricsProps {
  masteredTopicCount: number
  reviewThisMonthCount: number
  daysActiveThisMonth: number
  upcomingReviewCount: number
}

export default function DashboardMetrics({
  masteredTopicCount,
  reviewThisMonthCount,
  daysActiveThisMonth,
  upcomingReviewCount,
}: DashboardMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mastered Topics</CardTitle>
          <IconAward className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{masteredTopicCount}</div>
          <p className="text-xs text-muted-foreground">Topics with 3+ reviews and score ≥ 4</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reviews This Month</CardTitle>
          <IconBook2 className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reviewThisMonthCount}</div>
          <p className="text-xs text-muted-foreground">Total reviews completed this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Days</CardTitle>
          <IconCalendar className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{daysActiveThisMonth}</div>
          <p className="text-xs text-muted-foreground">Days with activity this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Reviews</CardTitle>
          <IconClock className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingReviewCount}</div>
          <p className="text-xs text-muted-foreground">Reviews scheduled in the next 7 days</p>
        </CardContent>
      </Card>
    </div>
  )
}
