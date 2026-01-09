# MedusaJS 2.0 Store Data Configuration Options

This guide focuses specifically on **store data** configuration - regions, shipping, products, inventory, and other business data. This is separate from infrastructure configuration (payment providers, email services, etc.).

## What is Store Data?

Store data includes:

- **Regions** (countries, currencies, payment providers)
- **Shipping options** (rates, zones, profiles)
- **Stock locations** (warehouses, fulfillment centers)
- **Products** (items, variants, options)
- **Product categories**
- **Inventory levels**
- **Tax regions**
- **Sales channels**
- **Store settings** (currencies, default region)

## Configuration Methods for Store Data

### Option 1: Seed Script (Recommended for Initial Setup)

**File**: `backend/src/scripts/seed.ts`

#### What It Does

Uses MedusaJS workflows to programmatically create all store data:

```typescript
// Create regions
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

// Create shipping options
await createShippingOptionsWorkflow(container).run({
  input: [
    {
      name: "Standard Shipping",
      price_type: "flat",
      prices: [{ currency_code: "eur", amount: 500 }],
      // ... more config
    },
  ],
});

// Create products
await createProductsWorkflow(container).run({
  input: {
    products: [
      {
        title: "Organic Green Tea",
        // ... product config
      },
    ],
  },
});
```

#### How to Run

```bash
cd backend
pnpm seed
# or
npm run seed
```

#### Pros

✅ **Complete setup** - Creates everything in one go  
✅ **Reproducible** - Same data every time  
✅ **Version controlled** - Track changes in git  
✅ **Idempotent** - Safe to run multiple times  
✅ **Best for bootstrapping** - Perfect for new stores

#### Cons

❌ **Requires code changes** - Must edit TypeScript  
❌ **Less flexible** - Harder to make quick tweaks  
❌ **Requires script execution** - Need to run after changes

#### Best For

- Initial store setup (Nature's Elixir)
- Development environments
- Staging/production deployments
- Reproducible configurations

---

### Option 2: Admin Dashboard (Best for Ongoing Management)

**URL**: `http://localhost:9000/app` (when backend is running)

#### What It Does

Provides a web UI to manage store data through forms and interfaces.

#### Available Operations

**Regions**:

- Create/edit regions
- Add/remove countries
- Configure payment providers
- Set currency

**Shipping**:

- Create shipping options
- Set shipping rates
- Configure shipping zones
- Manage shipping profiles

**Products**:

- Create/edit products
- Manage variants and options
- Upload images
- Set pricing
- Manage inventory

**Inventory**:

- Set stock levels
- Manage stock locations
- Track inventory

**Categories**:

- Create product categories
- Organize products

#### How to Access

1. Start backend: `cd backend && pnpm dev`
2. Navigate to: `http://localhost:9000/app`
3. Login with admin credentials

#### Pros

✅ **User-friendly** - No coding required  
✅ **Visual** - See what you're configuring  
✅ **Quick changes** - Make updates instantly  
✅ **Best for ongoing management** - Perfect for day-to-day operations  
✅ **Product management** - Easy to add/edit products

#### Cons

❌ **Manual** - Can't automate  
❌ **Not version controlled** - Changes not tracked in git  
❌ **Time-consuming** - Slower for bulk operations  
❌ **Not reproducible** - Hard to replicate exact setup

#### Best For

- Adding new products (Jim's use case)
- Updating inventory levels
- Adjusting shipping rates
- Managing orders
- Quick configuration changes

---

### Option 3: REST API (For Automation/Integration)

**Base URL**: `http://localhost:9000/admin` (admin API) or `/store` (storefront API)

#### What It Does

Direct HTTP API calls to create/update store data programmatically.

#### Example API Calls

**Create Region**:

```bash
curl -X POST http://localhost:9000/admin/regions \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ireland",
    "currency_code": "eur",
    "countries": ["ie"],
    "payment_providers": ["pp_stripe_stripe"]
  }'
```

**Create Product**:

```bash
curl -X POST http://localhost:9000/admin/products \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Organic Green Tea",
    "description": "Premium organic green tea...",
    "handle": "organic-green-tea",
    "status": "published",
    "variants": [{
      "title": "50g",
      "prices": [{"currency_code": "eur", "amount": 1500}]
    }]
  }'
```

**Create Shipping Option**:

```bash
curl -X POST http://localhost:9000/admin/shipping-options \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Standard Shipping",
    "price_type": "flat",
    "prices": [{"currency_code": "eur", "amount": 500}],
    "service_zone_id": "zone_123",
    "shipping_profile_id": "profile_123"
  }'
```

#### Pros

✅ **Automated** - Can be scripted  
✅ **Integration** - Works with external tools  
✅ **Flexible** - Can build custom tools  
✅ **Programmatic** - Full control via code

#### Cons

❌ **Complex** - Requires API knowledge  
❌ **Authentication** - Need to manage tokens  
❌ **Not user-friendly** - Requires technical knowledge  
❌ **More code** - More verbose than seed script

#### Best For

- Automation scripts
- CI/CD pipelines
- Custom integrations
- Bulk operations
- External tool integration

---

### Option 4: MedusaJS SDK (Programmatic Access)

**Package**: `@medusajs/js-sdk` (already in storefront)

#### What It Is

JavaScript/TypeScript SDK for interacting with MedusaJS APIs programmatically.

#### Example Usage

```typescript
import Medusa from "@medusajs/js-sdk";

const medusa = new Medusa({
  baseUrl: "http://localhost:9000",
  publishableKey: "pk_...",
});

// For admin operations, you'd use the admin SDK
// This is more for storefront operations
```

#### Best For

- Storefront integrations
- Client-side operations
- Custom storefront features

---

## Comparison: Seed Script vs Admin Dashboard vs API

| Feature                | Seed Script        | Admin Dashboard | REST API         |
| ---------------------- | ------------------ | --------------- | ---------------- |
| **Initial Setup**      | ✅ Excellent       | ❌ Slow         | ✅ Good          |
| **Ongoing Management** | ❌ Requires code   | ✅ Excellent    | ⚠️ Complex       |
| **Reproducible**       | ✅ Yes             | ❌ No           | ✅ Yes           |
| **Version Control**    | ✅ Yes             | ❌ No           | ✅ Yes           |
| **User-Friendly**      | ⚠️ Requires coding | ✅ Very easy    | ❌ Technical     |
| **Bulk Operations**    | ✅ Good            | ❌ Slow         | ✅ Excellent     |
| **Quick Changes**      | ❌ Requires code   | ✅ Instant      | ⚠️ Requires code |
| **Automation**         | ✅ Yes             | ❌ No           | ✅ Yes           |

## Recommended Approach for Nature's Elixir

### Phase 1: Initial Setup → Seed Script

**Use the seed script** to bootstrap all store data:

1. **Update `backend/src/scripts/seed.ts`** with:

   - Ireland region (EUR currency)
   - Dublin stock location
   - Shipping options for Ireland
   - Product categories (Tea, Spartan Oils, Natural Sponges)
   - Initial product catalog

2. **Run the seed script**:

   ```bash
   cd backend
   pnpm seed
   ```

3. **Result**: Complete store configuration in one command

### Phase 2: Ongoing Management → Admin Dashboard

**Use the admin dashboard** for day-to-day operations:

1. **Start backend**: `cd backend && pnpm dev`
2. **Access admin**: `http://localhost:9000/app`
3. **Jim can**:
   - Add new products
   - Update inventory
   - Adjust shipping rates
   - Manage orders
   - Update product details

### Phase 3: Updates/Changes → Hybrid Approach

**For configuration changes**:

- **Major changes**: Update seed script (version controlled)
- **Quick tweaks**: Use admin dashboard
- **Bulk operations**: Use REST API or update seed script

## What Store Data to Configure Where

### Seed Script (Initial Setup)

✅ **Regions and Countries**

- Create Ireland region
- Set EUR as currency
- Configure payment providers

✅ **Stock Locations**

- Create Dublin stock location
- Link to fulfillment provider

✅ **Shipping Configuration**

- Create shipping profiles
- Create shipping options
- Set base shipping rates

✅ **Product Categories**

- Tea
- Spartan Oils
- Natural Sponges

✅ **Initial Products**

- Sample products for each category
- Variants and options
- Initial pricing

✅ **Store Settings**

- Supported currencies
- Default sales channel
- Store configuration

### Admin Dashboard (Ongoing)

✅ **Products**

- Add new products
- Update product details
- Upload images
- Adjust pricing

✅ **Inventory**

- Update stock levels
- Track inventory
- Manage stock locations

✅ **Shipping**

- Adjust shipping rates
- Add new shipping options
- Update shipping zones

✅ **Orders**

- View orders
- Process orders
- Manage fulfillment

✅ **Categories**

- Add new categories
- Organize products

### REST API (Automation)

✅ **Bulk Operations**

- Import products
- Update multiple items
- Sync with external systems

✅ **Automation**

- Scheduled updates
- Integration workflows
- Custom tools

## Workflow Example for Nature's Elixir

### Initial Setup (Seed Script)

```typescript
// 1. Create Ireland region
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

// 2. Create Dublin stock location
await createStockLocationsWorkflow(container).run({
  input: {
    locations: [
      {
        name: "Nature's Elixir - Dublin",
        address: {
          city: "Dublin",
          country_code: "IE",
          address_1: "123 Main St", // From Jim
        },
      },
    ],
  },
});

// 3. Create shipping options
await createShippingOptionsWorkflow(container).run({
  input: [
    {
      name: "Standard Shipping (Ireland)",
      price_type: "flat",
      prices: [{ currency_code: "eur", amount: 500 }], // €5.00
      // ... more config
    },
  ],
});

// 4. Create product categories
await createProductCategoriesWorkflow(container).run({
  input: {
    product_categories: [
      { name: "Tea", is_active: true },
      { name: "Spartan Oils", is_active: true },
      { name: "Natural Sponges", is_active: true },
    ],
  },
});

// 5. Create initial products
await createProductsWorkflow(container).run({
  input: {
    products: [
      // Tea products
      // Spartan Oil products
      // Natural Sponge products
    ],
  },
});
```

### Ongoing Management (Admin Dashboard)

1. Jim logs into admin dashboard
2. Adds new tea product:

   - Clicks "Add Product"
   - Fills in details
   - Uploads images
   - Sets price and inventory
   - Publishes

3. Updates inventory:
   - Views product
   - Updates stock level
   - Saves

## Key Takeaways

1. **Seed Script** = Initial setup, reproducible, version controlled
2. **Admin Dashboard** = Ongoing management, user-friendly, quick changes
3. **REST API** = Automation, bulk operations, integrations

**For Nature's Elixir**:

- **Start with seed script** to bootstrap everything
- **Use admin dashboard** for Jim's day-to-day product management
- **Update seed script** when making major configuration changes

## Next Steps

1. Update seed script with Nature's Elixir configuration
2. Run seed script to create initial store data
3. Use admin dashboard for ongoing product management
4. Keep seed script updated for reproducible deployments
