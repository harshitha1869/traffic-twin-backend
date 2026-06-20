"use client"

import { useState, useEffect } from "react"
import { Flame, TrendingUp, TrendingDown, MapPin } from "lucide-react"
import { PageHeader } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RiskBadge } from "@/components/stat-card"
import {  riskLevelFromScore } from "@/lib/traffic-data"
import { cn } from "@/lib/utils"

// Normalize lat/lng into a 0-100 grid for the stylized ops map.



export function HotspotMapClient() {
 const [hotspots, setHotspots] = useState<any[]>([])
const [active, setActive] = useState(1)
const fetchHotspots = async () => {
  try {
    const response = await fetch(
      "https://traffictwin-api.onrender.com/hotspots"
    )

    const data = await response.json()

    console.log("HOTSPOTS:", data)

    setHotspots(data)
  } catch (err) {
    console.error(err)
  }
}

useEffect(() => {
  fetchHotspots()
}, [])
if (hotspots.length === 0) {
  return <div>Loading hotspots...</div>
}
const selected =
  hotspots.find((h) => h.rank === active) ?? hotspots[0]
  const lats = hotspots.map((h:any) => h.lat)
const lngs = hotspots.map((h:any) => h.lng)

const minLat = Math.min(...lats)
const maxLat = Math.max(...lats)

const minLng = Math.min(...lngs)
const maxLng = Math.max(...lngs)
const toXY = (lat:number, lng:number) => {
  const x =
    ((lng - minLng) / (maxLng - minLng || 1)) * 84 + 8

  const y =
    (1 - (lat - minLat) / (maxLat - minLat || 1)) * 84 + 8

  return { x, y }
}

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Traffic Hotspot Map"
        description="Geospatial view of the city's highest-frequency congestion and incident zones, ranked by AI risk score."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between border-b border-border">
            <CardTitle className="text-base">Live Risk Map</CardTitle>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-destructive" /> High
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-warning" /> Medium
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-success" /> Low
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div
              className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-muted/20"
              style={{
                backgroundImage:
                  "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            >
              {/* stylized arterial lines */}
              <svg className="absolute inset-0 size-full opacity-30" aria-hidden="true">
                <line x1="12%" y1="20%" x2="88%" y2="72%" stroke="var(--primary)" strokeWidth="1.5" />
                <line x1="50%" y1="6%" x2="46%" y2="94%" stroke="var(--primary)" strokeWidth="1.5" />
                <line x1="8%" y1="64%" x2="92%" y2="40%" stroke="var(--primary)" strokeWidth="1.5" />
              </svg>

              {hotspots.map((h) => {
                const { x, y } = toXY(h.lat, h.lng)
                const level = riskLevelFromScore(h.riskScore)
                const color =
                  level === "High" ? "bg-destructive" : level === "Medium" ? "bg-warning" : "bg-success"
                const isActive = h.rank === active
                return (
                  <button
                    key={h.rank}
                    onClick={() => setActive(h.rank)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                    style={{ left: `${x}%`, top: `${y}%` }}
                    aria-label={`${h.zone}, risk ${h.riskScore}`}
                  >
                    <span className="relative flex items-center justify-center">
                      {isActive && (
                        <span className={cn("absolute size-10 animate-ping rounded-full opacity-30", color)} />
                      )}
                      <span
                        className={cn(
                          "relative flex items-center justify-center rounded-full text-[10px] font-semibold text-background ring-2 ring-background transition-all",
                          color,
                          isActive ? "size-7" : "size-5",
                        )}
                      >
                        {h.rank}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="border-b border-border">
              <CardTitle className="text-base">Selected Zone</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-6">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
                  <MapPin className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{selected.zone}</p>
                  <p className="text-sm text-muted-foreground">{selected.area}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">Risk Score</p>
                  <p className="text-2xl font-semibold tabular-nums">{selected.riskScore}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">Events / mo</p>
                  <p className="text-2xl font-semibold tabular-nums">{selected.frequency}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <RiskBadge level={riskLevelFromScore(selected.riskScore)} />
                <Badge variant="outline" className="gap-1">
                  {selected.trend === "up" ? (
                    <TrendingUp className="size-3 text-destructive" />
                  ) : (
                    <TrendingDown className="size-3 text-success" />
                  )}
                  {selected.trend === "up" ? "Worsening" : "Improving"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader className="flex-row items-center gap-2 border-b border-border">
              <Flame className="size-4 text-destructive" />
              <CardTitle className="text-base">Top 10 Hotspots</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {hotspots.map((h) => (
                  <li key={h.rank}>
                    <button
                      onClick={() => setActive(h.rank)}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/40",
                        h.rank === active && "bg-muted/50",
                      )}
                    >
                      <span className="w-4 text-sm font-semibold tabular-nums text-muted-foreground">
                        {h.rank}
                      </span>
                      <span className="flex-1 truncate text-sm">{h.zone}</span>
                      <span className="text-sm font-medium tabular-nums">{h.riskScore}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
