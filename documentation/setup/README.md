# Initial Setup Documentation

This folder contains all documentation related to the initial setup and configuration of the Nature's Elixir store.

## Setup Approach

We're using a **Seed Script + CSV Import** approach:

1. **Store Configuration**: Seed script configures regions, shipping, stock locations, categories, etc.
2. **Product Import**: Use JSON product files to generate CSV for bulk product import

## Setup Documentation

### Getting Started

1. **[Seed Script Requirements](./seed-script-requirements.md)** ⭐ **SEED SCRIPT GUIDE**

   - Complete requirements for seed script implementation
   - All store configuration values and settings
   - What to include and what to exclude (products via CSV)
   - Use this to build the seed script

2. **[Store Configuration Plan](./store-configuration-plan.md)** ⭐ **REFERENCE GUIDE**

   - Complete requirements for store configuration (reference)
   - All configuration values and settings
   - Useful for understanding the full setup

3. **[Product JSON Files](./products/)** ⭐ **PRODUCT DATA**

   - `tea-products.json` - All 32 tea products with variants
   - `essential-oils.json` - All 12 essential oil products
   - `other-products.json` - Supplements, sponges, soaps, accessories
   - Use these to generate CSV for product import

4. **[Region Configuration Guide](./region-configuration-guide.md)**

   - Explains why UK is a separate region from Europe
   - Region structure and currency setup

5. **[Admin Dashboard Shipping Guide](./admin-dashboard-shipping-guide.md)** ⭐ **SHIPPING SETUP**

   - Step-by-step guide for configuring shipping in admin dashboard
   - How to create shipping options and set pricing
   - Troubleshooting tips

6. **[Medusa Configuration](./medusa-configuration.md)**
   - MedusaJS 2.0 specific configurations
   - Environment variables
   - Module configurations

## Setup Workflow

1. **Review** [Seed Script Requirements](./seed-script-requirements.md) for all requirements
2. **Run Seed Script** to configure:
   - Store settings (currencies, sales channels)
   - Regions (Europe with EUR, UK with GBP)
   - Stock locations (Dublin)
   - Shipping profiles, zones, and options
   - Payment providers (Stripe)
   - Product categories
3. **Generate CSV** from product JSON files for bulk import
4. **Import Products** via CSV import in admin dashboard
5. **Verify** all configurations match the requirements

## Product Import Process

### Step 1: Generate CSV from JSON

The product JSON files in `./products/` contain all product data. Convert these to CSV format for import:

- Product details (title, description, handle)
- Variants (sizes, SKUs, prices)
- Categories
- Shipping profiles

### Step 2: Import via Admin Dashboard

1. Access admin dashboard: `http://localhost:9000/app` (or your Railway URL)
2. Navigate to Products → Import
3. Upload the generated CSV file
4. Verify products are imported correctly

## Store Configuration via Seed Script

The seed script (`backend/src/scripts/seed.ts`) will automatically configure:

- **Store Settings**: Currencies (EUR, GBP), sales channels
- **Regions**: Europe (EUR) and UK (GBP) with countries
- **Shipping**: Profiles, zones, and options with pricing
- **Stock Locations**: Dublin fulfillment center
- **Payment**: Stripe integration in both regions
- **Categories**: Product categories for CSV import reference

Refer to [Seed Script Requirements](./seed-script-requirements.md) for detailed requirements.

## Quick Reference

- **Product JSON Files**: `documentation/setup/products/`
- **Backend Config**: `backend/medusa-config.js`
- **Environment Variables**: `backend/src/lib/constants.ts`
- **Admin Dashboard**: `http://localhost:9000/app` (or Railway URL)

## Notes

- All setup documentation assumes the store is already deployed on Railway
- Store configuration is done via seed script (`backend/src/scripts/seed.ts`)
- Products are imported via CSV generated from JSON files
- Product images can be added after import via admin dashboard
- Seed script should be idempotent (safe to run multiple times)
