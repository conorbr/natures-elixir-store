# Seed Script Requirements - Store Configuration

This document defines all requirements for the seed script that will configure the Nature's Elixir store. **Products are NOT included** - they will be imported separately via CSV.

## Purpose

The seed script will:

- Configure store settings (currencies, sales channels)
- Create regions (Europe/EUR and UK/GBP)
- Set up stock locations (Dublin)
- Configure shipping profiles, zones, and options
- Set up payment providers (Stripe)
- Create tax regions
- Configure fulfillment providers
- Create product categories (for CSV import reference)

**Products will be imported via CSV** - not included in seed script.

## 1. Store Settings

### Currencies

- **Primary Currency**: EUR (Euro) - `is_default: true`
- **Supported Currencies**:
  - EUR (Euro) - default
  - GBP (British Pound Sterling)

### Sales Channels

- **Default Sales Channel**:
  - Name: "Default Sales Channel"
  - Description: "Primary online store"
  - Set as store's default sales channel

## 2. Region Configuration

### Region 1: Europe (EUR)

- **Name**: "Europe"
- **Currency Code**: `eur`
- **Countries**:
  - `ie` - Ireland
  - `de` - Germany
  - `dk` - Denmark
  - `se` - Sweden
  - `fr` - France
  - `es` - Spain
  - `it` - Italy
- **Payment Providers**: `["pp_stripe_stripe"]`
- **Tax Provider**: `tp_system` (for all countries)

### Region 2: United Kingdom (GBP)

- **Name**: "United Kingdom"
- **Currency Code**: `gbp`
- **Countries**:
  - `gb` - United Kingdom
- **Payment Providers**: `["pp_stripe_stripe"]`
- **Tax Provider**: `tp_system`

**Note**: UK is separate from Europe due to:

- Different currency (GBP vs EUR)
- Post-Brexit regulations
- Different shipping requirements

## 3. Tax Regions

Create tax regions for all countries in both regions:

- `ie` - Ireland → `tp_system`
- `gb` - United Kingdom → `tp_system`
- `de` - Germany → `tp_system`
- `dk` - Denmark → `tp_system`
- `se` - Sweden → `tp_system`
- `fr` - France → `tp_system`
- `es` - Spain → `tp_system`
- `it` - Italy → `tp_system`

**Note**: Tax rates will need to be configured separately based on each country's VAT requirements.

## 4. Stock Location

### Primary Stock Location

- **Name**: "Nature's Elixir - Dublin"
- **Address**:
  - `city`: "Dublin"
  - `country_code`: "IE"
  - `address_1`: "" (empty - to be updated later)
- **Set as default location**: Yes
- **Link to sales channel**: Default Sales Channel
- **Link to fulfillment**: Yes (for manual fulfillment)

## 5. Shipping Configuration

### Shipping Profiles

#### Default Shipping Profile

- **Name**: "Default Shipping Profile"
- **Type**: `default`
- **Products**: All products (Tea, Essential Oils, Natural Sponges, etc.)

### Shipping Zones

#### Zone 1: Ireland

- **Name**: "Ireland"
- **Countries**: `["ie"]`
- **Fulfillment Set**: Linked to Dublin stock location

#### Zone 2: United Kingdom

- **Name**: "United Kingdom"
- **Countries**: `["gb"]`
- **Fulfillment Set**: Linked to Dublin stock location

#### Zone 3: Europe

- **Name**: "Europe"
- **Countries**: `["de", "dk", "se", "fr", "es", "it"]`
- **Fulfillment Set**: Linked to Dublin stock location

### Shipping Options

#### Ireland Shipping Options

**Standard Shipping (Ireland)**

- **Name**: "Standard Shipping (Ireland)"
- **Type**: `standard`
- **Price**: `500` (€5.00 in cents)
- **Currency**: `eur`
- **Zone**: Ireland
- **Profile**: Default Shipping Profile
- **Provider**: `manual_manual`
- **Rules**:
  - `is_return`: false
  - Enabled in store: true

**Express Shipping (Ireland)**

- **Name**: "Express Shipping (Ireland)"
- **Type**: `express`
- **Price**: `1000` (€10.00 in cents)
- **Currency**: `eur`
- **Zone**: Ireland
- **Profile**: Default Shipping Profile
- **Provider**: `manual_manual`
- **Rules**:
  - `is_return`: false
  - Enabled in store: true

**Free Shipping (Ireland - Orders Over €45)**

- **Name**: "Free Shipping"
- **Type**: `free`
- **Price**: `0` (€0.00)
- **Currency**: `eur`
- **Zone**: Ireland
- **Profile**: Default Shipping Profile
- **Provider**: `manual_manual`
- **Condition**: Order subtotal ≥ `4500` (€45.00 in cents)
- **Rules**:
  - `is_return`: false
  - Enabled in store: true

#### UK Shipping Options

**Standard Shipping (UK)**

- **Name**: "Standard Shipping (UK)"
- **Type**: `standard`
- **Price**: `500` (£5.00 in pence)
- **Currency**: `gbp`
- **Zone**: United Kingdom
- **Profile**: Default Shipping Profile
- **Provider**: `manual_manual`
- **Rules**:
  - `is_return`: false
  - Enabled in store: true

**Express Shipping (UK)**

- **Name**: "Express Shipping (UK)"
- **Type**: `express`
- **Price**: `1000` (£10.00 in pence)
- **Currency**: `gbp`
- **Zone**: United Kingdom
- **Profile**: Default Shipping Profile
- **Provider**: `manual_manual`
- **Rules**:
  - `is_return`: false
  - Enabled in store: true

**Free Shipping (UK - Orders Over £45)**

- **Name**: "Free Shipping (UK)"
- **Type**: `free`
- **Price**: `0` (£0.00)
- **Currency**: `gbp`
- **Zone**: United Kingdom
- **Profile**: Default Shipping Profile
- **Provider**: `manual_manual`
- **Condition**: Order subtotal ≥ `4500` (£45.00 in pence)
- **Rules**:
  - `is_return`: false
  - Enabled in store: true

#### Europe Shipping Options

**Standard Shipping (Europe)**

- **Name**: "Standard Shipping (Europe)"
- **Type**: `standard`
- **Price**: `500` (€5.00 in cents)
- **Currency**: `eur`
- **Zone**: Europe
- **Profile**: Default Shipping Profile
- **Provider**: `manual_manual`
- **Rules**:
  - `is_return`: false
  - Enabled in store: true

**Express Shipping (Europe)**

- **Name**: "Express Shipping (Europe)"
- **Type**: `express`
- **Price**: `1000` (€10.00 in cents)
- **Currency**: `eur`
- **Zone**: Europe
- **Profile**: Default Shipping Profile
- **Provider**: `manual_manual`
- **Rules**:
  - `is_return`: false
  - Enabled in store: true

**Free Shipping (Europe - Orders Over €45)**

- **Name**: "Free Shipping"
- **Type**: `free`
- **Price**: `0` (€0.00)
- **Currency**: `eur`
- **Zone**: Europe
- **Profile**: Default Shipping Profile
- **Provider**: `manual_manual`
- **Condition**: Order subtotal ≥ `4500` (€45.00 in cents)
- **Rules**:
  - `is_return`: false
  - Enabled in store: true

## 6. Payment Configuration

### Payment Providers

#### Stripe

- **Provider ID**: `pp_stripe_stripe`
- **Status**: Enabled (configured via environment variables)
- **Configuration**:
  - API Key: `STRIPE_API_KEY` (from environment)
  - Webhook Secret: `STRIPE_WEBHOOK_SECRET` (from environment)
- **Regions**: Both Europe and UK regions
- **Supported Methods**: Credit cards, debit cards, Apple Pay, Google Pay

**Note**: Stripe configuration is handled via `medusa-config.js` and environment variables. The seed script should ensure Stripe is available in both regions.

## 7. Product Categories

Create categories for product organization (products will reference these when imported via CSV):

### Category 1: Tea

- **Name**: "Tea"
- **Description**: "Various types of natural and organic teas"
- **Handle**: `tea`
- **Is Active**: `true`
- **Is Internal**: `false`

### Category 2: Essential Oils

- **Name**: "Essential Oils"
- **Description**: "Natural essential oils and oil products"
- **Handle**: `essential-oils`
- **Is Active**: `true`
- **Is Internal**: `false`

### Category 3: Natural Sponges

- **Name**: "Natural Sponges"
- **Description**: "Organic and natural sponge products"
- **Handle**: `natural-sponges`
- **Is Active**: `true`
- **Is Internal**: `false`

### Category 4: Wellness Supplements

- **Name**: "Wellness Supplements"
- **Description**: "Natural wellness and health supplements"
- **Handle**: `wellness-supplements`
- **Is Active**: `true`
- **Is Internal**: `false`

### Category 5: Soap Products

- **Name**: "Soap Products"
- **Description**: "Natural soap products"
- **Handle**: `soap-products`
- **Is Active**: `true`
- **Is Internal**: `false`

### Category 6: Accessories

- **Name**: "Accessories"
- **Description**: "Tea accessories and related products"
- **Handle**: `accessories`
- **Is Active**: `true`
- **Is Internal**: `false`

## 8. Fulfillment Configuration

### Fulfillment Provider

- **Provider ID**: `manual_manual`
- **Type**: Manual fulfillment
- **Process**:
  1. Order placed
  2. Payment confirmed
  3. Jim fulfills from garage
  4. Manual shipping label creation
  5. Order marked as shipped

### Fulfillment Sets

- **Name**: "Nature's Elixir - Dublin Delivery"
- **Type**: Shipping
- **Service Zones**: Ireland, UK, Europe
- **Linked to Stock Location**: Yes (Nature's Elixir - Dublin)

## 9. API Keys

### Publishable API Key

- **Name**: "Webshop"
- **Type**: Publishable
- **Purpose**: Storefront access
- **Linked to Sales Channel**: Default Sales Channel
- **Usage**: Storefront authentication

**Note**: API keys may need to be created manually or via separate workflow.

## 10. Implementation Notes

### Idempotency

The seed script should be **idempotent** - it should be safe to run multiple times:

- Check if resources exist before creating
- Update existing resources if they differ
- Don't create duplicates

### Error Handling

- Log all operations
- Handle errors gracefully
- Continue with remaining operations if one fails (where possible)

### Dependencies

Resources must be created in this order:

1. Store (already exists)
2. Sales Channels
3. Regions
4. Tax Regions
5. Stock Locations
6. Shipping Profiles
7. Shipping Zones
8. Shipping Options
9. Product Categories
10. Fulfillment Sets
11. API Keys

### Currency Amounts Reference

#### EUR (in cents)

- €5.00 = `500`
- €10.00 = `1000`
- €45.00 = `4500`

#### GBP (in pence)

- £5.00 = `500`
- £10.00 = `1000`
- £45.00 = `4500`

### Country Codes Reference

- Ireland: `ie`
- United Kingdom: `gb`
- Germany: `de`
- Denmark: `dk`
- Sweden: `se`
- France: `fr`
- Spain: `es`
- Italy: `it`

### Provider IDs Reference

- Stripe Payment: `pp_stripe_stripe`
- Manual Fulfillment: `manual_manual`
- System Tax: `tp_system`

## 11. What's NOT Included

The seed script should **NOT** include:

- ❌ Products (imported via CSV)
- ❌ Product variants (included in CSV)
- ❌ Product images (added via admin after import)
- ❌ Inventory levels (products use `manage_inventory: false`)
- ❌ Tax rates (configured separately based on country VAT)
- ❌ Admin users (created separately)
- ❌ Customer accounts (created via storefront)

## 12. Verification Checklist

After running the seed script, verify:

- [ ] Store has EUR (default) and GBP currencies
- [ ] Default Sales Channel exists and is set as default
- [ ] Europe region exists with EUR currency and 7 countries
- [ ] UK region exists with GBP currency and 1 country
- [ ] Tax regions exist for all 8 countries
- [ ] Dublin stock location exists and is set as default
- [ ] One shipping profile exists (Default Shipping Profile)
- [ ] Three shipping zones exist (Ireland, UK, Europe)
- [ ] 9 shipping options exist (3 per zone: standard, express, free)
- [ ] Free shipping conditions are set (€45 for EUR, £45 for GBP)
- [ ] Stripe is available in both regions
- [ ] 6 product categories exist
- [ ] Fulfillment sets are configured
- [ ] Publishable API key exists (if created by script)

## 13. Testing

After running the seed script:

1. **Admin Dashboard**: Verify all configurations appear correctly
2. **Storefront**: Verify regions, currencies, and shipping options work
3. **API**: Test API endpoints for regions, shipping, etc.
4. **Checkout Flow**: Test adding items to cart and checking out

## Notes

- All prices stored in smallest currency unit (cents/pence)
- Free shipping conditions use order subtotal (before shipping)
- Shipping options are linked to zones and profiles
- Only one shipping profile (Default) - no fragile items profile needed
- Products will be imported separately via CSV
- Inventory management is disabled for all products (handled manually)
