# Nature's Elixir - Client Documentation

This directory contains all client-specific documentation, configurations, and business requirements for Nature's Elixir (natureselixir.com).

## Client Information

- **Client Name**: Jim
- **Business Name**: Nature's Elixir
- **Website**: natureselixir.com
- **Business Type**: E-commerce retail

## Documentation Structure

### Initial Setup

All setup and configuration documentation is in the **[setup/](./setup/)** folder:

- **[Setup Documentation](./setup/README.md)** - Overview of all setup docs
- **[Seed Script Requirements](./setup/seed-script-requirements.md)** - Requirements for building the seed script ⭐ **SEED SCRIPT GUIDE**
- **[Store Configuration Plan](./setup/store-configuration-plan.md)** - Complete requirements guide (reference)
- **[Product JSON Files](./setup/products/)** - Product data for CSV import ⭐ **PRODUCT DATA**
- **[Region Configuration Guide](./setup/region-configuration-guide.md)** - Region and currency setup
- **[Medusa Configuration](./setup/medusa-configuration.md)** - MedusaJS 2.0 specific configurations

### Business & Operations

- **[Client Overview](./client-overview.md)** - Business details, contact information, and general client information
- **[Products](./products.md)** - Product catalog, types, specifications, and inventory details
- **[Shipping & Fulfillment](./shipping-fulfillment.md)** - Shipping methods, rates, and fulfillment processes
- **[Business Requirements](./business-requirements.md)** - Custom business rules, workflows, and operational requirements
- **[Email Templates & Communications](./email-communications.md)** - Email templates, notifications, and communication preferences

## Quick Links

- Backend Configuration: `backend/medusa-config.js`
- Product JSON Files: `documentation/setup/products/`
- Email Templates: `backend/src/modules/email-notifications/templates/`

## Setup Approach

We're using a **Seed Script + CSV Import** approach:

1. **Store Configuration**: Seed script configures regions, shipping, stock locations, categories, etc.
2. **Products**: Import via CSV generated from JSON product files

## Notes

- Always update this documentation when making client-specific changes
- Check this documentation before implementing new features
- Maintain consistency between documentation and code implementation
