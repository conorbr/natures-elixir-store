# Nature's Elixir - Deployment Context

## Current Deployment Status

**Important**: This project was forked from the [MedusaJS 2.0 Railway Boilerplate](https://github.com/rpuls/medusajs-2.0-for-railway-boilerplate) and is **already deployed on Railway**. The seed script has **already run**, meaning the database contains the default demo data.

### Source Repository

This project is based on:

- **Repository**: [rpuls/medusajs-2.0-for-railway-boilerplate](https://github.com/rpuls/medusajs-2.0-for-railway-boilerplate)
- **Version**: MedusaJS 2.12.1
- **Features**: Preconfigured with MinIO, Resend, Stripe, MeiliSearch
- **Deployment**: Railway template with automatic setup
- **Documentation**: [Deploy guide and video instructions](https://funkyton.com/medusajs-2-0-is-finally-here/)

### Railway Template Details

When deployed via Railway template:

- **Automatic setup**: Database, Redis, MinIO, and MeiliSearch are automatically provisioned
- **Seed script runs automatically**: The `seed.ts` script executes on initial deployment
- **Environment variables**: Automatically configured for Railway services
- **One-click deploy**: [Railway template link](https://railway.com/deploy/gkU-27?referralCode=-Yg50p)

## What This Means

### Existing Data in Database

The database currently contains:

- ✅ Default Europe region (EUR currency, multiple countries)
- ✅ European Warehouse stock location (Copenhagen, DK)
- ✅ Default shipping options (Standard & Express)
- ✅ Demo product categories (Shirts, Sweatshirts, Pants, Merch)
- ✅ Demo products (T-shirts, etc.)
- ✅ Default sales channel
- ✅ API keys

### Implications

1. **Cannot simply re-run seed script** - Would create duplicate data or conflicts
2. **Need to update existing data** - Rather than create new
3. **Production database** - Changes need to be careful and tested
4. **Idempotent updates needed** - Scripts should handle existing data gracefully

## Options for Updating Store Data

### Option 1: Update Seed Script (Idempotent Updates)

**Approach**: Modify seed script to update existing data instead of creating new.

**How it works**:

- Check if data exists
- Update if exists, create if doesn't
- Safe to run multiple times

**Pros**:
✅ Version controlled
✅ Reproducible
✅ Can be run safely multiple times

**Cons**:
❌ Requires careful coding to handle existing data
❌ Need to identify existing records first

**Example**:

```typescript
// Check if region exists, update it
const existingRegion = await query.graph({
  entity: "region",
  fields: ["id", "name"],
  filters: { name: "Ireland" },
});

if (existingRegion.length > 0) {
  // Update existing region
  await updateRegionsWorkflow(container).run({
    input: {
      selector: { id: existingRegion[0].id },
      update: {
        currency_code: "eur",
        countries: ["ie"],
        payment_providers: ["pp_stripe_stripe"],
      },
    },
  });
} else {
  // Create new region
  await createRegionsWorkflow(container).run({
    input: { regions: [{ name: "Ireland", ... }] },
  });
}
```

### Option 2: Admin Dashboard (Manual Updates)

**Approach**: Use the admin dashboard to manually update existing data.

**How it works**:

1. Access admin at `https://your-backend.railway.app/app`
2. Navigate to each section
3. Update regions, shipping, products manually

**Pros**:
✅ No code changes needed
✅ Visual and immediate
✅ Safe for production

**Cons**:
❌ Time-consuming
❌ Not reproducible
❌ Not version controlled
❌ Manual process

### Option 3: Create Update/Migration Script

**Approach**: Create a new script specifically for updating existing data.

**File**: `backend/src/scripts/update-natures-elixir.ts`

**How it works**:

- Separate from seed script
- Specifically designed to update existing data
- Can be run after initial deployment

**Pros**:
✅ Clear separation of concerns
✅ Designed for updates, not initial setup
✅ Can be version controlled
✅ Safe to run multiple times

**Cons**:
❌ Requires creating new script
❌ Need to handle existing data carefully

**Example**:

```typescript
// backend/src/scripts/update-natures-elixir.ts
export default async function updateNaturesElixir({ container }: ExecArgs) {
  // Update existing region
  // Update stock location
  // Update shipping options
  // Replace demo products with Nature's Elixir products
}
```

### Option 4: Database Reset + Seed Script

**Approach**: Reset the database and run updated seed script.

**How it works**:

1. Clear/reset database
2. Run updated seed script with Nature's Elixir data

**Pros**:
✅ Clean slate
✅ Can use seed script as-is
✅ No need to handle existing data

**Cons**:
❌ **DESTRUCTIVE** - Loses all existing data
❌ Not suitable for production with real orders
❌ Only for development/staging

**⚠️ Warning**: Only use this in development/staging, never in production with real orders!

## Recommended Approach for Nature's Elixir

### Phase 1: Development/Staging (Safe to Reset)

If you have a development/staging environment:

1. **Reset database** (if safe to do so)
2. **Update seed script** with Nature's Elixir configuration
3. **Run seed script** to create fresh Nature's Elixir data

### Phase 2: Production (Update Existing)

For the production Railway deployment:

**Option A: Admin Dashboard (Safest)**

1. Use admin dashboard to:
   - Update region settings
   - Update stock location
   - Delete demo products
   - Add Nature's Elixir products
   - Update shipping options

**Option B: Update Script (Best for Reproducibility)**

1. Create `backend/src/scripts/update-natures-elixir.ts`
2. Make it idempotent (safe to run multiple times)
3. Update existing data rather than create new
4. Run via: `pnpm exec ./src/scripts/update-natures-elixir.ts`

**Option C: Hybrid**

1. Use admin dashboard for quick updates
2. Create update script for reproducible changes
3. Use update script for future deployments

## Creating an Update Script

### Structure

```typescript
// backend/src/scripts/update-natures-elixir.ts
import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import {
  updateRegionsWorkflow,
  updateStoresWorkflow,
  // ... other update workflows
} from "@medusajs/medusa/core-flows";

export default async function updateNaturesElixir({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  logger.info("Updating Nature's Elixir configuration...");

  // 1. Find and update existing region
  const [existingRegion] = await query.graph({
    entity: "region",
    fields: ["id", "name"],
    filters: { name: "Europe" }, // Update the default Europe region
  });

  if (existingRegion) {
    await updateRegionsWorkflow(container).run({
      input: {
        selector: { id: existingRegion.id },
        update: {
          name: "Ireland",
          currency_code: "eur",
          countries: ["ie"], // Replace with Ireland only
          payment_providers: ["pp_stripe_stripe"], // Update to Stripe
        },
      },
    });
    logger.info("Updated region to Ireland");
  }

  // 2. Update stock location
  // ... similar pattern

  // 3. Delete demo products
  // ... remove existing demo products

  // 4. Create Nature's Elixir products
  // ... add new products

  logger.info("Finished updating Nature's Elixir configuration");
}
```

### Running the Update Script

```bash
cd backend
pnpm exec ./src/scripts/update-natures-elixir.ts
# or
medusa exec ./src/scripts/update-natures-elixir.ts
```

## Making Seed Script Idempotent

If you want to update the seed script to handle existing data:

### Pattern for Idempotent Operations

```typescript
// Check if exists, update if so, create if not
const existing = await query.graph({
  entity: "region",
  fields: ["id"],
  filters: { name: "Ireland" },
});

if (existing.length > 0) {
  // Update existing
  await updateRegionsWorkflow(container).run({
    input: {
      selector: { id: existing[0].id },
      update: {
        /* updates */
      },
    },
  });
} else {
  // Create new
  await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          /* new data */
        },
      ],
    },
  });
}
```

## Current State Checklist

Before making changes, document what exists:

- [ ] What region exists? (Europe with EUR)
- [ ] What countries are in the region? (GB, DE, DK, SE, FR, ES, IT)
- [ ] What stock location exists? (European Warehouse, Copenhagen)
- [ ] What shipping options exist? (Standard & Express)
- [ ] What products exist? (Demo T-shirts, etc.)
- [ ] What categories exist? (Shirts, Sweatshirts, Pants, Merch)
- [ ] What payment provider is configured? (pp_system_default - manual)

## Migration Plan

### Step 1: Document Current State

- List all existing data
- Note what needs to change

### Step 2: Choose Update Method

- Admin dashboard (quick, manual)
- Update script (reproducible, automated)
- Hybrid approach

### Step 3: Execute Updates

- Update region (Europe → Ireland)
- Update stock location (Copenhagen → Dublin)
- Update shipping (adjust rates/zones)
- Replace products (demo → Nature's Elixir)
- Replace categories (clothing → Tea/Oils/Sponges)

### Step 4: Verify

- Check admin dashboard
- Test storefront
- Verify shipping calculations
- Test checkout flow

## Important Considerations

### Production Safety

⚠️ **Never reset production database** if it has:

- Real customer orders
- Real customer accounts
- Real payment transactions
- Any production data

✅ **Safe to update**:

- Configuration (regions, shipping)
- Products (can delete demo, add new)
- Categories (can replace)
- Settings

### Testing

1. **Test in development first**
2. **Backup production database** before major changes
3. **Test update script** in staging
4. **Verify changes** after running updates

## Next Steps

1. **Assess current state** - What data exists in production?
2. **Choose update method** - Admin dashboard vs update script
3. **Create update plan** - Step-by-step migration
4. **Execute carefully** - Test first, then production
5. **Verify results** - Check all changes worked

## Questions to Answer

1. Does the production database have any real orders/customers?
2. Can we safely delete demo products?
3. Should we create an update script or use admin dashboard?
4. Do we have a staging environment to test first?
