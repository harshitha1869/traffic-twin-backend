"use client"

import { useEffect, useState } from "react"
import { Search, Bell, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group"

function useClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return now
}

export function Topbar() {
  const now = useClock()
  const [officerName, setOfficerName] = useState("Cmdr. R. Khanna")

useEffect(() => {
  const storedName = localStorage.getItem("officerName")

  if (storedName) {
    setOfficerName(storedName)
  }
}, [])

  const date = now?.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
  const time = now?.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border glass px-4 md:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="size-5" />
        <span className="sr-only">Toggle navigation</span>
      </Button>

      <div className="hidden flex-col leading-tight sm:flex">
        <span className="text-sm font-semibold tracking-tight">{date ?? "—"}</span>
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {time ?? "--:--:--"} IST
        </span>
      </div>

      <div className="ml-auto w-full max-w-xs">
        <InputGroup>
          <InputGroupInput placeholder="Search zones, events, IDs..." />
          <InputGroupAddon>
            <Search className="size-4 text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <Button variant="ghost" size="icon" className="relative shrink-0">
        <Bell className="size-5" />
        <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive ring-2 ring-background" />
        <span className="sr-only">Notifications</span>
      </Button>

      <div className="flex shrink-0 items-center gap-3 border-l border-border pl-3">
        <Avatar className="size-9">
         <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
  {officerName?.charAt(0).toUpperCase()}
</AvatarFallback>
        </Avatar>
        <div className="hidden flex-col leading-tight md:flex">
          <span className="text-sm font-medium">{officerName}</span>
          <span className="text-[11px] text-muted-foreground">Traffic Control · HQ</span>
        </div>
      </div>
      <Button
  variant="outline"
  size="sm"
  onClick={() => {
    localStorage.removeItem("loggedIn")
    localStorage.removeItem("officerName")
    window.location.href = "/login"
  }}
>
  Logout
</Button>
    </header>

    
  )
}
