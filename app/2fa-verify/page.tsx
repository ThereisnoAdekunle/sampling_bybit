import type { Metadata } from "next"
import TwoFactorVerification from "@/components/two-factor-verification"
import { LanguageSelector } from "@/components/language-selector"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { ImageFooter } from "@/components/image-footer"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Bybit - 2FA Security Verification",
  description: "Two-Factor Authentication Security Verification",
}

export default function TwoFactorVerifyPage() {
  return (
    <div className="min-h-screen flex w-full overflow-hidden">
      {/* Left Split - Branding Section */}
      <div className="w-1/2 bg-gradient-to-br from-gray-900 to-black text-white flex flex-col relative overflow-hidden">
        {/* Decorative curved border */}
        <div className="absolute top-0 left-0 w-full">
          <div className="absolute top-0 left-0 right-0 h-[400px] w-full">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] border-2 border-white/10 rounded-full -translate-y-[600px]"></div>

            {/* Small star */}
            <div className="absolute top-16 left-16">
              <Image src="/small-star.png" alt="Star" width={40} height={40} className="animate-pulse" />
            </div>
          </div>
        </div>

        {/* Header for left split */}
        <header className="w-full border-b border-white/10 bg-black/20 backdrop-blur supports-[backdrop-filter]:bg-black/20 relative z-10">
          <div className="px-8 flex h-16 items-center justify-between">
            <LanguageSelector />
          </div>
        </header>

        {/* Body content with logo */}
        <main className="flex-1 flex flex-col justify-center items-center px-12 py-10 relative z-10">
          <div className="text-center space-y-8">
            <Logo />
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">
                Enhanced Security Verification
                <br />
                <span className="text-gray-400">For Your Protection</span>
              </h1>
            </div>
          </div>
        </main>

        {/* Footer with image cards */}
        <ImageFooter />
      </div>

      {/* Right Split - 2FA Verification Form */}
      <div className="w-1/2 flex flex-col bg-background">
        {/* Header for right split */}
        <header className="w-full border-b bg-background relative z-10">
          <div className="px-8 flex h-16 items-center justify-end">
            <div className="flex items-center gap-4">
              <Link href="/register" className="text-primary hover:underline text-sm font-medium">
                Sign up
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* 2FA verification content */}
        <div className="flex-1 flex items-center justify-center py-10 px-8 overflow-y-auto">
          <TwoFactorVerification />
        </div>
      </div>
    </div>
  )
}
