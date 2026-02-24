import { Dialog, Transition } from "@headlessui/react"
import { Button, clx } from "@medusajs/ui"
import React, { Fragment, useMemo } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import X from "@modules/common/icons/x"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import { getProductPrice } from "@lib/util/get-product-price"
import OptionSelect from "./option-select"
import { HttpTypes } from "@medusajs/types"

type MobileActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  updateOptions: (title: string, value: string) => void
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
  optionsDisabled: boolean
  cartCount: number
}

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
  cartCount,
}) => {
  const { state, open, close } = useToggleState()

  const price = getProductPrice({ product, variantId: variant?.id })

  const selectedPrice = useMemo(() => {
    if (!price) return null
    return price.variantPrice || price.cheapestPrice || null
  }, [price])

  return (
    <>
      {/* Sticky bottom bar (mobile only) */}
      <div
        className={clx(
          "small:hidden fixed inset-x-0 bottom-0 z-50 transition-transform duration-300",
          show ? "translate-y-0" : "translate-y-full pointer-events-none"
        )}
      >
        {/* Checkout nudge strip — visible when cart has items */}
        {cartCount > 0 && (
          <LocalizedClientLink href="/cart">
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold">
              <span className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </span>
              <span>
                {cartCount === 1 ? "1 item in cart" : `${cartCount} items in cart`}
                {" · "}
                <span className="underline underline-offset-2">
                  Checkout
                </span>
                {" →"}
              </span>
            </div>
          </LocalizedClientLink>
        )}

        {/* Main action row */}
        <div className="bg-white border-t border-primary/10 shadow-lg px-4 py-3 flex items-center gap-3">
          {/* Price + title summary */}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-semibold text-primary truncate">
              {product.title}
            </span>
            {selectedPrice && (
              <span className="text-sm font-bold text-amber-accent">
                {selectedPrice.price_type === "sale" && (
                  <span className="line-through text-ui-fg-muted font-normal mr-1">
                    {selectedPrice.original_price}
                  </span>
                )}
                {selectedPrice.calculated_price}
              </span>
            )}
          </div>

          {/* Options selector trigger (only when there are options) */}
          {(product.variants?.length ?? 0) > 1 && (
            <Button
              onClick={open}
              variant="secondary"
              className="shrink-0 rounded-circle px-4 py-2 text-sm border-primary/30"
              data-testid="mobile-actions-button"
            >
              {variant ? Object.values(options).join(" / ") : "Options"}
            </Button>
          )}

          {/* Add to cart */}
          <Button
            onClick={handleAddToCart}
            disabled={!inStock || !variant}
            isLoading={isAdding}
            className="shrink-0 rounded-circle px-6 py-2 font-bold text-sm"
            data-testid="mobile-cart-button"
          >
            {!variant ? "Select" : !inStock ? "Out of stock" : "Add to cart"}
          </Button>
        </div>
      </div>

      {/* Options modal sheet */}
      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed bottom-0 inset-x-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <Dialog.Panel
                className="bg-white rounded-t-large px-6 pt-6 pb-10 flex flex-col gap-y-6"
                data-testid="mobile-actions-modal"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-primary text-lg">
                    {product.title}
                  </span>
                  <button
                    onClick={close}
                    className="p-2 rounded-circle hover:bg-primary/10 text-primary transition-colors"
                    data-testid="close-modal-button"
                  >
                    <X />
                  </button>
                </div>

                {(product.variants?.length ?? 0) > 1 && (
                  <div className="flex flex-col gap-y-4">
                    {(product.options || []).map((option) => (
                      <OptionSelect
                        key={option.id}
                        option={option}
                        current={options[option.title ?? ""]}
                        updateOption={updateOptions}
                        title={option.title ?? ""}
                        disabled={optionsDisabled}
                      />
                    ))}
                  </div>
                )}

                <Button
                  onClick={() => {
                    handleAddToCart()
                    close()
                  }}
                  disabled={!inStock || !variant}
                  isLoading={isAdding}
                  className="w-full h-14 rounded-circle font-bold text-base"
                >
                  {!variant
                    ? "Select variant"
                    : !inStock
                    ? "Out of stock"
                    : "Add to cart"}
                </Button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileActions
