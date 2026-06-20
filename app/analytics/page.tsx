import { PageHeader } from "@/components/app-shell"
import { AnalyticsCharts } from "@/components/analytics-charts"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Analytics Center"
        description="Deep-dive analytics across event causes, timing, and seasonal patterns to inform long-term traffic strategy."
      />
      <AnalyticsCharts />
    </div>
  )
}
