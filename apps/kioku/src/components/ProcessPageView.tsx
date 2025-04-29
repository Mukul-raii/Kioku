import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Brain, Calendar, ChevronUp, Clock, Star } from "lucide-react";

export default function ProcessPageView({
  retention,
  masteredTopicCount,
  masteredTopics,
}) {
  return (
    <>
     {/*  <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Progress</h1>
        <Select defaultValue="6months">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Retention
            </CardTitle>
            <Brain className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{retention}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ChevronUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+5%</span> from last
              month
            </div>
            <Progress value={87} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Topics Mastered
            </CardTitle>
            <Star className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{masteredTopicCount}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ChevronUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+3</span> from last
              month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Review Streak</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">x</div>
            <div className="text-xs text-muted-foreground">Best: 21 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Review Interval
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.3 days</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ChevronUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+0.8</span> from last
              month
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Retention Score Over Time</CardTitle>
            <CardDescription>
              Your memory retention is improving
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {/*   <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retention}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Topics by Category</CardTitle>
            <CardDescription>
              Distribution of your learning topics
            </CardDescription>
          </CardHeader>
          {/*  <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent> */}
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Mastered Topics</CardTitle>
            <CardDescription>
              Topics with highest retention scores
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={masteredTopics} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar
                  dataKey="mastery"
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
