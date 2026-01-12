/**
 * Script to import all products from JSON files using the Admin API
 * 
 * Usage:
 *   node documentation/setup/import-all-products.js
 * 
 * Environment variables required:
 *   - BACKEND_URL: Your Medusa backend URL (e.g., https://backend-production-8f25.up.railway.app)
 *   - ADMIN_SECRET_KEY: Your secret API key (starts with sk_)
 * 
 * Options:
 *   - SKIP_EXISTING: Set to "true" to skip products that already exist (by handle)
 *   - DRY_RUN: Set to "true" to validate without creating products
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BACKEND_URL = (process.env.BACKEND_URL || 'https://backend-production-8f25.up.railway.app').replace(/\/$/, '');
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || '';
const SKIP_EXISTING = process.env.SKIP_EXISTING === 'true';
const DRY_RUN = process.env.DRY_RUN === 'true';

if (!ADMIN_SECRET_KEY) {
  console.error('❌ Error: ADMIN_SECRET_KEY environment variable is required');
  console.error('   Set it in your .env file or pass it as an environment variable');
  process.exit(1);
}

// Statistics
const stats = {
  total: 0,
  created: 0,
  skipped: 0,
  errors: 0,
  errorDetails: [],
};

// Cache for IDs
const idCache = {
  categories: new Map(),
  shippingProfiles: new Map(),
  regions: null,
  existingProducts: new Set(),
};

// Helper function to make authenticated API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${BACKEND_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  const requestOptions = {
    method: options.method || 'GET',
    headers: {
      'Authorization': `Basic ${ADMIN_SECRET_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (options.body !== undefined) {
    requestOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText}\n${errorText}`);
    }

    return response.json();
  } catch (error) {
    if (error.message.includes('fetch failed')) {
      throw new Error(`Network error: Could not connect to ${url}. Check your BACKEND_URL and network connection.`);
    }
    throw error;
  }
}

// Test API connection
async function testConnection() {
  try {
    console.log('🔍 Testing API connection...');
    await apiRequest('/admin/regions?limit=1');
    console.log('✅ API connection successful\n');
  } catch (error) {
    console.error('❌ API connection failed:', error.message);
    console.error(`   Backend URL: ${BACKEND_URL}\n`);
    throw error;
  }
}

// Load all IDs upfront
async function loadIds() {
  console.log('📋 Loading required IDs...\n');

  // Load categories
  try {
    const categoriesResponse = await apiRequest('/admin/product-categories?limit=100');
    const categories = categoriesResponse.product_categories || [];
    categories.forEach(cat => {
      idCache.categories.set(cat.name, cat.id);
    });
    console.log(`   ✅ Loaded ${categories.length} categories`);
  } catch (error) {
    console.error('   ❌ Error loading categories:', error.message);
    throw error;
  }

  // Load shipping profiles
  try {
    const profilesResponse = await apiRequest('/admin/shipping-profiles');
    const profiles = profilesResponse.shipping_profiles || [];
    profiles.forEach(profile => {
      idCache.shippingProfiles.set(profile.name, profile.id);
    });
    console.log(`   ✅ Loaded ${profiles.length} shipping profiles`);
  } catch (error) {
    console.error('   ❌ Error loading shipping profiles:', error.message);
    throw error;
  }

  // Load regions
  try {
    const regionsResponse = await apiRequest('/admin/regions');
    const regions = regionsResponse.regions || [];
    if (regions.length === 0) {
      throw new Error('No regions found. Make sure the seed script has run.');
    }
    // Prefer "Europe" region, otherwise use the first one
    const europeRegion = regions.find(r => r.name === 'Europe');
    idCache.regions = europeRegion || regions[0];
    console.log(`   ✅ Using region: ${idCache.regions.name} (${idCache.regions.currency_code})`);
  } catch (error) {
    console.error('   ❌ Error loading regions:', error.message);
    throw error;
  }

  // Load existing products (if skipping)
  if (SKIP_EXISTING) {
    try {
      let offset = 0;
      const limit = 100;
      let hasMore = true;

      while (hasMore) {
        const productsResponse = await apiRequest(`/admin/products?limit=${limit}&offset=${offset}`);
        const products = productsResponse.products || [];
        products.forEach(product => {
          if (product.handle) {
            idCache.existingProducts.add(product.handle);
          }
        });
        hasMore = products.length === limit;
        offset += limit;
      }
      console.log(`   ✅ Found ${idCache.existingProducts.size} existing products (will skip duplicates)\n`);
    } catch (error) {
      console.warn('   ⚠️  Warning: Could not load existing products:', error.message);
      console.warn('   Continuing without skip functionality...\n');
    }
  }

  console.log('');
}

// Get category ID by name
function getCategoryId(categoryName) {
  const categoryId = idCache.categories.get(categoryName);
  if (!categoryId) {
    throw new Error(`Category "${categoryName}" not found. Available: ${Array.from(idCache.categories.keys()).join(', ')}`);
  }
  return categoryId;
}

// Get shipping profile ID by name
function getShippingProfileId(profileName) {
  const profileNameMap = {
    'default': 'Default Shipping Profile',
    'fragile': 'Fragile Shipping Profile',
  };
  const mappedName = profileNameMap[profileName.toLowerCase()] || profileName;
  
  // Try exact match first
  let profileId = idCache.shippingProfiles.get(mappedName);
  
  // If not found, try case-insensitive match
  if (!profileId) {
    for (const [name, id] of idCache.shippingProfiles.entries()) {
      if (name.toLowerCase() === mappedName.toLowerCase()) {
        profileId = id;
        break;
      }
    }
  }
  
  if (!profileId) {
    throw new Error(`Shipping profile "${profileName}" not found. Available: ${Array.from(idCache.shippingProfiles.keys()).join(', ')}`);
  }
  return profileId;
}

// Convert JSON product to Admin API format
function convertProductToApiFormat(productJson) {
  const categoryId = getCategoryId(productJson.category);
  const shippingProfileId = getShippingProfileId(productJson.shipping_profile);

  // Extract unique option names and values
  const optionMap = new Map();
  productJson.variants.forEach(variant => {
    if (variant.variant_option_1_name && variant.variant_option_1_value) {
      const optionName = variant.variant_option_1_name;
      if (!optionMap.has(optionName)) {
        optionMap.set(optionName, new Set());
      }
      optionMap.get(optionName).add(variant.variant_option_1_value);
    }
  });

  // Build options array
  const options = Array.from(optionMap.entries()).map(([title, values]) => ({
    title,
    values: Array.from(values),
  }));

  // Build variants array
  const variants = productJson.variants.map(variant => {
    const variantData = {
      title: variant.variant_title,
      sku: variant.variant_sku,
      prices: [
        {
          currency_code: 'eur',
          amount: variant.variant_price_eur, // Already in major units
        },
      ],
      manage_inventory: variant.manage_inventory || false,
      allow_backorder: variant.allow_backorder || true,
    };

    // Add options if present
    if (variant.variant_option_1_name && variant.variant_option_1_value) {
      variantData.options = {
        [variant.variant_option_1_name]: variant.variant_option_1_value,
      };
    }

    return variantData;
  });

  // Build the API payload
  const apiPayload = {
    title: productJson.product_title,
    handle: productJson.product_handle,
    description: productJson.product_description || '',
    subtitle: productJson.product_subtitle || undefined,
    status: productJson.product_status || 'draft',
    weight: productJson.product_weight || undefined,
    shipping_profile_id: shippingProfileId,
    categories: [{ id: categoryId }],
    options,
    variants,
  };

  // Remove undefined fields
  Object.keys(apiPayload).forEach(key => {
    if (apiPayload[key] === undefined) {
      delete apiPayload[key];
    }
  });

  return apiPayload;
}

// Create a single product
async function createProduct(productJson, index, total) {
  const productName = productJson.product_title;
  const handle = productJson.product_handle;

  try {
    // Check if product already exists
    if (SKIP_EXISTING && idCache.existingProducts.has(handle)) {
      console.log(`   [${index}/${total}] ⏭️  Skipped: ${productName} (already exists)`);
      stats.skipped++;
      return { success: true, skipped: true };
    }

    // Convert to API format
    const apiPayload = convertProductToApiFormat(productJson);

    if (DRY_RUN) {
      console.log(`   [${index}/${total}] 🔍 DRY RUN: Would create ${productName}`);
      console.log(`      Handle: ${handle}`);
      console.log(`      Variants: ${apiPayload.variants.length}`);
      stats.created++;
      return { success: true, dryRun: true };
    }

    // Create the product
    const response = await apiRequest('/admin/products', {
      method: 'POST',
      body: apiPayload,
    });

    console.log(`   [${index}/${total}] ✅ Created: ${productName}`);
    console.log(`      ID: ${response.product.id}`);
    console.log(`      Variants: ${response.product.variants?.length || 0}`);

    stats.created++;
    return { success: true, product: response.product };

  } catch (error) {
    console.error(`   [${index}/${total}] ❌ Error: ${productName}`);
    console.error(`      ${error.message.split('\n')[0]}`);
    
    stats.errors++;
    stats.errorDetails.push({
      product: productName,
      handle,
      error: error.message,
    });

    return { success: false, error: error.message };
  }
}

// Load products from JSON file
function loadProductsFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    return data.products || [];
  } catch (error) {
    throw new Error(`Error reading ${filePath}: ${error.message}`);
  }
}

// Main function
async function main() {
  console.log('🚀 Starting product import...\n');
  console.log(`   Backend URL: ${BACKEND_URL}`);
  console.log(`   Skip Existing: ${SKIP_EXISTING}`);
  console.log(`   Dry Run: ${DRY_RUN}\n`);

  try {
    // Test connection
    await testConnection();

    // Load all required IDs
    await loadIds();

    // Load products from all JSON files
    const productsDir = path.join(__dirname, 'products');
    const jsonFiles = [
      'tea-products.json',
      'essential-oils.json',
      'other-products.json',
    ];

    const allProducts = [];

    for (const file of jsonFiles) {
      const filePath = path.join(productsDir, file);
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  Warning: File not found: ${file}`);
        continue;
      }

      const products = loadProductsFromFile(filePath);
      allProducts.push(...products);
      console.log(`📦 Loaded ${products.length} products from ${file}`);
    }

    console.log(`\n📊 Total products to import: ${allProducts.length}\n`);
    stats.total = allProducts.length;

    if (allProducts.length === 0) {
      console.log('❌ No products found to import.');
      process.exit(1);
    }

    // Import products
    console.log('🔄 Starting import...\n');

    for (let i = 0; i < allProducts.length; i++) {
      await createProduct(allProducts[i], i + 1, allProducts.length);
      
      // Small delay to avoid rate limiting
      if (i < allProducts.length - 1 && !DRY_RUN) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Import Summary');
    console.log('='.repeat(60));
    console.log(`   Total products: ${stats.total}`);
    console.log(`   ✅ Created: ${stats.created}`);
    if (SKIP_EXISTING) {
      console.log(`   ⏭️  Skipped: ${stats.skipped}`);
    }
    console.log(`   ❌ Errors: ${stats.errors}`);

    if (stats.errorDetails.length > 0) {
      console.log('\n❌ Error Details:');
      stats.errorDetails.forEach((detail, index) => {
        console.log(`   ${index + 1}. ${detail.product} (${detail.handle})`);
        console.log(`      ${detail.error.split('\n')[0]}`);
      });
    }

    if (DRY_RUN) {
      console.log('\n⚠️  This was a DRY RUN - no products were actually created.');
    }

    console.log('');

    // Exit with error code if there were errors
    if (stats.errors > 0) {
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run the script
main();

