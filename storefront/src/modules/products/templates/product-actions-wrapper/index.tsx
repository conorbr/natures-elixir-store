import { getProductsById } from "@lib/data/products"
import { retrieveCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"

/**
 * Fetches real-time pricing and the current cart item count, then renders
 * ProductActions so the mobile sticky bar can display a live checkout nudge.
 */
export default async function ProductActionsWrapper({
  id,
  region,
}: {
  id: string
  region: HttpTypes.StoreRegion
}) {
  const [[product], cart] = await Promise.all([
    getProductsById({ ids: [id], regionId: region.id }),
    retrieveCart(),
  ])

  if (!product) {
    return null
  }

  const initialCartCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return (
    <ProductActions
      product={product}
      region={region}
      initialCartCount={initialCartCount}
    />
  )
}
