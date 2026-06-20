"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  TrendingUp,
  Flame,
  BarChart3,
  FlaskConical,
  Truck,
  FileText,
  Settings,
  Radar,
  Activity,
  Brain,
} from "lucide-react"
import { cn } from "@/lib/utils"

const nav = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Congestion Prediction", href: "/prediction", icon: TrendingUp },
  { label: "Traffic Hotspots", href: "/hotspots", icon: Flame },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "What-If Simulator", href: "/simulator", icon: FlaskConical },
  { label: "Resource Deployment", href: "/resources", icon: Truck },
  {
  label: "AI Recommendations",
  href: "/recommendations",
  icon: Brain,
},
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
  <img
    src="/traffic.png"
    alt="TrafficTwin AI"
    className="h-10 w-10 rounded-lg object-cover"
  />

  <div className="flex flex-col leading-tight">
    <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
      TrafficTwin <span className="text-primary">AI</span>
    </span>
    <span className="text-[11px] text-muted-foreground">
      Operations Command
    </span>
  </div>
</div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {nav.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <Icon className={cn("size-[18px]", active && "text-primary")} />
              <span className="truncate">{item.label}</span>
              {active && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/40 px-3 py-3">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-success" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="flex items-center gap-1.5 text-xs font-medium text-sidebar-foreground">
              <Activity className="size-3 text-success" /> Live Feed Online
            </span>
            <span className="text-[11px] text-muted-foreground">Last sync 2s ago</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
