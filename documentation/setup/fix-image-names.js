/**
 * Script to fix product image file names:
 * 1. Fix unmatched images (rename to match product handles)
 * 2. Resolve duplicates (keep best quality, archive others)
 * 3. Standardize all filenames to use product handles
 * 
 * Usage:
 *   node documentation/setup/fix-image-names.js
 * 
 * Options:
 *   - DRY_RUN: Set to "true" to preview changes without renaming
 */

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.env.DRY_RUN === 'true';
const IMAGE_DIR = '/Users/conorbreen/Documents/nixers/natures-elixir-product-images';
const DUPLICATES_DIR = path.join(IMAGE_DIR, '_duplicates');

// Load products to get handles
function loadProducts() {
  const productsDir = path.join(__dirname, 'products');
  const files = ['tea-products.json', 'essential-oils.json', 'other-products.json'];
  const allProducts = [];
  const handleMap = new Map();

  files.forEach(file => {
    const filePath = path.join(productsDir, file);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const products = data.products || [];
      allProducts.push(...products);
      products.forEach(product => {
        handleMap.set(product.product_handle, product.product_title);
      });
    }
  });

  return { products: allProducts, handleMap };
}

// Get file size for quality comparison
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

// Extract product name from filename and map to handle
function mapToProductHandle(filename, handleMap) {
  const basename = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '').toLowerCase();
  
  // Remove prefixes
  const cleaned = basename
    .replace(/^natures[-_]?elixir[-_]?/i, '')
    .replace(/^natureselixir[-_]?/i, '')
    .replace(/^natureselxir[-_]?/i, '');
  
  // Extract category and product
  const parts = cleaned.split('-');
  let productName = cleaned;
  
  if (parts.length >= 2) {
    // Remove category prefix (oil, tea, other)
    productName = parts.slice(1).join('-');
  }
  
  // Remove trailing numbers (e.g., "shilajit-1" -> "shilajit")
  productName = productName.replace(/-\d+$/, '');
  
  // Special mappings for unmatched images
  const specialMappings = {
    'gokshura': 'gok-shura',
    'ashwaganda': 'ashwagandha-30-gram',
    'morninga': 'moringa-30-gram',
    'spartan-healing': 'spartan-healing-oil',
    'sponge': 'natural-sea-sponge',
    'earl-grey': 'earl-grey-tea',
    'jasmine': 'jasmine-tea',
    'strawberry-kiwi': 'strawberry-kiwi-tea',
    'wild-cherry': 'wild-cherry-tea',
  };
  
  // Check special mappings first
  if (specialMappings[productName]) {
    const handle = specialMappings[productName];
    if (handleMap.has(handle)) {
      return handle;
    }
  }
  
  // Try direct match
  if (handleMap.has(productName)) {
    return productName;
  }
  
  // Try partial matches
  for (const [handle, title] of handleMap.entries()) {
    const normalizedHandle = handle.toLowerCase();
    const normalizedName = productName.toLowerCase();
    
    // Check if handle contains the name or vice versa
    if (normalizedHandle.includes(normalizedName) || normalizedName.includes(normalizedHandle)) {
      return handle;
    }
    
    // Check if title matches
    const normalizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (normalizedTitle.includes(normalizedName) || normalizedName.includes(normalizedTitle)) {
      return handle;
    }
  }
  
  return null;
}

// Main function
function main() {
  console.log('🔧 Fixing Product Image File Names\n');
  console.log(`   Image Directory: ${IMAGE_DIR}`);
  console.log(`   Dry Run: ${DRY_RUN}\n`);

  if (!fs.existsSync(IMAGE_DIR)) {
    console.error(`❌ Error: Image directory not found: ${IMAGE_DIR}`);
    process.exit(1);
  }

  // Load products
  const { handleMap } = loadProducts();
  console.log(`📦 Loaded ${handleMap.size} product handles\n`);

  // Get all image files
  const files = fs.readdirSync(IMAGE_DIR)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .map(file => ({
      filename: file,
      fullPath: path.join(IMAGE_DIR, file),
      size: getFileSize(path.join(IMAGE_DIR, file)),
    }));

  console.log(`📸 Found ${files.length} image files\n`);

  // Group by product handle
  const groupedByHandle = new Map();
  const unmatched = [];

  files.forEach(file => {
    const handle = mapToProductHandle(file.filename, handleMap);
    if (handle) {
      if (!groupedByHandle.has(handle)) {
        groupedByHandle.set(handle, []);
      }
      groupedByHandle.get(handle).push(file);
    } else {
      unmatched.push(file);
    }
  });

  // Process each group
  const operations = [];
  const duplicatesToArchive = [];

  console.log('📋 Processing images...\n');

  // Handle matched products
  for (const [handle, fileGroup] of groupedByHandle.entries()) {
    if (fileGroup.length === 1) {
      // Single file - just rename if needed
      const file = fileGroup[0];
      const extension = path.extname(file.filename);
      const newName = `${handle}${extension}`;
      
      if (file.filename !== newName) {
        operations.push({
          type: 'rename',
          from: file.filename,
          to: newName,
          handle: handle,
        });
      }
    } else {
      // Multiple files - keep best quality, archive others
      // Sort by file size (larger = better quality)
      fileGroup.sort((a, b) => b.size - a.size);
      
      const bestFile = fileGroup[0];
      const extension = path.extname(bestFile.filename);
      const newName = `${handle}${extension}`;
      
      // Rename best file
      if (bestFile.filename !== newName) {
        operations.push({
          type: 'rename',
          from: bestFile.filename,
          to: newName,
          handle: handle,
          isBest: true,
        });
      }
      
      // Archive duplicates
      fileGroup.slice(1).forEach(duplicate => {
        duplicatesToArchive.push({
          from: duplicate.filename,
          handle: handle,
          size: duplicate.size,
        });
      });
    }
  }

  // Handle unmatched files
  if (unmatched.length > 0) {
    console.log('⚠️  Unmatched files (cannot be mapped to product handles):\n');
    unmatched.forEach(file => {
      console.log(`   - ${file.filename}`);
    });
    console.log('');
  }

  // Print summary
  console.log('='.repeat(80));
  console.log('📊 Summary of Changes\n');
  console.log(`   Products with images: ${groupedByHandle.size}`);
  console.log(`   Files to rename: ${operations.length}`);
  console.log(`   Duplicates to archive: ${duplicatesToArchive.length}`);
  console.log(`   Unmatched files: ${unmatched.length}\n`);

  // Show rename operations
  if (operations.length > 0) {
    console.log('📝 Files to rename:\n');
    operations.forEach(op => {
      console.log(`   ${op.from}`);
      console.log(`   → ${op.to}${op.isBest ? ' (best quality, keeping)' : ''}`);
      console.log('');
    });
  }

  // Show duplicates
  if (duplicatesToArchive.length > 0) {
    console.log('🔄 Duplicates to archive:\n');
    duplicatesToArchive.forEach(dup => {
      console.log(`   ${dup.from} (${(dup.size / 1024).toFixed(1)} KB)`);
      console.log(`   → _duplicates/${dup.from}`);
      console.log('');
    });
  }

  // Execute operations
  if (!DRY_RUN) {
    console.log('🚀 Executing operations...\n');

    // Create duplicates directory
    if (duplicatesToArchive.length > 0) {
      if (!fs.existsSync(DUPLICATES_DIR)) {
        fs.mkdirSync(DUPLICATES_DIR, { recursive: true });
        console.log(`   ✅ Created duplicates directory: ${DUPLICATES_DIR}\n`);
      }
    }

    // Rename files
    let renamed = 0;
    operations.forEach(op => {
      try {
        const fromPath = path.join(IMAGE_DIR, op.from);
        const toPath = path.join(IMAGE_DIR, op.to);
        
        // Check if target already exists
        if (fs.existsSync(toPath)) {
          console.log(`   ⚠️  Skipping ${op.from}: ${op.to} already exists`);
          return;
        }
        
        fs.renameSync(fromPath, toPath);
        console.log(`   ✅ Renamed: ${op.from} → ${op.to}`);
        renamed++;
      } catch (error) {
        console.error(`   ❌ Error renaming ${op.from}: ${error.message}`);
      }
    });

    // Archive duplicates
    let archived = 0;
    duplicatesToArchive.forEach(dup => {
      try {
        const fromPath = path.join(IMAGE_DIR, dup.from);
        const toPath = path.join(DUPLICATES_DIR, dup.from);
        
        fs.renameSync(fromPath, toPath);
        console.log(`   📦 Archived: ${dup.from} → _duplicates/${dup.from}`);
        archived++;
      } catch (error) {
        console.error(`   ❌ Error archiving ${dup.from}: ${error.message}`);
      }
    });

    console.log('\n' + '='.repeat(80));
    console.log('✅ Operations Complete\n');
    console.log(`   Renamed: ${renamed}/${operations.length}`);
    console.log(`   Archived: ${archived}/${duplicatesToArchive.length}`);
    console.log('');

    if (duplicatesToArchive.length > 0) {
      console.log(`   Duplicates saved in: ${DUPLICATES_DIR}`);
      console.log('   You can review and delete them later if needed.\n');
    }
  } else {
    console.log('⚠️  DRY RUN - No files were actually renamed.');
    console.log('   Set DRY_RUN=false or remove it to execute changes.\n');
  }
}

// Run the script
main();

