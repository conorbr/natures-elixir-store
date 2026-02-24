import { Suspense } from "react"
import Image from "next/image"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import CategoryBanner from "@modules/layout/components/category-banner"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          {/* Left: Menu + logo on desktop */}
          <div className="flex-1 basis-0 h-full flex items-center gap-x-3">
            <div className="h-full">
              <SideMenu regions={regions} />
            </div>
            <LocalizedClientLink
              href="/"
              className="hidden small:flex items-center"
              data-testid="nav-store-link"
            >
              <Image
                src="/Logo-stamp-dark-green.png"
                alt="Nature's Elixir"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </LocalizedClientLink>
          </div>

          {/* Center: logo on mobile only */}
          <div className="flex items-center h-full small:hidden">
            <LocalizedClientLink
              href="/"
              className="flex items-center"
              data-testid="nav-store-link-mobile"
            >
              <Image
                src="/Logo-stamp-dark-green.png"
                alt="Nature's Elixir"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              {process.env.NEXT_PUBLIC_FEATURE_SEARCH_ENABLED && (
                <LocalizedClientLink
                  className="hover:text-ui-fg-base"
                  href="/search"
                  scroll={false}
                  data-testid="nav-search-link"
                >
                  Search
                </LocalizedClientLink>
              )}
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
      <CategoryBanner />
    </div>
  )
}
