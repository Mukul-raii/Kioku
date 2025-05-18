"use client";

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
import DashboardHeader from "./dashboard/dashboard-header";
import { Suspense } from "react";
import { Skeleton } from "./ui/skeleton";
import DashboardMetrics from "./dashboard/dashboard-metrics";
import CategoryBreakdown from "./dashboard/category-breakdown";
import ActivityCalendar from "./dashboard/activity-calendar";
import UpcomingReviews from "./dashboard/upcoming-reviews";
import RecentLogs from "./dashboard/recent-logs";
import TopTopics from "./dashboard/top-topics";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#f87171", "#60a5fa", "#facc15"];

export default function ProcessPageView({ progressData }) {
  if (!progressData) {
    return <p className="text-gray-300 text-center">Loading progress...</p>;
  }

  return (
   
  )
}
