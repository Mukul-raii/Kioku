"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts"

interface CategoryBreakdownProps {
  categoryBreakdown: Record<string, { count: number; averageScore: number }>
}

export default function CategoryBreakdown({ categoryBreakdown }: CategoryBreakdownProps) {
  const data = Object.entries(categoryBreakdown).map(([name, { count, averageScore }]) => ({
    name,
    value: count,
    score: averageScore,
  }))

  // Custom colors for the pie chart
  const COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>Distribution of your learning topics by category</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => {
                if (name === "value") return [`${value} topics`, "Count"]
                if (name === "score") return [`${value.toFixed(1)}/5.0`, "Avg. Score"]
                return [value, name]
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
