console.log("🧪 Starting Simple Nodemailer Test...")

// Test if we can import nodemailer
try {
  const nodemailer = require("nodemailer")
  console.log("✅ Nodemailer imported successfully")

  // Test configuration
  const config = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "westkhalifahninety7@gmail.com",
      pass: "sawujuvkbqpobevf",
    },
  }

  console.log("📧 Creating transporter...")
  const transporter = nodemailer.createTransporter(config)

  console.log("⏳ Testing SMTP connection...")

  // Test the connection
  transporter.verify((error, success) => {
    if (error) {
      console.log("❌ SMTP Connection Failed:")
      console.log("Error:", error.message)
      console.log("Code:", error.code)
    } else {
      console.log("✅ SMTP Connection Successful!")
      console.log("Server is ready to take our messages")

      // Try sending a test email
      const mailOptions = {
        from: '"Bybit Test" <westkhalifahninety7@gmail.com>',
        to: "ao2674710@gmail.com",
        subject: "🧪 Test Email from v0",
        text: "This is a test email sent from v0 interface!",
        html: "<h1>Test Email</h1><p>This email was sent successfully from v0!</p>",
      }

      console.log("📤 Sending test email...")

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("❌ Email Send Failed:")
          console.log("Error:", error.message)
        } else {
          console.log("✅ Email Sent Successfully!")
          console.log("Message ID:", info.messageId)
          console.log("Response:", info.response)
        }
      })
    }
  })
} catch (error) {
  console.log("❌ Failed to import or use nodemailer:")
  console.log("Error:", error.message)
}
