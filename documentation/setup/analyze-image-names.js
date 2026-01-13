/**
 * Script to analyze product image file names and compare with product handles
 */

const fs = require('fs');
const path = require('path');

// Load products from JSON files
function loadProducts() {
  const productsDir = path.join(__dirname, 'products');
  const files = ['tea-products.json', 'essential-oils.json', 'other-products.json'];
  const allProducts = [];

  files.forEach(file => {
    const filePath = path.join(productsDir, file);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      allProducts.push(...(data.products || []));
    }
  });

  return allProducts;
}

// Get image files
function getImageFiles() {
  const imageDir = '/Users/conorbreen/Documents/nixers/natures-elixir-product-images';
  if (!fs.existsSync(imageDir)) {
    return [];
  }

  return fs.readdirSync(imageDir)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .map(file => ({
      filename: file,
      basename: file.replace(/\.(jpg|jpeg|png|webp)$/i, ''),
    }));
}

// Normalize product handle for comparison
function normalizeHandle(handle) {
  return handle.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

// Extract product name from image filename
function extractProductName(filename) {
  // Remove extension
  const basename = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  
  // Remove prefixes: natures-elixir-, naturesElixir-, naturesElxir-
  const cleaned = basename
    .replace(/^natures[-_]?elixir[-_]?/i, '')
    .replace(/^natureselixir[-_]?/i, '')
    .replace(/^natureselxir[-_]?/i, '');
  
  // Extract category and product
  const parts = cleaned.split('-');
  if (parts.length >= 2) {
    return parts.slice(1).join('-'); // Remove category prefix
  }
  return cleaned;
}

// Main analysis
function analyze() {
  const products = loadProducts();
  const images = getImageFiles();

  console.log('📊 Image File Name Analysis\n');
  console.log('='.repeat(80));
  console.log(`Total Products: ${products.length}`);
  console.log(`Total Images: ${images.length}\n`);

  // Create product handle map
  const productMap = new Map();
  products.forEach(product => {
    productMap.set(product.product_handle, {
      title: product.product_title,
      handle: product.product_handle,
      category: product.category,
    });
  });

  // Analyze image files
  console.log('📸 Image Files Analysis:\n');
  const imageAnalysis = [];

  images.forEach(image => {
    const extracted = extractProductName(image.filename);
    const normalized = normalizeHandle(extracted);
    
    // Try to find matching product
    let match = null;
    let matchScore = 0;

    for (const [handle, product] of productMap.entries()) {
      const normalizedHandle = normalizeHandle(handle);
      
      // Exact match
      if (normalizedHandle === normalized) {
        match = product;
        matchScore = 100;
        break;
      }
      
      // Partial match (contains)
      if (normalizedHandle.includes(normalized) || normalized.includes(normalizedHandle)) {
        if (normalized.length > matchScore) {
          match = product;
          matchScore = normalized.length;
        }
      }
    }

    imageAnalysis.push({
      filename: image.filename,
      extracted: extracted,
      normalized: normalized,
      match: match,
      matchScore: matchScore,
    });
  });

  // Print analysis
  imageAnalysis.forEach((item, index) => {
    console.log(`${index + 1}. ${item.filename}`);
    console.log(`   Extracted: "${item.extracted}"`);
    console.log(`   Normalized: "${item.normalized}"`);
    if (item.match) {
      console.log(`   ✅ Matches: ${item.match.title} (${item.match.handle})`);
    } else {
      console.log(`   ❌ No match found`);
    }
    console.log('');
  });

  // Summary
  console.log('='.repeat(80));
  console.log('📋 Summary:\n');

  const matched = imageAnalysis.filter(item => item.match).length;
  const unmatched = imageAnalysis.filter(item => !item.match).length;
  const duplicates = [];

  // Find duplicates
  const nameCounts = new Map();
  imageAnalysis.forEach(item => {
    const key = item.normalized;
    if (!nameCounts.has(key)) {
      nameCounts.set(key, []);
    }
    nameCounts.get(key).push(item.filename);
  });

  nameCounts.forEach((files, name) => {
    if (files.length > 1) {
      duplicates.push({ name, files });
    }
  });

  console.log(`✅ Matched: ${matched}/${images.length}`);
  console.log(`❌ Unmatched: ${unmatched}/${images.length}`);
  console.log(`🔄 Duplicates: ${duplicates.length}`);

  if (duplicates.length > 0) {
    console.log('\n⚠️  Duplicate image names:');
    duplicates.forEach(dup => {
      console.log(`   "${dup.name}":`);
      dup.files.forEach(file => console.log(`     - ${file}`));
    });
  }

  // Naming issues
  console.log('\n📝 Naming Issues:\n');
  
  const issues = [];
  imageAnalysis.forEach(item => {
    if (item.filename.includes('natures-elixir-')) {
      issues.push(`${item.filename}: Uses "natures-elixir-" (with hyphens)`);
    }
    if (item.filename.includes('naturesElixir-')) {
      issues.push(`${item.filename}: Uses "naturesElixir-" (camelCase)`);
    }
    if (item.filename.includes('naturesElxir-')) {
      issues.push(`${item.filename}: Uses "naturesElxir-" (typo: missing 'i')`);
    }
  });

  if (issues.length > 0) {
    issues.forEach(issue => console.log(`   ⚠️  ${issue}`));
  } else {
    console.log('   ✅ No naming inconsistencies found');
  }

  // Products without images
  console.log('\n📦 Products without images:\n');
  const productsWithImages = new Set(
    imageAnalysis.filter(item => item.match).map(item => item.match.handle)
  );
  
  const productsWithoutImages = products.filter(
    product => !productsWithImages.has(product.product_handle)
  );

  if (productsWithoutImages.length > 0) {
    console.log(`   ${productsWithoutImages.length} products need images:`);
    productsWithoutImages.slice(0, 10).forEach(product => {
      console.log(`   - ${product.product_title} (${product.product_handle})`);
    });
    if (productsWithoutImages.length > 10) {
      console.log(`   ... and ${productsWithoutImages.length - 10} more`);
    }
  } else {
    console.log('   ✅ All products have images');
  }

  // Recommended naming standard
  console.log('\n' + '='.repeat(80));
  console.log('💡 Recommended Naming Standard:\n');
  console.log('Format: {product-handle}.{extension}');
  console.log('Example: apricot-delight-tea.jpg');
  console.log('\nBenefits:');
  console.log('  - Direct mapping to product handles');
  console.log('  - Easy to match programmatically');
  console.log('  - No category prefix needed');
  console.log('  - Consistent and simple');
}

// Run analysis
analyze();

