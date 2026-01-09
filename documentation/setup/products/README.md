# Nature's Elixir - Product Data Files

This folder contains product data organized by category for easier management and import.

## File Structure

### `tea-products.json`

Contains all 32 tea products with their variants, pricing, and descriptions.

**Products included:**

- All tea varieties (Apricot Delight, Breakfast, Cacao, Calendula, Chamomile, etc.)
- Variants: 50g, 100g, 250g
- Pricing: EUR and GBP configured

### `essential-oils.json`

Contains all 13 essential oil products (Spartan Oils).

**Products included:**

- Lavender, Peppermint, Frankincense, Sandalwood, Cedarwood, Aniseed, Citronella, Eucalyptus, Tea Tree, Rosemary, May Chang, Bergamot
- Spartan Healing Oil
- Variants: 10g (all oils)
- Shipping Profile: fragile (glass containers)

### `other-products.json`

Contains all other product categories.

**Products included:**

- **Natural Sponges**: Natural Sea Sponge (1 product)
- **Wellness Supplements**: Shilajit (30g, 15g), Ashwagandha (30g), Moringa (30g), Gok Shura (5 products)
- **Other Products**: Tea Strainer (1 product)
- **Soap Products**: Aleppo Soap, Dead Sea Black Mud Soap (2 products)

## Usage

These JSON files can be used to:

1. Generate CSV import files for MedusaJS admin dashboard
2. Reference product data for bulk import
3. Update product information in batches
4. Maintain product catalog separately from code

## Notes

- All prices are in smallest currency unit (EUR in cents, GBP in pence)
- Tea products have complete pricing (50g: €8.75, 100g: €15.00, 250g: €35.00)
- Essential oils and other products have pricing set to 0 (to be configured)
- Descriptions have been pulled from the Shopify CSV where available
- Products without descriptions in the CSV still have placeholder text

## Inventory Management

**Inventory tracking is disabled** for all products (`manage_inventory: false`):

- Products are always available unless manually marked unavailable
- Jim's workflow: Sell and order when needed, manually mark items unavailable when out of stock
- No stock count tracking required
- To mark a product as unavailable: Unpublish the product or mark variant as unavailable in admin dashboard
- Perfect for small-scale merchant operations

## Combining Files

To combine all products back into a single file:

```bash
# Using jq (if available)
jq -s '.[0].description as $desc | .[0].csv_mapping as $map | {description: $desc, csv_mapping: $map, products: [.[].products[]], metadata: {total_products: ([.[].products[]] | length)}}' products/*.json > products-combined.json
```

Or use a simple script to merge the products arrays from all three files.
