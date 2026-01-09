# MedusaJS 2.0 Backend Configuration Options

This document outlines all the different ways you can configure a MedusaJS 2.0 backend, with a focus on what's best for Nature's Elixir.

## Configuration Layers

MedusaJS 2.0 has multiple layers of configuration:

1. **Infrastructure & Modules** (`medusa-config.js`) - Core system configuration
2. **Store Data** (Regions, Shipping, Products, etc.) - Business data configuration
3. **Environment Variables** - Runtime configuration

## Option 1: Seed Script (Recommended for Initial Setup)

### What It Is

A TypeScript script (`backend/src/scripts/seed.ts`) that programmatically sets up your store using MedusaJS workflows.

### What It Configures

- **Store settings** (currencies, sales channels)
- **Regions** (countries, currencies, payment providers)
- **Tax regions**
- **Stock locations** (warehouses/fulfillment centers)
- **Shipping profiles** and **shipping options**
- **Product categories**
- **Products** and **variants**
- **Inventory levels**
- **API keys** (publishable keys for storefront)

### How to Use

```bash
# Run the seed script
cd backend
pnpm seed
# or
npm run seed
```

### Pros

✅ **Reproducible** - Same configuration every time  
✅ **Version controlled** - Changes tracked in git  
✅ **Automated** - No manual clicking in admin  
✅ **Complete setup** - Can configure everything at once  
✅ **Idempotent** - Can run multiple times safely (checks for existing data)  
✅ **Best for initial setup** - Perfect for bootstrapping a new store

### Cons

❌ **Requires code changes** - Need to edit TypeScript  
❌ **Less flexible** - Harder to make quick changes  
❌ **Requires restart** - Need to run script after changes

### Best For

- **Initial store setup** (like Nature's Elixir)
- **Development environments**
- **Staging/production deployments**
- **Reproducible configurations**

### Example: What the Seed Script Does

```typescript
// Creates regions
await createRegionsWorkflow(container).run({
  input: {
    regions: [
      {
        name: "Ireland",
        currency_code: "eur",
        countries: ["ie"],
        payment_providers: ["pp_stripe_stripe"],
      },
    ],
  },
});

// Creates shipping options
await createShippingOptionsWorkflow(container).run({
  input: [
    {
      name: "Standard Shipping",
      price_type: "flat",
      prices: [{ currency_code: "eur", amount: 500 }], // €5.00
      // ... more config
    },
  ],
});
```

## Option 2: Admin Dashboard (Best for Ongoing Management)

### What It Is

A web-based UI accessible at `http://localhost:9000/app` (when backend is running) that provides a graphical interface for managing your store.

### What It Configures

- **Products** - Create, edit, manage products
- **Orders** - View and manage orders
- **Customers** - Customer management
- **Regions** - Create and edit regions
- **Shipping** - Configure shipping options
- **Tax** - Tax configuration
- **Settings** - Store settings
- **Inventory** - Stock levels and locations

### How to Access

1. Start the backend: `cd backend && pnpm dev`
2. Navigate to: `http://localhost:9000/app`
3. Login with admin credentials (created during initial setup)

### Pros

✅ **User-friendly** - No coding required  
✅ **Visual** - See what you're configuring  
✅ **Quick changes** - Make updates on the fly  
✅ **Best for ongoing management** - Perfect for day-to-day operations  
✅ **Product management** - Easy to add/edit products

### Cons

❌ **Manual** - Can't automate or version control  
❌ **Time-consuming** - Slower for bulk operations  
❌ **Not reproducible** - Hard to replicate exact setup  
❌ **Requires UI access** - Need to be logged in

### Best For

- **Ongoing product management** (adding new products)
- **Order management**
- **Quick configuration changes**
- **Non-technical users** (like Jim managing products)

## Option 3: REST API (For Automation/Integration)

### What It Is

Direct HTTP API calls to configure the backend programmatically.

### What It Configures

Everything that the admin dashboard can configure, but via HTTP requests.

### How to Use

```bash
# Example: Create a region via API
curl -X POST http://localhost:9000/admin/regions \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ireland",
    "currency_code": "eur",
    "countries": ["ie"]
  }'
```

### Pros

✅ **Automated** - Can be scripted  
✅ **Integration** - Works with external tools  
✅ **Flexible** - Can build custom tools

### Cons

❌ **Complex** - Requires API knowledge  
❌ **Authentication** - Need to manage tokens  
❌ **Not user-friendly** - Requires technical knowledge

### Best For

- **Automation scripts**
- **CI/CD pipelines**
- **Custom integrations**
- **Bulk operations**

## Option 4: medusa-config.js (Infrastructure Only)

### What It Is

The main configuration file (`backend/medusa-config.js`) that configures MedusaJS modules and infrastructure.

### What It Configures

- **Database connection**
- **Payment providers** (Stripe, PayPal, etc.)
- **Email providers** (Resend, SendGrid)
- **File storage** (MinIO, local)
- **Event bus** (Redis)
- **Workflow engine** (Redis)
- **Search** (MeiliSearch)
- **CORS settings**
- **Admin dashboard settings**

### What It Does NOT Configure

- ❌ Regions
- ❌ Shipping options
- ❌ Products
- ❌ Store settings (currencies, etc.)

### How to Use

Edit `backend/medusa-config.js` directly. Changes require backend restart.

### Example

```javascript
// Configure Stripe payment
{
  key: Modules.PAYMENT,
  resolve: '@medusajs/payment',
  options: {
    providers: [{
      resolve: '@medusajs/payment-stripe',
      id: 'stripe',
      options: {
        apiKey: STRIPE_API_KEY,
        webhookSecret: STRIPE_WEBHOOK_SECRET,
      },
    }],
  },
}
```

## Option 5: Environment Variables

### What It Is

Configuration via `.env` files that control runtime behavior.

### What It Configures

- **Database URLs**
- **API keys** (Stripe, Resend, etc.)
- **Service endpoints** (Redis, MinIO, MeiliSearch)
- **CORS origins**
- **Feature flags**

### How to Use

Create/update `.env` file in `backend/` directory:

```bash
DATABASE_URL=postgresql://...
STRIPE_API_KEY=sk_test_...
RESEND_API_KEY=re_...
```

### Best For

- **Sensitive data** (API keys, secrets)
- **Environment-specific config** (dev, staging, prod)
- **Service connections**

## Recommended Approach for Nature's Elixir

### Initial Setup: Seed Script

**Use the seed script** (`backend/src/scripts/seed.ts`) to bootstrap the entire store configuration:

1. ✅ Update the seed script with Nature's Elixir settings
2. ✅ Run `pnpm seed` to create:
   - Ireland region with EUR currency
   - Dublin stock location
   - Shipping options for Ireland
   - Product categories (Tea, Spartan Oils, Natural Sponges)
   - Sample products

### Ongoing Management: Admin Dashboard

**Use the admin dashboard** for day-to-day operations:

1. ✅ Add new products
2. ✅ Update inventory levels
3. ✅ Manage orders
4. ✅ Adjust shipping rates
5. ✅ Update product information

### Infrastructure: medusa-config.js + Environment Variables

**Use these for system-level configuration**:

1. ✅ Payment providers (already configured for Stripe)
2. ✅ Email service (already configured for Resend)
3. ✅ File storage (MinIO or local)
4. ✅ Environment-specific settings

## Configuration Workflow for Nature's Elixir

### Phase 1: Initial Bootstrap (Seed Script)

```bash
# 1. Update seed.ts with Nature's Elixir configuration
# 2. Run seed script
cd backend
pnpm seed
```

This creates:

- Ireland region
- Dublin stock location
- Shipping options
- Product categories
- Initial products

### Phase 2: Fine-tuning (Admin Dashboard)

```bash
# 1. Start backend
cd backend
pnpm dev

# 2. Access admin at http://localhost:9000/app
# 3. Make adjustments:
#    - Update shipping rates
#    - Add/edit products
#    - Configure tax settings
```

### Phase 3: Production (Environment Variables)

```bash
# 1. Set production environment variables
# 2. Update medusa-config.js if needed
# 3. Deploy
```

## What to Configure in Seed Script vs Admin

### Seed Script (Initial Setup)

- ✅ Regions and countries
- ✅ Stock locations
- ✅ Shipping profiles
- ✅ Shipping options (base configuration)
- ✅ Product categories
- ✅ Initial product catalog
- ✅ Store currencies
- ✅ Sales channels

### Admin Dashboard (Ongoing)

- ✅ Adding new products
- ✅ Updating product details
- ✅ Managing inventory
- ✅ Processing orders
- ✅ Adjusting shipping rates
- ✅ Customer management
- ✅ Promotions/discounts

## Summary

| Method                    | Best For           | Complexity | Reproducible |
| ------------------------- | ------------------ | ---------- | ------------ |
| **Seed Script**           | Initial setup      | Medium     | ✅ Yes       |
| **Admin Dashboard**       | Ongoing management | Low        | ❌ No        |
| **REST API**              | Automation         | High       | ✅ Yes       |
| **medusa-config.js**      | Infrastructure     | Low        | ✅ Yes       |
| **Environment Variables** | Secrets/config     | Low        | ✅ Yes       |

## Next Steps for Nature's Elixir

1. **Update seed script** with Ireland/Dublin configuration
2. **Run seed script** to bootstrap the store
3. **Use admin dashboard** for ongoing product management
4. **Keep seed script updated** for reproducible deployments

The seed script is perfect for your use case because:

- You can version control the configuration
- It's reproducible across environments
- It sets up everything at once
- Jim can then use the admin dashboard for day-to-day product management
