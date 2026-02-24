import { notFound } from "next/navigation"
import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import Breadcrumb from "@modules/store/components/breadcrumb"
import CategoryPills from "@modules/store/components/category-pills"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types"

const DEFAULT_DESCRIPTION =
  "Discover our hand-selected, award-winning herbal blends. Sourced sustainably from the wild Irish coastlines and artisanal gardens, crafted for your holistic well-being."

export default function CategoryTemplate({
  categories,
  sortBy,
  page,
  countryCode,
}: {
  categories: HttpTypes.StoreProductCategory[]
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page, 10) : 1
  const sort = sortBy || "created_at"

  const category = categories[categories.length - 1]
  const parents = categories.slice(0, categories.length - 1)

  if (!category || !countryCode) notFound()

  const breadcrumbItems = [
    { label: "Home", href: "/" as string },
    ...parents.map((p) => ({ label: p.name, href: `/categories/${p.handle}` as string })),
    { label: category.name },
  ]

  return (
    <div
      className="bg-background-light py-8 lg:py-12"
      data-testid="category-container"
    >
      <div className="content-container">
      <Breadcrumb items={breadcrumbItems} />
      <CategoryPills activeHandle={category.handle} />
      <div className="mb-6 lg:mb-8">
        <h1
          className="font-serif text-3xl lg:text-4xl font-bold text-primary"
          data-testid="category-page-title"
        >
          {category.name}
        </h1>
        <p className="mt-2 text-slate-600 text-base lg:text-lg max-w-2xl">
          {category.description ?? DEFAULT_DESCRIPTION}
        </p>
      </div>
      <Suspense fallback={<SkeletonProductGrid />}>
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          categoryId={category.id}
          countryCode={countryCode}
        />
      </Suspense>
    </div>
      </div>

  )
}
