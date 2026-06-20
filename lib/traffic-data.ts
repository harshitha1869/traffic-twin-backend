export type EventType = "Planned" | "Unplanned"

export type EventCause =
  | "Accident"
  | "Construction"
  | "Procession"
  | "VIP Movement"
  | "Vehicle Breakdown"
  | "Water Logging"
  | "Tree Fall"
  | "Congestion"

export type RiskLevel = "Low" | "Medium" | "High"

export type IncidentStatus = "Active" | "Monitoring" | "Resolved" | "Dispatched"

export const EVENT_CAUSES: EventCause[] = [
  "Accident",
  "Construction",
  "Procession",
  "VIP Movement",
  "Vehicle Breakdown",
  "Water Logging",
  "Tree Fall",
  "Congestion",
]

export const EVENT_TYPES: EventType[] = ["Planned", "Unplanned"]

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export interface Incident {
  id: string
  type: EventType
  cause: EventCause
  location: string
  zone: string
  lat: number
  lng: number
  riskScore: number
  status: IncidentStatus
  reportedAt: string
}

export const kpis = [
  {
    id: "events",
    label: "Total Traffic Events",
    value: "2,847",
    delta: "+12.4%",
    trend: "up" as const,
    hint: "vs last week",
    icon: "activity",
  },
  {
    id: "highrisk",
    label: "Predicted High Risk",
    value: "164",
    delta: "+8.1%",
    trend: "up" as const,
    hint: "next 24 hours",
    icon: "alert",
  },
  {
    id: "closure",
    label: "Road Closure Probability",
    value: "37%",
    delta: "-3.2%",
    trend: "down" as const,
    hint: "city average",
    icon: "ban",
  },
  {
    id: "resolution",
    label: "Avg Resolution Time",
    value: "42 min",
    delta: "-6.5%",
    trend: "down" as const,
    hint: "vs last week",
    icon: "timer",
  },
  {
    id: "hotspots",
    label: "Active Hotspots",
    value: "28",
    delta: "+4",
    trend: "up" as const,
    hint: "live now",
    icon: "flame",
  },
]

export const eventTypeDistribution = [
  { name: "Unplanned", value: 1820, fill: "var(--color-unplanned)" },
  { name: "Planned", value: 1027, fill: "var(--color-planned)" },
]

export const eventCauseDistribution = [
  { cause: "Accident", events: 642 },
  { cause: "Congestion", events: 588 },
  { cause: "Construction", events: 421 },
  { cause: "Water Logging", events: 318 },
  { cause: "Vehicle Breakdown", events: 296 },
  { cause: "VIP Movement", events: 214 },
  { cause: "Procession", events: 187 },
  { cause: "Tree Fall", events: 181 },
]

export const monthlyTrends = [
  { month: "Jan", events: 198, closures: 64 },
  { month: "Feb", events: 221, closures: 71 },
  { month: "Mar", events: 264, closures: 88 },
  { month: "Apr", events: 247, closures: 79 },
  { month: "May", events: 289, closures: 104 },
  { month: "Jun", events: 312, closures: 118 },
  { month: "Jul", events: 298, closures: 96 },
  { month: "Aug", events: 276, closures: 87 },
  { month: "Sep", events: 305, closures: 112 },
  { month: "Oct", events: 331, closures: 126 },
  { month: "Nov", events: 318, closures: 109 },
  { month: "Dec", events: 288, closures: 92 },
]

export const peakHourAnalysis = [
  { hour: "00", congestion: 12 },
  { hour: "02", congestion: 6 },
  { hour: "04", congestion: 8 },
  { hour: "06", congestion: 34 },
  { hour: "08", congestion: 92 },
  { hour: "10", congestion: 58 },
  { hour: "12", congestion: 64 },
  { hour: "14", congestion: 52 },
  { hour: "16", congestion: 71 },
  { hour: "18", congestion: 98 },
  { hour: "20", congestion: 67 },
  { hour: "22", congestion: 38 },
]

export const plannedVsUnplanned = [
  { month: "Jul", planned: 96, unplanned: 202 },
  { month: "Aug", planned: 88, unplanned: 188 },
  { month: "Sep", planned: 104, unplanned: 201 },
  { month: "Oct", planned: 121, unplanned: 210 },
  { month: "Nov", planned: 109, unplanned: 209 },
  { month: "Dec", planned: 92, unplanned: 196 },
]

export const resourceUtilization = [
  { resource: "Officers", deployed: 78, available: 22 },
  { resource: "Barricades", deployed: 64, available: 36 },
  { resource: "Tow Trucks", deployed: 41, available: 59 },
  { resource: "Drones", deployed: 33, available: 67 },
  { resource: "Patrol Cars", deployed: 71, available: 29 },
]

export const closureStats = [
  { week: "W1", probability: 31 },
  { week: "W2", probability: 38 },
  { week: "W3", probability: 44 },
  { week: "W4", probability: 36 },
  { week: "W5", probability: 49 },
  { week: "W6", probability: 41 },
]

export const incidents: Incident[] = [
  {
    id: "TT-2041",
    type: "Unplanned",
    cause: "Accident",
    location: "MG Road & Trinity Circle",
    zone: "Central Business District",
    lat: 12.9756,
    lng: 77.6101,
    riskScore: 88,
    status: "Active",
    reportedAt: "08:42",
  },
  {
    id: "TT-2042",
    type: "Planned",
    cause: "VIP Movement",
    location: "Vidhana Soudha Approach",
    zone: "Government Quarter",
    lat: 12.9794,
    lng: 77.5907,
    riskScore: 82,
    status: "Dispatched",
    reportedAt: "08:30",
  },
  {
    id: "TT-2043",
    type: "Unplanned",
    cause: "Water Logging",
    location: "Silk Board Junction",
    zone: "Outer Ring Road",
    lat: 12.9172,
    lng: 77.6228,
    riskScore: 76,
    status: "Monitoring",
    reportedAt: "08:11",
  },
  {
    id: "TT-2044",
    type: "Planned",
    cause: "Construction",
    location: "Hebbal Flyover Ramp",
    zone: "North Corridor",
    lat: 13.0358,
    lng: 77.597,
    riskScore: 64,
    status: "Monitoring",
    reportedAt: "07:55",
  },
  {
    id: "TT-2045",
    type: "Unplanned",
    cause: "Vehicle Breakdown",
    location: "Electronic City Toll",
    zone: "South Tech Belt",
    lat: 12.8452,
    lng: 77.6602,
    riskScore: 48,
    status: "Resolved",
    reportedAt: "07:32",
  },
  {
    id: "TT-2046",
    type: "Unplanned",
    cause: "Tree Fall",
    location: "Cubbon Park Road",
    zone: "Central Business District",
    lat: 12.9762,
    lng: 77.5993,
    riskScore: 39,
    status: "Resolved",
    reportedAt: "07:04",
  },
  {
    id: "TT-2047",
    type: "Planned",
    cause: "Procession",
    location: "Avenue Road Market",
    zone: "Old City",
    lat: 12.9667,
    lng: 77.578,
    riskScore: 71,
    status: "Active",
    reportedAt: "06:48",
  },
  {
    id: "TT-2048",
    type: "Unplanned",
    cause: "Congestion",
    location: "KR Puram Bridge",
    zone: "East Corridor",
    lat: 12.9991,
    lng: 77.6951,
    riskScore: 69,
    status: "Monitoring",
    reportedAt: "06:20",
  },
]

export interface Hotspot {
  rank: number
  zone: string
  area: string
  frequency: number
  riskScore: number
  lat: number
  lng: number
  trend: "up" | "down"
}

export const hotspots: Hotspot[] = [
  { rank: 1, zone: "Silk Board Junction", area: "Outer Ring Road", frequency: 412, riskScore: 94, lat: 12.9172, lng: 77.6228, trend: "up" },
  { rank: 2, zone: "KR Puram Bridge", area: "East Corridor", frequency: 388, riskScore: 91, lat: 12.9991, lng: 77.6951, trend: "up" },
  { rank: 3, zone: "Hebbal Flyover", area: "North Corridor", frequency: 356, riskScore: 88, lat: 13.0358, lng: 77.597, trend: "down" },
  { rank: 4, zone: "MG Road Circle", area: "Central Business District", frequency: 331, riskScore: 85, lat: 12.9756, lng: 77.6101, trend: "up" },
  { rank: 5, zone: "Marathahalli Bridge", area: "East Corridor", frequency: 318, riskScore: 83, lat: 12.9569, lng: 77.7011, trend: "up" },
  { rank: 6, zone: "Electronic City Toll", area: "South Tech Belt", frequency: 296, riskScore: 79, lat: 12.8452, lng: 77.6602, trend: "down" },
  { rank: 7, zone: "Tin Factory", area: "East Corridor", frequency: 274, riskScore: 76, lat: 13.0118, lng: 77.6648, trend: "up" },
  { rank: 8, zone: "Yeshwanthpur Circle", area: "North West", frequency: 251, riskScore: 72, lat: 13.0287, lng: 77.5401, trend: "down" },
  { rank: 9, zone: "Banashankari Junction", area: "South Corridor", frequency: 238, riskScore: 68, lat: 12.925, lng: 77.5468, trend: "up" },
  { rank: 10, zone: "Trinity Circle", area: "Central Business District", frequency: 221, riskScore: 64, lat: 12.9726, lng: 77.6201, trend: "down" },
]

export interface AiInsight {
  id: string
  title: string
  body: string
  confidence: number
  severity: RiskLevel
}

export const aiInsights: AiInsight[] = [
  {
    id: "ai-1",
    title: "VIP Movement Closure Risk",
    body: "VIP Movement at 6 PM on Vidhana Soudha Approach has an 82% probability of requiring a road closure. Pre-position diversion teams now.",
    confidence: 82,
    severity: "High",
  },
  {
    id: "ai-2",
    title: "Recommended Deployment",
    body: "For the Silk Board incident cluster, deploy 4 officers and 3 barricades to maintain throughput above 60%.",
    confidence: 91,
    severity: "Medium",
  },
  {
    id: "ai-3",
    title: "Expected Resolution Window",
    body: "Current accident at MG Road & Trinity Circle has an expected resolution time of 45 minutes given live tow-truck ETA.",
    confidence: 76,
    severity: "Medium",
  },
  {
    id: "ai-4",
    title: "Monsoon Water-Logging Forecast",
    body: "Rainfall models predict water logging across 6 low-lying junctions after 5 PM. Stage pumps at Silk Board and KR Puram.",
    confidence: 68,
    severity: "High",
  },
]

export function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 70) return "High"
  if (score >= 45) return "Medium"
  return "Low"
}

// Deterministic pseudo prediction so output is stable for given inputs.
export function predictCongestion(input: {
  cause: EventCause
  type: EventType
  hour: number
}) {
  const causeWeight: Record<EventCause, number> = {
    Accident: 78,
    Construction: 58,
    Procession: 66,
    "VIP Movement": 84,
    "Vehicle Breakdown": 44,
    "Water Logging": 72,
    "Tree Fall": 40,
    Congestion: 62,
  }
  const peak = input.hour >= 8 && input.hour <= 10 ? 14 : input.hour >= 17 && input.hour <= 20 ? 18 : 0
  const typeAdj = input.type === "Unplanned" ? 6 : -4
  let score = Math.min(98, Math.max(8, causeWeight[input.cause] + peak + typeAdj))
  const closureProbability = Math.min(96, Math.round(score * 0.92))
  const level = riskLevelFromScore(score)
  const officers = Math.max(1, Math.round(score / 18))
  const barricades = Math.max(0, Math.round(score / 24))
  const diversion = score >= 60
  const resolution = Math.round(20 + score * 0.45)
  return {
    riskScore: Math.round(score),
    closureProbability,
    level,
    officers,
    barricades,
    diversion,
    resolution,
  }
}
