import Product from "../product-preview"
import { getRegion } from "@lib/data/regions"
import { getProductsList } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

type StoreProductParamsWithTags = HttpTypes.StoreProductParams & {
  tags?: string[]
}

type StoreProductWithTags = HttpTypes.StoreProduct & {
  tags?: { value: string }[]
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) return null

  const queryParams: StoreProductParamsWithTags = {}
  if (region?.id) queryParams.region_id = region.id
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  const productWithTags = product as StoreProductWithTags
  if (productWithTags.tags) {
    queryParams.tags = productWithTags.tags
      .map((t) => t.value)
      .filter(Boolean) as string[]
  }
  queryParams.is_giftcard = false

  const products = await getProductsList({ queryParams, countryCode }).then(
    ({ response }) =>
      response.products.filter((p) => p.id !== product.id).slice(0, 4)
  )

  if (!products.length) return null

  return (
    <div>
      <h2 className="font-serif text-2xl small:text-3xl font-bold text-primary mb-10 text-center">
        You might also like
      </h2>
      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {products.map((p) => (
          <li key={p.id}>
            <Product region={region} product={p} />
          </li>
        ))}
      </ul>
    </div>
  )
}
