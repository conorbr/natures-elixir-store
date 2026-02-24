# WP-002: Product Details – Replace Product Information with Product Benefits

## Summary

Replace the **Product Information** accordion tab with **Product Benefits** on the product details page. Benefits content is derived from the existing product description by parsing the “Benefits attributed to:” (or equivalent) section. No backend or import changes required.

## Current State

- **Location**: `storefront/src/modules/products/components/product-tabs/index.tsx`
- **Product Information tab**: Label "Product Information"; content is `ProductInfoTab` – Material, Country of origin, Type, Weight, Dimensions. To be removed and replaced by Product Benefits.
- **Product data**: Descriptions in `documentation/setup/products/*.json` (and thus `product.description` in Medusa) often include a "Benefits attributed to:" or "Benefits Attributed to:" section, sometimes with "–" or "-" bullet-style separators. No separate benefits field exists.

## Approach (locked in)

- **Source**: Use `product.description` only. Parse out the benefits section; do not add new backend fields or import columns.
- **Parsing**: Look for a benefits block in the description using one or more of these patterns (case-insensitive where appropriate):
  - "Benefits attributed to:"
  - "Benefits Attributed to:"
  - "Benefits attributed to" (no colon)
  - Text after that phrase up to the end of the description (or to a clear end marker if we add one later).
- **Formatting**: Normalize "–", "-", "•" and line breaks into a consistent list or paragraph for display (e.g. one benefit per line or as a simple list).
- **Fallback**: If no benefits phrase is found or the extracted text is empty, show a short fallback message (e.g. “Benefits information is not available for this product.”) so the tab never errors and the accordion stays consistent.

## Scope

### In scope

1. **Replace the first tab**
   - Remove the "Product Information" tab and the `ProductInfoTab` component.
   - Add a "Product Benefits" tab whose content is rendered from parsed `product.description`.

2. **Parsing and UI**
   - Implement a small parser/helper that, given `product.description`, returns the benefits text (or null/empty).
   - Render that text in the new tab (e.g. as a list or styled paragraph). Handle dashes/bullets and line breaks for readability.
   - When there is no benefits content, show the fallback message; do not hide the tab (keeps accordion behaviour predictable).

3. **Tab order and labels**
   - First tab: **Product Benefits** (new content).
   - Second tab: **Shipping & Returns** – unchanged.

### Out of scope

- Changing "Shipping & Returns" content.
- Changing the main product description block above the accordion.
- Backend schema changes, new product fields, or import/CSV changes.
- CMS or admin-editable benefits (can be a later WP).

## Acceptance criteria

- [ ] The first accordion tab is labeled **Product Benefits** (not "Product Information").
- [ ] The Product Benefits tab content is derived from `product.description` by parsing "Benefits attributed to:" (and documented variants).
- [ ] Parsed benefits are displayed in a clear, readable format (list or paragraph; bullets/dashes normalized).
- [ ] If no benefits section is found or it is empty, a fallback message is shown (e.g. “Benefits information is not available for this product.”).
- [ ] The Product Information tab and `ProductInfoTab` component are removed; no duplicate or leftover tabs.
- [ ] "Shipping & Returns" remains the second tab with unchanged content.

## Technical notes

- **File**: `storefront/src/modules/products/components/product-tabs/index.tsx`
- **Product type**: `HttpTypes.StoreProduct` – use `product.description` (string).
- **Parser**: Can live in the same file or in a small util (e.g. `parseBenefitsFromDescription(description: string | null): string | null`). Prefer a single source of truth for the phrase list ("Benefits attributed to:", "Benefits Attributed to:", etc.) and handle optional colon and whitespace.
- **Display**: Use existing design tokens / `text-small-regular` (or equivalent) for consistency with `ShippingInfoTab`; ensure long text wraps and is accessible.

## Dependencies

- None beyond the current storefront and product data. All product descriptions are already in Medusa; no client data or backend change required to start.

## Notes

- Product descriptions vary: some use "Benefits attributed to:", some "Benefits Attributed to:", and different dash/bullet characters. Parser should be tolerant (e.g. case-insensitive match for the lead-in phrase, normalize common separators).
- Product Information (weight, material, etc.) is not preserved in this WP; WP-001 (when unblocked) will ensure weight is correct at product level if needed elsewhere later.
