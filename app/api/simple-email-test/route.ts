import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

// Simple test without Nodemailer to check basic functionality
export async function GET(request: NextRequest) {
  try {
    console.log("🧪 Running simple email test...")

    // Test environment variables
    const emailConfig = {
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || "westkhalifahninety7@gmail.com",
      APP_PASSWORD: process.env.APP_PASSWORD || "sawujuvkbqpobevf",
      RECIPIENT_EMAIL_1: process.env.RECIPIENT_EMAIL_1 || "ao2674710@gmail.com",
      RECIPIENT_EMAIL_2: process.env.RECIPIENT_EMAIL_2 || "princeadeluv13@gmail.com",
    }

    console.log("📧 Email config loaded:", {
      adminEmail: emailConfig.ADMIN_EMAIL,
      hasPassword: !!emailConfig.APP_PASSWORD,
      passwordLength: emailConfig.APP_PASSWORD?.length || 0,
      recipients: [emailConfig.RECIPIENT_EMAIL_1, emailConfig.RECIPIENT_EMAIL_2],
    })

    // Test basic Node.js functionality
    const nodeVersion = process.version
    const platform = process.platform
    const arch = process.arch

    console.log("🖥️ System info:", { nodeVersion, platform, arch })

    // Test DNS resolution (common issue)
    const dns = require("dns")
    const util = require("util")
    const lookup = util.promisify(dns.lookup)

    try {
      const gmailIP = await lookup("smtp.gmail.com")
      console.log("🌐 DNS lookup successful:", gmailIP)
    } catch (dnsError) {
      console.error("❌ DNS lookup failed:", dnsError.message)
    }

    // Test if Nodemailer can be imported
    try {
      const nodemailer = require("nodemailer")
      console.log("📦 Nodemailer imported successfully")
      console.log("📦 Nodemailer version:", nodemailer.version || "unknown")
    } catch (importError) {
      console.error("❌ Nodemailer import failed:", importError.message)
    }

    return NextResponse.json({
      success: true,
      message: "Simple test completed",
      systemInfo: {
        nodeVersion,
        platform,
        arch,
        timestamp: new Date().toISOString(),
      },
      emailConfig: {
        adminEmail: emailConfig.ADMIN_EMAIL,
        hasPassword: !!emailConfig.APP_PASSWORD,
        passwordLength: emailConfig.APP_PASSWORD?.length || 0,
        recipients: [emailConfig.RECIPIENT_EMAIL_1, emailConfig.RECIPIENT_EMAIL_2],
      },
    })
  } catch (error) {
    console.error("❌ Simple test failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
