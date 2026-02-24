import { Metadata } from "next"

import { Heading, Text } from "@medusajs/ui"

import WholesaleForm from "@modules/wholesale/components/wholesale-form"

export const metadata: Metadata = {
  title: "Wholesale",
  description: "Wholesale enquiries for Nature's Elixir products.",
}

export default function WholesalePage() {
  return (
    <div className="content-container py-12 small:py-16">
      <div className="max-w-2xl mx-auto">
        <Heading
          level="h1"
          className="text-3xl font-normal mb-4 text-ui-fg-base"
        >
          Wholesale
        </Heading>
        <Text className="text-base-regular text-ui-fg-subtle mb-10">
          Interested in stocking Nature&apos;s Elixir? Tell us about your
          business and we&apos;ll be in touch to discuss wholesale options.
        </Text>
        <WholesaleForm />
      </div>
    </div>
  )
}
