console.log("📊 Checking Gmail Sending Limits and Status...")

const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: "westkhalifahninety7@gmail.com",
    pass: "sawujuvkbqpobevf",
  },
  logger: true,
  debug: true,
})

async function checkGmailStatus() {
  try {
    console.log("🔍 Checking Gmail account status...")

    // Verify connection first
    await transporter.verify()
    console.log("✅ Gmail connection verified")

    // Send a test email to the sender's own email (most likely to work)
    console.log("📤 Sending test email to sender's own email...")

    const selfTestEmail = {
      from: '"Bybit Clone" <westkhalifahninety7@gmail.com>',
      to: "westkhalifahninety7@gmail.com", // Send to self
      subject: "🧪 Self-Test Email - " + new Date().toISOString(),
      html: `
        <h2>📧 Gmail Self-Test</h2>
        <p><strong>Status:</strong> ✅ Gmail sending is working!</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        <p><strong>Account:</strong> westkhalifahninety7@gmail.com</p>
        
        <div style="background: #f0f0f0; padding: 15px; margin: 15px 0;">
          <h3>📋 Troubleshooting Info:</h3>
          <ul>
            <li>If you receive this email: Gmail sending works</li>
            <li>Check if other emails are in spam folder</li>
            <li>Gmail might have daily sending limits</li>
            <li>Try different recipient email providers</li>
          </ul>
        </div>
        
        <p style="color: #666; font-size: 12px;">
          This email confirms your Gmail SMTP is working correctly.
        </p>
      `,
    }

    const info = await transporter.sendMail(selfTestEmail)
    console.log("✅ Self-test email sent successfully!")
    console.log("Message ID:", info.messageId)
    console.log("Response:", info.response)

    // Now test with external emails
    console.log("\n📤 Testing external email delivery...")

    const externalEmails = [
      { email: "ao2674710@gmail.com", provider: "Gmail" },
      { email: "princeadeluv13@gmail.com", provider: "Gmail" },
    ]

    for (const recipient of externalEmails) {
      console.log(`\n📧 Testing delivery to ${recipient.email} (${recipient.provider})`)

      const testEmail = {
        from: '"Bybit Clone Test" <westkhalifahninety7@gmail.com>',
        to: recipient.email,
        subject: `🔍 External Delivery Test - ${recipient.provider}`,
        html: `
          <div style="border: 2px solid #f7931a; padding: 20px; font-family: Arial;">
            <h2 style="color: #f7931a;">📧 External Email Test</h2>
            <p><strong>Recipient:</strong> ${recipient.email}</p>
            <p><strong>Provider:</strong> ${recipient.provider}</p>
            <p><strong>Sent:</strong> ${new Date().toISOString()}</p>
            
            <div style="background: #ffe8e8; padding: 10px; margin: 10px 0;">
              <p><strong>⚠️ Important:</strong> If you don't see this email in your inbox:</p>
              <ul>
                <li>Check your spam/junk folder</li>
                <li>Check Gmail promotions tab</li>
                <li>Email might be delayed</li>
              </ul>
            </div>
            
            <p>Please confirm receipt of this test email.</p>
          </div>
        `,
      }

      try {
        const info = await transporter.sendMail(testEmail)
        console.log(`✅ Sent to ${recipient.email}`)
        console.log("Accepted:", info.accepted)
        console.log("Rejected:", info.rejected)

        if (info.rejected && info.rejected.length > 0) {
          console.log("❌ Email was rejected by server")
        }
      } catch (error) {
        console.log(`❌ Failed to send to ${recipient.email}:`, error.message)
      }

      // Wait to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 5000))
    }

    console.log("\n📋 Gmail Limits Information:")
    console.log("• Gmail allows 500 emails per day for regular accounts")
    console.log("• 100 emails per hour limit")
    console.log("• Emails to same domain might be rate limited")
    console.log("• New accounts have stricter limits")
    console.log("\n🔍 Check these locations for missing emails:")
    console.log("1. Spam/Junk folder")
    console.log("2. Gmail Promotions tab")
    console.log("3. Gmail Sent folder (to confirm they were sent)")
    console.log("4. Try sending to different email providers")
  } catch (error) {
    console.log("❌ Gmail status check failed:", error.message)
  }
}

checkGmailStatus()
