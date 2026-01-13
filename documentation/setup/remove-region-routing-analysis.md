# Removing Region Routing from Frontend - Analysis

## Current State

The storefront currently uses `[countryCode]` in all routes:

- `/ie/store`, `/gb/store`, etc.
- `/ie/products/[handle]`, `/gb/products/[handle]`, etc.
- Middleware automatically redirects to include country code
- All links use `LocalizedClientLink` to preserve country code

## Scope of Changes

### 🔴 High Impact (Required Changes)

#### 1. **Route Structure** (Major)

- **Current**: All routes under `app/[countryCode]/`
- **New**: Move all routes to `app/` (remove `[countryCode]` folder)
- **Files affected**: ~15 route files
- **Effort**: Medium (file moves + param removal)

#### 2. **Middleware** (Major)

- **Current**: Redirects all requests to include country code
- **New**: Get default region, don't redirect
- **File**: `storefront/src/middleware.ts`
- **Effort**: Medium (simplify logic, remove redirects)

#### 3. **Data Fetching Functions** (Major)

- **Current**: Functions take `countryCode` parameter
- **New**: Use default region internally
- **Files affected**:
  - `storefront/src/lib/data/products.ts`
  - `storefront/src/lib/data/collections.ts`
  - `storefront/src/lib/data/cart.ts`
  - `storefront/src/lib/data/regions.ts`
- **Effort**: Medium (update function signatures, use default region)

#### 4. **Page Components** (Major)

- **Current**: All pages receive `countryCode` from params
- **New**: Get default region directly
- **Files affected**: ~10 page components
- **Effort**: Medium (remove param, get region directly)

#### 5. **Navigation Links** (Major)

- **Current**: `LocalizedClientLink` adds country code
- **New**: Use regular Next.js `Link` or create simple wrapper
- **Files affected**: ~20+ components using `LocalizedClientLink`
- **Effort**: Medium (find/replace, test links)

### 🟡 Medium Impact (Supporting Changes)

#### 6. **Country Selector Component** (Optional)

- **Current**: Allows switching regions via URL
- **New**: Can remove or keep for cart region switching only
- **File**: `storefront/src/modules/layout/components/country-select/index.tsx`
- **Effort**: Low (can be removed or simplified)

#### 7. **Static Generation** (Update)

- **Current**: `generateStaticParams` generates pages for each country
- **New**: Generate single set of pages
- **Files affected**: Product, collection, category pages
- **Effort**: Low (simplify static params)

#### 8. **Cart Region Handling** (Update)

- **Current**: Cart region can change via URL
- **New**: Cart uses default region, can still update via API
- **Files affected**: Cart components, checkout
- **Effort**: Low (use default region for cart creation)

### 🟢 Low Impact (Cleanup)

#### 9. **Type Definitions** (Cleanup)

- Remove `countryCode` from param types
- **Effort**: Low

#### 10. **Tests** (Update)

- Update e2e tests that use country codes
- **Effort**: Low-Medium

## Recommended Approach

### Option 1: Single Default Region (Simplest)

**Strategy**: Use the "Europe" region as the default for all users.

**Changes**:

1. Get default region ID from environment or hardcode
2. Remove `[countryCode]` from all routes
3. Simplify middleware to not redirect
4. Update all data fetching to use default region
5. Replace `LocalizedClientLink` with regular `Link`

**Pros**:

- ✅ Cleaner URLs (`/store` instead of `/ie/store`)
- ✅ Simpler codebase
- ✅ No region switching complexity
- ✅ Still supports multiple countries in one region

**Cons**:

- ❌ Can't easily switch regions via URL
- ❌ All users see same region (but you only have one region anyway)

### Option 2: Region Cookie/Context (More Flexible)

**Strategy**: Store region preference in cookie/context, not URL.

**Changes**:

- Similar to Option 1, but region stored in cookie
- Country selector updates cookie instead of URL
- More complex but allows region switching

**Pros**:

- ✅ Clean URLs
- ✅ Can still switch regions
- ✅ More flexible

**Cons**:

- ❌ More complex implementation
- ❌ Requires cookie management

## Estimated Effort

### Option 1 (Recommended): **4-6 hours**

**Breakdown**:

- Route restructuring: 1-2 hours
- Middleware simplification: 30 minutes
- Data fetching updates: 1-2 hours
- Link replacements: 1 hour
- Testing & cleanup: 1 hour

### Option 2: **6-8 hours**

**Additional work**:

- Cookie/context management: 1-2 hours
- Country selector updates: 1 hour

## Implementation Steps (Option 1)

1. **Create default region helper**

   ```typescript
   // storefront/src/lib/data/regions.ts
   export async function getDefaultRegion() {
     const regions = await listRegions();
     // Return "Europe" region or first available
     return regions?.find((r) => r.name === "Europe") || regions?.[0];
   }
   ```

2. **Update middleware**

   - Remove country code redirect logic
   - Keep region detection for cart/checkout
   - Simplify to just pass through

3. **Move route files**

   - Move all files from `app/[countryCode]/` to `app/`
   - Update imports

4. **Update page components**

   - Remove `countryCode` from params
   - Use `getDefaultRegion()` instead

5. **Update data functions**

   - Remove `countryCode` parameter
   - Use default region internally

6. **Replace links**

   - Find all `LocalizedClientLink` usage
   - Replace with regular `Link` or create simple wrapper

7. **Update static generation**
   - Remove country code from `generateStaticParams`

## Files to Modify

### High Priority

- `storefront/src/middleware.ts` - Simplify/remove redirects
- `storefront/src/lib/data/regions.ts` - Add default region helper
- `storefront/src/lib/data/products.ts` - Remove countryCode param
- `storefront/src/lib/data/collections.ts` - Remove countryCode param
- `storefront/src/lib/data/cart.ts` - Use default region
- `storefront/src/modules/common/components/localized-client-link/index.tsx` - Simplify or remove
- All page components in `app/[countryCode]/` - Move and update

### Medium Priority

- `storefront/src/modules/layout/components/country-select/index.tsx` - Remove or simplify
- All components using `LocalizedClientLink` - Replace with `Link`

## Testing Checklist

- [ ] Homepage loads without redirect
- [ ] Store page works (`/store`)
- [ ] Product pages work (`/products/[handle]`)
- [ ] Cart creation uses default region
- [ ] Checkout works with default region
- [ ] All internal links work
- [ ] No broken redirects
- [ ] SEO (no duplicate content issues)

## Recommendation

**Go with Option 1** - Since you only have one region (Europe) that includes all countries, there's no need for region routing. The effort is moderate (4-6 hours) and will significantly simplify the codebase.

The main benefit: **Cleaner URLs and simpler codebase** without losing functionality since you're only serving one region anyway.
