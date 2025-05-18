export default function RecentLogs({ recentLogs }) {
  const formatDate = (date) => {
    if (!date) return "N/A"

    const logDate = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (logDate.toDateString() === today.toDateString()) {
      return "Today"
    } else if (logDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return logDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  if (!recentLogs || recentLogs.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-gray-500 dark:text-gray-400">No recent logs</div>
    )
  }

  return (
    <div className="space-y-3">
      {recentLogs.map((log, index) => (
        <div
          key={index}
          className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{log.topic}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Added: {formatDate(log.date)}</p>
            </div>
            <div className="px-2 py-1 rounded-md text-xs font-medium bg-gray-200 dark:bg-gray-800">{log.category}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
