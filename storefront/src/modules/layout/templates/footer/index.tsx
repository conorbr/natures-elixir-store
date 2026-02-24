import { getCategoriesList } from "@lib/data/categories"
import { getCollectionsList } from "@lib/data/collections"
import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import FooterNewsletter from "@modules/layout/components/footer-newsletter"

const COMPANY_LINKS = [
  { label: "Our Story", href: "/our-story" },
  { label: "Contact Us", href: "/contact" },
  { label: "Wholesale", href: "/wholesale" },
]

export default async function Footer() {
  const { collections } = await getCollectionsList(0, 6)
  const { product_categories } = await getCategoriesList(0, 6)

  const topLevelCategories =
    product_categories?.filter((c) => !c.parent_category) ?? []

  const shopLinks = [
    ...topLevelCategories.slice(0, 4).map((c) => ({
      label: c.name,
      href: `/categories/${c.handle}`,
      testId: "category-link",
    })),
    ...(collections?.slice(0, 3) ?? []).map((c) => ({
      label: c.title,
      href: `/collections/${c.handle}`,
    })),
  ]

  return (
    <footer className="bg-primary text-white w-full">
      {/* Main content */}
      <div className="content-container py-16">
        <div className="grid grid-cols-1 xsmall:grid-cols-2 medium:grid-cols-4 gap-10 small:gap-12">
          {/* ── Brand column ─────────────────────────── */}
          <div className="xsmall:col-span-2 medium:col-span-1">
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-3 mb-5 w-fit"
            >
              <Image
                src="/Logo-stamp-dark-green.png"
                alt="Nature's Elixir"
                width={36}
                height={36}
                className="object-contain brightness-0 invert"
              />
              <span className="font-serif text-xl font-bold text-white tracking-tight">
                Nature&apos;s Elixir
              </span>
            </LocalizedClientLink>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Small-batch natural wellness products, handcrafted with care in
              Dublin, Ireland.
            </p>
            <p className="text-sm text-white/70 mt-4">
              <span className="font-medium text-white">Find us:</span> Herbert
              Park &amp; St. Anne&apos;s Park, every weekend.
            </p>
          </div>

          {/* ── Shop column ───────────────────────────── */}
          {shopLinks.length > 0 && (
            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-widest mb-5">
                Shop
              </h5>
              <ul className="space-y-3 text-sm text-white/70">
                {shopLinks.map((link) => (
                  <li key={link.href}>
                    <LocalizedClientLink
                      href={link.href}
                      className="hover:text-white transition-colors"
                      data-testid={link.testId}
                    >
                      {link.label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Company column ────────────────────────── */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-widest mb-5">
              Company
            </h5>
            <ul className="space-y-3 text-sm text-white/70">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <LocalizedClientLink
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Newsletter column ─────────────────────── */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-widest mb-5">
              Stay Connected
            </h5>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Join our community for natural wellness tips and exclusive offers.
            </p>
            <FooterNewsletter />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="content-container py-5 flex flex-col xsmall:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>
            &copy; {new Date().getFullYear()} Nature&apos;s Elixir. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <LocalizedClientLink
              href="/contact"
              className="hover:text-white/70 transition-colors"
            >
              Contact
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/wholesale"
              className="hover:text-white/70 transition-colors"
            >
              Wholesale
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
