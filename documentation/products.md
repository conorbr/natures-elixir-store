# Nature's Elixir - Products

## Product Categories

### 1. Tea

**Description**: Various types of natural and organic teas

**Product Type Details**:
- Organic teas
- Natural tea blends
- Herbal teas
- Specialty tea varieties

**Key Attributes**:
- Tea type/variety
- Organic certification (if applicable)
- Caffeine content
- Flavor profile
- Packaging size/weight

**Inventory Considerations**:
- Shelf life management
- Storage requirements
- Batch tracking (if applicable)

### 2. Spartan Oils

**Description**: Natural oils and essential oil products

**Product Type Details**:
- Essential oils
- Carrier oils
- Oil blends
- Natural oil-based products

**Key Attributes**:
- Oil type/variety
- Volume/size
- Extraction method
- Purity/concentration
- Application/use case

**Inventory Considerations**:
- Expiration dates
- Storage conditions (light-sensitive, temperature)
- Batch tracking for quality control

### 3. Natural Sponges

**Description**: Organic and natural sponge products

**Product Type Details**:
- Sea sponges
- Natural bath sponges
- Organic sponge varieties

**Key Attributes**:
- Sponge type/variety
- Size/dimensions
- Origin/source
- Texture/grade
- Sustainability certifications (if applicable)

**Inventory Considerations**:
- Natural product variations
- Size variations
- Care instructions

## Product Configuration Notes

### MedusaJS Product Setup

- **Product Types**: Tea, Spartan Oils, Natural Sponges
- **Product Variants**: Size, quantity, variety options
- **Product Options**: 
  - Tea: Size, variety, quantity
  - Spartan Oils: Volume, type, concentration
  - Natural Sponges: Size, type, grade

### Pricing Strategy

- [To be determined based on client requirements]
- Consider volume discounts for bulk purchases
- Subscription options (if applicable)

### Inventory Management

- Track inventory levels for all product types
- Consider seasonal variations for tea products
- Natural product variations may require flexible inventory tracking

### Product Images

- High-quality product photography required
- Lifestyle images for marketing
- Detail shots showing product quality
- Consider image optimization for web performance

## Product Data Structure

### Example Product Structure (Tea)

```typescript
{
  title: "Organic Green Tea",
  description: "Premium organic green tea...",
  handle: "organic-green-tea",
  status: "published",
  categories: ["tea"],
  variants: [
    {
      title: "50g",
      sku: "TEA-GREEN-50G",
      prices: [{ amount: 1500, currency_code: "usd" }],
      inventory_quantity: 100
    },
    {
      title: "100g",
      sku: "TEA-GREEN-100G",
      prices: [{ amount: 2500, currency_code: "usd" }],
      inventory_quantity: 50
    }
  ]
}
```

## Next Steps

- [ ] Define specific product SKUs and pricing
- [ ] Set up product categories in Medusa
- [ ] Configure product variants and options
- [ ] Upload product images
- [ ] Set inventory levels
- [ ] Configure shipping profiles for each product type

