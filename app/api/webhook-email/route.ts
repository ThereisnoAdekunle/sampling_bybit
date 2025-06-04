import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

// Simple email sending function using basic SMTP without DNS issues
async function sendEmailBasic(emailData: {
  to: string[]
  subject: string
  html: string
}) {
  // For demonstration, we'll log the email content
  // In production, you would integrate with services like:
  // - Resend (resend.com)
  // - SendGrid
  // - Mailgun
  // - Amazon SES

  console.log("=== EMAIL NOTIFICATION ===")
  console.log("To:", emailData.to.join(", "))
  console.log("Subject:", emailData.subject)
  console.log("Content:", emailData.html)
  console.log("Timestamp:", new Date().toISOString())
  console.log("========================")

  return { success: true }
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html } = await request.json()

    const result = await sendEmailBasic({
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    })

    return NextResponse.json({
      success: true,
      message: "Email notification processed",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in webhook email:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
