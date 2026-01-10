# Nature's Elixir - Store Configuration Plan

This document serves as the requirements guide for configuring the Nature's Elixir store via the admin dashboard. Use this to ensure all configurations are complete and accurate.

## Store Overview

- **Store Name**: Nature's Elixir
- **Domain**: natureselixir.com
- **Location**: Dublin, Ireland
- **Business Type**: Small-scale merchant, weekend markets + online store
- **Fulfillment**: Home garage in Dublin

## 1. Store Settings

### Currencies

- **Primary Currency**: EUR (Euro)
- **Supported Currencies**:
  - EUR (Euro) - primary
  - GBP (British Pound Sterling)
- **Reason**: Store serves Ireland, UK, and Europe

### Sales Channels

- **Default Sales Channel**: "Default Sales Channel"
- **Purpose**: Primary online store
- **Additional Channels**: None initially (can add market-specific channels later)

## 2. Region Configuration

**Current Approach**: Single Europe region that includes the UK with EUR currency. This simplifies the initial setup and can be expanded later if a separate UK region with GBP is needed.

### Single Region: Europe (EUR)

- **Region Name**: "Europe"
- **Currency**: EUR (Euro)
- **Countries**:
  - Ireland (IE)
  - United Kingdom (GB)
  - Germany (DE)
  - Denmark (DK)
  - Sweden (SE)
  - France (FR)
  - Spain (ES)
  - Italy (IT)
- **Payment Providers**:
  - Stripe (`pp_stripe_stripe`) - for credit card payments
- **Tax Provider**:
  - System tax provider (`tp_system`)

### Tax Regions

Tax regions for all supported countries:

- **Ireland (IE)**: `tp_system`
- **United Kingdom (GB)**: `tp_system`
- **Germany (DE)**: `tp_system`
- **Denmark (DK)**: `tp_system`
- **Sweden (SE)**: `tp_system`
- **France (FR)**: `tp_system`
- **Spain (ES)**: `tp_system`
- **Italy (IT)**: `tp_system`
- **Note**: Tax rates to be configured based on each country's VAT requirements

## 3. Stock Location

### Primary Stock Location

- **Name**: "Nature's Elixir - Dublin"
- **Type**: Fulfillment center (home garage)
- **Address**:
  - City: Dublin
  - Country: IE (Ireland)
  - Address Line 1: [To be provided by Jim]
  - Note: This is Jim's home garage where he fulfills orders

### Stock Location Configuration

- **Default Location**: Yes (set as store default)
- **Linked to Fulfillment**: Yes (manual fulfillment)
- **Linked to Sales Channel**: Yes (default sales channel)

## 4. Shipping Configuration

### Shipping Profiles

#### Default Shipping Profile

- **Name**: "Default Shipping Profile"
- **Type**: "default"
- **Products**: Tea, Natural Sponges (non-fragile items)

#### Fragile Items Profile

- **Name**: "Fragile Items (Oils)"
- **Type**: "custom"
- **Products**: Spartan Oils (glass containers, requires careful handling)
- **Note**: May need special packaging and insurance

### Shipping Zones

#### Ireland Zone

- **Name**: "Ireland"
- **Type**: Country-based zone
- **Countries**: Ireland (IE)
- **Fulfillment Set**: "Nature's Elixir - Dublin Delivery"

#### UK Zone

- **Name**: "United Kingdom"
- **Type**: Country-based zone
- **Countries**: United Kingdom (GB)
- **Fulfillment Set**: "Nature's Elixir - Dublin Delivery"

#### Europe Zone

- **Name**: "Europe"
- **Type**: Country-based zone
- **Countries**: Germany (DE), Denmark (DK), Sweden (SE), France (FR), Spain (ES), Italy (IT)
- **Fulfillment Set**: "Nature's Elixir - Dublin Delivery"

### Shipping Options

#### Standard Shipping (Ireland)

- **Name**: "Standard Shipping (Ireland)"
- **Type**: Standard
- **Description**: "Standard shipping within Ireland. Delivery in 3-5 business days."
- **Price Type**: Flat rate
- **Price**: €5.00 (500 cents)
- **Currency**: EUR
- **Provider**: Manual (`manual_manual`)
- **Zone**: Ireland
- **Profile**: Default Shipping Profile
- **Rules**:
  - Enabled in store: true
  - Is return: false

#### Express Shipping (Ireland)

- **Name**: "Express Shipping (Ireland)"
- **Type**: Express
- **Description**: "Express shipping within Ireland. Delivery in 1-2 business days."
- **Price Type**: Flat rate
- **Price**: €10.00 (1000 cents)
- **Currency**: EUR
- **Provider**: Manual (`manual_manual`)
- **Zone**: Ireland
- **Profile**: Default Shipping Profile (can be used for fragile items too)
- **Rules**:
  - Enabled in store: true
  - Is return: false

#### Standard Shipping (UK)

- **Name**: "Standard Shipping (UK)"
- **Type**: Standard
- **Description**: "Standard shipping to United Kingdom. Delivery in 5-7 business days."
- **Price Type**: Flat rate
- **Price**: €5.00 (500 cents)
- **Currency**: EUR
- **Provider**: Manual (`manual_manual`)
- **Zone**: United Kingdom
- **Profile**: Default Shipping Profile
- **Rules**:
  - Enabled in store: true
  - Is return: false

#### Express Shipping (UK)

- **Name**: "Express Shipping (UK)"
- **Type**: Express
- **Description**: "Express shipping to United Kingdom. Delivery in 2-3 business days."
- **Price Type**: Flat rate
- **Price**: €10.00 (1000 cents)
- **Currency**: EUR
- **Provider**: Manual (`manual_manual`)
- **Zone**: United Kingdom
- **Profile**: Default Shipping Profile (can be used for fragile items too)
- **Rules**:
  - Enabled in store: true
  - Is return: false

#### Standard Shipping (Europe)

- **Name**: "Standard Shipping (Europe)"
- **Type**: Standard
- **Description**: "Standard shipping to Europe. Delivery in 7-10 business days."
- **Price Type**: Flat rate
- **Price**: €5.00 (500 cents)
- **Currency**: EUR
- **Provider**: Manual (`manual_manual`)
- **Zone**: Europe
- **Profile**: Default Shipping Profile
- **Rules**:
  - Enabled in store: true
  - Is return: false

#### Express Shipping (Europe)

- **Name**: "Express Shipping (Europe)"
- **Type**: Express
- **Description**: "Express shipping to Europe. Delivery in 3-5 business days."
- **Price Type**: Flat rate
- **Price**: €10.00 (1000 cents)
- **Currency**: EUR
- **Provider**: Manual (`manual_manual`)
- **Zone**: Europe
- **Profile**: Default Shipping Profile (can be used for fragile items too)
- **Rules**:
  - Enabled in store: true
  - Is return: false

#### Free Shipping (Orders Over €45 - Ireland & Europe)

- **Name**: "Free Shipping"
- **Type**: Free
- **Description**: "Free shipping for orders over €45.00"
- **Price Type**: Free
- **Price**: €0.00 (0 cents)
- **Currency**: EUR
- **Provider**: Manual (`manual_manual`)
- **Zones**: Ireland, Europe
- **Profile**: Default Shipping Profile
- **Rules**:
  - Enabled in store: true
  - Is return: false
  - **Condition**: Order subtotal must be ≥ €45.00 (4500 cents)
  - **Note**: This applies to Ireland and Europe regions (EUR currency)

#### Free Shipping (Orders Over €45 - UK)

- **Name**: "Free Shipping (UK)"
- **Type**: Free
- **Description**: "Free shipping for orders over €45.00"
- **Price Type**: Free
- **Price**: €0.00 (0 cents)
- **Currency**: EUR
- **Provider**: Manual (`manual_manual`)
- **Zone**: United Kingdom
- **Profile**: Default Shipping Profile
- **Rules**:
  - Enabled in store: true
  - Is return: false
  - **Condition**: Order subtotal must be ≥ €45.00 (4500 cents)
  - **Note**: UK is included in Europe region with EUR currency

### Shipping Considerations

- **Ireland Shipping**: €5.00 standard, €10.00 express
- **UK Shipping**: €5.00 standard, €10.00 express (EUR pricing - UK included in Europe region)
- **Europe Shipping**: €5.00 standard, €10.00 express (EUR pricing)
- **Free Shipping**:
  - All zones (Ireland, UK, Europe): Orders over €45.00
- **International Shipping**: Consider restrictions for oils (hazmat regulations)
- **Note**: UK is included in the Europe region with EUR currency. This can be expanded later if a separate UK region with GBP is needed.

## 5. Payment Configuration

### Payment Providers

#### Stripe

- **Provider ID**: `pp_stripe_stripe`
- **Status**: Enabled
- **Configuration**:
  - API Key: Set via `STRIPE_API_KEY` environment variable
  - Webhook Secret: Set via `STRIPE_WEBHOOK_SECRET` environment variable
- **Region**: Ireland
- **Supported Methods**: Credit cards, debit cards

### Payment Flow

- **Payment Intent**: Stripe Payment Intents
- **Webhook Handling**: Required for payment status updates
- **Refund Policy**: [To be determined with client]

## 6. Product Categories

### Category Structure

1. **Tea**

   - Description: Various types of natural and organic teas
   - Active: Yes
   - Products: Tea products

2. **Spartan Oils**

   - Description: Natural oils and essential oil products
   - Active: Yes
   - Products: Oil products
   - Note: Fragile items, may require special shipping

3. **Natural Sponges**
   - Description: Organic and natural sponge products
   - Active: Yes
   - Products: Sponge products

## 7. Products Configuration

### Product Requirements

Each product should have:

- **Title**: Clear, descriptive name
- **Description**: Natural, authentic tone, health-focused
- **Handle**: URL-friendly slug
- **Status**: Published (for active products)
- **Weight**: In grams (for shipping calculations)
- **Shipping Profile**:
  - Default profile for Tea and Sponges
  - Fragile profile for Oils
- **Category**: Appropriate category
- **Images**: Product images (to be added via admin)
- **Variants**: Size/volume options
- **Pricing**: In EUR (amounts in cents)
- **Inventory**: Not tracked (Jim will manually mark items unavailable when out of stock)

### Sample Products (Initial Catalog)

#### Tea Products

**Organic Green Tea**

- Description: Premium organic green tea sourced from the finest tea gardens. Rich in antioxidants and naturally refreshing. Perfect for daily wellness and relaxation.
- Handle: `organic-green-tea`
- Weight: 100g (base weight)
- Category: Tea
- Shipping Profile: Default
- Variants:
  - 50g - €8.00 (800 cents) / £7.00 (700 pence) - SKU: `TEA-GREEN-50G`
  - 100g - €14.00 (1400 cents) / £12.00 (1200 pence) - SKU: `TEA-GREEN-100G`
  - 250g - €30.00 (3000 cents) / £26.00 (2600 pence) - SKU: `TEA-GREEN-250G`
- Inventory: Not tracked (manage_inventory: false)

**Additional Tea Products**: [To be added by Jim via admin dashboard]

#### Spartan Oil Products

**Lavender Essential Oil**

- Description: Pure lavender essential oil, known for its calming and soothing properties. Perfect for aromatherapy, relaxation, and natural wellness. 100% pure and natural.
- Handle: `lavender-essential-oil`
- Weight: 50g (base weight)
- Category: Spartan Oils
- Shipping Profile: Fragile Items (Oils)
- Variants:
  - 10ml - €12.00 (1200 cents) / £10.00 (1000 pence) - SKU: `OIL-LAVENDER-10ML`
  - 30ml - €30.00 (3000 cents) / £26.00 (2600 pence) - SKU: `OIL-LAVENDER-30ML`
  - 50ml - €45.00 (4500 cents) / £39.00 (3900 pence) - SKU: `OIL-LAVENDER-50ML`
- Inventory: Not tracked (manage_inventory: false)
- Note: Glass containers, requires careful packaging

**Additional Oil Products**: [To be added by Jim via admin dashboard]

#### Natural Sponge Products

**Natural Sea Sponge**

- Description: Premium natural sea sponge, sustainably harvested. Soft, durable, and perfect for gentle exfoliation and natural skincare. Eco-friendly and biodegradable.
- Handle: `natural-sea-sponge`
- Weight: 50g (base weight)
- Category: Natural Sponges
- Shipping Profile: Default
- Variants:
  - Small - €15.00 (1500 cents) / £13.00 (1300 pence) - SKU: `SPONGE-SEA-SMALL`
  - Medium - €25.00 (2500 cents) / £22.00 (2200 pence) - SKU: `SPONGE-SEA-MEDIUM`
  - Large - €35.00 (3500 cents) / £30.00 (3000 pence) - SKU: `SPONGE-SEA-LARGE`
- Inventory: Not tracked (manage_inventory: false)

**Additional Sponge Products**: [To be added by Jim via admin dashboard]

## 8. Inventory Configuration

### Inventory Management Approach

**Jim's Workflow**: Sell and order when needed, manually mark items unavailable when out of stock.

- **Track Inventory**: **No** (inventory management disabled for all products)
- **Stock Location**: Nature's Elixir - Dublin (for fulfillment reference only)
- **Inventory Settings**:
  - `manage_inventory: false` - Products are always available unless manually marked unavailable
  - `allow_backorder: true` - Allows orders even if inventory tracking is enabled (backup setting)
- **Out of Stock Management**:
  - Jim will manually unpublish products or mark variants as unavailable in admin dashboard when out of stock
  - No automatic inventory tracking or stock level management

### Benefits of This Approach

- ✅ No need to track stock counts
- ✅ Products always available unless manually marked unavailable
- ✅ Simple workflow: sell, order when needed, mark unavailable when out
- ✅ No low stock alerts or inventory management overhead
- ✅ Perfect for small-scale merchant operations

## 9. API Keys

### Publishable API Key

- **Name**: "Webshop"
- **Type**: Publishable
- **Purpose**: Storefront access
- **Linked to Sales Channel**: Default Sales Channel
- **Usage**: Storefront authentication

### Admin API Keys

- **To be generated**: Via admin dashboard as needed
- **Purpose**: Admin API access

## 10. Fulfillment Configuration

### Fulfillment Provider

- **Provider**: Manual (`manual_manual`)
- **Type**: Manual fulfillment
- **Process**:
  1. Order placed
  2. Payment confirmed
  3. Jim fulfills from garage
  4. Manual shipping label creation
  5. Order marked as shipped
  6. Tracking updated (if applicable)

### Fulfillment Set

- **Name**: "Nature's Elixir - Dublin Delivery"
- **Type**: Shipping
- **Service Zones**: Ireland
- **Linked to Stock Location**: Yes

## 11. Configuration Checklist

### Store Settings

- [x] EUR currency configured
- [x] Default sales channel created
- [x] Store linked to sales channel

### Region

- [x] Europe region created (includes UK)
- [x] EUR currency set
- [x] All countries added (IE, GB, DE, DK, SE, FR, ES, IT)
- [x] Stripe payment provider configured
- [x] Tax regions for all countries created

### Stock Location

- [x] Dublin stock location created
- [x] Set as default location
- [x] Linked to fulfillment
- [x] Linked to sales channel

### Shipping

- [x] Default shipping profile created
- [x] Fragile items profile created (for oils)
- [x] Ireland shipping zone created
- [x] Standard shipping option (€5.00)
- [x] Express shipping option (€10.00)
- [x] Shipping options linked to profiles and zones

### Products

- [x] Product categories created (Tea, Spartan Oils, Natural Sponges)
- [x] Sample products created
- [x] Product variants configured
- [x] Pricing set in EUR
- [x] Products published
- [x] Products linked to sales channel
- [x] Products linked to shipping profiles

### Inventory

- [x] Inventory levels set (placeholder values)
- [x] Stock location linked to inventory

### API Keys

- [x] Publishable API key created
- [x] API key linked to sales channel

## 12. Configuration Values Reference

### Currency Amounts

#### EUR (in cents)

- €5.00 = 500 cents
- €8.00 = 800 cents
- €10.00 = 1000 cents
- €12.00 = 1200 cents
- €14.00 = 1400 cents
- €15.00 = 1500 cents
- €20.00 = 2000 cents
- €25.00 = 2500 cents
- €30.00 = 3000 cents
- €35.00 = 3500 cents
- €45.00 = 4500 cents

**Note**: All prices are in EUR. UK customers will see prices in EUR. GBP can be added later if a separate UK region is created.

### Country Codes

- Ireland: `ie`
- United Kingdom: `gb`
- Germany: `de`
- Denmark: `dk`
- Sweden: `se`
- France: `fr`
- Spain: `es`
- Italy: `it`

### Payment Provider IDs

- Stripe: `pp_stripe_stripe`
- Manual: `pp_system_default` (not used, Stripe preferred)

### Fulfillment Provider IDs

- Manual: `manual_manual`

### Tax Provider IDs

- System: `tp_system`

## 13. Future Considerations

### Potential Expansions

- **Additional EU Countries**: Add more European countries if needed
- **Additional Currencies**: Add more currencies if expanding further
- **Additional Payment Methods**: PayPal, etc. (if needed)
- **Subscription Products**: Tea subscriptions (if applicable)
- **Bulk Discounts**: Volume pricing (if applicable)
- **Regional Pricing**: Different prices for different regions (if needed)

### Configuration Updates Needed

- [ ] Actual Dublin address for stock location
- [ ] Real inventory levels (replace placeholder 1,000,000)
- [ ] Product images (add via admin dashboard)
- [ ] Tax rates (configure Irish VAT rates)
- [ ] Return policy configuration
- [ ] Shipping carrier integration (if automating labels)
- [ ] Low stock alert thresholds

## 14. Configuration Checklist

Use this document to verify all configurations are complete when setting up via admin dashboard:

1. ✅ All store settings are correct
2. ✅ Region is configured for Ireland
3. ✅ Stock location is Dublin
4. ✅ Shipping is configured for Ireland
5. ✅ Payment provider is Stripe
6. ✅ Product categories are correct
7. ✅ Sample products are created
8. ✅ Inventory is set up
9. ✅ API keys are created

## 15. Verification Steps

After completing the configuration via admin dashboard, verify:

1. **Admin Dashboard** (`http://localhost:9000/app`):

   - Region shows "Ireland" with EUR
   - Stock location shows "Nature's Elixir - Dublin"
   - Products show Tea, Spartan Oils, Natural Sponges
   - Shipping options show Ireland shipping

2. **Storefront** (`http://localhost:8000`):

   - Products display correctly
   - Prices show in EUR
   - Shipping options available
   - Can add to cart
   - Checkout works with Stripe

3. **Database**:
   - Regions table has Ireland
   - Products table has Nature's Elixir products
   - Categories table has correct categories
   - Shipping options configured

## Notes

- All prices are in EUR (amounts stored in cents)
- Inventory levels are placeholders and should be updated
- Product images are empty and should be added via admin
- Address details need to be provided by Jim
- Tax rates need to be configured for Ireland
- This is a living document - update as requirements change
