import { Metadata } from "next"

import AwardBanner from "@modules/home/components/award-banner"
import BrandStory from "@modules/home/components/brand-story"
import CategoryGrid from "@modules/home/components/category-grid"
import HomeFeaturedSection from "@modules/home/components/featured-products/home-featured-section"
import Hero from "@modules/home/components/hero"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Nature's Elixir - Premium Irish Herbal Health",
  description:
    "Experience the purity of premium Irish botanicals, hand-harvested and small-batch produced in the heart of the Emerald Isle.",
}

export default async function Home({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <div className="bg-background-light">
      <Hero />
      <CategoryGrid />
      <AwardBanner />
      <HomeFeaturedSection countryCode={countryCode} region={region} />
      <BrandStory />
    </div>
  )
}
