"use client"

import { useState } from "react"

export default function FooterNewsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <p className="text-sm text-white/70 italic">
        Thanks for signing up — we&apos;ll be in touch!
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        required
        className="flex-1 min-w-0 bg-white/10 border border-white/20 rounded-circle px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 transition-colors"
      />
      <button
        type="submit"
        className="bg-white text-primary px-5 py-2 rounded-circle font-bold text-sm hover:bg-white/90 transition-colors shrink-0"
      >
        Join
      </button>
    </form>
  )
}
