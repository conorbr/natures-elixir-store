# WP-001: One Weight per Product

**Status: Blocked** – Inconsistent weight data in current sources. Accurate weights are required from the client before implementation.

## Summary

Client feedback: **one weight per product**. Weight is (or will be) available in the CSV; ensure the store uses a single weight per product and that data is correct end-to-end. This WP is blocked until the client supplies accurate weights; current product/JSON data is inconsistent and cannot be used as the source of truth.

## Current State

- **Product JSON** (`documentation/setup/products/*.json`): Already has one weight per product via `product_weight` (grams), e.g. 50, 100, 10, 30.
- **CSV**: `generate-product-csv.js` outputs **Product Weight** from `product_weight`; **Variant Weight** is left empty. So the CSV already has one weight per product (same value repeated per variant row).
- **Import** (`import-all-products.js`): Sends `weight` at **product** level only (line 259: `weight: productJson.product_weight`). Variants do not receive weight.
- **Medusa**: Product has a `weight` field; the import uses it. Variant-level weight is not set by our import.

So the pipeline is already “one weight per product”. This work package is to **confirm, document, fix any gaps, and optionally backfill/update existing products**.

## Scope

### In scope

1. **Data source**
   - Confirm every product has a weight in the source (JSON and/or CSV).
   - If any product is missing weight, client will source it; document the format (e.g. grams, integer).

2. **Import and backend**
   - Ensure product create/update uses **product-level weight only** (no variant weight).
   - If the Medusa admin or another import ever set variant weight, define whether we clear variant weight and rely solely on product weight.

3. **Existing products**
   - If the store already has products: either re-import from CSV or run an update (script or admin) so every product has the correct single weight from the CSV.

4. **Documentation**
   - Document where weight lives (product only), unit (grams), and that CSV/import use one weight per product.

### Out of scope (unless agreed)

- Changing weight unit (e.g. to kg) in the system.
- Displaying weight on the storefront (can be a separate WP if client wants it).

## Acceptance criteria

- [ ] Every product in the source (JSON/CSV) has a weight value; any gaps documented and client committed to supplying.
- [ ] Import and any product-update flows use **product-level weight only**; variant weight is not used for “one weight per product” logic.
- [ ] All existing products in the store have the correct weight (from CSV) applied at product level.
- [ ] Documentation updated: one weight per product, unit (grams), and where weight is set (product, not variant).

## Dependencies

- **Blocker**: Accurate weight data from the client for all products. Current data is inconsistent; do not proceed with import or backfill until client-supplied weights are available.
- CSV (or JSON) as source of truth for weight; client to provide or confirm any missing values.
- Access to Medusa Admin API for create/update (already used by `import-all-products.js`).

## Data details

- **Unit**: Grams (integer in JSON, e.g. `50`, `100`, `10`).
- **CSV column**: “Product Weight”.
- **Variant Weight**: Intentionally empty in generated CSV; do not populate for “one weight per product”.

## Notes

- Tea products in `tea-products.json` currently use e.g. `product_weight: 50` (base weight); other files use 10, 30, 50, 100 as appropriate.
- If updating existing products without full re-import, consider a small script that reads CSV by handle and PATCHes `weight` on the product via Admin API.
