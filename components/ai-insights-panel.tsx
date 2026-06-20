import { Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RiskBadge } from "@/components/stat-card"
import { aiInsights } from "@/lib/traffic-data"

export function AiInsightsPanel({ compact = false }: { compact?: boolean }) {
  const items = compact ? aiInsights.slice(0, 3) : aiInsights
  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-center gap-3 border-b border-border">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
          <Sparkles className="size-[18px] text-primary" />
        </div>
        <div className="flex flex-col">
          <CardTitle className="text-base">TrafficTwin Intelligence</CardTitle>
          <span className="text-xs text-muted-foreground">
            AI-generated operational insights
          </span>
        </div>
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
          <span className="size-1.5 rounded-full bg-success" />
          Live
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 p-4">
        {items.map((insight) => (
          <div
            key={insight.id}
            className="rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:border-primary/30"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-sm font-medium">{insight.title}</span>
              <RiskBadge level={insight.severity} />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {insight.body}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <Progress value={insight.confidence} className="h-1.5" />
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {insight.confidence}% conf.
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
