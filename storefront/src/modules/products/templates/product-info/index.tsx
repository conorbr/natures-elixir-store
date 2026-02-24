import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info" className="flex flex-col gap-y-4">
      {/* Badges */}
      {product.collection && (
        <div className="flex flex-wrap gap-2">
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="px-3 py-1 bg-primary/10 text-primary rounded-circle text-xs font-bold uppercase tracking-wider hover:bg-primary/20 transition-colors"
          >
            {product.collection.title}
          </LocalizedClientLink>
        </div>
      )}

      {/* Title */}
      <h1
        className="font-serif text-3xl small:text-4xl font-bold text-primary leading-tight"
        data-testid="product-title"
      >
        {product.title}
      </h1>

      {/* Description */}
      {product.description && (
        <p
          className="text-base italic text-ui-fg-subtle leading-relaxed"
          data-testid="product-description"
        >
          {product.description}
        </p>
      )}
    </div>
  )
}

export default ProductInfo
