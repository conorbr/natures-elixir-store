import { getProductPrice } from "@lib/util/get-product-price"
import { getProductsById } from "@lib/data/products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { HttpTypes } from "@medusajs/types"

function truncate(str: string | null | undefined, max: number): string {
  if (!str) return ""
  return str.length <= max ? str : str.slice(0, max).trim() + "…"
}

export default async function ListingProductCard({
  product,
  region,
  badgeLabel,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  badgeLabel?: string | null
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
  const description =
    (product as { subtitle?: string }).subtitle ||
    truncate((product as { description?: string }).description, 80)

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group flex flex-col h-full bg-warm-white border border-primary/10 rounded-xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-0.5"
    >
      <div className="flex flex-col h-full">
        <div className="relative aspect-square bg-background-light overflow-hidden">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="square"
            className="!aspect-square !w-full !p-0 !shadow-none !rounded-none"
          />
          {badgeLabel && (
            <span className="absolute top-3 right-3 bg-amber-accent text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              {badgeLabel}
            </span>
          )}
        </div>
        <div className="p-4 sm:p-5 flex flex-col gap-2 sm:gap-3 flex-1">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-primary line-clamp-2">
            {product.title}
          </h3>
          {description && (
            <p className="text-slate-500 text-sm line-clamp-2">{description}</p>
          )}
          {firstOptionValues.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {firstOptionValues.slice(0, 4).map((value) => (
                <span
                  key={value}
                  className="px-2 py-1 text-[10px] border border-slate-200 rounded hover:border-primary transition-colors"
                >
                  {value}
                </span>
              ))}
            </div>
          )}
          <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
            {cheapestPrice && (
              <span className="text-amber-accent font-bold text-sm sm:text-base">
                {cheapestPrice.calculated_price}
              </span>
            )}
            <span className="w-full sm:w-auto py-2.5 sm:py-2 px-4 sm:px-6 bg-primary text-white text-xs sm:text-sm font-bold rounded flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
              View Product
            </span>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
