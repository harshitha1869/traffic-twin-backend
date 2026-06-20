import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { TooltipProvider } from "@/components/ui/tooltip"
import LayoutWrapper from "@/components/layout-wrapper"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "TrafficTwin AI — Traffic Operations Command Center",
  description:
    "AI-powered traffic operations command center for smart cities and traffic police departments. Predict congestion, manage hotspots, and deploy resources in real time.",

  generator: "TrafficTwin AI",

  icons: {
    icon: "/traffic.png",
    apple: "/traffic.png",
  },
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0b1220",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <TooltipProvider delayDuration={200}>
  <LayoutWrapper>
    {children}
  </LayoutWrapper>
</TooltipProvider>

        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}