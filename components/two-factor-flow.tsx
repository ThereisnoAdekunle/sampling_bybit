"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, EyeOff, QrCode, Clock, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

type FlowStep = "check2fa" | "emailLogin" | "firstVerification" | "secondVerification" | "thankYou"

export default function TwoFactorFlow() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<FlowStep>("check2fa")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstCode: "",
    secondCode: "",
  })
  const [ticketId, setTicketId] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [secondTicketId, setSecondTicketId] = useState("")
  const [secondQrCode, setSecondQrCode] = useState("")

  // Generate random ticket ID and QR code
  const generateTicketData = () => {
    const ticketId = Math.random().toString(36).substring(2, 15).toUpperCase()
    const qrCode = `QR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    return { ticketId, qrCode }
  }

  // Validate first code format: 4 numbers + 2 letters
  const validateFirstCode = (code: string) => {
    const regex = /^[1-9]{4}[A-Za-z]{2}$/
    return regex.test(code)
  }

  // Validate second code format: 3 letters + 3 numbers
  const validateSecondCode = (code: string) => {
    const regex = /^[A-Za-z]{3}[1-9]{3}$/
    return regex.test(code)
  }

  const handleNo2FA = () => {
    router.push("/")
  }

  const handleYes2FA = () => {
    setCurrentStep("emailLogin")
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const { ticketId: newTicketId, qrCode: newQrCode } = generateTicketData()
    setTicketId(newTicketId)
    setQrCode(newQrCode)
    setCurrentStep("firstVerification")
    setIsLoading(false)
  }

  const handleFirstVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!validateFirstCode(formData.firstCode)) {
      alert("Invalid code format. Please enter 4 numbers (1-9) followed by 2 letters (A-Z)")
      setIsLoading(false)
      return
    }

    const { ticketId: newSecondTicketId, qrCode: newSecondQrCode } = generateTicketData()
    setSecondTicketId(newSecondTicketId)
    setSecondQrCode(newSecondQrCode)
    setCurrentStep("secondVerification")
    setIsLoading(false)
  }

  const handleSecondVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!validateSecondCode(formData.secondCode)) {
      alert("Invalid code format. Please enter 3 letters (A-Z) followed by 3 numbers (1-9)")
      setIsLoading(false)
      return
    }

    setCurrentStep("thankYou")
    setIsLoading(false)
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
              <CardTitle>Two-Factor Authentication</CardTitle>
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
              <CardTitle>Enter Your Credentials</CardTitle>
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
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Ticket ID:</p>
                <p className="font-mono text-lg font-bold">{ticketId}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">QR Code:</p>
                <p className="font-mono text-lg font-bold">{qrCode}</p>
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
                <Button type="submit" className="w-full h-12" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )

      case "secondVerification":
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Second Verification</CardTitle>
              <CardDescription>Submit your second Ticket ID to admin for final access code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Second Ticket ID:</p>
                <p className="font-mono text-lg font-bold">{secondTicketId}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Second QR Code:</p>
                <p className="font-mono text-lg font-bold">{secondQrCode}</p>
              </div>
              <form onSubmit={handleSecondVerification} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Enter 6-character access code"
                    value={formData.secondCode}
                    onChange={(e) => setFormData({ ...formData, secondCode: e.target.value.toUpperCase() })}
                    className="h-12 text-center font-mono"
                    maxLength={6}
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Final Verification"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )

      case "thankYou":
        return <ThankYouPage />

      default:
        return null
    }
  }

  return <div className="w-full max-w-md mx-auto">{renderStep()}</div>
}

function ThankYouPage() {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60) // 24 hours in seconds

  // Countdown timer
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-green-600">Verification Complete!</CardTitle>
        <CardDescription>Your account verification has been successfully completed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-primary mr-2" />
            <span className="text-2xl font-bold font-mono">{formatTime(timeLeft)}</span>
          </div>
          <p className="text-sm text-muted-foreground">Time remaining for issue resolution</p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">What happens next?</h3>
          <ul className="text-sm text-muted-foreground space-y-2 text-left">
            <li>• Your issues will be resolved within 24 hours</li>
            <li>• You will receive an email with final instructions</li>
            <li>• Please check your inbox regularly</li>
            <li>• Keep your verification codes for reference</li>
          </ul>
        </div>

        <div className="pt-4">
          <p className="text-xs text-muted-foreground">
            If you don't receive an email within 24 hours, please contact our support team.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
