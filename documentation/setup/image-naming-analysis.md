# Product Image Naming Analysis

## Summary

- **Total Products**: 53
- **Total Images**: 15
- **Matched**: 12/15 (80%)
- **Unmatched**: 3/15 (20%)
- **Duplicates**: 2 sets

## Issues Found

### 1. Naming Inconsistencies

Three different naming patterns are used:

1. **`natures-elixir-{category}-{product}.jpeg`** (with hyphens)
   - `natures-elixir-oil-shilajit.jpeg`
   - `natures-elixir-other-gokshura.jpeg`
   - `natures-elixir-other-shilajit.jpeg`

2. **`naturesElixir-{category}-{product}.jpeg`** (camelCase)
   - Most files use this pattern
   - `naturesElixir-tea-earl-grey.jpeg`
   - `naturesElixir-oil-spartan-healing-oil.jpeg`
   - etc.

3. **`naturesElxir-{category}-{product}.jpeg`** (typo - missing 'i')
   - `naturesElxir-oil-spartan-healing.jpeg`

### 2. Unmatched Images

These images don't match any product handles:

1. **`natures-elixir-other-gokshura.jpeg`**
   - Product handle: `gok-shura` (not `gokshura`)
   - Should be: `gok-shura.jpeg`

2. **`naturesElixir-other-ashwaganda.jpeg`**
   - Product handle: `ashwagandha-30-gram` (not `ashwaganda`)
   - Should be: `ashwagandha-30-gram.jpeg`

3. **`naturesElixir-other-morninga.jpeg`**
   - Product handle: `moringa-30-gram` (not `morninga`)
   - Should be: `moringa-30-gram.jpeg`

### 3. Duplicate Images

Multiple images for the same product:

1. **Shilajit** (3 images):
   - `natures-elixir-oil-shilajit.jpeg`
   - `natures-elixir-other-shilajit.jpeg`
   - `naturesElixir-oil-shilajit.jpeg`
   - `naturesElixir-other-shilajit-1.jpeg` (also matches)

2. **Spartan Healing Oil** (2 images):
   - `naturesElixir-oil-spartan-healing.jpeg`
   - `naturesElxir-oil-spartan-healing.jpeg` (typo)

### 4. Missing Images

**46 products** (87%) are missing images, including:
- All tea products except 4 (Earl Grey, Jasmine, Strawberry Kiwi, Wild Cherry)
- All essential oils except 2 (Spartan Healing Oil, Shilajit)
- Most other products

## Recommended Naming Standard

### Format
```
{product-handle}.{extension}
```

### Examples
- `apricot-delight-tea.jpg`
- `spartan-healing-oil.jpg`
- `shilajit.jpg`
- `ashwagandha-30-gram.jpg`
- `gok-shura.jpg`

### Benefits
1. **Direct mapping** - File name = product handle (exact match)
2. **Easy automation** - Can programmatically match images to products
3. **No category prefix** - Category is already in the product handle
4. **Consistent** - Single naming pattern for all products
5. **Simple** - Easy to understand and maintain

## Action Items

### Immediate Fixes Needed

1. **Rename unmatched images**:
   - `gokshura` → `gok-shura.jpeg`
   - `ashwaganda` → `ashwagandha-30-gram.jpeg`
   - `morninga` → `moringa-30-gram.jpeg`

2. **Fix typo**:
   - `naturesElxir-` → `naturesElixir-` (or better: remove prefix entirely)

3. **Resolve duplicates**:
   - Keep best quality image for each product
   - Delete or archive duplicates

4. **Standardize naming**:
   - Remove all prefixes (`natures-elixir-`, `naturesElixir-`, etc.)
   - Use product handle as filename
   - Example: `naturesElixir-tea-earl-grey.jpeg` → `earl-grey-tea.jpeg`

### Long-term

1. **Rename all existing images** to match product handles
2. **Create images** for the 46 missing products
3. **Document naming standard** for future images

## Current Image Status

### ✅ Has Images (12 products)
- Earl Grey Tea
- Jasmine Tea
- Strawberry Kiwi Tea
- Wild Cherry Tea
- Spartan Healing Oil
- Shilajit
- Natural Sea Sponge

### ❌ Missing Images (46 products)
- 28 tea products
- 11 essential oils
- 7 other products

## Renaming Script

A script can be created to:
1. Rename existing images to match product handles
2. Validate all image names
3. Generate a mapping file for manual review

Would you like me to create a renaming script?

