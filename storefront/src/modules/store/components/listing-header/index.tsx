"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const SORT_OPTIONS: { value: SortOptions; label: string }[] = [
  { value: "created_at", label: "Newest Arrival" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
]

type ListingHeaderProps = {
  count: number
  sortBy: SortOptions
}

export default function ListingHeader({ count, sortBy }: ListingHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      params.delete("page")
      return params.toString()
    },
    [searchParams]
  )

  const setSort = (value: SortOptions) => {
    router.push(`${pathname}?${createQueryString("sortBy", value)}`)
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
      <p className="text-slate-600 text-sm font-medium">
        {count} {count === 1 ? "product" : "products"} found
      </p>
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <span className="text-slate-600 text-sm">Sort by:</span>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSort(opt.value)}
              className={`
                text-sm font-medium px-3 py-1.5 rounded-full border transition-colors
                ${
                  sortBy === opt.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
