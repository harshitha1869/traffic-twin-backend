"use client"
import { Download, FileText, TrendingDown, TrendingUp } from "lucide-react"
import { PageHeader } from "@/components/app-shell"
import { AiInsightsPanel } from "@/components/ai-insights-panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { kpis } from "@/lib/traffic-data"
import { useState, useEffect } from "react"

const reportArchive = [
  { name: "Weekly Operations Digest", period: "Jun 10 – Jun 16, 2026", type: "Operational", size: "2.4 MB" },
  { name: "Monthly Congestion Review", period: "May 2026", type: "Strategic", size: "5.1 MB" },
  { name: "Incident Response Audit", period: "Q2 2026", type: "Compliance", size: "3.8 MB" },
  { name: "Hotspot Risk Assessment", period: "Jun 2026", type: "Analytical", size: "4.2 MB" },
  { name: "Resource Utilization Report", period: "Jun 2026", type: "Operational", size: "1.9 MB" },
]

export default function ReportsPage() {
  interface ReportSummary {
  metric: string
  value: string | number
  change: string
  positive: boolean
}

interface Hotspot {
  rank: number
  zone: string
  area: string
  frequency: number
  riskScore: number
}
    const [reportSummary, setReportSummary] = useState<any[]>([])
const [hotspots, setHotspots] = useState<any[]>([])
  const loadReportData = async () => {
  const status = await fetch("http://127.0.0.1:8000/status")
  const data = await status.json()

  setReportSummary([
    {
      metric: "Model Accuracy",
      value: `${data.accuracy}%`,
      change: "+1.8%",
      positive: true,
    },
    {
      metric: "Model AUC",
      value: data.auc,
      change: "+0.5%",
      positive: true,
    },
  ])
}

const loadHotspots = async () => {
  const res = await fetch(
    "http://127.0.0.1:8000/hotspots"
  )

  const data = await res.json()

  setHotspots(data)
}

  useEffect(() => {
    loadReportData()
    loadHotspots()
  }, [])

  
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reports & Intelligence"
        description="Executive summaries, AI insights, and downloadable reports for city leadership and traffic command."
      >
        <Button>
          <Download data-icon="inline-start" />
          Export Report
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="border-red-500/30">
  <CardHeader>
    <CardTitle>
      🚨 Executive Recommendation
    </CardTitle>
  </CardHeader>

  <CardContent>
    <p>
      High congestion risk expected near
      Silk Board between 5 PM and 8 PM.
    </p>

    <ul className="mt-3 space-y-1">
      <li>• Deploy 5 Officers</li>
      <li>• Deploy 4 Barricades</li>
      <li>• Activate Diversion Route</li>
      <li>• Dispatch 1 Tow Truck</li>
    </ul>
  </CardContent>
</Card>
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
              <CardDescription>Key performance indicators for the current reporting period</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reportSummary.map((r:any) => (
                <div key={r.metric} className="rounded-lg border border-border bg-muted/20 p-4">
                  <p className="text-xs text-muted-foreground">{r.metric}</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">{r.value}</p>
                  <Badge
                    variant="secondary"
                    className={r.positive ? "mt-2 gap-0.5 text-success" : "mt-2 gap-0.5 text-warning"}
                  >
                    {r.positive ? <TrendingDown className="size-3" /> : <TrendingUp className="size-3" />}
                    {r.change}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Risk Zones — Period Summary</CardTitle>
              <CardDescription>Highest-frequency hotspots for the reporting window</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Zone</TableHead>
                    <TableHead>Corridor</TableHead>
                    <TableHead className="text-right">Events</TableHead>
                    <TableHead className="pr-6 text-right">Risk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hotspots.slice(0, 6).map((h:any) => (
                    <TableRow key={h.rank}>
                      <TableCell className="pl-6 font-medium">{h.zone}</TableCell>
                      <TableCell className="text-muted-foreground">{h.area}</TableCell>
                      <TableCell className="text-right tabular-nums">{h.frequency}</TableCell>
                      <TableCell className="pr-6 text-right font-semibold tabular-nums">{h.riskScore}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Archive</CardTitle>
              <CardDescription>Previously generated reports available for download</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {reportArchive.map((r) => (
                <div
                  key={r.name}
                  className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 p-3 transition-colors hover:border-primary/30"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/12 text-primary ring-1 ring-primary/25">
                    <FileText className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.period} · {r.size}
                    </p>
                  </div>
                  <Badge variant="outline">{r.type}</Badge>
                  <Button variant="ghost" size="icon" aria-label={`Download ${r.name}`}>
                    <Download />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <AiInsightsPanel />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Period Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {kpis.slice(0, 4).map((k) => (
                <div key={k.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{k.label}</span>
                  <span className="font-semibold tabular-nums">{k.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
  <CardHeader>
    <CardTitle>Model Information</CardTitle>
  </CardHeader>

  <CardContent className="space-y-3">
    <div className="flex justify-between">
      <span>Model</span>
      <span>XGBoost Ensemble</span>
    </div>

    <div className="flex justify-between">
      <span>Accuracy</span>
      <span>92.35%</span>
    </div>

    <div className="flex justify-between">
      <span>AUC</span>
      <span>0.8449</span>
    </div>

    <div className="flex justify-between">
      <span>Status</span>
      <Badge className="bg-green-600">
        Online
      </Badge>
    </div>
  </CardContent>
</Card>
        </div>
      </div>
    </div>
  )
}
