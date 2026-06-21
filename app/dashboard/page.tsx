"use client";
import { Activity, AlertTriangle, Ban, Timer, Flame, Download } from "lucide-react"
import { PageHeader } from "@/components/app-shell"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  EventTypeChart,
  EventCauseChart,
  MonthlyTrendChart,
  PeakHourChart,
} from "@/components/dashboard-charts"
import { IncidentsTable } from "@/components/incidents-table"
import ExportPdfButton from "@/components/export-pdf-button";
import { AiInsightsPanel } from "@/components/ai-insights-panel"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



const cards = [
  { label: "Total Traffic Events", value: "2,847", delta: "+12.4%", trend: "up" as const, hint: "vs last week", icon: Activity, accent: "primary" as const },
  { label: "Predicted High Risk", value: "164", delta: "+8.1%", trend: "up" as const, hint: "next 24h", icon: AlertTriangle, accent: "destructive" as const },
  { label: "Road Closure Prob.", value: "37%", delta: "-3.2%", trend: "down" as const, hint: "city average", icon: Ban, accent: "warning" as const },
  { label: "Avg Resolution Time", value: "42 min", delta: "-6.5%", trend: "down" as const, hint: "vs last week", icon: Timer, accent: "success" as const },
  { label: "Active Hotspots", value: "28", delta: "+4", trend: "up" as const, hint: "live now", icon: Flame, accent: "primary" as const },
]

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");

    if (loggedIn === "true") {
      setIsAuthenticated(true);
    } else {
      router.replace("/login");
    }

    setChecking(false);
  }, [router]);

  if (checking) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    // Your dashboard JSX
    <div className="flex flex-col gap-6">
      <PageHeader
  title="Operations Overview"
  description="Real-time citywide traffic intelligence, congestion forecasts, and active incident monitoring."
  actions={<ExportPdfButton />}
/>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <EventTypeChart />
        <div className="lg:col-span-2">
          <EventCauseChart />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MonthlyTrendChart />
        <PeakHourChart />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border">
            <CardTitle className="text-base">Recent Incidents</CardTitle>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              View all
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <IncidentsTable />
          </CardContent>
        </Card>
        <AiInsightsPanel compact />
      </div>
    </div>
  )
}
