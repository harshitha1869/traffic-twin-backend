import { MapPin } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RiskBadge, StatusBadge } from "@/components/stat-card"
import { incidents, riskLevelFromScore, type Incident } from "@/lib/traffic-data"

export function IncidentsTable({ rows = incidents }: { rows?: Incident[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>ID</TableHead>
            <TableHead>Event Type</TableHead>
            <TableHead>Event Cause</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Risk Score</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {row.id}
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">{row.type}</span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{row.cause}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm">{row.location}</span>
                    <span className="text-[11px] text-muted-foreground">{row.zone}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-mono text-sm font-medium tabular-nums">
                  {row.riskScore}
                </span>
              </TableCell>
              <TableCell>
                <RiskBadge level={riskLevelFromScore(row.riskScore)} />
              </TableCell>
              <TableCell>
                <StatusBadge status={row.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
