import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  tea: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-2h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" />
    </svg>
  ),
  oil: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2C8.5 2 6 4.5 6 8c0 3.5 6 10 6 10s6-6.5 6-10c0-3.5-2.5-6-6-6zm0 5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
    </svg>
  ),
  sponge: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 3c-1.1 0-2 .9-2 2v1H6.5C5.67 6 5 6.67 5 7.5S5.67 9 6.5 9H8v2H6.5C5.67 11 5 11.67 5 12.5S5.67 14 6.5 14H8v2H6.5C5.67 16 5 16.67 5 17.5S5.67 19 6.5 19H10v1c0 1.1.9 2 2 2s2-.9 2-2v-1h3.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5H16v-2h1.5c.83 0 1.5-.67 1.5-1.5S18.33 11 17.5 11H16V9h1.5C18.33 9 19 8.33 19 7.5S18.33 6 17.5 6H14V5c0-1.1-.9-2-2-2z" />
    </svg>
  ),
}

function getIconForCategory(name: string): React.ReactNode {
  const lower = name.toLowerCase()
  if (lower.includes("tea") || lower.includes("herbal")) return CATEGORY_ICONS.tea
  if (lower.includes("oil") || lower.includes("spartan")) return CATEGORY_ICONS.oil
  return CATEGORY_ICONS.sponge
}

export default async function CategoryGrid() {
  const categories = await listCategories()
  const topLevel = categories?.filter((c) => !c.parent_category) ?? []
  const displayCategories = topLevel.slice(0, 3)

  if (displayCategories.length === 0) {
    return null
  }

  return (
    <section className="bg-white/50 py-16 lg:py-20">
      <div className="content-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {displayCategories.map((category) => (
            <LocalizedClientLink
              key={category.id}
              href={`/categories/${category.handle}`}
              className="group p-6 lg:p-8 bg-warm-white border border-primary/10 rounded-xl hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="size-14 lg:size-16 bg-primary/5 rounded-full flex items-center justify-center mb-4 lg:mb-6 text-primary">
                {getIconForCategory(category.name)}
              </div>
              <h3 className="font-serif text-xl lg:text-2xl font-bold mb-2 lg:mb-3 text-primary">
                {category.name}
              </h3>
              <p className="text-slate-500 mb-4 lg:mb-6 text-sm lg:text-base">
                {category.name.includes("Tea")
                  ? "Artisanal blends for wellness, sleep, and vitality."
                  : category.name.includes("Oil")
                    ? "Cold-pressed Spartan oils infused with healing botanicals."
                    : "Ethically harvested sea sponges for gentle skin care."}
              </p>
              <span className="inline-flex items-center text-primary font-bold hover:gap-2 transition-all">
                Browse{" "}
                <span className="ml-1 text-sm" aria-hidden>
                  →
                </span>
              </span>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
