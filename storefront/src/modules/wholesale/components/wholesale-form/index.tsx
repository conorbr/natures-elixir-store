"use client"

import { Button, Label, Text } from "@medusajs/ui"
import React, { useState } from "react"

import Input from "@modules/common/components/input"

const WHOLESALE_EMAIL =
  process.env.NEXT_PUBLIC_WHOLESALE_EMAIL ||
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
  "wholesale@natureselixir.com"
const WHOLESALE_PHONE =
  process.env.NEXT_PUBLIC_WHOLESALE_PHONE ||
  process.env.NEXT_PUBLIC_CONTACT_PHONE ||
  ""

export default function WholesaleForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Wholesale enquiry: ${company || name}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nMessage:\n${message}`
    )
    window.location.href = `mailto:${WHOLESALE_EMAIL}?subject=${subject}&body=${body}`
  }

  return (
    <div className="flex flex-col gap-10">
      {WHOLESALE_PHONE ? (
        <Text className="text-base-regular text-ui-fg-subtle">
          You can also reach us at{" "}
          <a
            href={`tel:${WHOLESALE_PHONE.replace(/\s/g, "")}`}
            className="text-ui-fg-interactive hover:underline"
          >
            {WHOLESALE_PHONE}
          </a>
        </Text>
      ) : null}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Company / Business name"
            name="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full">
          <Label className="mb-2 txt-compact-medium-plus">Message</Label>
          <textarea
            name="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="pt-4 pb-1 block w-full px-4 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover text-ui-fg-base resize-y min-h-[120px]"
            placeholder="Tell us about your business and wholesale interest..."
          />
        </div>
        <Button type="submit" size="large">
          Send enquiry
        </Button>
      </form>
    </div>
  )
}
