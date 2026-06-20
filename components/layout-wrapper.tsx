"use client"

import { usePathname } from "next/navigation"
import { AppShell } from "@/components/app-shell"

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (
    pathname === "/login" ||
    pathname === "/signup"
  ) {
    return <>{children}</>
  }

  return <AppShell>{children}</AppShell>
}