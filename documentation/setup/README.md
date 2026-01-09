# Initial Setup Documentation

This folder contains all documentation related to the initial setup and configuration of the Nature's Elixir store.

## Setup Approach

We're using a **CSV import + Admin Dashboard** approach:

1. **Product Import**: Use JSON product files to generate CSV for bulk product import
2. **Store Configuration**: Configure regions, shipping, and other settings via admin dashboard

## Setup Documentation

### Getting Started

1. **[Store Configuration Plan](./store-configuration-plan.md)** ⭐ **REQUIREMENTS GUIDE**

   - Complete requirements for store configuration
   - Use this as a checklist when configuring via admin dashboard
   - All configuration values and settings

2. **[Product JSON Files](./products/)** ⭐ **PRODUCT DATA**

   - `tea-products.json` - All 32 tea products with variants
   - `essential-oils.json` - All 12 essential oil products
   - `other-products.json` - Supplements, sponges, soaps, accessories
   - Use these to generate CSV for product import

3. **[Region Configuration Guide](./region-configuration-guide.md)**

   - Explains why UK is a separate region from Europe
   - Region structure and currency setup

4. **[Admin Dashboard Shipping Guide](./admin-dashboard-shipping-guide.md)** ⭐ **SHIPPING SETUP**

   - Step-by-step guide for configuring shipping in admin dashboard
   - How to create shipping options and set pricing
   - Troubleshooting tips

5. **[Medusa Configuration](./medusa-configuration.md)**
   - MedusaJS 2.0 specific configurations
   - Environment variables
   - Module configurations

## Setup Workflow

1. **Review** [Store Configuration Plan](./store-configuration-plan.md) for all requirements
2. **Generate CSV** from product JSON files for bulk import
3. **Configure Store Settings** via admin dashboard:
   - Regions (Europe with EUR, UK with GBP)
   - Stock locations (Dublin)
   - Shipping options and rates
   - Payment providers (Stripe)
4. **Import Products** via CSV import in admin dashboard
5. **Verify** all configurations match the requirements plan

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

## Store Configuration via Admin Dashboard

Use the admin dashboard to configure:

- **Regions**: Create Europe (EUR) and UK (GBP) regions
- **Shipping**: Set up shipping options and rates
- **Stock Locations**: Configure Dublin fulfillment center
- **Payment**: Ensure Stripe is configured
- **Categories**: Create product categories (Tea, Spartan Oils, Natural Sponges, etc.)

Refer to [Store Configuration Plan](./store-configuration-plan.md) for detailed requirements.

## Quick Reference

- **Product JSON Files**: `documentation/setup/products/`
- **Backend Config**: `backend/medusa-config.js`
- **Environment Variables**: `backend/src/lib/constants.ts`
- **Admin Dashboard**: `http://localhost:9000/app` (or Railway URL)

## Notes

- All setup documentation assumes the store is already deployed on Railway
- Products are imported via CSV generated from JSON files
- Store settings are configured manually via admin dashboard
- Product images can be added after import via admin dashboard
