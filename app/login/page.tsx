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
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Login Form Section - Always First */}
      <div className="w-full lg:w-1/2 flex flex-col bg-background relative z-20">
        {/* Header for login form */}
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

      {/* Logo Section - Always Last */}
      <div className="w-full lg:w-1/2 flex-col bg-primary/5 relative z-10 hidden lg:flex">
        {/* Main content with logo */}
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
    </div>
  )
}
