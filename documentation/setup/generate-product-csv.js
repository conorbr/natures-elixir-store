#!/usr/bin/env node

/**
 * Generate Product Import CSV from JSON Product Files
 * 
 * This script reads the three product JSON files and generates a CSV file
 * compatible with MedusaJS product import.
 * 
 * Usage: node generate-product-csv.js
 * 
 * Note: Category IDs are hardcoded and must match the actual category IDs
 * in your MedusaJS instance. If categories are recreated, update the IDs in
 * the getCategoryId() function.
 */

const fs = require('fs');
const path = require('path');

// CSV column headers (matching the template)
const CSV_HEADERS = [
  'Product Id',
  'Product Handle',
  'Product Title',
  'Product Subtitle',
  'Product Description',
  'Product Status',
  'Product Thumbnail',
  'Product Weight',
  'Product Length',
  'Product Width',
  'Product Height',
  'Product HS Code',
  'Product Origin Country',
  'Product MID Code',
  'Product Material',
  'Shipping Profile Id',
  'Product Sales Channel 1',
  'Product Collection Id',
  'Product Category Id 1',
  'Product Type Id',
  'Product Tag 1',
  'Product Discountable',
  'Product External Id',
  'Variant Id',
  'Variant Title',
  'Variant SKU',
  'Variant Barcode',
  'Variant Allow Backorder',
  'Variant Manage Inventory',
  'Variant Weight',
  'Variant Length',
  'Variant Width',
  'Variant Height',
  'Variant HS Code',
  'Variant Origin Country',
  'Variant MID Code',
  'Variant Material',
  'Variant Price EUR',
  'Variant Option 1 Name',
  'Variant Option 1 Value',
  'Product Image 1 Url',
  'Product Image 2 Url'
];

// Helper function to sanitize text for JSON/CSV compatibility
function sanitizeText(text) {
  if (!text) return text;
  
  let sanitized = String(text);
  
  // Remove or replace control characters (except newlines, which we'll handle separately)
  // Control characters: \x00-\x1F except \n (0x0A), \r (0x0D), \t (0x09)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
  
  // Replace problematic Unicode characters that can break JSON parsing
  // Em dash (—) to regular dash (-)
  sanitized = sanitized.replace(/—/g, '-');
  // En dash (–) to regular dash (-)
  sanitized = sanitized.replace(/–/g, '-');
  // Bullet point (•) to dash (-)
  sanitized = sanitized.replace(/•/g, '-');
  // Smart quotes to regular quotes
  sanitized = sanitized.replace(/[""]/g, '"');
  sanitized = sanitized.replace(/['']/g, "'");
  // Ellipsis (…) to three dots
  sanitized = sanitized.replace(/…/g, '...');
  
  // Normalize line breaks (convert \r\n to \n, then \r to \n)
  sanitized = sanitized.replace(/\r\n/g, '\n');
  sanitized = sanitized.replace(/\r/g, '\n');
  
  return sanitized;
}

// Helper function to escape CSV values
function escapeCsvValue(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  
  // Sanitize the value first
  let stringValue = sanitizeText(value);
  
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
    // Escape quotes by doubling them (CSV standard)
    stringValue = stringValue.replace(/"/g, '""');
    // Wrap in quotes
    return `"${stringValue}"`;
  }
  
  return stringValue;
}

// Helper function to convert boolean to TRUE/FALSE
function booleanToCsv(bool) {
  return bool ? 'TRUE' : 'FALSE';
}

// Helper function to get category ID from category name
// These IDs were fetched from the MedusaJS API on 2024-01-XX
// To update: Query GET /store/product-categories with x-publishable-api-key header
function getCategoryId(categoryName) {
  const categoryMap = {
    'Tea': 'pcat_01KEHWW17PHFG1R5WWMK8M99AZ',
    'Essential Oils': 'pcat_01KEHWW17QG7S40P2YEY6ZTWY2',
    'Natural Sponges': 'pcat_01KEHWW17QP18FQD6X5T4WZSTD',
    'Wellness Supplements': 'pcat_01KEHWW17RZYN97D259HJY0HA4',
    'Soap Products': 'pcat_01KEHWW17SE7MQVJ6ZD28ACPFP',
    'Accessories': 'pcat_01KEHWW17TCF541VBNKMQ429NJ'
  };
  return categoryMap[categoryName] || '';
}

// Helper function to get shipping profile ID
function getShippingProfileId(profileName) {
  // For now, we'll use the profile name as-is
  // In Medusa, this should be the actual profile ID, but for import it might work with name
  return profileName === 'default' ? 'default' : profileName;
}

// Convert product JSON to CSV rows
function productToCsvRows(product) {
  const rows = [];
  
  // For each variant, create one CSV row
  for (const variant of product.variants) {
    const row = [
      '', // Product Id (empty for new products)
      escapeCsvValue(product.product_handle),
      escapeCsvValue(product.product_title),
      escapeCsvValue(product.product_subtitle || ''),
      escapeCsvValue(product.product_description || ''),
      escapeCsvValue(product.product_status || 'published'),
      escapeCsvValue(product.product_thumbnail || ''),
      escapeCsvValue(product.product_weight || ''),
      '', // Product Length
      '', // Product Width
      '', // Product Height
      '', // Product HS Code
      '', // Product Origin Country
      '', // Product MID Code
      '', // Product Material
      escapeCsvValue(getShippingProfileId(product.shipping_profile || 'default')),
      'TRUE', // Product Sales Channel 1 (default sales channel)
      '', // Product Collection Id (leave empty - we use categories instead)
      escapeCsvValue(getCategoryId(product.category || '')), // Product Category Id 1
      '', // Product Type Id
      '', // Product Tag 1
      'TRUE', // Product Discountable (default to TRUE)
      '', // Product External Id
      '', // Variant Id (empty for new variants)
      escapeCsvValue(variant.variant_title),
      escapeCsvValue(variant.variant_sku),
      '', // Variant Barcode
      booleanToCsv(variant.allow_backorder !== false), // Variant Allow Backorder (default true)
      booleanToCsv(variant.manage_inventory === true), // Variant Manage Inventory (default false)
      '', // Variant Weight
      '', // Variant Length
      '', // Variant Width
      '', // Variant Height
      '', // Variant HS Code
      '', // Variant Origin Country
      '', // Variant MID Code
      '', // Variant Material
      escapeCsvValue(variant.variant_price_eur || ''),
      escapeCsvValue(variant.variant_option_1_name || ''),
      escapeCsvValue(variant.variant_option_1_value || ''),
      escapeCsvValue(product.images && product.images[0] ? product.images[0] : ''),
      escapeCsvValue(product.images && product.images[1] ? product.images[1] : '')
    ];
    
    rows.push(row);
  }
  
  return rows;
}

// Main function
function generateCsv() {
  const productsDir = path.join(__dirname, 'products');
  const outputFile = path.join(__dirname, 'natures-elixir-products-import.csv');
  
  const jsonFiles = [
    'tea-products.json',
    'essential-oils.json',
    'other-products.json'
  ];
  
  let allProducts = [];
  
  // Read and parse all JSON files
  console.log('Reading product JSON files...');
  for (const jsonFile of jsonFiles) {
    const filePath = path.join(productsDir, jsonFile);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: File not found: ${filePath}`);
      continue;
    }
    
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);
      
      if (jsonData.products && Array.isArray(jsonData.products)) {
        allProducts = allProducts.concat(jsonData.products);
        console.log(`  ✓ Loaded ${jsonData.products.length} products from ${jsonFile}`);
      } else {
        console.warn(`  ⚠ No products array found in ${jsonFile}`);
      }
    } catch (error) {
      console.error(`  ✗ Error reading ${jsonFile}:`, error.message);
    }
  }
  
  console.log(`\nTotal products loaded: ${allProducts.length}`);
  
  // Generate CSV rows
  console.log('Generating CSV rows...');
  const csvRows = [CSV_HEADERS];
  
  for (const product of allProducts) {
    const rows = productToCsvRows(product);
    csvRows.push(...rows);
  }
  
  console.log(`Total CSV rows (including header): ${csvRows.length}`);
  console.log(`Total variants: ${csvRows.length - 1}`);
  
  // Write CSV file
  console.log(`\nWriting CSV to: ${outputFile}`);
  const csvContent = csvRows.map(row => row.join(',')).join('\n');
  fs.writeFileSync(outputFile, csvContent, 'utf8');
  
  console.log('✓ CSV file generated successfully!');
  console.log(`\nFile location: ${outputFile}`);
  console.log(`\nNext steps:`);
  console.log(`  1. Review the generated CSV file`);
  console.log(`  2. Import via MedusaJS Admin Dashboard: Settings > Import/Export > Import Products`);
  console.log(`  3. Or use the MedusaJS API to import products programmatically`);
}

// Run the script
if (require.main === module) {
  try {
    generateCsv();
  } catch (error) {
    console.error('Error generating CSV:', error);
    process.exit(1);
  }
}

module.exports = { generateCsv, productToCsvRows };

