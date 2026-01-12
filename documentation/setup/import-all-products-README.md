# Product Import Script

This script imports all products from the JSON files using the MedusaJS Admin API.

## Features

- ✅ Imports all products from `tea-products.json`, `essential-oils.json`, and `other-products.json`
- ✅ Automatically fetches required IDs (categories, shipping profiles, regions)
- ✅ Handles product options and variants correctly
- ✅ Skips existing products (optional)
- ✅ Dry run mode for validation
- ✅ Progress tracking and error reporting
- ✅ Comprehensive summary at the end

## Prerequisites

1. **Seed script has been run** - Categories, shipping profiles, and regions must exist
2. **Admin API key** - You need a secret API key (starts with `sk_`)
3. **Node.js** - Version 18+ (for native `fetch` support)

## Usage

### Basic Import

```bash
cd documentation/setup
BACKEND_URL="https://backend-production-8f25.up.railway.app" \
ADMIN_SECRET_KEY="sk_your_secret_key_here" \
node import-all-products.js
```

### Skip Existing Products

To skip products that already exist (by handle):

```bash
SKIP_EXISTING=true \
BACKEND_URL="https://backend-production-8f25.up.railway.app" \
ADMIN_SECRET_KEY="sk_your_secret_key_here" \
node import-all-products.js
```

### Dry Run (Validation Only)

To validate the import without actually creating products:

```bash
DRY_RUN=true \
BACKEND_URL="https://backend-production-8f25.up.railway.app" \
ADMIN_SECRET_KEY="sk_your_secret_key_here" \
node import-all-products.js
```

### Using Environment File

Create a `.env` file in `documentation/setup/`:

```bash
BACKEND_URL=https://backend-production-8f25.up.railway.app
ADMIN_SECRET_KEY=sk_your_secret_key_here
SKIP_EXISTING=true
```

Then run:

```bash
node import-all-products.js
```

## What It Does

1. **Tests API connection** - Verifies backend is accessible
2. **Loads required IDs**:
   - Product categories (maps names to IDs)
   - Shipping profiles (maps names to IDs)
   - Regions (uses "Europe" region)
   - Existing products (if `SKIP_EXISTING=true`)
3. **Loads products** from all three JSON files
4. **Converts each product** to Admin API format:
   - Maps category names to category IDs
   - Maps shipping profile names to profile IDs
   - Converts variants with options
   - Sets prices in EUR (major units)
5. **Creates products** via Admin API
6. **Reports progress** and errors

## Output

The script provides:
- Real-time progress for each product
- Success/error status for each product
- Final summary with statistics
- Detailed error messages for failed imports

### Example Output

```
🚀 Starting product import...

   Backend URL: https://backend-production-8f25.up.railway.app
   Skip Existing: true
   Dry Run: false

🔍 Testing API connection...
✅ API connection successful

📋 Loading required IDs...

   ✅ Loaded 4 categories
   ✅ Loaded 1 shipping profiles
   ✅ Using region: Europe (eur)
   ✅ Found 1 existing products (will skip duplicates)

📦 Loaded 32 products from tea-products.json
📦 Loaded 13 products from essential-oils.json
📦 Loaded 8 products from other-products.json

📊 Total products to import: 53

🔄 Starting import...

   [1/53] ✅ Created: Apricot Delight Tea
      ID: prod_01KEM86S1XKAEDCPRQAB7VK7X5
      Variants: 3
   [2/53] ⏭️  Skipped: Breakfast Tea (already exists)
   ...

============================================================
📊 Import Summary
============================================================
   Total products: 53
   ✅ Created: 52
   ⏭️  Skipped: 1
   ❌ Errors: 0
```

## Error Handling

The script handles common errors:

- **Network errors**: Clear error message with connection troubleshooting
- **Missing categories**: Lists available categories
- **Missing shipping profiles**: Lists available profiles
- **Invalid product data**: Detailed error message for each failed product
- **API errors**: Full error response from the API

## Troubleshooting

### "Category not found"

Make sure the seed script has created the categories. Check category names match exactly:
- "Tea"
- "Essential Oils"
- "Natural Sponges"
- etc.

### "Shipping profile not found"

The script maps:
- `"default"` → `"Default Shipping Profile"`
- `"fragile"` → `"Fragile Shipping Profile"`

Make sure these profiles exist (created by seed script).

### "Network error"

- Verify `BACKEND_URL` is correct
- Check your network connection
- Ensure the backend is running and accessible

### Rate Limiting

The script includes a 100ms delay between requests. If you encounter rate limiting:
- The script will show errors for affected products
- Re-run with `SKIP_EXISTING=true` to skip successfully created products

## Resuming Failed Imports

If some products fail to import:

1. Run with `SKIP_EXISTING=true` to skip successfully created products
2. Fix any data issues in the JSON files
3. Re-run the script

The script will only attempt to create products that don't already exist.

## Notes

- **Prices**: All prices are in major currency units (EUR) as required by MedusaJS 2.0
- **Inventory**: All products have `manage_inventory: false` and `allow_backorder: true`
- **Status**: Products are created with status from JSON (`published` or `draft`)
- **Images**: Product images are not included in the JSON - add them manually via admin dashboard

