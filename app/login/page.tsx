"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    const user = JSON.parse(localStorage.getItem("trafficUser") || "{}");

    if (email === user.email && password === user.password) {
      localStorage.setItem("loggedIn", "true")
localStorage.setItem("officerName", user.name)
router.push("/dashboard")
    } else {
      alert("Invalid Credentials");
    }
  };

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

          <p className="text-muted-foreground">Create Officer Account</p>
        </CardHeader>

        <CardContent className="space-y-4">
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

          <Button className="w-full" onClick={login}>
            Login
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <span
              className="cursor-pointer text-primary"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
