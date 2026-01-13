# Setting Ireland (IE) as Default Region

## Changes Made

### 1. Middleware Default Region
**File**: `storefront/src/middleware.ts`

Changed the default region from `"us"` to `"ie"`:

```typescript
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "ie"
```

**What this does**:
- When a user visits the site without a country code in the URL (e.g., `/` or `/store`), the middleware will redirect them to `/ie/` or `/ie/store`
- If the `NEXT_PUBLIC_DEFAULT_REGION` environment variable is set, it will use that instead
- Falls back to "ie" if the environment variable is not set

### 2. Region Helper Default
**File**: `storefront/src/lib/data/regions.ts`

Changed the fallback region from `"us"` to `"ie"`:

```typescript
const region = countryCode
  ? regionMap.get(countryCode)
  : regionMap.get("ie")
```

**What this does**:
- When `getRegion()` is called without a country code or with an invalid one, it defaults to Ireland (IE)
- This ensures consistent region selection throughout the app

## How It Works

### User Flow

1. **User visits `/`** (root)
   - Middleware detects no country code in URL
   - Checks Vercel IP country header (if available)
   - Falls back to `DEFAULT_REGION` ("ie")
   - Redirects to `/ie/`

2. **User visits `/store`**
   - Middleware detects no country code
   - Redirects to `/ie/store`

3. **User visits `/ie/store`**
   - Country code is present, middleware allows request through
   - Page loads with Ireland region

4. **User visits `/gb/store`**
   - Country code is present (GB is in Europe region)
   - Middleware allows request through
   - Page loads with Europe region (same as IE, but URL shows GB)

### Region Detection Priority

The middleware uses this priority order:

1. **URL country code** (e.g., `/ie/store`) - Highest priority
2. **Vercel IP country header** (if available) - Auto-detection
3. **DEFAULT_REGION** ("ie") - Fallback
4. **First available region** - Last resort

## Environment Variable (Optional)

You can override the default by setting:

```bash
NEXT_PUBLIC_DEFAULT_REGION=ie
```

This is optional since "ie" is now the hardcoded default.

## Benefits

✅ **Simple change** - Only 2 lines modified
✅ **Keeps existing structure** - All routes still work with country codes
✅ **Backward compatible** - Existing URLs with country codes still work
✅ **Clean defaults** - New visitors automatically get Ireland region
✅ **Flexible** - Can still access other countries via URL (e.g., `/gb/store`)

## Testing

After deployment, test:

1. Visit `/` - Should redirect to `/ie/`
2. Visit `/store` - Should redirect to `/ie/store`
3. Visit `/ie/store` - Should work normally
4. Visit `/gb/store` - Should work (same region, different URL)
5. All existing links should continue to work

## Notes

- Since you only have one region (Europe) that includes both IE and GB, both `/ie/store` and `/gb/store` will show the same content
- The country code in the URL is now mainly for URL structure, not for different content
- Users can still manually change the country code in the URL if needed
- The country selector component can still work to switch between countries in the same region

