"use client"

import { useState } from "react"
import { ArrowRight, TrendingUp, TrendingDown, Minus, FlaskConical, Users, Construction } from "lucide-react"
import { PageHeader } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RiskBadge } from "@/components/stat-card"
import {
  DAYS,
  EVENT_CAUSES,
  EVENT_TYPES,
  MONTHS,
  predictCongestion,
  type EventCause,
  type EventType,
} from "@/lib/traffic-data"
import { cn } from "@/lib/utils"

const baseline = predictCongestion({ type: "Unplanned", cause: "Congestion", hour: 12 })

export function SimulatorClient() {
  const [type, setType] = useState<EventType>("Planned")
  const [cause, setCause] = useState<EventCause>("VIP Movement")
  const [hour, setHour] = useState("18")
  const [day, setDay] = useState("Friday")
  const [month, setMonth] = useState("December")
  
 
  const [loading, setLoading] = useState(false)

const [sim, setSim] = useState({
  probability: 0,
  risk: "LOW",
  officers: 0,
  barricades: 0,
  diversion: "NO",
  resolution_time: 0,
})
const riskDelta = Number(
  (sim.probability - baseline.riskScore).toFixed(2)
)

const closureDelta = Number(
  (sim.probability - baseline.closureProbability).toFixed(2)
)
  const officerDelta = sim.officers - baseline.officers
  const barricadeDelta = sim.barricades - baseline.barricades
  const riskLevel =
  sim.risk === "HIGH"
    ? "High"
    : sim.risk === "MEDIUM"
    ? "Medium"
    : "Low"
const [result, setResult] = useState<any>(null)
 const run = async () => {
  try {
    setLoading(true)
    const response = await fetch(
      "https://traffictwin-api.onrender.com/predict",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_type: type.toLowerCase(),
         event_cause:
  cause.toLowerCase().replace(/\s+/g, "_"),

          zone: "East",
          corridor: "ORR",
          police_station: "Whitefield",

          latitude: 12.97,
          longitude: 77.59,

          hour: Number(hour),
          day: DAYS.indexOf(day) + 1,
          month: MONTHS.indexOf(month) + 1,
        }),
      }
    )

    const data = await response.json()

    console.log("PREDICTION:", data)

    
    setSim(data)
setResult(data)
  } catch (err) {
    console.error(err)
  }finally{
    setLoading(false)
  }
}


  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="What-If Simulator"
        description="Model a hypothetical event and instantly compare its projected risk against the current city baseline."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="border-b border-border">
            <CardTitle className="text-base">Simulation Inputs</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <FieldGroup>
              <Field>
                <FieldLabel>Event Type</FieldLabel>
                <Select value={type} onValueChange={(v) => setType(v as EventType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {EVENT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Event Cause</FieldLabel>
                <Select value={cause} onValueChange={(v) => setCause(v as EventCause)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {EVENT_CAUSES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Hour of Day</FieldLabel>
                <Select value={hour} onValueChange={setHour}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Array.from({ length: 24 }).map((_, h) => (
                        <SelectItem key={h} value={String(h)}>
                          {String(h).padStart(2, "0")}:00
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Day</FieldLabel>
                  <Select value={day} onValueChange={setDay}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {DAYS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Month</FieldLabel>
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {MONTHS.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Button
  onClick={run}
  disabled={loading}
  className="mt-2 w-full"
>
                <FlaskConical data-icon="inline-start" />
                Simulate Scenario
              </Button>
            </FieldGroup>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
            <CompareCard label="Current Baseline" score={baseline.riskScore} level={baseline.level} closure={baseline.closureProbability} muted />
            <div className="flex items-center justify-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
                <ArrowRight className="size-5 text-primary" />
              </div>
            </div>
            <CompareCard label="Simulated Scenario" score={sim.probability} level={riskLevel} closure={sim.probability} />
          </div>

          <Card>
            <CardHeader className="border-b border-border">
              <CardTitle className="text-base">Projected Differences</CardTitle>
            </CardHeader>
            {result && (
  <div className="p-6 space-y-4 border-b border-border">
    <h3 className="text-lg font-semibold">
      AI Prediction Result
    </h3>

      <div className="flex justify-between">
        <span>Risk Level</span>
        <span className="font-bold">
          {result.risk}
        </span>
      </div>

      <div className="flex justify-between">
        <span>Probability</span>
        <span className="font-bold">
          {result.probability}%
        </span>
      </div>

      <div className="flex justify-between">
        <span>Officers Needed</span>
        <span className="font-bold">
          {result.officers}
        </span>
      </div>

      <div className="flex justify-between">
        <span>Barricades Needed</span>
        <span className="font-bold">
          {result.barricades}
        </span>
      </div>

      <div className="flex justify-between">
        <span>Diversion Required</span>
        <span className="font-bold">
          {result.diversion}
        </span>
      </div>

      <div className="flex justify-between">
        <span>Resolution Time</span>
        <span className="font-bold">
          {result.resolution_time} mins
        </span>
      </div>
  </div>
)}
            <CardContent className="grid grid-cols-2 gap-4 pt-6 md:grid-cols-4">
              <DeltaStat label="Risk Change" value={riskDelta} suffix=" pts" />
              <DeltaStat label="Closure Prob." value={closureDelta} suffix="%" />
              <DeltaStat label="Officers" value={officerDelta} icon={Users} />
              <DeltaStat label="Barricades" value={barricadeDelta} icon={Construction} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function CompareCard({
  label,
  score,
  level,
  closure,
  muted = false,
}: {
  label: string
  score: number
  level: "Low" | "Medium" | "High"
  closure: number
  muted?: boolean
}) {
  return (
    <Card className={cn(muted && "bg-muted/30")}>
      <CardContent className="flex flex-col gap-3 p-5">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-4xl font-semibold tabular-nums">{score}</span>
        <RiskBadge level={level} />
        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Closure prob.</span>
          <span className="font-medium tabular-nums">{closure}%</span>
        </div>
      </CardContent>
    </Card>
  )
}


function DeltaStat({
  label,
  value,
  suffix = "",
  icon: Icon,
}: {
  label: string
  value: number
  suffix?: string
  icon?: typeof Users
}) {
  const positive = value > 0
  const neutral = value === 0
  const TrendIcon = neutral ? Minus : positive ? TrendingUp : TrendingDown
  const color = neutral
    ? "text-muted-foreground"
    : positive
      ? "text-destructive"
      : "text-success"
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-muted/20 p-4">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {Icon && <Icon className="size-3.5" />}
        {label}
      </div>
      <div className={cn("flex items-center gap-1.5 text-2xl font-semibold tabular-nums", color)}>
        <TrendIcon className="size-4" />
        {positive ? "+" : ""}
        {value}
        {suffix}
      </div>
    </div>
  )
}
