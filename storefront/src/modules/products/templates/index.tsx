import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div
        className="content-container py-6 small:py-10"
        data-testid="product-container"
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs uppercase tracking-widest text-primary/50 font-medium mb-8">
          <LocalizedClientLink
            href="/store"
            className="hover:text-primary transition-colors"
          >
            Shop
          </LocalizedClientLink>
          {product.collection && (
            <>
              <span className="mx-1 text-primary/30">›</span>
              <LocalizedClientLink
                href={`/collections/${product.collection.handle}`}
                className="hover:text-primary transition-colors"
              >
                {product.collection.title}
              </LocalizedClientLink>
            </>
          )}
          <span className="mx-1 text-primary/30">›</span>
          <span className="text-primary">{product.title}</span>
        </nav>

        {/* Main 2-column grid: images left, details right */}
        <div className="grid grid-cols-1 small:grid-cols-2 gap-8 small:gap-16 mb-16">
          {/* Left: image gallery */}
          <div>
            <ImageGallery images={product?.images || []} />
          </div>

          {/* Right: info + actions — sticky on desktop, inline on mobile */}
          <div className="flex flex-col gap-y-6 small:sticky small:top-24 small:self-start">
            <ProductInfo product={product} />
            <Suspense
              fallback={
                <ProductActions
                  disabled={true}
                  product={product}
                  region={region}
                />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
          </div>
        </div>

        {/* Product tabs: details + shipping (full width below the grid) */}
        <div className="mb-16 max-w-3xl">
          <ProductTabs product={product} />
        </div>
      </div>

      {/* Related products */}
      <div
        className="content-container mb-16 small:mb-24"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
