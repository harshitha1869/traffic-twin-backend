"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import {
  Brain,
  ShieldAlert,
  Truck,
  Route,
  Sparkles,
} from "lucide-react"

const cards = [
  {
    title: "Risk Assessment",
    icon: ShieldAlert,
    description:
      "Identify congestion severity and closure probability using AI models.",
  },
  {
    title: "Resource Allocation",
    icon: Truck,
    description:
      "Recommend officers, barricades, tow trucks and drones dynamically.",
  },
  {
    title: "Diversion Planning",
    icon: Route,
    description:
      "Generate alternate traffic routes to reduce congestion impact.",
  },
]

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<string[]>([])
const [confidence, setConfidence] = useState(0)
useEffect(() => {
  fetch("http://127.0.0.1:8000/recommendations")
    .then((res) => res.json())
    .then((data) => {
      setConfidence(data.confidence)
      setRecommendations(data.recommendations)
    })
    .catch((err) => console.error(err))
}, [])
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: (i * 73) % 1200,
    y: (i * 47) % 700,
    duration: 4 + (i % 5),
  }))

  return (
    <div className="relative overflow-hidden p-6 space-y-8">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute h-1 w-1 rounded-full bg-cyan-400/40"
            initial={{
              x: particle.x,
              y: particle.y,
              opacity: 0,
            }}
            animate={{
              y: [particle.y, particle.y - 150],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              y: [0, -6, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Brain className="h-9 w-9 text-cyan-400" />
          </motion.div>

          <h1 className="text-4xl font-bold">
            AI Recommendations Engine
          </h1>
        </div>

        <p className="mt-3 text-muted-foreground text-lg">
          AI-powered traffic management recommendations and operational insights.
        </p>

        <div className="mt-4 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-400" />
          </span>

          <span className="text-cyan-400 text-sm font-medium">
            AI Engine Active
          </span>
        </div>
      </motion.div>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = card.icon

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.15,
                duration: 0.5,
              }}
              whileHover={{
                scale: 1.03,
                y: -6,
              }}
              className="
                group
                relative
                overflow-hidden
                rounded-xl
                border
                border-slate-800
                bg-slate-900/50
                p-6
                backdrop-blur-sm
                hover:border-cyan-500/40
                hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]
                transition-all
              "
            >
              {/* Scanner Effect */}
              <motion.div
                className="
                  absolute
                  inset-0
                  pointer-events-none
                  bg-gradient-to-r
                  from-transparent
                  via-cyan-500/10
                  to-transparent
                "
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <div className="relative z-10">
                <Icon className="mb-4 h-8 w-8 text-cyan-400" />

                <h2 className="text-xl font-semibold">
                  {card.title}
                </h2>

                <p className="mt-3 text-sm text-muted-foreground">
                  {card.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Confidence */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />

            <h3 className="text-xl font-semibold">
              Recommendation Confidence
            </h3>
          </div>

          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="text-7xl font-bold text-cyan-400"
          >
             {confidence}%
          </motion.div>

          <p className="mt-4 text-muted-foreground">
            AI confidence based on historical traffic patterns and
            real-time congestion intelligence.
          </p>
        </motion.div>

        {/* Live Insights */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-6"
        >
          <h3 className="mb-5 text-xl font-semibold">
            Live AI Insights
          </h3>

         <div className="space-y-4">
  {recommendations.map((item, index) => (
    <motion.div
      key={index}
      animate={{
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay: index * 0.3,
      }}
      className="
      rounded-lg
      border
      border-cyan-500/20
      bg-cyan-500/5
      p-4
      "
    >
      {item}
    </motion.div>
  ))}
</div>
        </motion.div>
      </div>
    </div>
  )
}