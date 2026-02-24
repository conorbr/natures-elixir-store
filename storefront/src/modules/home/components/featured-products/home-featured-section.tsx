import { getCollectionsWithProducts } from "@lib/data/collections"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import HomeProductCard from "./home-product-card"

export default async function HomeFeaturedSection({
  countryCode,
  region,
}: {
  countryCode: string
  region: HttpTypes.StoreRegion
}) {
  const collections = await getCollectionsWithProducts(countryCode)

  if (!collections?.length) {
    return null
  }

  const [firstCollection] = collections
  const products = firstCollection.products ?? []
  const displayProducts = products.slice(0, 4)

  if (displayProducts.length === 0) {
    return null
  }

  return (
    <section className="content-container py-16 lg:py-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 lg:mb-12">
        <div className="space-y-1">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary">
            Award-Winning Blends
          </h2>
          <p className="text-slate-500 text-sm lg:text-base">
            Our most beloved herbal remedies and elixirs.
          </p>
        </div>
        <LocalizedClientLink
          href="/store"
          className="text-primary font-bold border-b-2 border-primary/20 hover:border-primary transition-all pb-1 w-fit"
        >
          View All Products
        </LocalizedClientLink>
      </div>
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {displayProducts.map((product, index) => (
          <li key={product.id}>
            <HomeProductCard
              product={product}
              region={region}
              showBadge={index < 2}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
