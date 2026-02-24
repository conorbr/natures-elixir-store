import { Metadata } from "next"

import { Heading, Text } from "@medusajs/ui"

export const metadata: Metadata = {
  title: "Our Story",
  description: "Learn about Nature's Elixir and our journey.",
}

export default function OurStoryPage() {
  return (
    <div className="content-container py-12 small:py-16">
      <div className="max-w-3xl mx-auto">
        <Heading
          level="h1"
          className="text-3xl font-normal mb-8 text-ui-fg-base"
        >
          Our Story
        </Heading>
        <div className="flex flex-col gap-6 text-ui-fg-subtle">
          <Text className="text-base-regular">
            Nature&apos;s Elixir was born from a simple belief: that the best
            wellness comes from nature. We source and craft products with care,
            so you can feel good about what you use every day.
          </Text>
          <Text className="text-base-regular">
            From our family to yours, we&apos;re committed to quality,
            transparency, and the well-being of our customers and the planet.
          </Text>
          <Text className="text-base-regular">
            You&apos;ll often find us at our weekend stall in Herbert Park and
            St. Anne&apos;s Park—come say hello.
          </Text>
          <Text className="text-base-regular">
            Thank you for being part of our story.
          </Text>
        </div>
      </div>
    </div>
  )
}
