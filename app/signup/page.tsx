"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignupPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const signup = () => {
    localStorage.setItem(
      "trafficUser",
      JSON.stringify({
        name,
        email,
        password,
      })
    )

    alert("Officer Account Created")
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-[420px]">
        <CardHeader className="text-center">
          <img
            src="/traffic.png"
            alt="TrafficTwin AI"
            className="mx-auto h-16 w-16 object-contain mb-3"
          />

          <CardTitle className="text-3xl">
            TrafficTwin <span className="text-cyan-400">AI</span>
          </CardTitle>

          <p className="text-muted-foreground">
            Create Officer Account
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Officer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Officer Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            className="w-full"
            onClick={signup}
          >
            Create Account
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <span
              className="cursor-pointer text-primary"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}