import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type CategoryPillsProps = {
  activeHandle?: string | null
}

export default async function CategoryPills({
  activeHandle = null,
}: CategoryPillsProps) {
  const categories = await listCategories()
  const topLevel = categories?.filter((c) => !c.parent_category) ?? []

  if (topLevel.length === 0) {
    return null
  }

  return (
    <div className="mb-6 lg:mb-8">
      <div className="flex flex-wrap gap-2 lg:gap-3">
        {topLevel.map((cat) => {
          const isActive = activeHandle === cat.handle
          return (
            <LocalizedClientLink
              key={cat.id}
              href={`/categories/${cat.handle}`}
              className={`
                inline-block px-4 py-2 rounded-full text-sm font-medium border transition-colors
                ${
                  isActive
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
                }
              `}
            >
              {cat.name}
            </LocalizedClientLink>
          )
        })}
      </div>
    </div>
  )
}
