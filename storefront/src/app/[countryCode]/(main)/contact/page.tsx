import { Metadata } from "next"

import { Heading, Text } from "@medusajs/ui"

import ContactForm from "@modules/contact/components/contact-form"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Nature's Elixir.",
}

export default function ContactPage() {
  return (
    <div className="content-container py-12 small:py-16">
      <div className="max-w-2xl mx-auto">
        <Heading
          level="h1"
          className="text-3xl font-normal mb-4 text-ui-fg-base"
        >
          Contact Us
        </Heading>
        <Text className="text-base-regular text-ui-fg-subtle mb-10">
          Have a question or feedback? We&apos;d love to hear from you. Send us
          a message and we&apos;ll get back to you as soon as we can. You can
          also find us at our weekend stall in Herbert Park and St. Anne&apos;s
          Park.
        </Text>
        <ContactForm />
      </div>
    </div>
  )
}
