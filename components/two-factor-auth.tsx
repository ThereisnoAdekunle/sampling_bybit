"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield } from "lucide-react"

interface TwoFactorAuthProps {
  onBack: () => void
  onVerify: (code: string) => void
  isLoading: boolean
}

export function TwoFactorAuth({ onBack, onVerify, isLoading }: TwoFactorAuthProps) {
  const [code, setCode] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length === 6) {
      onVerify(code)
    }
  }

  const handleCodeChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, "").slice(0, 6)
    setCode(numericValue)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>Enter the 6-digit code from your authenticator app</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="000000"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="text-center text-2xl tracking-widest"
              maxLength={6}
              required
            />
            <p className="text-xs text-muted-foreground text-center">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={code.length !== 6 || isLoading}>
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </form>

        <div className="space-y-2">
          <Button variant="ghost" className="w-full" onClick={onBack} disabled={isLoading}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>

          <div className="text-center">
            <Button variant="link" className="text-sm">
              Didn't receive a code? Resend
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
