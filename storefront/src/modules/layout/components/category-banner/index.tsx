import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function CategoryBanner() {
  const categories = await listCategories()

  const topLevel = categories.filter((c) => !c.parent_category)

  if (!topLevel.length) {
    return null
  }

  return (
    <div className="bg-white border-b border-ui-border-base w-full">
      <nav
        aria-label="Product categories"
        className="content-container overflow-x-auto scrollbar-hide"
      >
        <ul className="flex items-center gap-x-1 py-2 w-max min-w-full justify-center">
          {topLevel.map((category) => (
            <li key={category.id} className="flex-shrink-0">
              <LocalizedClientLink
                href={`/categories/${category.handle}`}
                className="
                  inline-block px-4 py-1.5 rounded-full
                  text-xs font-medium tracking-wide
                  text-ui-fg-subtle border border-ui-border-base
                  hover:border-ui-border-strong hover:text-ui-fg-base
                  hover:bg-ui-bg-subtle
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
