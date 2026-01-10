# Product CSV Generator

This script generates a product import CSV file from the three JSON product files.

## Usage

```bash
node documentation/setup/generate-product-csv.js
```

## What it does

1. Reads all three product JSON files:
   - `tea-products.json`
   - `essential-oils.json`
   - `other-products.json`

2. Converts each product variant into a CSV row matching the MedusaJS import format

3. Generates `natures-elixir-products-import.csv` in the same directory

## Output

The generated CSV file will contain:
- **Header row**: All required CSV columns
- **Data rows**: One row per product variant (118 total variants from 53 products)

## CSV Format

The CSV matches the MedusaJS product import template format with these key mappings:

- **Product fields**: Handle, Title, Description, Status, Weight, etc.
- **Category**: Automatically converts category names to handles (e.g., "Tea" → "tea")
- **Shipping Profile**: Uses "default" profile
- **Prices**: EUR and GBP (GBP uses the "Variant Price USD" column)
- **Inventory**: `manage_inventory: false`, `allow_backorder: true` (as configured)
- **Variants**: Each variant becomes a separate row

## Import Instructions

After generating the CSV:

1. **Review the CSV file** to ensure all data is correct
2. **Import via Admin Dashboard**:
   - Go to Settings > Import/Export > Import Products
   - Upload the CSV file
   - Follow the import wizard

3. **Or use the API**:
   - Use MedusaJS Admin API to import products programmatically

## Notes

- All prices are in major currency units (EUR in euros, GBP in pounds)
- Product images are not included (add them manually after import)
- **Category IDs are hardcoded** in the script - if categories are recreated in Medusa, update the IDs in `getCategoryId()` function
- Categories must exist in Medusa before import (they're created by the seed script)
- Shipping profiles must exist (created by the seed script)

## Updating Category IDs

If you need to update category IDs after recreating categories:

1. Query the API to get current category IDs:
   ```bash
   curl -k -X GET "https://YOUR-BACKEND-URL/store/product-categories" \
     -H "x-publishable-api-key: YOUR_PUBLISHABLE_KEY" \
     -H "Content-Type: application/json" | jq '.product_categories[] | {id: .id, name: .name, handle: .handle}'
   ```

2. Update the `getCategoryId()` function in `generate-product-csv.js` with the new IDs

