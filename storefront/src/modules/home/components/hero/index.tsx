"use client"

import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/natures-elixir-homepage-banner.png"
          alt="Nature's Elixir"
          fill
          className="object-cover object-bottom"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      {/* Text Overlay - Positioned at bottom */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end items-center text-center pb-12 small:pb-16 px-4 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-ui-fg-base font-normal"
          >
          </Heading>
          <Heading
            level="h2"
            className="text-3xl leading-10 text-ui-fg-subtle font-normal"
          >
          </Heading>
        </span>
        <LocalizedClientLink href="/store">
          <Button className="bg-ui-bg-base text-ui-fg-base hover:bg-ui-bg-base-hover">
            Shop Now
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Hero
