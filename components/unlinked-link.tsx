"use client"

import { useState } from "react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface UnlinkedLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function UnlinkedLink({ href, children, className }: UnlinkedLinkProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowTooltip(true)
    setTimeout(() => setShowTooltip(false), 3000)
  }

  return (
    <TooltipProvider>
      <Tooltip open={showTooltip}>
        <TooltipTrigger asChild>
          <Link href={href} onClick={handleClick} className={className}>
            {children}
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Please submit a ticket to report any issue</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 