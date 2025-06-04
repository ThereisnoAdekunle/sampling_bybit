console.log("🔍 Debugging Email Delivery Issues...")

const nodemailer = require("nodemailer")

// Test with detailed logging
const transporter = nodemailer.createTransporter({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "westkhalifahninety7@gmail.com",
    pass: "sawujuvkbqpobevf",
  },
  tls: {
    rejectUnauthorized: false,
  },
  // Enable detailed logging
  logger: true,
  debug: true,
})

async function testEmailDelivery() {
  try {
    console.log("📧 Testing email delivery with detailed logging...")

    // Test different recipient emails
    const testEmails = [
      "ao2674710@gmail.com", // Original recipient 1
      "princeadeluv13@gmail.com", // Original recipient 2
      "westkhalifahninety7@gmail.com", // Send to sender (should work)
    ]

    for (const email of testEmails) {
      console.log(`\n📤 Sending test email to: ${email}`)

      const mailOptions = {
        from: '"Bybit Clone Debug" <westkhalifahninety7@gmail.com>',
        to: email,
        subject: `🔍 Delivery Test - ${new Date().toISOString()}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #f7931a;">
            <h2 style="color: #f7931a;">📧 Email Delivery Test</h2>
            <div style="background: #f0f0f0; padding: 15px; margin: 10px 0;">
              <p><strong>Recipient:</strong> ${email}</p>
              <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
              <p><strong>From:</strong> westkhalifahninety7@gmail.com</p>
              <p><strong>Test ID:</strong> ${Math.random().toString(36).substring(7)}</p>
            </div>
            <div style="background: #e8f5e8; padding: 15px; margin: 10px 0;">
              <h3>✅ If you see this email:</h3>
              <ul>
                <li>Email delivery is working</li>
                <li>Check spam/junk folder for other emails</li>
                <li>Gmail settings are correct</li>
              </ul>
            </div>
            <div style="background: #ffe8e8; padding: 15px; margin: 10px 0;">
              <h3>❌ If you don't see other emails:</h3>
              <ul>
                <li>They might be in spam folder</li>
                <li>Gmail might be rate limiting</li>
                <li>Recipient email might be wrong</li>
              </ul>
            </div>
            <p style="color: #666; font-size: 12px;">
              This is a delivery test from Bybit Clone Debug System
            </p>
          </div>
        `,
      }

      try {
        const info = await transporter.sendMail(mailOptions)
        console.log(`✅ Email sent to ${email}`)
        console.log("Message ID:", info.messageId)
        console.log("Response:", info.response)
        console.log("Envelope:", info.envelope)
        console.log("Accepted:", info.accepted)
        console.log("Rejected:", info.rejected)
        console.log("Pending:", info.pending)

        // Check if email was actually accepted
        if (info.accepted && info.accepted.length > 0) {
          console.log("✅ Email was ACCEPTED by Gmail server")
        } else {
          console.log("❌ Email was NOT accepted by Gmail server")
        }

        if (info.rejected && info.rejected.length > 0) {
          console.log("❌ Email was REJECTED:", info.rejected)
        }
      } catch (error) {
        console.log(`❌ Failed to send to ${email}:`, error.message)
      }

      // Wait between emails to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }

    console.log("\n📊 Delivery Test Complete!")
    console.log("🔍 Next steps:")
    console.log("1. Check your Gmail inbox for test emails")
    console.log("2. Check spam/junk folder")
    console.log("3. Check Gmail sent folder to confirm emails were sent")
    console.log("4. Try sending to a different email provider (Yahoo, Outlook)")
  } catch (error) {
    console.log("❌ Delivery test failed:", error.message)
  }
}

testEmailDelivery()
