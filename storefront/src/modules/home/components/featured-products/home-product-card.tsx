import { getProductPrice } from "@lib/util/get-product-price"
import { getProductsById } from "@lib/data/products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { HttpTypes } from "@medusajs/types"

export default async function HomeProductCard({
  product,
  region,
  showBadge = false,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  showBadge?: boolean
}) {
  const [pricedProduct] = await getProductsById({
    ids: [product.id!],
    regionId: region.id,
  })

  if (!pricedProduct) {
    return null
  }

  const { cheapestPrice } = getProductPrice({ product: pricedProduct })
  const options = product.options ?? []
  const firstOptionValues = options[0]?.values?.map((v) => v.value) ?? []

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group flex flex-col h-full"
    >
      <div className="space-y-3 sm:space-y-4">
        <div className="relative aspect-square bg-background-light rounded-xl overflow-hidden">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="square"
            className="!aspect-square !w-full !p-0 !shadow-none"
          />
          {showBadge && (
            <span className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-amber-accent text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              Gold Medal
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:gap-3 flex-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-primary line-clamp-2">
              {product.title}
            </h3>
            {cheapestPrice && (
              <span className="text-amber-accent font-bold text-sm sm:text-base shrink-0">
                {cheapestPrice.calculated_price}
              </span>
            )}
          </div>
          {firstOptionValues.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {firstOptionValues.slice(0, 3).map((value, i) => (
                <span
                  key={value}
                  className="px-2 py-1 text-[10px] border border-slate-200 rounded hover:border-primary transition-colors group-hover:border-primary/50"
                >
                  {value}
                </span>
              ))}
            </div>
          )}
          <span className="mt-auto w-full py-2.5 sm:py-3 bg-primary text-white text-xs sm:text-sm font-bold rounded flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
            Add to Cart
          </span>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
