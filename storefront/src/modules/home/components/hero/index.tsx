"use client"

import { Button } from "@medusajs/ui"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="bg-background-light">
      <div className="content-container py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Copy block - same order on both, visual order changes via grid */}
          <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <span className="text-amber-accent font-bold text-xs uppercase tracking-[0.2em]">
                5x Blas na hÉireann Gold Medal Winner
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-primary leading-tight font-bold">
                Irish Herbal Health,
                <br />
                Crafted with Nature
              </h2>
              <p className="text-base lg:text-lg text-slate-600 max-w-xl">
                Experience the purity of premium Irish botanicals,
                hand-harvested and small-batch produced in the heart of the
                Emerald Isle.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <LocalizedClientLink href="/store">
                <Button className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:opacity-90 transition-all shadow-lg shadow-primary/20 border-0">
                  Shop Teas
                </Button>
              </LocalizedClientLink>
              <LocalizedClientLink href="/our-story">
                <Button
                  variant="secondary"
                  className="px-8 py-4 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary/5 transition-all bg-transparent"
                >
                  Our Story
                </Button>
              </LocalizedClientLink>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex gap-0.5 text-amber-accent" aria-hidden>
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="text-lg lg:text-xl">
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm font-medium text-slate-500 italic">
                5 Consecutive Gold Medals for Excellence
              </span>
            </div>
          </div>
          {/* Hero image */}
          <div className="relative group order-1 lg:order-2">
            <div className="absolute -inset-4 bg-primary/5 rounded-xl -rotate-2 group-hover:rotate-0 transition-transform hidden lg:block" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-2xl">
              <Image
                src="/natures-elixir-homepage-banner.png"
                alt="Kraft tea bags and fresh herbs on wooden table"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
