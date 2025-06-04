import { type NextRequest, NextResponse } from "next/server"
import * as nodemailer from "nodemailer"

export const runtime = "nodejs"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL || "westkhalifahninety7@gmail.com",
    pass: process.env.APP_PASSWORD || "sawujuvkbqpobevf",
  },
  logger: true,
  debug: true,
})

export async function POST(request: NextRequest) {
  try {
    const { testType } = await request.json()

    console.log(`🧪 Running delivery test: ${testType}`)

    const results = []

    if (testType === "self") {
      // Test sending to sender's own email
      const info = await transporter.sendMail({
        from: `"Bybit Clone" <${process.env.ADMIN_EMAIL || "westkhalifahninety7@gmail.com"}>`,
        to: process.env.ADMIN_EMAIL || "westkhalifahninety7@gmail.com",
        subject: "🧪 Self-Test - " + new Date().toISOString(),
        html: `
          <h2>✅ Gmail Self-Test Successful</h2>
          <p>If you receive this, Gmail sending is working!</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        `,
      })

      results.push({
        recipient: process.env.ADMIN_EMAIL || "westkhalifahninety7@gmail.com",
        success: true,
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
      })
    } else if (testType === "external") {
      // Test sending to external emails
      const recipients = [
        process.env.RECIPIENT_EMAIL_1 || "ao2674710@gmail.com",
        process.env.RECIPIENT_EMAIL_2 || "princeadeluv13@gmail.com",
      ]

      for (const email of recipients) {
        try {
          const info = await transporter.sendMail({
            from: `"Bybit Clone Test" <${process.env.ADMIN_EMAIL || "westkhalifahninety7@gmail.com"}>`,
            to: email,
            subject: "🔍 Delivery Test - " + new Date().toISOString(),
            html: `
              <div style="border: 2px solid #f7931a; padding: 20px;">
                <h2 style="color: #f7931a;">📧 Email Delivery Test</h2>
                <p><strong>Recipient:</strong> ${email}</p>
                <p><strong>Sent:</strong> ${new Date().toISOString()}</p>
                <div style="background: #ffe8e8; padding: 10px; margin: 10px 0;">
                  <p><strong>⚠️ If you don't see this email:</strong></p>
                  <ul>
                    <li>Check spam/junk folder</li>
                    <li>Check Gmail promotions tab</li>
                    <li>Email might be delayed</li>
                  </ul>
                </div>
              </div>
            `,
          })

          results.push({
            recipient: email,
            success: true,
            messageId: info.messageId,
            accepted: info.accepted,
            rejected: info.rejected,
            response: info.response,
          })

          console.log(`✅ Sent to ${email}:`, info.messageId)
        } catch (error: any) {
          results.push({
            recipient: email,
            success: false,
            error: error.message || "Unknown error occurred",
          })

          console.log(`❌ Failed to send to ${email}:`, error.message || "Unknown error")
        }

        // Wait between emails
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    return NextResponse.json({
      success: true,
      testType,
      results,
      timestamp: new Date().toISOString(),
      troubleshooting: {
        checkSpamFolder: "Emails might be in spam/junk folder",
        checkGmailTabs: "Check Gmail Promotions/Social tabs",
        checkSentFolder: "Verify emails appear in Gmail Sent folder",
        tryDifferentProvider: "Test with Yahoo/Outlook email",
      },
    })
  } catch (error: any) {
    console.error("Delivery test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
