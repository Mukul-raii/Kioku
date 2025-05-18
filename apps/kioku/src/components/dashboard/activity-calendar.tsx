"use client"

import { useState } from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export default function ActivityCalendar() {
  // Mock data for the activity calendar
  // In a real app, this would come from your API
  const [data] = useState(() => {
    const today = new Date()
    const days = []
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      days.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        reviews: Math.floor(Math.random() * 10),
      })
    }
    return days
  })

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => {
            // Only show every 5th label to avoid crowding
            const index = data.findIndex((item) => item.date === value)
            return index % 5 === 0 ? value : ""
          }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickCount={5} />
        <Tooltip
          formatter={(value) => [`${value} reviews`, "Reviews"]}
          labelFormatter={(label) => `Date: ${label}`}
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        />
        <Bar dataKey="reviews" fill="#6366f1" radius={[4, 4, 0, 0]} name="Reviews" animationDuration={1500} />
      </BarChart>
    </ResponsiveContainer>
  )
}
