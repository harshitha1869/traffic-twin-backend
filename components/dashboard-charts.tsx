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
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  eventTypeDistribution,
  eventCauseDistribution,
  monthlyTrends,
  peakHourAnalysis,
} from "@/lib/traffic-data"

const pieConfig = {
  value: { label: "Events" },
  unplanned: { label: "Unplanned", color: "var(--chart-4)" },
  planned: { label: "Planned", color: "var(--chart-1)" },
} satisfies ChartConfig

const causeConfig = {
  events: { label: "Events", color: "var(--chart-1)" },
} satisfies ChartConfig

const trendConfig = {
  events: { label: "Events", color: "var(--chart-1)" },
  closures: { label: "Closures", color: "var(--chart-3)" },
} satisfies ChartConfig

const peakConfig = {
  congestion: { label: "Congestion Index", color: "var(--chart-1)" },
} satisfies ChartConfig

export function EventTypeChart() {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle className="text-base">Event Type Distribution</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ChartContainer config={pieConfig} className="mx-auto aspect-square max-h-[220px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
            <Pie
              data={eventTypeDistribution}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              strokeWidth={4}
              stroke="var(--card)"
            >
              {eventTypeDistribution.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-2 flex justify-center gap-6">
          {eventTypeDistribution.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-sm">
              <span
                className="size-2.5 rounded-full"
                style={{ background: d.fill }}
              />
              <span className="text-muted-foreground">{d.name}</span>
              <span className="font-medium tabular-nums">{d.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function EventCauseChart() {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle className="text-base">Event Cause Distribution</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ChartContainer config={causeConfig} className="h-[260px] w-full">
          <BarChart
            data={eventCauseDistribution}
            layout="vertical"
            margin={{ left: 12, right: 16 }}
          >
            <CartesianGrid horizontal={false} stroke="var(--border)" />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="cause"
              tickLine={false}
              axisLine={false}
              width={108}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="events" fill="var(--color-events)" radius={[0, 4, 4, 0]} barSize={16} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function MonthlyTrendChart() {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle className="text-base">Monthly Congestion Trends</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ChartContainer config={trendConfig} className="h-[260px] w-full">
          <AreaChart data={monthlyTrends} margin={{ left: 4, right: 12, top: 8 }}>
            <defs>
              <linearGradient id="fillEvents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-events)" stopOpacity={0.5} />
                <stop offset="95%" stopColor="var(--color-events)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillClosures" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-closures)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-closures)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={32}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="events"
              type="monotone"
              fill="url(#fillEvents)"
              stroke="var(--color-events)"
              strokeWidth={2}
            />
            <Area
              dataKey="closures"
              type="monotone"
              fill="url(#fillClosures)"
              stroke="var(--color-closures)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function PeakHourChart() {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle className="text-base">Peak Hour Analysis</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ChartContainer config={peakConfig} className="h-[260px] w-full">
          <BarChart data={peakHourAnalysis} margin={{ left: 4, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={32}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="congestion" fill="var(--color-congestion)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
