import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 lg:mb-6">
      <ol className="flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-x-2">
            {index > 0 && <span aria-hidden>/</span>}
            {item.href ? (
              <LocalizedClientLink
                href={item.href}
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </LocalizedClientLink>
            ) : (
              <span className="text-primary font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
