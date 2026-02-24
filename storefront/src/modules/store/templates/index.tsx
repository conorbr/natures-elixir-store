import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import Breadcrumb from "@modules/store/components/breadcrumb"
import CategoryPills from "@modules/store/components/category-pills"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page, 10) : 1
  const sort = sortBy || "created_at"

  return (
    <div
      className="bg-background-light py-8 lg:py-12 content-container"
      data-testid="category-container"
    >
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "All products" },
        ]}
      />
      <CategoryPills />
      <div className="mb-6 lg:mb-8">
        <h1
          className="font-serif text-3xl lg:text-4xl font-bold text-primary"
          data-testid="store-page-title"
        >
          All products
        </h1>
        <p className="mt-2 text-slate-600 text-base lg:text-lg max-w-2xl">
          Discover our hand-selected, award-winning herbal blends and remedies.
          Sourced sustainably from the wild Irish coastlines and artisanal
          gardens.
        </p>
      </div>
      <Suspense fallback={<SkeletonProductGrid />}>
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          countryCode={countryCode}
        />
      </Suspense>
    </div>
  )
}

export default StoreTemplate
