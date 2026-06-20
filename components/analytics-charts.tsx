"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  eventCauseDistribution,
  eventTypeDistribution,
  monthlyTrends,
  peakHourAnalysis,
  plannedVsUnplanned,
} from "@/lib/traffic-data"
import { useEffect, useState } from "react"

const trendConfig = {
  events: { label: "Events", color: "var(--chart-1)" },
  closures: { label: "Closures", color: "var(--chart-4)" },
} satisfies ChartConfig

const causeConfig = {
  events: { label: "Events", color: "var(--chart-1)" },
} satisfies ChartConfig

const typeConfig = {
  Unplanned: { label: "Unplanned", color: "var(--chart-4)" },
  Planned: { label: "Planned", color: "var(--chart-2)" },
} satisfies ChartConfig

const peakConfig = {
  congestion: { label: "Congestion Index", color: "var(--chart-1)" },
} satisfies ChartConfig

const compareConfig = {
  planned: { label: "Planned", color: "var(--chart-2)" },
  unplanned: { label: "Unplanned", color: "var(--chart-4)" },
} satisfies ChartConfig

export function AnalyticsCharts() {
  const [types, setTypes] = useState<any[]>([])
const [causes, setCauses] = useState<any[]>([])
const [hours, setHours] = useState<any[]>([])
const [monthly, setMonthly] = useState<any[]>([])
const [comparison, setComparison] = useState<any[]>([])

useEffect(() => {
  loadAnalytics()
}, [])

const loadAnalytics = async () => {
  try {
    const causesRes = await fetch("https://traffictwin-api.onrender.com/analytics/causes")
    const typesRes = await fetch("https://traffictwin-api.onrender.com/analytics/types")
    const hoursRes = await fetch("https://traffictwin-api.onrender.com/analytics/hours")
    const monthlyRes = await fetch("https://traffictwin-api.onrender.com/analytics/monthly")
    const comparisonRes = await fetch(
  "https://traffictwin-api.onrender.com/analytics/comparison"
)

setComparison(await comparisonRes.json())

    setCauses(await causesRes.json())
    setTypes(await typesRes.json())
    setHours(await hoursRes.json())
    setMonthly(await monthlyRes.json())
  } catch (err) {
    console.error(err)
  }
}
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Annual Event & Closure Trend</CardTitle>
          <CardDescription>Monthly traffic events and resulting road closures across the city</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={trendConfig} className="aspect-auto h-[300px] w-full">
            <AreaChart data={monthly} margin={{ left: 8, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="fillEvents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-events)" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="var(--color-events)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fillClosures" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-closures)" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="var(--color-closures)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={32} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area dataKey="events" type="monotone" fill="url(#fillEvents)" stroke="var(--color-events)" strokeWidth={2} />
              <Area dataKey="closures" type="monotone" fill="url(#fillClosures)" stroke="var(--color-closures)" strokeWidth={2} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Events by Cause</CardTitle>
          <CardDescription>Distribution of traffic events by root cause</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={causeConfig} className="aspect-auto h-[300px] w-full">
            <BarChart data={causes} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis dataKey="cause" type="category" tickLine={false} axisLine={false} width={96} tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
              <Bar dataKey="events" fill="var(--color-events)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Planned vs Unplanned</CardTitle>
          <CardDescription>Share of scheduled versus emergent traffic events</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <ChartContainer config={typeConfig} className="aspect-square h-[300px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              <Pie data={types} dataKey="value" nameKey="name" innerRadius={70} strokeWidth={2}>
                {types.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Peak Hour Congestion</CardTitle>
          <CardDescription>Average congestion index across the 24-hour cycle</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={peakConfig} className="aspect-auto h-[300px] w-full">
            <BarChart data={hours} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={32} />
              <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
              <Bar dataKey="congestion" fill="var(--color-congestion)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent 6-Month Comparison</CardTitle>
          <CardDescription>Planned versus unplanned event volume by month</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <ChartContainer config={compareConfig} className="aspect-square h-[300px]">
            <RadarChart data={comparison}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <PolarGrid />
              <PolarAngleAxis dataKey="month" />
              <Radar dataKey="planned" fill="var(--color-planned)" fillOpacity={0.5} stroke="var(--color-planned)" />
              <Radar dataKey="unplanned" fill="var(--color-unplanned)" fillOpacity={0.3} stroke="var(--color-unplanned)" />
              <ChartLegend content={<ChartLegendContent />} />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
