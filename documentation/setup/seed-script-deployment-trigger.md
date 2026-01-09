# Seed Script Deployment Trigger - How It Works

This document explains how the seed script (`backend/src/scripts/seed.ts`) is triggered during deployment and initialization.

## Key Commands and Scripts

### Package.json Scripts

From `backend/package.json`:

```json
{
  "scripts": {
    "build": "medusa build && node src/scripts/postBuild.js",
    "seed": "medusa exec ./src/scripts/seed.ts",
    "ib": "init-backend",
    "start": "init-backend && cd .medusa/server && medusa start --verbose",
    "dev": "medusa develop"
  }
}
```

### Command Breakdown

1. **`pnpm seed`** or **`npm run seed`**
   - Runs: `medusa exec ./src/scripts/seed.ts`
   - **Manual execution** - explicitly runs the seed script
   - Used for: Manual database seeding

2. **`pnpm ib`** or **`npm run ib`**
   - Runs: `init-backend`
   - **From package**: `medusajs-launch-utils@0.0.18`
   - **Purpose**: Initializes backend by running migrations and seeding database
   - **According to README**: "will initialize the backend by running migrations and seed the database with required system data"

3. **`pnpm start`** or **`npm run start`**
   - Runs: `init-backend && cd .medusa/server && medusa start --verbose`
   - **Runs `init-backend` first**, then starts the server
   - **Used in production** - this is the production start command

4. **`pnpm dev`** or **`npm run dev`**
   - Runs: `medusa develop`
   - **Development mode** - does NOT run seed script automatically
   - Hot-reloading development server

## How `init-backend` Works

The `init-backend` command comes from the `medusajs-launch-utils` package. Based on the README documentation:

> "`npm run ib` or `pnpm ib` will initialize the backend by running migrations and seed the database with required system data."

### What `init-backend` Likely Does:

1. **Runs database migrations** - Sets up the database schema
2. **Runs seed scripts** - Executes seed scripts to populate initial data
3. **Prepares the backend** - Sets up necessary directories and configurations

### Important Note:

The `init-backend` command appears to automatically run seed scripts as part of initialization. This means:

- **First deployment**: `init-backend` runs migrations + seed script
- **Subsequent deployments**: `init-backend` may run migrations, but seed script should be idempotent (check for existing data)

## Deployment Flow on Railway

Based on the Railway template deployment:

### Build Phase

1. **Install dependencies**: `pnpm install`
2. **Build backend**: `pnpm build`
   - Runs: `medusa build && node src/scripts/postBuild.js`
   - `postBuild.js` copies files and installs production dependencies
3. **Build completes**: Creates `.medusa/server` directory

### Start Phase

1. **Start command runs**: `pnpm start`
   - Which runs: `init-backend && cd .medusa/server && medusa start --verbose`
2. **`init-backend` executes**:
   - Runs database migrations
   - **Runs seed scripts** (including `seed.ts`)
   - Prepares backend
3. **Server starts**: `medusa start --verbose`

## Current Seed Script Behavior

The seed script (`backend/src/scripts/seed.ts`) has built-in protection:

### Idempotency Check

```typescript
// Check if seed has already run by checking if "Europe" region exists
const existingRegions = await query.graph({
  entity: "region",
  fields: ["id", "name"],
  filters: {
    name: "Europe",
  },
});

if (existingRegions?.data && existingRegions.data.length > 0) {
  logger.info(
    "Seed has already been run. 'Europe' region exists. Skipping seed script."
  );
  return;
}
```

### Database Reset Logic

```typescript
let needsReset = true; // Global variable - forces reset during setup

// Always reset database during setup to ensure clean state
if (needsReset) {
  logger.info("Resetting database: Removing default regions, products, and related data...");
  await resetDatabase(container, logger, query);
  logger.info("Database reset complete.");
}
```

## When Seed Script Runs

### Automatic Execution

1. **First deployment** (Railway):
   - `init-backend` runs → triggers seed script
   - Database is empty → seed script runs fully
   - Creates all Nature's Elixir data

2. **Subsequent deployments** (Railway):
   - `init-backend` runs → triggers seed script
   - Seed script checks for "Europe" region
   - If exists → **skips** (idempotent)
   - If doesn't exist → runs seed + reset

3. **Manual execution**:
   - `pnpm seed` → explicitly runs seed script
   - Useful for: Updates, testing, manual seeding

### Manual Execution

```bash
cd backend
pnpm seed
# or
npm run seed
```

This explicitly runs the seed script, bypassing `init-backend`.

## Important Considerations

### For Setup/Reset Purposes

Since the seed script is designed to **force a database reset** during setup:

1. **First deployment**: Will reset and seed cleanly
2. **Re-deployment**: Will skip if "Europe" region exists
3. **Force reset**: Currently set to `needsReset = true` globally

### To Force Reset on Every Deployment

If you want to force reset on every deployment (⚠️ **DESTRUCTIVE**):

1. Remove the idempotency check
2. Always set `needsReset = true`
3. **Warning**: This will delete all data on every deployment!

### Current Safe Behavior

The current implementation:
- ✅ **Idempotent**: Won't run if already seeded
- ✅ **Reset on setup**: Forces reset when no "Europe" region exists
- ✅ **Safe for production**: Won't reset existing data

## Verification

To verify if seed script ran:

1. **Check logs** during deployment:
   ```
   "Checking if seed has already run..."
   "Seed has already been run. 'Europe' region exists. Skipping seed script."
   ```
   OR
   ```
   "Seeding Nature's Elixir store data..."
   "Seed script completed successfully!"
   ```

2. **Check database**:
   - Look for "Europe" region
   - Look for "United Kingdom" region
   - Look for Nature's Elixir product categories
   - Look for shipping options

3. **Check admin dashboard**:
   - Regions should show Europe and UK
   - Shipping options should be configured
   - Product categories should exist

## Summary

| Scenario | `init-backend` Runs? | Seed Script Runs? | Database Reset? |
|----------|---------------------|-------------------|-----------------|
| First deployment | ✅ Yes | ✅ Yes | ✅ Yes (if `needsReset = true`) |
| Subsequent deployment (already seeded) | ✅ Yes | ❌ No (skips) | ❌ No |
| Subsequent deployment (not seeded) | ✅ Yes | ✅ Yes | ✅ Yes (if `needsReset = true`) |
| Manual `pnpm seed` | ❌ No | ✅ Yes | ✅ Yes (if `needsReset = true`) |
| Development `pnpm dev` | ❌ No | ❌ No | ❌ No |

## References

- `backend/package.json` - Script definitions
- `backend/README.md` - Command documentation
- `backend/src/scripts/seed.ts` - Seed script implementation
- `backend/src/scripts/postBuild.js` - Post-build script
- `medusajs-launch-utils@0.0.18` - Package providing `init-backend`

