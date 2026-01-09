# Admin Dashboard - Shipping Configuration Guide

This guide walks you through configuring shipping options and pricing in the MedusaJS admin dashboard.

## Accessing Shipping Configuration

1. **Log into Admin Dashboard**
   - Navigate to: `http://localhost:9000/app` (or your Railway URL)
   - Login with your admin credentials

2. **Navigate to Shipping**
   - In the left sidebar, look for **"Settings"** or **"Configuration"**
   - Click on **"Shipping"** or **"Shipping Options"**
   - Alternatively, go to: **Settings → Shipping**

## Step-by-Step: Creating Shipping Options

### Step 1: Create Shipping Profiles (if not already created)

1. Go to **Settings → Shipping → Shipping Profiles**
2. Click **"Create Shipping Profile"** or **"Add Profile"**
3. Create two profiles:
   - **Default Shipping Profile** (for Tea, Natural Sponges)
   - **Fragile Items (Oils)** (for Spartan Oils)

### Step 2: Create Service Zones

Service zones define which countries/regions the shipping option applies to.

1. Go to **Settings → Shipping → Service Zones** (or **Zones**)
2. Click **"Create Zone"** or **"Add Zone"**

**Create Ireland Zone:**
- **Name**: "Ireland"
- **Countries**: Select "Ireland (IE)"
- **Save**

**Create UK Zone:**
- **Name**: "United Kingdom"
- **Countries**: Select "United Kingdom (GB)"
- **Save**

**Create Europe Zone:**
- **Name**: "Europe"
- **Countries**: Select multiple:
  - Germany (DE)
  - Denmark (DK)
  - Sweden (SE)
  - France (FR)
  - Spain (ES)
  - Italy (IT)
- **Save**

### Step 3: Create Shipping Options

This is where you add the shipping pricing. Navigate to **Settings → Shipping → Shipping Options** (or **Options**).

#### Create Standard Shipping (Ireland)

1. Click **"Create Shipping Option"** or **"Add Option"**
2. Fill in the form:

   **Basic Information:**
   - **Name**: `Standard Shipping (Ireland)`
   - **Description**: `Standard shipping within Ireland. Delivery in 3-5 business days.`
   - **Service Zone**: Select "Ireland" (the zone you created)
   - **Shipping Profile**: Select "Default Shipping Profile"

   **Pricing:**
   - **Price Type**: Select "Flat Rate" or "Fixed"
   - **Price**: Enter `5.00` (or `500` if it asks for cents)
   - **Currency**: Select "EUR" (Euro)
   
   **Additional Settings:**
   - **Fulfillment Provider**: Select "Manual" or "Manual Fulfillment"
   - **Enabled**: Check this box
   - **Is Return**: Leave unchecked

3. Click **"Save"** or **"Create"**

#### Create Express Shipping (Ireland)

Repeat the process with:
- **Name**: `Express Shipping (Ireland)`
- **Description**: `Express shipping within Ireland. Delivery in 1-2 business days.`
- **Service Zone**: Ireland
- **Price**: `10.00` (or `1000` cents)
- **Currency**: EUR

#### Create Standard Shipping (UK)

- **Name**: `Standard Shipping (UK)`
- **Description**: `Standard shipping to United Kingdom. Delivery in 5-7 business days.`
- **Service Zone**: United Kingdom
- **Price**: `5.00` (or `500` pence)
- **Currency**: GBP (British Pound)

#### Create Express Shipping (UK)

- **Name**: `Express Shipping (UK)`
- **Description**: `Express shipping to United Kingdom. Delivery in 2-3 business days.`
- **Service Zone**: United Kingdom
- **Price**: `10.00` (or `1000` pence)
- **Currency**: GBP

#### Create Standard Shipping (Europe)

- **Name**: `Standard Shipping (Europe)`
- **Description**: `Standard shipping to Europe. Delivery in 7-10 business days.`
- **Service Zone**: Europe
- **Price**: `5.00` (or `500` cents)
- **Currency**: EUR

#### Create Express Shipping (Europe)

- **Name**: `Express Shipping (Europe)`
- **Description**: `Express shipping to Europe. Delivery in 3-5 business days.`
- **Service Zone**: Europe
- **Price**: `10.00` (or `1000` cents)
- **Currency**: EUR

### Step 4: Configure Free Shipping (Conditional)

Free shipping requires setting up a condition. This may be done through:

**Option A: Shipping Option with Condition**
- Some admin dashboards allow you to set a minimum order amount
- Look for "Minimum Order Amount" or "Condition" field
- Set to `45.00` (or `4500` cents for EUR, `4500` pence for GBP)

**Option B: Promotion/Discount**
- Go to **Promotions** or **Discounts**
- Create a promotion for free shipping
- Set condition: Order subtotal ≥ €45.00 (EUR) or £45.00 (GBP)

**Option C: Shipping Option with Price Rules**
- When creating the shipping option, look for "Rules" or "Conditions"
- Add a rule: "Order subtotal must be greater than or equal to 45.00"

## Common Admin Dashboard Locations

The exact location may vary by MedusaJS version, but shipping is typically found in:

- **Settings → Shipping**
- **Configuration → Shipping**
- **Shipping → Options**
- **Shipping → Zones**
- **Shipping → Profiles**

## Troubleshooting

### Can't Find Shipping Section?

1. **Check Permissions**: Make sure you're logged in as an admin user
2. **Check Version**: Different MedusaJS versions may have different UI layouts
3. **Look for "Settings"**: Shipping is usually under Settings or Configuration
4. **Search Bar**: Use the admin dashboard search to find "shipping"

### Price Not Saving?

- **Check Currency**: Make sure the currency matches the region (EUR for Ireland/Europe, GBP for UK)
- **Check Format**: Some dashboards want `5.00`, others want `500` (cents/pence)
- **Check Required Fields**: Make sure all required fields are filled

### Shipping Option Not Showing?

- **Check Service Zone**: Make sure the zone includes the correct countries
- **Check Shipping Profile**: Products need to be assigned to the correct shipping profile
- **Check Enabled Status**: Make sure the shipping option is enabled
- **Check Region**: Make sure the region has the correct currency

## Quick Reference: Shipping Rates

**Ireland:**
- Standard: €5.00 (500 cents)
- Express: €10.00 (1000 cents)
- Free: Orders over €45.00

**United Kingdom:**
- Standard: £5.00 (500 pence)
- Express: £10.00 (1000 pence)
- Free: Orders over £45.00

**Europe:**
- Standard: €5.00 (500 cents)
- Express: €10.00 (1000 cents)
- Free: Orders over €45.00

## Next Steps

After configuring shipping:
1. Test by adding items to cart in the storefront
2. Go through checkout to verify shipping options appear
3. Verify prices are correct
4. Test free shipping threshold (add items totaling over €45/£45)

## Need Help?

If you're still having trouble finding the shipping configuration:
- Check the MedusaJS documentation for your version
- Look for "Shipping" in the admin dashboard search
- Shipping configuration may be under "Regions" → Edit Region → Shipping Options

