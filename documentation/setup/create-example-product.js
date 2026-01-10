/**
 * Script to create an example product from the JSON file using the Admin API
 * 
 * Usage:
 *   node documentation/setup/create-example-product.js
 * 
 * Environment variables required:
 *   - BACKEND_URL: Your Medusa backend URL (e.g., https://backend-production-8f25.up.railway.app)
 *   - ADMIN_SECRET_KEY: Your secret API key (starts with sk_)
 */

const fs = require('fs');
const path = require('path');

// Configuration - update these or set via environment variables
const BACKEND_URL = (process.env.BACKEND_URL || 'https://backend-production-8f25.up.railway.app').replace(/\/$/, '');
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || '';

if (!ADMIN_SECRET_KEY) {
  console.error('❌ Error: ADMIN_SECRET_KEY environment variable is required');
  console.error('   Set it in your .env file or pass it as an environment variable');
  process.exit(1);
}

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

  // Add body if present (stringify if it's an object)
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

// Get category ID by name
async function getCategoryId(categoryName) {
  try {
    const response = await apiRequest('/admin/product-categories?limit=100');
    const categories = response.product_categories || [];
    const category = categories.find(cat => cat.name === categoryName);
    
    if (!category) {
      throw new Error(`Category "${categoryName}" not found. Available categories: ${categories.map(c => c.name).join(', ')}`);
    }
    
    return category.id;
  } catch (error) {
    console.error(`Error fetching category "${categoryName}":`, error.message);
    throw error;
  }
}

// Get shipping profile ID by name (handles "default" -> "Default Shipping Profile" mapping)
async function getShippingProfileId(profileName) {
  try {
    const response = await apiRequest('/admin/shipping-profiles');
    const profiles = response.shipping_profiles || [];
    
    // Map "default" to "Default Shipping Profile"
    const profileNameMap = {
      'default': 'Default Shipping Profile',
      'fragile': 'Fragile Shipping Profile',
    };
    
    const mappedName = profileNameMap[profileName.toLowerCase()] || profileName;
    
    // Try exact match first
    let profile = profiles.find(p => p.name === mappedName);
    
    // If not found, try case-insensitive match
    if (!profile) {
      profile = profiles.find(p => p.name.toLowerCase() === mappedName.toLowerCase());
    }
    
    if (!profile) {
      throw new Error(`Shipping profile "${profileName}" not found. Available profiles: ${profiles.map(p => p.name).join(', ')}`);
    }
    
    return profile.id;
  } catch (error) {
    console.error(`Error fetching shipping profile "${profileName}":`, error.message);
    throw error;
  }
}

// Get region ID (we'll use the first region, which should be Europe)
async function getRegionId() {
  try {
    const response = await apiRequest('/admin/regions');
    const regions = response.regions || [];
    
    if (regions.length === 0) {
      throw new Error('No regions found. Make sure the seed script has run.');
    }
    
    // Prefer "Europe" region, otherwise use the first one
    const europeRegion = regions.find(r => r.name === 'Europe');
    const region = europeRegion || regions[0];
    
    console.log(`Using region: ${region.name} (${region.currency_code})`);
    return region.id;
  } catch (error) {
    console.error('Error fetching regions:', error.message);
    throw error;
  }
}

// Convert JSON product to Admin API format
async function convertProductToApiFormat(productJson) {
  // Get required IDs
  const categoryId = await getCategoryId(productJson.category);
  const shippingProfileId = await getShippingProfileId(productJson.shipping_profile);
  const regionId = await getRegionId();

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
          amount: variant.variant_price_eur, // Already in major units (8.75 for €8.75)
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

// Test connection to the API
async function testConnection() {
  try {
    console.log('🔍 Testing API connection...');
    // Test with a simple endpoint that should exist
    await apiRequest('/admin/regions?limit=1');
    console.log('✅ API connection successful\n');
  } catch (error) {
    console.error('❌ API connection failed:', error.message);
    console.error(`   Backend URL: ${BACKEND_URL}`);
    console.error(`   Make sure the backend is accessible and the URL is correct.\n`);
    throw error;
  }
}

// Main function
async function main() {
  try {
    console.log('🚀 Creating example product from JSON...\n');

    // Test connection first
    await testConnection();

    // Read the tea products JSON file
    const jsonPath = path.join(__dirname, 'products', 'tea-products.json');
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const productData = JSON.parse(jsonContent);

    // Use the first product as an example (Apricot Delight Tea)
    const exampleProduct = productData.products[0];

    console.log(`📦 Product: ${exampleProduct.product_title}`);
    console.log(`   Handle: ${exampleProduct.product_handle}`);
    console.log(`   Variants: ${exampleProduct.variants.length}`);
    console.log(`   Category: ${exampleProduct.category}`);
    console.log(`   Shipping Profile: ${exampleProduct.shipping_profile}\n`);

    // Convert to API format
    console.log('🔄 Converting product to API format...');
    const apiPayload = await convertProductToApiFormat(exampleProduct);

    // Create the product
    console.log('📤 Creating product via Admin API...');
    const response = await apiRequest('/admin/products', {
      method: 'POST',
      body: apiPayload,
    });

    console.log('\n✅ Product created successfully!');
    console.log(`   Product ID: ${response.product.id}`);
    console.log(`   Title: ${response.product.title}`);
    console.log(`   Handle: ${response.product.handle}`);
    console.log(`   Status: ${response.product.status}`);
    console.log(`   Variants: ${response.product.variants?.length || 0}`);
    console.log(`\n   View in admin: ${BACKEND_URL}/app/products/${response.product.id}`);

  } catch (error) {
    console.error('\n❌ Error creating product:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run the script
main();

