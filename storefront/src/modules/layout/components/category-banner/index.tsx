import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function CategoryBanner() {
  const categories = await listCategories()

  const topLevel = categories.filter((c) => !c.parent_category)

  if (!topLevel.length) {
    return null
  }

  return (
    <div className="bg-white border-b border-primary/5 w-full">
      <nav
        aria-label="Product categories"
        className="content-container overflow-x-auto no-scrollbar py-3"
      >
        <ul className="flex items-center gap-3 lg:gap-4 w-max min-w-full justify-center">
          {topLevel.map((category) => (
            <li key={category.id} className="flex-shrink-0">
              <LocalizedClientLink
                href={`/categories/${category.handle}`}
                className="
                  inline-block px-4 py-1.5 rounded-full
                  text-sm font-medium
                  text-slate-600 border border-slate-200
                  hover:border-primary hover:text-primary
                  bg-transparent
                  transition-colors duration-150 whitespace-nowrap
                "
                data-testid={`category-banner-link-${category.handle}`}
              >
                {category.name}
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
