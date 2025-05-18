"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"

export default function TopTopics({ topTopics }) {
  if (!topTopics || topTopics.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-gray-500 dark:text-gray-400">
        No topic data available
      </div>
    )
  }

  // Format the data for the chart
  const chartData = topTopics.map((item) => ({
    name: item.topic,
    value: item.freq,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis type="number" axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => {
            // Truncate long topic names
            return value.length > 15 ? value.substring(0, 15) + "..." : value
          }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value) => [`${value} reviews`, "Reviews"]}
          labelFormatter={(label) => `Topic: ${label}`}
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        />
        <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} animationDuration={1500} />
      </BarChart>
    </ResponsiveContainer>
  )
}
