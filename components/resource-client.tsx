"use client"
import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Users, Construction, Truck, Plane, Car } from "lucide-react"
import { PageHeader } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { RiskBadge } from "@/components/stat-card"
import { useSearchParams } from "next/navigation"


const utilConfig = {
  deployed: { label: "Deployed", color: "var(--chart-1)" },
  available: { label: "Available", color: "var(--chart-3)" },
} satisfies ChartConfig

const resourceIcons = {
  Officers: Users,
  Barricades: Construction,
  "Tow Trucks": Truck,
  Drones: Plane,
  "Patrol Cars": Car,
} as const



export function ResourceClient() {
  const [resourceData, setResourceData] = useState({
  risk: 0,
  officers: 0,
  barricades: 0,
  tow_trucks: 0,
  drones: 0,
   resolution_time: 0,
})
 const searchParams = useSearchParams()

  const event_type = searchParams.get("event_type")
  const event_cause = searchParams.get("event_cause")
  const zone = searchParams.get("zone")
  const corridor = searchParams.get("corridor")
  const police_station = searchParams.get("police_station")
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const hour = searchParams.get("hour")
  const day = searchParams.get("day")
  const month = searchParams.get("month")
  
useEffect(() => {
  loadResources()
}, [])
const loadResources = async () => {
  
  try {
    const response = await fetch("https://traffictwin-api.onrender.com/resource", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  event_type: event_type || "planned",
  event_cause: event_cause || "vip_movement",
  zone: zone || "East",
  corridor: corridor || "ORR",
  police_station: police_station || "Whitefield",
  latitude: Number(lat) || 12.97,
  longitude: Number(lng) || 77.59,
  hour: Number(hour) || 18,
  day: Number(day) || 5,
  month: Number(month) || 12,
})
    })

    const data = await response.json()

    setResourceData(data)

    console.log(data)
  } catch (err) {
    console.log(err)
  }
}

const recommendations = [
  {
    id: "AI-001",
    location: zone ?? "Unknown Zone",
    zone: corridor ?? "Unknown Corridor",
    officers: resourceData.officers,
    barricades: resourceData.barricades,
    diversion: resourceData.risk > 60,
    level:
  resourceData.risk > 70
    ? ("High" as const)
    : resourceData.risk > 40
    ? ("Medium" as const)
    : ("Low" as const),
  },
]
const chartData = [
  {
    resource: "Officers",
    deployed: resourceData.officers,
    available: 10 - resourceData.officers,
  },
  {
    resource: "Barricades",
    deployed: resourceData.barricades,
    available: 10 - resourceData.barricades,
  },
  {
    resource: "Tow Trucks",
    deployed: resourceData.tow_trucks,
    available: 5 - resourceData.tow_trucks,
  },
  {
    resource: "Drones",
    deployed: resourceData.drones,
    available: 3 - resourceData.drones,
  },
  {
  resource: "Patrol Cars",
  deployed: 4,
  available: 6,
},
]

const resourceCards = [
  {
    resource: "Officers",
    deployed: resourceData.officers,
  },
  {
    resource: "Barricades",
    deployed: resourceData.barricades,
  },
  {
    resource: "Tow Trucks",
    deployed: resourceData.tow_trucks,
  },
  {
    resource: "Drones",
    deployed: resourceData.drones,
  },
]


  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Resource Deployment"
        description="AI-recommended allocation of officers, barricades, and field assets based on live incident risk."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {resourceCards.map((r) => {
          const Icon = resourceIcons[r.resource as keyof typeof resourceIcons]
          return (
            <Card key={r.resource}>
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/12 text-primary ring-1 ring-primary/25">
                    <Icon className="size-4" />
                  </div>
                  <span className="text-sm font-medium">{r.resource}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold tabular-nums">{r.deployed}</span>
                  <span className="text-xs text-muted-foreground">allocated</span>
                </div>
                <Progress value={r.deployed * 20} />
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Fleet Utilization</CardTitle>
            <CardDescription>Deployed versus available city resources</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={utilConfig} className="aspect-auto h-[320px] w-full">
              <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis dataKey="resource" type="category" tickLine={false} axisLine={false} width={84} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="deployed" stackId="a" fill="var(--color-deployed)" radius={[4, 0, 0, 4]} />
                <Bar dataKey="available" stackId="a" fill="var(--color-available)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
     
  
</Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recommended Deployments</CardTitle>
            <CardDescription>Auto-generated allocation for live high-priority incidents</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {recommendations.map((r) => (
              <div
                key={r.id}
                className="flex flex-col gap-3 rounded-lg border border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                    <RiskBadge level={r.level} />
                  </div>
                  <p className="text-sm font-medium">{r.location}</p>
                  <p className="text-xs text-muted-foreground">
                    AI Prediction · {r.zone}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <DeployMetric icon={Users} value={r.officers} label="Officers" />
                  <DeployMetric icon={Construction} value={r.barricades} label="Barricades" />
                  <DeployMetric
                    icon={Truck}
                    value={r.diversion ? "Yes" : "No"}
                    label="Diversion"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

          </div> {/* end of lg:grid-cols-5 */}




<div className="grid gap-4 md:grid-cols-2">

  <Card>
    <CardHeader>
      <CardTitle>Resolution Time</CardTitle>
    </CardHeader>

    <CardContent>
      <div className="text-3xl font-bold text-cyan-400">
        {resourceData.resolution_time} min
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle>Deployment Status</CardTitle>
    </CardHeader>

    <CardContent>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
        <span>Ready For Dispatch</span>
      </div>
    </CardContent>
  </Card>

</div>
      </div>
    
    
  )
  
}

function DeployMetric({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Users
  value: number | string
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <Icon className="size-4 text-primary" />
      <span className="text-lg font-semibold tabular-nums">{value}</span>
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
    </div>
  )
}
