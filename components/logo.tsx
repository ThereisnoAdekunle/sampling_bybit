import Link from "next/link"
import Image from "next/image"

export function Logo() {
  return (
    <Link href="/" className="flex items-center justify-center">
      <Image src="/bybit-logo.png" alt="Bybit" width={200} height={80} className="h-16 w-auto" priority />
    </Link>
  )
}
