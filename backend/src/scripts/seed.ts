import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createProductCategoriesWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default ?? false,
              };
            }
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

// Reset database function to remove default data
async function resetDatabase(
  container: any,
  logger: any,
  query: any
) {
  try {
    // Get database manager for direct SQL operations
    const manager = container.resolve(ContainerRegistrationKeys.MANAGER);
    
    logger.info("Resetting database: Truncating default data tables...");
    
    // Delete in correct order to respect foreign key constraints
    // 1. Delete inventory levels first (references products and stock locations)
    await manager.query("DELETE FROM inventory_level");
    logger.info("Deleted inventory levels");
    
    // 2. Delete products (references categories, shipping profiles)
    await manager.query("DELETE FROM product_variant");
    await manager.query("DELETE FROM product");
    logger.info("Deleted products and variants");
    
    // 3. Delete product categories
    await manager.query("DELETE FROM product_category");
    logger.info("Deleted product categories");
    
    // 4. Delete shipping options (references fulfillment sets, shipping profiles)
    await manager.query("DELETE FROM shipping_option");
    logger.info("Deleted shipping options");
    
    // 5. Delete fulfillment sets and service zones
    await manager.query("DELETE FROM geo_zone");
    await manager.query("DELETE FROM service_zone");
    await manager.query("DELETE FROM fulfillment_set");
    logger.info("Deleted fulfillment sets and service zones");
    
    // 6. Delete shipping profiles
    await manager.query("DELETE FROM shipping_profile");
    logger.info("Deleted shipping profiles");
    
    // 7. Delete regions (references countries, payment providers)
    await manager.query("DELETE FROM region_country");
    await manager.query("DELETE FROM region_payment_provider");
    await manager.query("DELETE FROM region");
    logger.info("Deleted regions");
    
    // 8. Delete stock locations
    await manager.query("DELETE FROM stock_location");
    logger.info("Deleted stock locations");
    
    // 9. Delete tax regions
    await manager.query("DELETE FROM tax_region");
    logger.info("Deleted tax regions");
    
    logger.info("Database reset completed successfully.");
  } catch (error: any) {
    logger.error(`Error during database reset: ${error.message}`);
    // Don't throw - allow script to continue even if reset fails
    logger.warn("Continuing with seed despite reset errors...");
  }
}

// Nature's Elixir seed script
// This script sets up the store with Ireland region, Dublin stock location,
// and Nature's Elixir products (Tea, Spartan Oils, Natural Sponges)
export default async function seedNaturesElixir({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  // Nature's Elixir: Europe and UK store
  const europeCountries = ["ie", "de", "dk", "se", "fr", "es", "it"]; // Europe (EUR)
  const ukCountries = ["gb"]; // United Kingdom (GBP)

  // Check if seed has already run by checking if "Europe" region exists
  logger.info("Checking if seed has already run...");
  let needsReset = false;
  try {
    const existingRegions = await query.graph({
      entity: "region",
      fields: ["id", "name"],
      filters: {
        name: "Europe",
      },
    });

    if (existingRegions && existingRegions.length > 0) {
      logger.info(
        "Seed has already been run. 'Europe' region exists. Skipping seed script."
      );
      return;
    }

    // Check if default data exists (from initial deployment)
    const allRegions = await query.graph({
      entity: "region",
      fields: ["id", "name"],
    });

    if (allRegions && allRegions.length > 0) {
      needsReset = true;
      logger.info("Default data detected. Resetting database before seeding...");
    }
  } catch (error) {
    // If query fails, continue with seeding (might be first run)
    logger.info("Could not check existing data, proceeding with seed...");
  }

  // Reset database if default data exists
  if (needsReset) {
    logger.info("Resetting database: Removing default regions, products, and related data...");
    await resetDatabase(container, logger, query);
    logger.info("Database reset complete.");
  }

  logger.info("Seeding Nature's Elixir store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  // Nature's Elixir: EUR primary currency, GBP secondary
  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        {
          currency_code: "eur",
          is_default: true,
        },
        {
          currency_code: "gbp",
        },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });
  logger.info("Seeding region data...");
  // Nature's Elixir: Europe region (EUR) and UK region (GBP) with Stripe payment
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Europe",
          currency_code: "eur",
          countries: europeCountries,
          payment_providers: ["pp_stripe_stripe"],
        },
        {
          name: "United Kingdom",
          currency_code: "gbp",
          countries: ukCountries,
          payment_providers: ["pp_stripe_stripe"],
        },
      ],
    },
  });
  const europeRegion = regionResult.find((r) => r.name === "Europe")!;
  const ukRegion = regionResult.find((r) => r.name === "United Kingdom")!;
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  // Create tax regions for all countries
  const allCountries = [...europeCountries, ...ukCountries];
  await createTaxRegionsWorkflow(container).run({
    input: allCountries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  // Nature's Elixir: Dublin stock location (Jim's garage)
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Nature's Elixir - Dublin",
          address: {
            city: "Dublin",
            country_code: "IE",
            address_1: "", // To be updated with Jim's address
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
      },
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  // Nature's Elixir: Multiple shipping zones (Ireland, UK, Europe)
  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Nature's Elixir - Dublin Delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Ireland",
        geo_zones: [
          {
            country_code: "ie",
            type: "country",
          },
        ],
      },
      {
        name: "United Kingdom",
        geo_zones: [
          {
            country_code: "gb",
            type: "country",
          },
        ],
      },
      {
        name: "Europe",
        geo_zones: [
          {
            country_code: "de",
            type: "country",
          },
          {
            country_code: "dk",
            type: "country",
          },
          {
            country_code: "se",
            type: "country",
          },
          {
            country_code: "fr",
            type: "country",
          },
          {
            country_code: "es",
            type: "country",
          },
          {
            country_code: "it",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  // Nature's Elixir: Shipping options for Ireland, UK, and Europe
  const irelandZone = fulfillmentSet.service_zones.find((z) => z.name === "Ireland")!;
  const ukZone = fulfillmentSet.service_zones.find((z) => z.name === "United Kingdom")!;
  const europeZone = fulfillmentSet.service_zones.find((z) => z.name === "Europe")!;

  await createShippingOptionsWorkflow(container).run({
    input: [
      // Ireland shipping options (EUR)
      {
        name: "Standard Shipping (Ireland)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: irelandZone.id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Standard shipping within Ireland. Delivery in 3-5 business days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "eur",
            amount: 500, // €5.00
          },
          {
            region_id: europeRegion.id,
            amount: 500,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Shipping (Ireland)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: irelandZone.id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Express shipping within Ireland. Delivery in 1-2 business days.",
          code: "express",
        },
        prices: [
          {
            currency_code: "eur",
            amount: 1000, // €10.00
          },
          {
            region_id: europeRegion.id,
            amount: 1000,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Free Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: irelandZone.id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Free",
          description: "Free shipping for orders over €45.00",
          code: "free",
        },
        prices: [
          {
            currency_code: "eur",
            amount: 0, // €0.00
          },
          {
            region_id: europeRegion.id,
            amount: 0,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
          {
            attribute: "subtotal",
            value: "4500", // €45.00 in cents
            operator: "gte",
          },
        ],
      },
      // UK shipping options (GBP)
      {
        name: "Standard Shipping (UK)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: ukZone.id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Standard shipping to United Kingdom. Delivery in 5-7 business days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "gbp",
            amount: 500, // £5.00
          },
          {
            region_id: ukRegion.id,
            amount: 500,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Shipping (UK)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: ukZone.id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Express shipping to United Kingdom. Delivery in 2-3 business days.",
          code: "express",
        },
        prices: [
          {
            currency_code: "gbp",
            amount: 1000, // £10.00
          },
          {
            region_id: ukRegion.id,
            amount: 1000,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Free Shipping (UK)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: ukZone.id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Free",
          description: "Free shipping for orders over £45.00",
          code: "free",
        },
        prices: [
          {
            currency_code: "gbp",
            amount: 0, // £0.00
          },
          {
            region_id: ukRegion.id,
            amount: 0,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
          {
            attribute: "subtotal",
            value: "4500", // £45.00 in pence
            operator: "gte",
          },
        ],
      },
      // Europe shipping options (EUR)
      {
        name: "Standard Shipping (Europe)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: europeZone.id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Standard shipping to Europe. Delivery in 7-10 business days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "eur",
            amount: 500, // €5.00
          },
          {
            region_id: europeRegion.id,
            amount: 500,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Shipping (Europe)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: europeZone.id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Express shipping to Europe. Delivery in 3-5 business days.",
          code: "express",
        },
        prices: [
          {
            currency_code: "eur",
            amount: 1000, // €10.00
          },
          {
            region_id: europeRegion.id,
            amount: 1000,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Free Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: europeZone.id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Free",
          description: "Free shipping for orders over €45.00",
          code: "free",
        },
        prices: [
          {
            currency_code: "eur",
            amount: 0, // €0.00
          },
          {
            region_id: europeRegion.id,
            amount: 0,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
          {
            attribute: "subtotal",
            value: "4500", // €45.00 in cents
            operator: "gte",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
    container
  ).run({
    input: {
      api_keys: [
        {
          title: "Webshop",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });
  const publishableApiKey = publishableApiKeyResult[0];

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding product categories...");

  // Nature's Elixir: Product categories (products will be imported via CSV)
  await createProductCategoriesWorkflow(container).run({
    input: {
      product_categories: [
        {
          name: "Tea",
          description: "Various types of natural and organic teas",
          handle: "tea",
          is_active: true,
          is_internal: false,
        },
        {
          name: "Essential Oils",
          description: "Natural essential oils and oil products",
          handle: "essential-oils",
          is_active: true,
          is_internal: false,
        },
        {
          name: "Natural Sponges",
          description: "Organic and natural sponge products",
          handle: "natural-sponges",
          is_active: true,
          is_internal: false,
        },
        {
          name: "Wellness Supplements",
          description: "Natural wellness and health supplements",
          handle: "wellness-supplements",
          is_active: true,
          is_internal: false,
        },
        {
          name: "Soap Products",
          description: "Natural soap products",
          handle: "soap-products",
          is_active: true,
          is_internal: false,
        },
        {
          name: "Accessories",
          description: "Tea accessories and related products",
          handle: "accessories",
          is_active: true,
          is_internal: false,
        },
      ],
    },
  });
  logger.info("Finished seeding product categories.");

  logger.info("Seed script completed successfully!");
  logger.info("Note: Products will be imported separately via CSV.");
}