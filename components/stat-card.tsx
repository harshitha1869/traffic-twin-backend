import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { RiskLevel } from "@/lib/traffic-data"

export function StatCard({
  label,
  value,
  delta,
  trend,
  hint,
  icon: Icon,
  accent = "primary",
}: {
  label: string
  value: string
  delta?: string
  trend?: "up" | "down"
  hint?: string
  icon: LucideIcon
  accent?: "primary" | "success" | "warning" | "destructive"
}) {
  const accentMap = {
    primary: "bg-primary/12 text-primary ring-primary/25",
    success: "bg-success/12 text-success ring-success/25",
    warning: "bg-warning/12 text-warning ring-warning/25",
    destructive: "bg-destructive/12 text-destructive ring-destructive/25",
  }
  const TrendIcon = trend === "down" ? ArrowDownRight : ArrowUpRight
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-lg ring-1",
              accentMap[accent],
            )}
          >
            <Icon className="size-[18px]" />
          </div>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            {value}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {delta && (
            <Badge
              variant="secondary"
              className={cn(
                "gap-0.5 px-1.5 font-mono text-[11px]",
                trend === "down" ? "text-success" : "text-warning",
              )}
            >
              <TrendIcon className="size-3" />
              {delta}
            </Badge>
          )}
          {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        </div>
      </CardContent>
    </Card>
  )
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const map = {
    Low: "bg-success/15 text-success ring-1 ring-success/25",
    Medium: "bg-warning/15 text-warning ring-1 ring-warning/25",
    High: "bg-destructive/15 text-destructive ring-1 ring-destructive/25",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        map[level],
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          level === "Low" && "bg-success",
          level === "Medium" && "bg-warning",
          level === "High" && "bg-destructive",
        )}
      />
      {level}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-destructive/15 text-destructive ring-destructive/25",
    Dispatched: "bg-primary/15 text-primary ring-primary/25",
    Monitoring: "bg-warning/15 text-warning ring-warning/25",
    Resolved: "bg-success/15 text-success ring-success/25",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1",
        map[status] ?? "bg-muted text-muted-foreground ring-border",
      )}
    >
      {status}
    </span>
  )
}
