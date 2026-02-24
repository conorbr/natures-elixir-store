/**
 * Storefront constants. Contact/wholesale details can be overridden via env.
 */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@natureselixir.com"
export const CONTACT_PHONE =
  process.env.NEXT_PUBLIC_CONTACT_PHONE || ""
export const WHOLESALE_PHONE =
  process.env.NEXT_PUBLIC_WHOLESALE_PHONE || process.env.NEXT_PUBLIC_CONTACT_PHONE || ""
