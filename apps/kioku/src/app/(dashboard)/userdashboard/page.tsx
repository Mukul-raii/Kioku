"use client";
import { Suspense, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle, Edit } from "lucide-react";
import NoteTaking from "@/components/notes/note-taking";
import { getProgress } from "@/app/actions/quick-review";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import ActivityCalendar from "@/components/dashboard/activity-calendar";
import UpcomingReviews from "@/components/dashboard/upcoming-reviews";
import RecentLogs from "@/components/dashboard/recent-logs";
import TopTopics from "@/components/dashboard/top-topics";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
export default function UserDashboard() {
  const { user } = useUser();
  const [progressData, setProgressData] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getProgress(user.id);
        console.log(res);
        setProgressData(res);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [user]);

  if (progressData === null)
    return <Skeleton className="h-96 w-full rounded-lg" />;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header with quick note button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold">Learning Dashboard</h2>
            <p className="text-muted-foreground">
              Track your progress and upcoming reviews
            </p>
          </div>
          <div className="flex flex-row gap-2 items-end">
            <Card
              className="w-full sm:w-56 h-12 border border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              onClick={openDialog}
            >
              <div className="flex items-center justify-start gap-2 h-full px-3">
                <Edit className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Start typing...
                </p>
              </div>
            </Card>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-800">
              <div className="text-sm text-muted-foreground">
                Retention Score
              </div>
              <div className="text-2xl font-bold">
                {progressData.retention?.toFixed(1) || "0.0"}/5.0
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="space-y-8">
          {/* Alert for missed reviews */}
          {progressData.missedReviewCount > 0 && (
            <Alert
              variant="destructive"
              className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Attention needed</AlertTitle>
              <AlertDescription className="flex items-center">
                You have {progressData.missedReviewCount} missed reviews.
                Completing these will help maintain your retention.
                <Button variant="outline" size="sm" className="ml-2">
                  Review Now
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Metrics cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Mastered Topics"
              value={progressData.masteredTopicCount || 0}
              description="Topics with 3+ reviews and score ≥ 4"
              icon="🏆"
            />
            <MetricCard
              title="Reviews This Month"
              value={progressData.reviewThisMonthCount || 0}
              description="Total reviews completed this month"
              icon="📚"
            />
            <MetricCard
              title="Active Days"
              value={progressData.daysActiveThisMonth || 0}
              description="Days with activity this month"
              icon="📅"
            />
            <MetricCard
              title="Upcoming Reviews"
              value={progressData.upcomingReviewCount || 0}
              description="Reviews scheduled in the next 7 days"
              icon="⏰"
            />
          </div>

          {/* Activity Calendar */}
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Activity Calendar</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your review activity over the past 30 days
            </p>
            <div className="h-[300px]">
              <Suspense
                fallback={<Skeleton className="h-full w-full rounded-lg" />}
              >
                <ActivityCalendar />
              </Suspense>
            </div>
          </div>

          {/* Bottom three cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Upcoming Reviews</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Topics scheduled for review in the next 7 days
              </p>
              <Suspense
                fallback={<Skeleton className="h-[300px] w-full rounded-lg" />}
              >
                <UpcomingReviews
                  upcomingReviews={progressData.upcomingReviews || []}
                />
              </Suspense>
            </div>

            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">
                Recent Learning Logs
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your most recently added learning topics
              </p>
              <Suspense
                fallback={<Skeleton className="h-[300px] w-full rounded-lg" />}
              >
                <RecentLogs recentLogs={progressData.recentLogs || []} />
              </Suspense>
            </div>

            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">
                Most Reviewed Topics
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Topics you've reviewed most frequently
              </p>
              <Suspense
                fallback={<Skeleton className="h-[300px] w-full rounded-lg" />}
              >
                <TopTopics topTopics={progressData.topTopics || []} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <NoteTaking isOpen={isDialogOpen} onClose={closeDialog} />
      )}
    </div>
  );
}

function MetricCard({ title, value, description, icon }) {
  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </h3>
          <p className="text-3xl font-bold mt-1">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}
