console.log("🔍 Checking Environment and Dependencies...")

// Check Node.js version
console.log("📦 Node.js version:", process.version)
console.log("🖥️ Platform:", process.platform)
console.log("🏗️ Architecture:", process.arch)

// Check if nodemailer is available
try {
  const nodemailer = require("nodemailer")
  console.log("✅ Nodemailer is available")
  console.log("📦 Nodemailer version:", nodemailer.version || "unknown")
} catch (error) {
  console.log("❌ Nodemailer not available:", error.message)
}

// Test DNS resolution
try {
  const dns = require("dns")
  console.log("🌐 Testing DNS resolution for smtp.gmail.com...")

  dns.lookup("smtp.gmail.com", (err, address, family) => {
    if (err) {
      console.log("❌ DNS lookup failed:", err.message)
    } else {
      console.log("✅ DNS lookup successful:")
      console.log("Address:", address)
      console.log("Family:", family)
    }
  })
} catch (error) {
  console.log("❌ DNS module error:", error.message)
}

// Check environment variables
console.log("\n📧 Email Configuration:")
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL || "Not set")
console.log(
  "APP_PASSWORD:",
  process.env.APP_PASSWORD ? "Set (length: " + process.env.APP_PASSWORD.length + ")" : "Not set",
)
console.log("RECIPIENT_EMAIL_1:", process.env.RECIPIENT_EMAIL_1 || "Not set")
console.log("RECIPIENT_EMAIL_2:", process.env.RECIPIENT_EMAIL_2 || "Not set")

console.log("\n🔧 Environment check complete!")
