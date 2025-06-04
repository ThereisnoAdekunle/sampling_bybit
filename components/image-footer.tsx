"use client"

import Image from "next/image"

export function ImageFooter() {
  const stats = [
    {
      image: "/countries-new.png",
      number: "160",
      label: "Countries",
      alt: "Global Reach",
    },
    {
      image: "/tokens-new.png",
      number: "1939",
      label: "Tokens Listed",
      alt: "Crypto Tokens",
    },
    {
      image: "/trading-volume-new.png",
      number: "25B+",
      label: "24H Trading Volume",
      alt: "Trading Volume",
    },
    {
      image: "/users-network-new.png",
      number: "71M+",
      label: "Registered Users",
      alt: "User Network",
    },
  ]

  return (
    <div className="p-8 mt-auto">
      <div className="grid grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            {/* Image without background box */}
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <Image
                src={stat.image || "/placeholder.svg"}
                alt={stat.alt}
                fill
                className="object-contain"
                sizes="80px"
              />
            </div>

            {/* Content without background */}
            <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
            <div className="text-sm text-gray-300">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
