import { Suspense } from "react"
import { ResourceClient } from "@/components/resource-client"

export default function ResourcesPage() {
  return (
    <Suspense fallback={<div>Loading Resources...</div>}>
      <ResourceClient />
    </Suspense>
  )
}