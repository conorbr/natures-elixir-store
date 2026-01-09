import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
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
            amount: 800, // £8.00
          },
          {
            region_id: ukRegion.id,
            amount: 800,
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
            amount: 1500, // £15.00
          },
          {
            region_id: ukRegion.id,
            amount: 1500,
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
            amount: 1200, // €12.00
          },
          {
            region_id: europeRegion.id,
            amount: 1200,
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
            amount: 2000, // €20.00
          },
          {
            region_id: europeRegion.id,
            amount: 2000,
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

  logger.info("Seeding product data...");

  // Nature's Elixir: Product categories
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Tea",
          is_active: true,
        },
        {
          name: "Spartan Oils",
          is_active: true,
        },
        {
          name: "Natural Sponges",
          is_active: true,
        },
      ],
    },
  });

  // Nature's Elixir: Products for Tea, Spartan Oils, and Natural Sponges
  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Organic Green Tea",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Tea")!.id,
          ],
          description:
            "Premium organic green tea sourced from the finest tea gardens. Rich in antioxidants and naturally refreshing. Perfect for daily wellness and relaxation.",
          handle: "organic-green-tea",
          weight: 100, // grams
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [], // To be added with actual product images
          options: [
            {
              title: "Size",
              values: ["50g", "100g", "250g"],
            },
          ],
          variants: [
            {
              title: "50g",
              sku: "TEA-GREEN-50G",
              options: {
                Size: "50g",
              },
              prices: [
                {
                  amount: 800, // €8.00
                  currency_code: "eur",
                },
                {
                  amount: 700, // £7.00
                  currency_code: "gbp",
                },
              ],
            },
            {
              title: "100g",
              sku: "TEA-GREEN-100G",
              options: {
                Size: "100g",
              },
              prices: [
                {
                  amount: 1400, // €14.00
                  currency_code: "eur",
                },
                {
                  amount: 1200, // £12.00
                  currency_code: "gbp",
                },
              ],
            },
            {
              title: "250g",
              sku: "TEA-GREEN-250G",
              options: {
                Size: "250g",
              },
              prices: [
                {
                  amount: 3000, // €30.00
                  currency_code: "eur",
                },
                {
                  amount: 2600, // £26.00
                  currency_code: "gbp",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Lavender Essential Oil",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Spartan Oils")!.id,
          ],
          description:
            "Pure lavender essential oil, known for its calming and soothing properties. Perfect for aromatherapy, relaxation, and natural wellness. 100% pure and natural.",
          handle: "lavender-essential-oil",
          weight: 50, // grams
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [], // To be added with actual product images
          options: [
            {
              title: "Volume",
              values: ["10ml", "30ml", "50ml"],
            },
          ],
          variants: [
            {
              title: "10ml",
              sku: "OIL-LAVENDER-10ML",
              options: {
                Volume: "10ml",
              },
              prices: [
                {
                  amount: 1200, // €12.00
                  currency_code: "eur",
                },
                {
                  amount: 1000, // £10.00
                  currency_code: "gbp",
                },
              ],
            },
            {
              title: "30ml",
              sku: "OIL-LAVENDER-30ML",
              options: {
                Volume: "30ml",
              },
              prices: [
                {
                  amount: 3000, // €30.00
                  currency_code: "eur",
                },
                {
                  amount: 2600, // £26.00
                  currency_code: "gbp",
                },
              ],
            },
            {
              title: "50ml",
              sku: "OIL-LAVENDER-50ML",
              options: {
                Volume: "50ml",
              },
              prices: [
                {
                  amount: 4500, // €45.00
                  currency_code: "eur",
                },
                {
                  amount: 3900, // £39.00
                  currency_code: "gbp",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Natural Sea Sponge",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Natural Sponges")!.id,
          ],
          description:
            "Premium natural sea sponge, sustainably harvested. Soft, durable, and perfect for gentle exfoliation and natural skincare. Eco-friendly and biodegradable.",
          handle: "natural-sea-sponge",
          weight: 50, // grams
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [], // To be added with actual product images
          options: [
            {
              title: "Size",
              values: ["Small", "Medium", "Large"],
            },
          ],
          variants: [
            {
              title: "Small",
              sku: "SPONGE-SEA-SMALL",
              options: {
                Size: "Small",
              },
              prices: [
                {
                  amount: 1500, // €15.00
                  currency_code: "eur",
                },
                {
                  amount: 1300, // £13.00
                  currency_code: "gbp",
                },
              ],
            },
            {
              title: "Medium",
              sku: "SPONGE-SEA-MEDIUM",
              options: {
                Size: "Medium",
              },
              prices: [
                {
                  amount: 2500, // €25.00
                  currency_code: "eur",
                },
                {
                  amount: 2200, // £22.00
                  currency_code: "gbp",
                },
              ],
            },
            {
              title: "Large",
              sku: "SPONGE-SEA-LARGE",
              options: {
                Size: "Large",
              },
              prices: [
                {
                  amount: 3500, // €35.00
                  currency_code: "eur",
                },
                {
                  amount: 3000, // £30.00
                  currency_code: "gbp",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
      ],
    },
  });
  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    const inventoryLevel = {
      location_id: stockLocation.id,
      stocked_quantity: 1000000,
      inventory_item_id: inventoryItem.id,
    };
    inventoryLevels.push(inventoryLevel);
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding inventory levels data.");
}