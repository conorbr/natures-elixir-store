"use client"

import { HttpTypes } from "@medusajs/types"
import { useState } from "react"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

type TabItem = {
  label: string
  content: React.ReactNode
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs: TabItem[] = [
    {
      label: "Product Details",
      content: <ProductDetailsTab product={product} />,
    },
    {
      label: "Shipping & Returns",
      content: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full rounded-large border border-primary/10 overflow-hidden bg-white divide-y divide-primary/10">
      {tabs.map((tab) => (
        <AccordionRow key={tab.label} label={tab.label}>
          {tab.content}
        </AccordionRow>
      ))}
    </div>
  )
}

const AccordionRow = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button
        className="w-full flex items-center justify-between px-6 py-4 text-left group"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span className="font-serif font-bold text-primary text-base">
          {label}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-sm text-ui-fg-subtle">{children}</div>
      )}
    </div>
  )
}

const ProductDetailsTab = ({ product }: ProductTabsProps) => {
  const rows = [
    { label: "Material", value: product.material },
    { label: "Country of origin", value: product.origin_country },
    { label: "Type", value: product.type?.value },
    {
      label: "Weight",
      value: product.weight ? `${product.weight} g` : undefined,
    },
    {
      label: "Dimensions",
      value:
        product.length && product.width && product.height
          ? `${product.length}L × ${product.width}W × ${product.height}H`
          : undefined,
    },
  ].filter((row) => row.value)

  if (!rows.length) {
    return (
      <p className="text-ui-fg-muted italic">
        No additional details available.
      </p>
    )
  }

  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-3">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-0.5">
          <dt className="font-semibold text-primary/80">{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <span className="text-lg">🚚</span>
        <div>
          <p className="font-semibold text-primary/80 mb-0.5">Fast delivery</p>
          <p>
            Your order will arrive within 3–5 business days to your door or
            pick-up location.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <span className="text-lg">↩️</span>
        <div>
          <p className="font-semibold text-primary/80 mb-0.5">Easy returns</p>
          <p>
            Not happy? Return your order within 30 days for a full refund, no
            questions asked.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
