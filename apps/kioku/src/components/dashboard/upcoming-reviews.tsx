export default function UpcomingReviews({ upcomingReviews }) {
  const formatDate = (date) => {
    if (!date) return "N/A"

    const reviewDate = new Date(date)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (reviewDate.toDateString() === today.toDateString()) {
      return "Today"
    } else if (reviewDate.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return reviewDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  const getScoreColor = (score) => {
    if (score >= 4) return "text-green-600 bg-green-50 dark:bg-green-950/20 dark:text-green-400"
    if (score >= 3) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20 dark:text-yellow-400"
    return "text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400"
  }

  if (!upcomingReviews || upcomingReviews.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-gray-500 dark:text-gray-400">
        No upcoming reviews
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {upcomingReviews.map((review, index) => (
        <div
          key={index}
          className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{review.miniTopic}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Due: {formatDate(review.nextReviewDate)}</p>
            </div>
            <div className={`px-2 py-1 rounded-md text-xs font-medium ${getScoreColor(review.lastScore)}`}>
              {review.lastScore}/5
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
