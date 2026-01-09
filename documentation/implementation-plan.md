# Nature's Elixir - Implementation Plan

## Overview

This document outlines the complete implementation plan for transforming the default MedusaJS 2.0 storefront into Nature's Elixir (natureselixir.com), a specialized e-commerce store selling tea, spartan oils, and natural sponges.

## Current State Analysis

### Default Configuration

**Backend (Current State)**:

- Region: Europe (EUR default, USD secondary)
- Countries: GB, DE, DK, SE, FR, ES, IT
- Stock Location: European Warehouse (Copenhagen, DK)
- Payment: Manual payment provider (`pp_system_default`)
- Shipping: Standard & Express (flat rate €10/$10)
- Products: Demo clothing items (T-shirts, Sweatshirts, Pants, Merch)
- Categories: Shirts, Sweatshirts, Pants, Merch

**Storefront**:

- Default MedusaJS storefront
- Next.js 14 App Router
- Default branding and styling
- Payment: Stripe configured in `medusa-config.js` but needs to be set up in regions

**Email**:

- Resend configured
- Default email templates

## Implementation Phases

### Phase 1: Backend Configuration & Setup

#### 1.1 Update Store Configuration

- [ ] Keep EUR as default currency (Ireland-based)
- [ ] Update supported currencies (EUR primary, consider GBP for UK)
- [ ] Update store name/branding references
- [ ] Keep it simple - small-scale merchant focus

#### 1.2 Configure Regions & Countries

- [ ] Update Europe region to focus on Ireland
  - Currency: EUR (primary)
  - Countries: Ireland (IE) as primary
  - Consider: UK (GB) for potential expansion
  - Payment providers: Stripe (`pp_stripe_stripe`)
- [ ] Update tax regions for Ireland
- [ ] Consider UK tax region if expanding there

#### 1.3 Update Stock Locations

- [ ] Update "European Warehouse" to reflect Dublin location
  - Name: "Nature's Elixir - Dublin" or "Jim's Garage"
  - Address: Dublin, Ireland (specific address from client)
  - Country: IE (Ireland)
  - Note: This is a home garage fulfillment center

#### 1.4 Configure Shipping

**📖 See detailed guide**: `documentation/setup/admin-dashboard-shipping-guide.md`

- [ ] Create shipping profiles
  - Default profile (Tea, Natural Sponges)
  - Fragile items profile (Spartan Oils)
- [ ] Create service zones
  - Ireland zone (IE)
  - United Kingdom zone (GB)
  - Europe zone (DE, DK, SE, FR, ES, IT)
- [ ] Configure shipping options (Settings → Shipping → Shipping Options)
  - Standard Shipping (Ireland): €5.00
  - Express Shipping (Ireland): €10.00
  - Standard Shipping (UK): £5.00
  - Express Shipping (UK): £10.00
  - Standard Shipping (Europe): €5.00
  - Express Shipping (Europe): €10.00
  - Free Shipping: Orders over €45.00 (Ireland and Europe regions)
  - Free Shipping: Orders over £45.00 (UK region)

#### 1.5 Configure Payment

- [ ] Configure Stripe payment provider in regions via admin dashboard
- [ ] Ensure Stripe is properly configured in `medusa-config.js`
- [ ] Test payment flow

#### 1.6 Create Product Categories

- [ ] Tea
- [ ] Spartan Oils
- [ ] Natural Sponges
- [ ] Wellness Supplements
- [ ] Other Products
- [ ] Soap Products

#### 1.7 Import Products

- [ ] Import Tea products (32 products)
  - Variants: 50g, 100g, 250g
  - Pricing: Configured in JSON (€8.75, €15.00, €35.00)
  - Inventory: Not tracked (manage_inventory: false) - Jim will manually mark unavailable when out of stock
- [ ] Import Essential Oil products (13 products)
  - Variants: 10g (all oils)
  - Pricing: [To be configured]
  - Inventory: Not tracked (manage_inventory: false)
  - Shipping Profile: Fragile (glass containers)
- [ ] Import Natural Sponge products (1 product)
  - Variants: Small, Medium, Large
  - Pricing: [To be configured]
  - Inventory: Not tracked (manage_inventory: false)
- [ ] Import Wellness Supplement products (4 products)
  - Shilajit (15g, 30g variants), Ashwagandha, Moringa, Gok Shura
  - Pricing: [To be configured]
  - Inventory: Not tracked (manage_inventory: false)
- [ ] Import Other Products (1 product)
  - Tea Strainer
  - Pricing: [To be configured]
  - Inventory: Not tracked (manage_inventory: false)
- [ ] Import Soap Products (2 products)
  - Aleppo Soap, Dead Sea Black Mud Soap
  - Pricing: [To be configured]
  - Inventory: Not tracked (manage_inventory: false)

### Phase 2: Email Customization

#### 2.1 Brand Email Templates

- [ ] Update base email template
  - Nature's Elixir branding
  - Natural color palette
  - Health-focused design
- [ ] Customize order confirmation email
  - Brand colors and logo
  - Natural, authentic tone
- [ ] Customize user invitation email
  - Welcome message aligned with brand
- [ ] Test all email templates
  - Order confirmation
  - Password reset
  - Account verification

#### 2.2 Email Content

- [ ] Review and update email copy
  - Natural, authentic tone
  - Health-focused messaging
  - Professional but warm

### Phase 3: Storefront Customization

#### 3.1 Branding & Design

- [ ] Update site metadata
  - Site name: "Nature's Elixir"
  - Description: [To be determined]
  - Logo: [To be provided by client]
- [ ] Customize color scheme
  - Natural color palette
  - Health-focused aesthetic
- [ ] Update typography
  - [To be determined with client]
- [ ] Customize homepage
  - Hero section
  - Featured products
  - Brand messaging

#### 3.2 Product Pages

- [ ] Ensure product pages work well for all product types
- [ ] Customize product display for:
  - Tea (size, variety options)
  - Spartan Oils (volume, type options)
  - Natural Sponges (size, type options)
- [ ] Add product-specific information
  - Usage instructions for oils
  - Care instructions for sponges
  - Brewing instructions for tea

#### 3.3 Navigation & Categories

- [ ] Update navigation menu
  - Tea category
  - Spartan Oils category
  - Natural Sponges category
  - Wellness Supplements category
  - Other Products category
  - Soap Products category
- [ ] Create category pages
  - Tea collection page
  - Spartan Oils collection page
  - Natural Sponges collection page
  - Wellness Supplements collection page
  - Other Products collection page
  - Soap Products collection page

#### 3.4 Checkout Flow

- [ ] Ensure Stripe payment integration works
- [ ] Test checkout process
- [ ] Verify shipping calculations
- [ ] Test order confirmation

### Phase 4: Content & Product Data

#### 4.1 Product Information

- [ ] Gather product details from client
  - Product names and descriptions
  - Pricing
  - Images
  - Variants and options
  - Inventory levels
- [ ] Create product data structure
- [ ] Upload product images
- [ ] Write product descriptions
  - Natural, authentic tone
  - Health benefits (where applicable)
  - Usage instructions

#### 4.2 Site Content

- [ ] Homepage content
- [ ] About page (if needed)
- [ ] Shipping policy
- [ ] Return policy
- [ ] Terms of service
- [ ] Privacy policy

### Phase 5: Testing & Quality Assurance

#### 5.1 Functional Testing

- [ ] Test product browsing
- [ ] Test product filtering and search
- [ ] Test add to cart functionality
- [ ] Test checkout process
- [ ] Test payment processing
- [ ] Test order confirmation emails
- [ ] Test shipping calculations
- [ ] Test inventory management

#### 5.2 User Experience Testing

- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility
- [ ] Page load performance
- [ ] Navigation flow
- [ ] Form validation

#### 5.3 Business Logic Testing

- [ ] Shipping rules
- [ ] Tax calculations
- [ ] Inventory tracking
- [ ] Order fulfillment workflow

### Phase 6: Production Preparation

#### 6.1 Environment Configuration

- [ ] Set up production environment variables
- [ ] Configure production domains
- [ ] Set up SSL certificates
- [ ] Configure CORS for production

#### 6.2 Third-Party Services

- [ ] Configure Resend for production
  - Domain authentication (SPF, DKIM)
  - Production API keys
- [ ] Configure Stripe for production
  - Production API keys
  - Webhook endpoints
- [ ] Configure MinIO (if using cloud storage)
- [ ] Configure MeiliSearch (if using)

#### 6.3 Database & Data

- [ ] Run migrations
- [ ] Import products via CSV in admin dashboard
- [ ] Verify all configurations

#### 6.4 Monitoring & Analytics

- [ ] Set up error monitoring
- [ ] Configure analytics (if needed)
- [ ] Set up logging

## Detailed Implementation Steps

### Step 1: Configure Store Settings via Admin Dashboard

**Access**: Admin Dashboard at `http://localhost:9000/app` (or Railway URL)

**Configuration needed**:

1. Update store currencies (EUR primary, GBP secondary)
2. Create/update regions:
   - Europe region (EUR) with Ireland and other EU countries
   - United Kingdom region (GBP)
3. Update stock location to Dublin, Ireland
4. Configure shipping zones and options:
   - Ireland domestic shipping
   - UK shipping
   - Europe shipping
5. Configure payment provider (Stripe) in regions
6. Create product categories (Tea, Spartan Oils, Natural Sponges, Wellness Supplements, Other Products, Soap Products)
7. Delete demo products (if present)

**Key decisions needed from client**:

- Dublin address for stock location
- Shipping rates:
  - Ireland: €5.00 standard, €10.00 express
  - UK: £5.00 standard, £10.00 express
  - Europe: €5.00 standard, €10.00 express
- Product pricing (some products already have pricing in JSON)
- Product variants and options (already defined in JSON)

### Step 2: Customize Email Templates

**Files**:

- `backend/src/modules/email-notifications/templates/base.tsx`
- `backend/src/modules/email-notifications/templates/order-placed.tsx`
- `backend/src/modules/email-notifications/templates/invite-user.tsx`

**Changes needed**:

1. Add Nature's Elixir branding
2. Update colors to natural palette
3. Update copy to match brand tone
4. Add logo (when available)

### Step 3: Storefront Branding

**Files to update**:

- `storefront/src/app/layout.tsx` - Site metadata
- `storefront/src/styles/globals.css` - Color scheme
- `storefront/src/app/[countryCode]/(main)/page.tsx` - Homepage
- Navigation components

**Changes needed**:

1. Update site name and metadata
2. Customize color scheme
3. Update homepage content
4. Add logo (when available)

### Step 4: Product Configuration

**Approach**:

1. Create product categories via admin dashboard (Tea, Spartan Oils, Natural Sponges, Wellness Supplements, Other Products, Soap Products)
2. Generate CSV from product JSON files
3. Import products via CSV import in admin dashboard
4. Configure pricing for products that need it (essential oils, supplements, etc.)
5. Upload product images via admin dashboard

## Configuration Checklist

### Backend Configuration

- [ ] Store currencies updated (EUR primary, GBP secondary)
- [ ] Europe region created (EUR) with Ireland and EU countries
- [ ] United Kingdom region created (GBP)
- [ ] Dublin stock location configured
- [ ] Shipping zones configured for Ireland, UK, and Europe
- [ ] Shipping profiles created (default, fragile)
- [ ] Shipping options and rates configured
- [ ] Stripe payment configured in regions via admin dashboard
- [ ] Product categories created (Tea, Spartan Oils, Natural Sponges, Wellness Supplements, Other Products, Soap Products)
- [ ] Products imported via CSV

### Email Configuration

- [ ] Base template customized
- [ ] Order confirmation template customized
- [ ] User invitation template customized
- [ ] All emails tested
- [ ] Resend domain authenticated

### Storefront Configuration

- [ ] Site metadata updated
- [ ] Branding applied
- [ ] Homepage customized
- [ ] Navigation updated
- [ ] Category pages created (all 6 categories)
- [ ] Product pages verified

### Production Configuration

- [ ] Environment variables set
- [ ] Domains configured
- [ ] SSL certificates installed
- [ ] CORS configured
- [ ] All services connected
- [ ] Products imported via CSV

## Questions for Client (Jim)

### Business Configuration

1. What is your Dublin address for the stock location? (Home garage address)
2. Shipping rates confirmed:
   - Ireland: €5.00 standard, €10.00 express
   - UK: £5.00 standard, £10.00 express
   - Europe: €5.00 standard, €10.00 express
3. UK shipping: Yes, configured
4. EU shipping: Yes, configured
5. Primary currency: EUR (Ireland) - confirmed
6. What countries should be supported? (Ireland primary, UK/EU if applicable)

### Product Information

1. What are the specific tea products to sell?
2. What are the specific spartan oil products?
3. What are the specific natural sponge products?
4. What are the pricing for each product?
5. What variants/options are needed for each product type?
6. What are the inventory levels?

### Branding

1. Do you have a logo?
2. What are the brand colors?
3. What is the brand tone/style? (Simple, personal, local merchant feel)
4. Do you have product images? (Can use market photos?)
5. What is the brand story/messaging? (Local Dublin merchant, weekend markets)
6. Should the store mention your market presence? (e.g., "Also find us at weekend markets in Dublin")

### Shipping & Fulfillment

1. What shipping carriers do you want to use? (An Post, DHL, etc.)
2. Shipping rates:
   - Ireland: €5.00 standard, €10.00 express
   - UK: £5.00 standard, £10.00 express
   - Europe: €5.00 standard, €10.00 express
3. Free shipping: Yes, for orders over €45.00 (configured)
4. What is the return policy?
5. How do you handle fulfillment? (Manual from garage - confirmed)
6. What are typical order processing times? (Given it's a small-scale operation)

### Payment

1. Stripe account ready?
2. Any specific payment requirements?

## Timeline Estimate

### Phase 1: Backend Configuration (2-3 days)

- Configure store settings via admin dashboard
- Configure regions, shipping, payment via admin dashboard
- Create product categories (all 6 categories) via admin dashboard
- Generate CSV from product JSON files
- Import products via CSV in admin dashboard

### Phase 2: Email Customization (1 day)

- Customize templates
- Test emails

### Phase 3: Storefront Customization (1-2 days)

- Update branding (keep it simple for small-scale merchant)
- Customize homepage (mention market presence if desired)
- Update navigation
- Keep design simple and straightforward

### Phase 4: Content & Product Data (1-2 days)

- Gather product information
- Create product data
- Upload images

### Phase 5: Testing (1-2 days)

- Functional testing
- UX testing
- Business logic testing

### Phase 6: Production Prep (1 day)

- Environment setup
- Final configurations
- Go-live checklist

**Total Estimated Time**: 6-10 days (simplified for small-scale merchant, depending on client response time for questions)

**Note**: Timeline may be shorter given the focus on simplicity and small-scale operations. The store should be straightforward and easy to manage.

## Next Steps

1. **Immediate**: Review this plan with client
2. **Gather Information**: Get answers to client questions
3. **Start Phase 1**: Begin backend configuration updates
4. **Iterate**: Work through phases systematically
5. **Test**: Thorough testing before launch
6. **Launch**: Deploy to production

## Notes

- This plan assumes starting from default MedusaJS 2.0 implementation
- All customizations should maintain MedusaJS 2.0 best practices
- Documentation should be updated as changes are made
- Client feedback should be incorporated throughout the process
