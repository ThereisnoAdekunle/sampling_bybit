import type { Metadata } from "next"
import TwoFactorVerification from "@/components/two-factor-verification"
import { LanguageSelector } from "@/components/language-selector"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { ImageFooter } from "@/components/image-footer"
import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import { UnlinkedLink } from "@/components/unlinked-link"

export const metadata: Metadata = {
  title: "Bybit - 2FA Security Verification",
  description: "Two-Factor Authentication Security Verification",
}

export default function TwoFactorVerifyPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* 2FA Verification Form Section - Always First */}
      <div className="w-full lg:w-1/2 flex flex-col bg-background relative z-20">
        {/* Header for 2FA form */}
        <header className="w-full border-b bg-background relative z-10">
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 flex h-12 sm:h-14 md:h-16 items-center justify-end">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <UnlinkedLink href="/register" className="text-primary hover:underline text-xs sm:text-sm font-medium">
                Sign up
              </UnlinkedLink>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* 2FA verification content */}
        <div className="flex-1 flex items-center justify-center py-4 sm:py-6 md:py-8 lg:py-10 px-3 sm:px-4 md:px-6 lg:px-8 overflow-y-auto">
           <Suspense fallback={<div>Loading...</div>}>
             <TwoFactorVerification />
           </Suspense>
        </div>
      </div>

      {/* Branding Section - Always Last, Hidden on Small Screens */}
      <div className="w-full lg:w-1/2 flex-col bg-primary/5 relative z-10 hidden lg:flex">
        {/* Decorative curved border */}
        <div className="absolute top-0 left-0 w-full">
          <div className="absolute top-0 left-0 right-0 h-[150px] sm:h-[200px] md:h-[300px] lg:h-[400px] w-full">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[300px] sm:w-[400px] md:w-[600px] lg:w-[800px] h-[300px] sm:h-[400px] md:h-[600px] lg:h-[800px] border-2 border-white/10 rounded-full -translate-y-[200px] sm:-translate-y-[300px] md:-translate-y-[400px] lg:-translate-y-[600px]"></div>

            {/* Small star */}
            <div className="absolute top-4 sm:top-8 md:top-12 lg:top-16 left-4 sm:left-8 md:left-12 lg:left-16">
              <Image src="/small-star.png" alt="Star" width={30} height={30} className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Header for branding section */}
        <header className="w-full border-b border-white/10 bg-black/20 backdrop-blur supports-[backdrop-filter]:bg-black/20 relative z-10">
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 flex h-12 sm:h-14 md:h-16 items-center justify-between">
            <LanguageSelector />
          </div>
        </header>

        {/* Body content with logo */}
        <main className="flex-1 flex flex-col justify-center items-center px-3 sm:px-4 md:px-8 lg:px-12 py-6 sm:py-8 md:py-10 relative z-10">
          <div className="text-center space-y-4 sm:space-y-6 md:space-y-8">
            <Logo />
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
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
    </div>
  )
}
