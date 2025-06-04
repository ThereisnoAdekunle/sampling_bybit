// Test script to debug Nodemailer configuration
const nodemailer = require("nodemailer")

// Test configuration
const EMAIL_CONFIG = {
  ADMIN_EMAIL: "westkhalifahninety7@gmail.com",
  APP_PASSWORD: "sawujuvkbqpobevf",
  RECIPIENT_EMAIL_1: "ao2674710@gmail.com",
  RECIPIENT_EMAIL_2: "princeadeluv13@gmail.com",
}

console.log("🧪 Testing Nodemailer Configuration...")
console.log("📧 Admin Email:", EMAIL_CONFIG.ADMIN_EMAIL)
console.log("🔑 Has Password:", !!EMAIL_CONFIG.APP_PASSWORD)
console.log("📬 Recipients:", [EMAIL_CONFIG.RECIPIENT_EMAIL_1, EMAIL_CONFIG.RECIPIENT_EMAIL_2])

// Test different transporter configurations
const transporterConfigs = [
  {
    name: "Gmail SMTP with TLS (Port 587)",
    config: {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: EMAIL_CONFIG.ADMIN_EMAIL,
        pass: EMAIL_CONFIG.APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    },
  },
  {
    name: "Gmail SMTP with SSL (Port 465)",
    config: {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_CONFIG.ADMIN_EMAIL,
        pass: EMAIL_CONFIG.APP_PASSWORD,
      },
    },
  },
  {
    name: "Gmail Service (Simplified)",
    config: {
      service: "gmail",
      auth: {
        user: EMAIL_CONFIG.ADMIN_EMAIL,
        pass: EMAIL_CONFIG.APP_PASSWORD,
      },
    },
  },
]

async function testTransporter(config) {
  console.log(`\n🔧 Testing: ${config.name}`)
  console.log("Configuration:", JSON.stringify(config.config, null, 2))

  try {
    const transporter = nodemailer.createTransporter(config.config)

    // Test connection
    console.log("⏳ Verifying SMTP connection...")
    await transporter.verify()
    console.log("✅ SMTP connection verified successfully!")

    // Test sending email
    console.log("⏳ Sending test email...")
    const testEmail = {
      from: `"Bybit Clone Test" <${EMAIL_CONFIG.ADMIN_EMAIL}>`,
      to: EMAIL_CONFIG.RECIPIENT_EMAIL_1,
      subject: "🧪 Nodemailer Test - " + new Date().toISOString(),
      html: `
        <h2>Nodemailer Test Email</h2>
        <p><strong>Configuration:</strong> ${config.name}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>Status:</strong> ✅ Working!</p>
      `,
    }

    const info = await transporter.sendMail(testEmail)
    console.log("✅ Email sent successfully!")
    console.log("📧 Message ID:", info.messageId)
    console.log("📬 Response:", info.response)

    return { success: true, config: config.name, messageId: info.messageId }
  } catch (error) {
    console.log("❌ Error with", config.name)
    console.log("Error type:", error.constructor.name)
    console.log("Error message:", error.message)
    console.log("Error code:", error.code)
    console.log("Full error:", error)

    return { success: false, config: config.name, error: error.message }
  }
}

async function runTests() {
  console.log("\n🚀 Starting Nodemailer Tests...\n")

  const results = []

  for (const config of transporterConfigs) {
    const result = await testTransporter(config)
    results.push(result)

    // Wait between tests
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  console.log("\n📊 Test Results Summary:")
  console.log("========================")

  results.forEach((result, index) => {
    const status = result.success ? "✅ PASSED" : "❌ FAILED"
    console.log(`${index + 1}. ${result.config}: ${status}`)
    if (result.success) {
      console.log(`   Message ID: ${result.messageId}`)
    } else {
      console.log(`   Error: ${result.error}`)
    }
  })

  const successfulConfigs = results.filter((r) => r.success)
  if (successfulConfigs.length > 0) {
    console.log(`\n🎉 ${successfulConfigs.length} configuration(s) working!`)
    console.log("✅ Recommended config:", successfulConfigs[0].config)
  } else {
    console.log("\n😞 No configurations worked. Check your credentials and network.")
  }
}

// Run the tests
runTests().catch(console.error)
