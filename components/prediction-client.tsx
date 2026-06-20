"use client"

import { useState } from "react"
import { Ban, Users, Construction, Route, Clock, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { RiskBadge } from "@/components/stat-card"
import {
  DAYS,
  EVENT_CAUSES,
  EVENT_TYPES,
  MONTHS,
  type EventCause,
  type EventType,
} from "@/lib/traffic-data"
import { cn } from "@/lib/utils"

export function PredictionClient() {
  const [type, setType] = useState<EventType>("Unplanned")
  const [cause, setCause] = useState<EventCause>("Accident")
  const [lat, setLat] = useState("12.9756")
  const [lng, setLng] = useState("77.6101")
  const [hour, setHour] = useState("18")
  const [day, setDay] = useState<string>("Monday")
  const [month, setMonth] = useState<string>("June")

  const [zone, setZone] = useState("")
const [corridor, setCorridor] = useState("")
const [policeStation, setPoliceStation] = useState("")
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [result, setResult] = useState({
    closureProbability: 0,
    riskScore: 0,
    level: "Low" as "Low" | "Medium" | "High",
    officers: 0,
    barricades: 0,
    diversion: false,
    resolution: 0,
  })

  const [ran, setRan] = useState(false)

  async function run() {
    try {
      setLoading(true)

      const dayMap: Record<string, number> = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 7,
      }

      const monthMap: Record<string, number> = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12,
      }

      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({
  event_type: type.toLowerCase(),
  event_cause: cause.toLowerCase(),

  zone,
  corridor,
  police_station: policeStation,

  latitude: parseFloat(lat),
  longitude: parseFloat(lng),

  hour: parseInt(hour),
  day: dayMap[day],
  month: monthMap[month],
}),
        }
      )
const data = await response.json()
if (!response.ok) {
  console.error(data)
  alert(data.error || "Prediction failed")
  return
}

console.log("Prediction Response:", data)

if (data.error) {
  alert(data.error)
  return
}

setResult({
  closureProbability: Number(data.probability ?? 0),
  riskScore: Number(data.probability ?? 0),

  level:
    data.risk === "HIGH"
      ? "High"
      : data.risk === "MEDIUM"
      ? "Medium"
      : "Low",

  officers: Number(data.officers ?? 0),
  barricades: Number(data.barricades ?? 0),
  diversion: data.diversion === "YES",
  resolution: Number(data.resolution_time ?? 0),
})
      setRan(true)
    } catch (error) {
      console.error(error)
      alert("Prediction failed")
    } finally {
      setLoading(false)
    }
  }

  const ringColor =
    result.level === "High"
      ? "text-destructive"
      : result.level === "Medium"
      ? "text-warning"
      : "text-success"

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Congestion Prediction"
        description="Forecast road-closure probability and risk severity using the TrafficTwin AI model."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-base">
              Event Parameters
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <FieldGroup>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Event Type</FieldLabel>

                  <Select
                    value={type}
                    onValueChange={(v) => setType(v as EventType)}
                  >
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

                  <Select
                    value={cause}
                    onValueChange={(v) => setCause(v as EventCause)}
                  >
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
              </div>
              <Field>
  <FieldLabel>Zone</FieldLabel>
  <Input
    value={zone}
    onChange={(e) => setZone(e.target.value)}
    placeholder="North Zone 1"
  />
</Field>

<Field>
  <FieldLabel>Corridor</FieldLabel>
  <Input
    value={corridor}
    onChange={(e) => setCorridor(e.target.value)}
    placeholder="ORR North 1"
  />
</Field>

<Field>
  <FieldLabel>Police Station</FieldLabel>
  <Input
    value={policeStation}
    onChange={(e) => setPoliceStation(e.target.value)}
    placeholder="Hebbal PS"
  />
</Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Latitude</FieldLabel>
                  <Input
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel>Longitude</FieldLabel>
                  <Input
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel>
                  Hour of Day ({hour}:00)
                </FieldLabel>

                <Select
  value={hour}
  onValueChange={(value: string) => setHour(value)}
>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {Array.from({ length: 24 }).map((_, h) => (
                        <SelectItem
                          key={h}
                          value={String(h)}
                        >
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

                  <Select
  value={day}
  onValueChange={(value: string) => setDay(value)}
>
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
                  <Select
  value={month}
  onValueChange={(value: string) => setMonth(value)}
>
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
  <Sparkles className="mr-2 h-4 w-4" />
  {loading ? "Predicting..." : "Run Prediction"}
</Button>

{ran && (
  <Button
    variant="outline"
    className="mt-2 w-full"
    onClick={() => {
      const dayMap: Record<string, number> = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 7,
      }

      const monthMap: Record<string, number> = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12,
      }

      router.push(
  `/resources?event_type=${type.toLowerCase()}
  &event_cause=${cause.toLowerCase()}
  &zone=Central Zone 1
  &corridor=Non-corridor
  &police_station=Shivajinagar PS
  &lat=${lat}
  &lng=${lng}
  &hour=${hour}
  &day=${dayMap[day]}
  &month=${monthMap[month]}`
    .replace(/\s+/g, "")
)
    }}
  >
    View Resource Plan
  </Button>
)}

            </FieldGroup>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6 lg:col-span-3">

          <Card
            className={cn(
              "border-l-4",
              result.level === "High" && "border-l-destructive",
              result.level === "Medium" && "border-l-warning",
              result.level === "Low" && "border-l-success",
            )}
          >
            <CardHeader className="border-b border-border">
              <CardTitle className="text-base">
                Prediction Output
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">

                <div className="flex justify-center">
                  <div className="relative flex size-32 items-center justify-center">

                    <svg
                      className="size-32 -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="var(--muted)"
                        strokeWidth="8"
                      />

                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(result.closureProbability / 100) * 264} 264`}
                        className={ringColor}
                      />
                    </svg>

                    <div className="absolute text-center">
                      <div className="text-3xl font-bold">
                        {result.closureProbability}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        closure prob.
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">
                    Risk Score
                  </div>

                  <div className="text-4xl font-bold">
                    {result.riskScore}
                  </div>

                  <Progress
                    value={result.riskScore}
                    className="mt-2"
                  />
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">
                    Risk Level
                  </div>

                  <RiskBadge level={result.level} />
                </div>

              </div>

            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

            <RecCard
              icon={Users}
              label="Officers Required"
              value={String(result.officers)}
              accent="primary"
            />

            <RecCard
              icon={Construction}
              label="Barricades"
              value={String(result.barricades)}
              accent="warning"
            />

            <RecCard
              icon={Route}
              label="Diversion Needed"
              value={result.diversion ? "Yes" : "No"}
              accent={
                result.diversion
                  ? "destructive"
                  : "success"
              }
            />

            <RecCard
              icon={Clock}
              label="Est. Resolution"
              value={`${result.resolution}m`}
              accent="primary"
            />

          </div>
        </div>
      </div>
    </div>
  )
}

function RecCard({
  icon: Icon,
  label,
  value,
  accent,
}: any) {
  const map = {
    primary: "bg-primary/12 text-primary ring-primary/25",
    warning: "bg-warning/12 text-warning ring-warning/25",
    destructive:
      "bg-destructive/12 text-destructive ring-destructive/25",
    success: "bg-success/12 text-success ring-success/25",
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4">
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-lg ring-1",
            map[accent]
          )}
        >
          <Icon className="size-[18px]" />
        </div>

        <div>
          <div className="text-2xl font-semibold">
            {value}
          </div>

          <div className="text-xs text-muted-foreground">
            {label}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}