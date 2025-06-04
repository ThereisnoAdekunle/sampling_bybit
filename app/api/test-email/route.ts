import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Test email configurations
const EMAIL_CONFIG = {
  ADMIN_EMAIL: "westkhalifahninety7@gmail.com",
  APP_PASSWORD: "sawujuvkbqpobevf",
  RECIPIENT_EMAIL_1: "ao2674710@gmail.com",
  RECIPIENT_EMAIL_2: "princeadeluv13@gmail.com",
}

const TRANSPORTER_CONFIGS = [
  {
    name: "Gmail TLS (Port 587)",
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
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
    },
  },
  {
    name: "Gmail SSL (Port 465)",
    config: {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_CONFIG.ADMIN_EMAIL,
        pass: EMAIL_CONFIG.APP_PASSWORD,
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
    },
  },
  {
    name: "Gmail Service",
    config: {
      service: "gmail",
      auth: {
        user: EMAIL_CONFIG.ADMIN_EMAIL,
        pass: EMAIL_CONFIG.APP_PASSWORD,
      },
    },
  },
]

async function testConfiguration(config: any) {
  try {
    console.log(`Testing configuration: ${config.name}`)

    const transporter = nodemailer.createTransporter(config.config)

    // Verify connection
    await transporter.verify()
    console.log(`✅ ${config.name} - Connection verified`)

    // Send test email
    const testEmail = {
      from: `"Bybit Clone Debug" <${EMAIL_CONFIG.ADMIN_EMAIL}>`,
      to: EMAIL_CONFIG.RECIPIENT_EMAIL_1,
      subject: `🧪 Debug Test - ${config.name} - ${new Date().toISOString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #f7931a;">🧪 Nodemailer Debug Test</h2>
          <div style="background: #f0f0f0; padding: 15px; border-radius: 5px;">
            <p><strong>Configuration:</strong> ${config.name}</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <p><strong>Status:</strong> ✅ Successfully sent!</p>
            <p><strong>From:</strong> ${EMAIL_CONFIG.ADMIN_EMAIL}</p>
            <p><strong>To:</strong> ${EMAIL_CONFIG.RECIPIENT_EMAIL_1}</p>
          </div>
          <p style="color: green; font-weight: bold;">This configuration is working! 🎉</p>
        </div>
      `,
    }

    const info = await transporter.sendMail(testEmail)
    console.log(`✅ ${config.name} - Email sent successfully:`, info.messageId)

    return {
      success: true,
      config: config.name,
      messageId: info.messageId,
      response: info.response,
    }
  } catch (error) {
    console.error(`❌ ${config.name} - Error:`, error)
    return {
      success: false,
      config: config.name,
      error: error.message,
      code: error.code,
      details: error.toString(),
    }
  }
}

export async function GET(request: NextRequest) {
  console.log("🧪 Starting email configuration tests...")

  const results = []

  for (const config of TRANSPORTER_CONFIGS) {
    const result = await testConfiguration(config)
    results.push(result)

    // Small delay between tests
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const successfulConfigs = results.filter((r) => r.success)
  const failedConfigs = results.filter((r) => !r.success)

  console.log(`✅ Successful configs: ${successfulConfigs.length}`)
  console.log(`❌ Failed configs: ${failedConfigs.length}`)

  return NextResponse.json({
    success: successfulConfigs.length > 0,
    summary: {
      total: results.length,
      successful: successfulConfigs.length,
      failed: failedConfigs.length,
      recommendedConfig: successfulConfigs[0]?.config || null,
    },
    results: results,
    emailConfig: {
      adminEmail: EMAIL_CONFIG.ADMIN_EMAIL,
      hasPassword: !!EMAIL_CONFIG.APP_PASSWORD,
      recipients: [EMAIL_CONFIG.RECIPIENT_EMAIL_1, EMAIL_CONFIG.RECIPIENT_EMAIL_2],
    },
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  try {
    const { configName } = await request.json()

    const selectedConfig = TRANSPORTER_CONFIGS.find((c) => c.name === configName) || TRANSPORTER_CONFIGS[0]

    console.log(`🎯 Testing specific configuration: ${selectedConfig.name}`)

    const result = await testConfiguration(selectedConfig)

    return NextResponse.json({
      success: result.success,
      result: result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in POST test:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
