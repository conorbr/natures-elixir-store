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
  deleteApiKeysWorkflow,
  deleteFulfillmentSetsWorkflow,
  deleteProductCategoriesWorkflow,
  deleteRegionsWorkflow,
  deleteServiceZonesWorkflow,
  deleteShippingOptionsWorkflow,
  deleteShippingProfileWorkflow,
  deleteStockLocationsWorkflow,
  deleteTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateRegionsWorkflow,
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
// Uses deleteRegionsWorkflow to properly delete existing regions
async function resetDatabase(
  container: any,
  logger: any,
  query: any
) {
  try {
    logger.info("Resetting database: Removing existing regions and data...");
    
    // Find existing regions and delete them using the proper workflow
    const existingRegions = await query.graph({
      entity: "region",
      fields: ["id", "name"],
    });
    
    if (existingRegions?.data && existingRegions.data.length > 0) {
      const regionIds = existingRegions.data.map((r: any) => r.id);
      logger.info(`Found ${regionIds.length} existing region(s) to delete: ${existingRegions.data.map((r: any) => r.name).join(", ")}`);
      
      try {
        // Use deleteRegionsWorkflow to properly delete regions
        await deleteRegionsWorkflow(container).run({
          input: {
            ids: regionIds,
          },
        });
        logger.info(`Successfully deleted ${regionIds.length} region(s)`);
      } catch (error: any) {
        logger.warn(`Failed to delete regions: ${error.message}`);
        // Try deleting one by one as fallback
        for (const regionId of regionIds) {
          try {
            await deleteRegionsWorkflow(container).run({
              input: {
                ids: [regionId],
              },
            });
            logger.info(`Deleted region: ${regionId}`);
          } catch (err: any) {
            logger.warn(`Failed to delete region ${regionId}: ${err.message}`);
          }
        }
      }
    }

    // Delete existing tax regions
    const existingTaxRegions = await query.graph({
      entity: "tax_region",
      fields: ["id", "country_code"],
    });

    if (existingTaxRegions?.data && existingTaxRegions.data.length > 0) {
      const taxRegionIds = existingTaxRegions.data.map((tr: any) => tr.id);
      logger.info(`Found ${taxRegionIds.length} existing tax region(s) to delete: ${existingTaxRegions.data.map((tr: any) => tr.country_code).join(", ")}`);
      
      try {
        // Use deleteTaxRegionsWorkflow to properly delete tax regions
        await deleteTaxRegionsWorkflow(container).run({
          input: {
            ids: taxRegionIds,
          },
        });
        logger.info(`Successfully deleted ${taxRegionIds.length} tax region(s)`);
      } catch (error: any) {
        logger.warn(`Failed to delete tax regions: ${error.message}`);
        // Try deleting one by one as fallback
        for (const taxRegionId of taxRegionIds) {
          try {
            await deleteTaxRegionsWorkflow(container).run({
              input: {
                ids: [taxRegionId],
              },
            });
            logger.info(`Deleted tax region: ${taxRegionId}`);
          } catch (err: any) {
            logger.warn(`Failed to delete tax region ${taxRegionId}: ${err.message}`);
          }
        }
      }
    }

    // Delete shipping options (must be deleted before service zones)
    const existingShippingOptions = await query.graph({
      entity: "shipping_option",
      fields: ["id", "name"],
    });

    if (existingShippingOptions?.data && existingShippingOptions.data.length > 0) {
      const shippingOptionIds = existingShippingOptions.data.map((so: any) => so.id);
      logger.info(`Found ${shippingOptionIds.length} existing shipping option(s) to delete`);
      
      try {
        await deleteShippingOptionsWorkflow(container).run({
          input: {
            ids: shippingOptionIds,
          },
        });
        logger.info(`Successfully deleted ${shippingOptionIds.length} shipping option(s)`);
      } catch (error: any) {
        logger.warn(`Failed to delete shipping options: ${error.message}`);
      }
    }

    // Delete service zones (must be deleted before fulfillment sets)
    const existingServiceZones = await query.graph({
      entity: "service_zone",
      fields: ["id", "name"],
    });

    if (existingServiceZones?.data && existingServiceZones.data.length > 0) {
      const serviceZoneIds = existingServiceZones.data.map((sz: any) => sz.id);
      logger.info(`Found ${serviceZoneIds.length} existing service zone(s) to delete`);
      
      try {
        await deleteServiceZonesWorkflow(container).run({
          input: {
            ids: serviceZoneIds,
          },
        });
        logger.info(`Successfully deleted ${serviceZoneIds.length} service zone(s)`);
      } catch (error: any) {
        logger.warn(`Failed to delete service zones: ${error.message}`);
      }
    }

    // Delete fulfillment sets
    const existingFulfillmentSets = await query.graph({
      entity: "fulfillment_set",
      fields: ["id", "name"],
    });

    if (existingFulfillmentSets?.data && existingFulfillmentSets.data.length > 0) {
      const fulfillmentSetIds = existingFulfillmentSets.data.map((fs: any) => fs.id);
      logger.info(`Found ${fulfillmentSetIds.length} existing fulfillment set(s) to delete`);
      
      try {
        await deleteFulfillmentSetsWorkflow(container).run({
          input: {
            ids: fulfillmentSetIds,
          },
        });
        logger.info(`Successfully deleted ${fulfillmentSetIds.length} fulfillment set(s)`);
      } catch (error: any) {
        logger.warn(`Failed to delete fulfillment sets: ${error.message}`);
      }
    }

    // Delete shipping profiles
    const existingShippingProfiles = await query.graph({
      entity: "shipping_profile",
      fields: ["id", "name"],
    });

    if (existingShippingProfiles?.data && existingShippingProfiles.data.length > 0) {
      const shippingProfileIds = existingShippingProfiles.data.map((sp: any) => sp.id);
      logger.info(`Found ${shippingProfileIds.length} existing shipping profile(s) to delete`);
      
      try {
        await deleteShippingProfileWorkflow(container).run({
          input: {
            ids: shippingProfileIds,
          },
        });
        logger.info(`Successfully deleted ${shippingProfileIds.length} shipping profile(s)`);
      } catch (error: any) {
        logger.warn(`Failed to delete shipping profiles: ${error.message}`);
      }
    }

    // Delete stock locations
    const existingStockLocations = await query.graph({
      entity: "stock_location",
      fields: ["id", "name"],
    });

    if (existingStockLocations?.data && existingStockLocations.data.length > 0) {
      const stockLocationIds = existingStockLocations.data.map((sl: any) => sl.id);
      logger.info(`Found ${stockLocationIds.length} existing stock location(s) to delete`);
      
      try {
        await deleteStockLocationsWorkflow(container).run({
          input: {
            ids: stockLocationIds,
          },
        });
        logger.info(`Successfully deleted ${stockLocationIds.length} stock location(s)`);
      } catch (error: any) {
        logger.warn(`Failed to delete stock locations: ${error.message}`);
      }
    }

    // Delete product categories
    const existingProductCategories = await query.graph({
      entity: "product_category",
      fields: ["id", "name"],
    });

    if (existingProductCategories?.data && existingProductCategories.data.length > 0) {
      const productCategoryIds = existingProductCategories.data.map((pc: any) => pc.id);
      logger.info(`Found ${productCategoryIds.length} existing product categor(ies) to delete`);
      
      try {
        await deleteProductCategoriesWorkflow(container).run({
          input: productCategoryIds,
        });
        logger.info(`Successfully deleted ${productCategoryIds.length} product categor(ies)`);
      } catch (error: any) {
        logger.warn(`Failed to delete product categories: ${error.message}`);
      }
    }

    // Delete API keys
    const existingApiKeys = await query.graph({
      entity: "api_key",
      fields: ["id", "title"],
    });

    if (existingApiKeys?.data && existingApiKeys.data.length > 0) {
      const apiKeyIds = existingApiKeys.data.map((ak: any) => ak.id);
      logger.info(`Found ${apiKeyIds.length} existing API key(s) to delete`);
      
      try {
        await deleteApiKeysWorkflow(container).run({
          input: {
            ids: apiKeyIds,
          },
        });
        logger.info(`Successfully deleted ${apiKeyIds.length} API key(s)`);
      } catch (error: any) {
        logger.warn(`Failed to delete API keys: ${error.message}`);
      }
    }
    
    logger.info("Database reset completed - all entities deleted, ready for re-seeding.");
  } catch (error: any) {
    logger.error(`Error during database reset: ${error.message}`);
    // Don't throw - allow script to continue even if reset fails
    logger.warn("Continuing with seed despite reset errors...");
  }
}

// Global variable to track if database reset is needed
// Set to true to force database reset during setup
let needsReset = true;

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

  // Nature's Elixir: Single Europe region (includes UK)
  const europeCountries = ["ie", "gb", "de", "dk", "se", "fr", "es", "it"]; // Europe (EUR) - includes UK

  // Check if seed has already run by checking if "Europe" region exists
  logger.info("Checking if seed has already run...");
  try {
    const existingRegions = await query.graph({
      entity: "region",
      fields: ["id", "name"],
      filters: {
        name: "Europe",
      },
    });

    // Check if default data exists (from initial deployment)
    const allRegions = await query.graph({
      entity: "region",
      fields: ["id", "name"],
    });

    if (existingRegions?.data && existingRegions.data.length > 0) {
      // Europe region exists - this means our seed has run before
      // Since we want to force reset and re-seed for setup purposes, we'll reset anyway
      logger.info(
        "'Europe' region exists. Forcing reset and re-seed for setup purposes..."
      );
      needsReset = true;
    } else if (allRegions?.data && allRegions.data.length > 0) {
      // Default data exists but not our seed - reset and seed
      needsReset = true;
      logger.info("Default data detected. Resetting database before seeding...");
    } else {
      // No existing data, but still reset to ensure clean state
      needsReset = true;
      logger.info("No existing data found. Resetting database to ensure clean state...");
    }
  } catch (error) {
    // If query fails, continue with reset and seeding (might be first run)
    logger.info("Could not check existing data, proceeding with reset and seed...");
    needsReset = true;
  }

  // Always reset database during setup to ensure clean state
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

  // Nature's Elixir: EUR primary currency only (UK included in Europe region)
  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        {
          currency_code: "eur",
          is_default: true,
        },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        name: "Natures Elixir",
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });
  logger.info("Seeding region data...");
  // Nature's Elixir: Single Europe region (EUR) including UK with Stripe payment
  // Regions should have been deleted by resetDatabase, so we create new ones
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Europe",
          currency_code: "eur",
          countries: europeCountries,
          payment_providers: ["pp_stripe_stripe"],
        },
      ],
    },
  });
  const europeRegion = regionResult.find((r) => r.name === "Europe")!;
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  // Create tax regions for all countries in Europe region (including UK)
  await createTaxRegionsWorkflow(container).run({
    input: europeCountries.map((country_code) => ({
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
            amount: 5, // €5.00 (major units in MedusaJS 2.0)
          },
          {
            region_id: europeRegion.id,
            amount: 5,
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
            amount: 10, // €10.00 (major units in MedusaJS 2.0)
          },
          {
            region_id: europeRegion.id,
            amount: 10,
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
            amount: 0, // €0.00 - free shipping when condition is met
            rules: [
                {
                attribute: "item_total",
                operator: "gte",
                value: 45, // €45.00 (major units in MedusaJS 2.0)
                },
              ],
            },
            {
            region_id: europeRegion.id,
            amount: 0,
            rules: [
                {
                attribute: "item_total",
                operator: "gte",
                value: 45, // €45.00 (major units in MedusaJS 2.0)
                },
              ],
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
      // UK shipping options (EUR - UK included in Europe region)
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
                  currency_code: "eur",
            amount: 5, // €5.00 (major units in MedusaJS 2.0)
            },
            {
            region_id: europeRegion.id,
            amount: 5,
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
                  currency_code: "eur",
            amount: 10, // €10.00 (major units in MedusaJS 2.0)
            },
            {
            region_id: europeRegion.id,
            amount: 10,
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
          description: "Free shipping for orders over €45.00",
          code: "free",
              },
              prices: [
                {
                  currency_code: "eur",
            amount: 0, // €0.00 - free shipping when condition is met
            rules: [
                {
                attribute: "item_total",
                operator: "gte",
                value: 45, // €45.00 (major units in MedusaJS 2.0)
                },
              ],
            },
          {
            region_id: europeRegion.id,
            amount: 0,
            rules: [
              {
                attribute: "item_total",
                operator: "gte",
                value: 45, // €45.00 (major units in MedusaJS 2.0)
              },
            ],
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
            amount: 5, // €5.00 (major units in MedusaJS 2.0)
            },
            {
            region_id: europeRegion.id,
            amount: 5,
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
            amount: 10, // €10.00 (major units in MedusaJS 2.0)
            },
            {
            region_id: europeRegion.id,
                  amount: 10,
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
            amount: 0, // €0.00 - free shipping when condition is met
            rules: [
                {
                attribute: "item_total",
                operator: "gte",
                value: 45, // €45.00 (major units in MedusaJS 2.0)
                },
              ],
            },
            {
            region_id: europeRegion.id,
            amount: 0,
            rules: [
                {
                attribute: "item_total",
                operator: "gte",
                value: 45, // €45.00 (major units in MedusaJS 2.0)
                },
              ],
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