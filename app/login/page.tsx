"use client";

import type { Metadata } from "next"
import LoginForm from "@/components/login-form"
import { LanguageSelector } from "@/components/language-selector"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { ImageFooter } from "@/components/image-footer"
import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full overflow-hidden">
      {/* Left Split - Branding Section */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-gray-900 to-black text-white flex flex-col relative overflow-hidden min-h-[300px] sm:min-h-[400px] lg:min-h-screen">
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

        {/* Header for left split */}
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
                Seize Your Next Trading Opportunity
                <br />
                <span className="text-gray-400">With Bybit</span>
              </h1>
            </div>
          </div>
        </main>

        {/* Footer with image cards */}
        <ImageFooter />
      </div>

      {/* Right Split - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-background">
        {/* Header for right split */}
        <header className="w-full border-b bg-background relative z-10">
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 flex h-12 sm:h-14 md:h-16 items-center justify-end">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <Link href="/register" className="text-primary hover:underline text-xs sm:text-sm font-medium">
                Sign up
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Login form content */}
        <div className="flex-1 flex items-center justify-center py-4 sm:py-6 md:py-8 lg:py-10 px-3 sm:px-4 md:px-6 lg:px-8 overflow-y-auto">
          <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
