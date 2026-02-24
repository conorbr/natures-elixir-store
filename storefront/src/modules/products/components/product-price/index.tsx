import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-ui-bg-subtle animate-pulse rounded-base" />
  }

  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex items-baseline gap-3">
        <span
          className={clx("text-3xl font-bold text-amber-accent", {
            "text-ui-fg-interactive": selectedPrice.price_type === "sale",
          })}
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {!variant && "From "}
          {selectedPrice.calculated_price}
        </span>

        {selectedPrice.price_type === "sale" && (
          <span
            className="text-lg text-ui-fg-muted line-through"
            data-testid="original-product-price"
            data-value={selectedPrice.original_price_number}
          >
            {selectedPrice.original_price}
          </span>
        )}
      </div>

      {selectedPrice.price_type === "sale" && (
        <span className="text-sm font-semibold text-ui-fg-interactive">
          Save {selectedPrice.percentage_diff}%
        </span>
      )}
    </div>
  )
}
