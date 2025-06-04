console.log("🔗 Testing Gmail SMTP Connection...")

const nodemailer = require("nodemailer")

// Different configurations to test
const configs = [
  {
    name: "Gmail TLS (Port 587)",
    config: {
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
    },
  },
  {
    name: "Gmail SSL (Port 465)",
    config: {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "westkhalifahninety7@gmail.com",
        pass: "sawujuvkbqpobevf",
      },
    },
  },
  {
    name: "Gmail Service",
    config: {
      service: "gmail",
      auth: {
        user: "westkhalifahninety7@gmail.com",
        pass: "sawujuvkbqpobevf",
      },
    },
  },
]

async function testConfig(configData) {
  console.log(`\n🧪 Testing: ${configData.name}`)

  try {
    const transporter = nodemailer.createTransporter(configData.config)

    // Test connection
    console.log("⏳ Verifying connection...")
    await transporter.verify()
    console.log("✅ Connection verified!")

    // Test sending email
    console.log("📤 Sending test email...")
    const info = await transporter.sendMail({
      from: '"Bybit Clone Test" <westkhalifahninety7@gmail.com>',
      to: "ao2674710@gmail.com",
      subject: `Test from ${configData.name} - ${new Date().toISOString()}`,
      html: `
        <h2>✅ Success!</h2>
        <p><strong>Configuration:</strong> ${configData.name}</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        <p>This email configuration is working!</p>
      `,
    })

    console.log("✅ Email sent successfully!")
    console.log("Message ID:", info.messageId)
    return { success: true, config: configData.name }
  } catch (error) {
    console.log("❌ Failed:")
    console.log("Error:", error.message)
    console.log("Code:", error.code)
    return { success: false, config: configData.name, error: error.message }
  }
}

// Test all configurations
async function runAllTests() {
  console.log("🚀 Starting all configuration tests...\n")

  const results = []

  for (const config of configs) {
    const result = await testConfig(config)
    results.push(result)

    // Wait 2 seconds between tests
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  console.log("\n📊 FINAL RESULTS:")
  console.log("==================")

  results.forEach((result, index) => {
    const status = result.success ? "✅ WORKING" : "❌ FAILED"
    console.log(`${index + 1}. ${result.config}: ${status}`)
    if (!result.success) {
      console.log(`   Error: ${result.error}`)
    }
  })

  const workingConfigs = results.filter((r) => r.success)
  if (workingConfigs.length > 0) {
    console.log(`\n🎉 SUCCESS! ${workingConfigs.length} configuration(s) working!`)
    console.log("✅ Use this config:", workingConfigs[0].config)
  } else {
    console.log("\n😞 No configurations worked. Check your Gmail settings.")
  }
}

runAllTests().catch(console.error)
