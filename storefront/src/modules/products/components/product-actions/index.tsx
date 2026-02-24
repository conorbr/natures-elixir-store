"use client"

import { Button } from "@medusajs/ui"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

import { useIntersection } from "@lib/hooks/use-in-view"
import OptionSelect from "@modules/products/components/product-actions/option-select"

import MobileActions from "./mobile-actions"
import ProductPrice from "../product-price"
import { addToCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
  initialCartCount?: number
}

const TRUST_BADGES = [
  { icon: "🌿", label: "100% Natural" },
  { icon: "🚚", label: "Free shipping over €40" },
  { icon: "🏅", label: "Award-winning" },
]

const optionsAsKeymap = (
  variantOptions: any
): Record<string, string | undefined> => {
  return variantOptions?.reduce(
    (acc: Record<string, string | undefined>, varopt: any) => {
      if (varopt.option && varopt.value !== null && varopt.value !== undefined) {
        acc[varopt.option.title] = varopt.value
      }
      return acc
    },
    {}
  )
}

export default function ProductActions({
  product,
  region,
  disabled,
  initialCartCount = 0,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [cartCount, setCartCount] = useState(initialCartCount)
  const countryCode = useParams().countryCode as string

  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return undefined
    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const setOptionValue = (title: string, value: string) => {
    setOptions((prev) => ({ ...prev, [title]: value }))
  }

  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) return true
    if (selectedVariant?.allow_backorder) return true
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    )
      return true
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return
    setIsAdding(true)
    await addToCart({ variantId: selectedVariant.id, quantity: 1, countryCode })
    setCartCount((prev) => prev + 1)
    setIsAdding(false)
  }

  const hasOptions = (product.variants?.length ?? 0) > 1

  return (
    <>
      <div className="flex flex-col gap-y-6" ref={actionsRef}>
        {/* Price */}
        <ProductPrice product={product} variant={selectedVariant} />

        {/* Variant options */}
        {hasOptions && (
          <div className="flex flex-col gap-y-4">
            {(product.options || []).map((option) => (
              <OptionSelect
                key={option.id}
                option={option}
                current={options[option.title ?? ""]}
                updateOption={setOptionValue}
                title={option.title ?? ""}
                data-testid="product-options"
                disabled={!!disabled || isAdding}
              />
            ))}
          </div>
        )}

        {/* Add to cart */}
        <Button
          onClick={handleAddToCart}
          disabled={!inStock || !selectedVariant || !!disabled || isAdding}
          variant="primary"
          className="w-full h-14 rounded-circle text-base font-bold tracking-wide shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-95 transition-all"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant
            ? "Select variant"
            : !inStock
            ? "Out of stock"
            : "Add to cart"}
        </Button>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-primary/10">
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 text-sm text-ui-fg-subtle"
            >
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>

      <MobileActions
        product={product}
        variant={selectedVariant}
        options={options}
        updateOptions={setOptionValue}
        inStock={inStock}
        handleAddToCart={handleAddToCart}
        isAdding={isAdding}
        show={!inView}
        optionsDisabled={!!disabled || isAdding}
        cartCount={cartCount}
      />
    </>
  )
}
