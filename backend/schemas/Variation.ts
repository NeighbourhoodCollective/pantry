import {
  integer,
  select,
  text,
  checkbox,
  relationship,
  timestamp,
  decimal,
} from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { rules, isSignedIn, permissions } from '../access';
import { document } from '@keystone-6/fields-document';
import stripeConfig from '../lib/stripe';
import { Lists } from '.keystone/types';
import Stripe from 'stripe';

export const Variation: Lists.Variation = list({
  hooks: {
    afterOperation: async ({ item, operation, context }) => {
      // Update Stripe Price if the variation is being updated
      if (operation === 'update') {
        const variation = await context.query.Variation.findOne({
          where: { id: item.id },
          query: `
                            id
                            stripePriceId
                            status
                            `,
        });
        const active = variation.status === 'active' ? true : false;
        await stripeConfig.prices.update(variation.stripePriceId, {
          active,
        });
      }
    },
    resolveInput: async ({ resolvedData, item, context }) => {
      // If the User is being created and no stripeCutomerId is provided create the stripe customer
      if (!resolvedData.stripePriceId && !item?.stripePriceId) {
        if (!resolvedData.price || !item?.price) return resolvedData;
        console.log(resolvedData);
        const subscription = await context.query.Subscription.findOne({
          where: { id: resolvedData.subscription?.connect?.id },
          query: `
                id
                stripeProductId`,
        });
        const active =
          resolvedData.status === 'active' || item?.status === 'active'
            ? true
            : false;
        const stripeProductId = subscription.stripeProductId;
        const unitPriceDollars = resolvedData.price || item?.price || 0;
        // TODO: fix this type
        const unitPriceCents = (unitPriceDollars as number) * 100;
        const price = await stripeConfig.prices.create({
          product: stripeProductId,
          active: active,
          currency: 'aud',
          unit_amount: unitPriceCents,
          recurring: {
            interval: (resolvedData.chargeInterval ||
              item?.chargeInterval) as Stripe.Price.Recurring.Interval,
            interval_count: (resolvedData.chargeIntervalCount ||
              item?.chargeIntervalCount) as number,
            usage_type: 'licensed',
          },
        });
        resolvedData.stripePriceId = price.id;
      }
      return resolvedData;
    },
    validateInput: async ({
      resolvedData,
      addValidationError,
      context,
      item,
    }) => {
      const subscription = await context.query.Subscription.findOne({
        where: {
          id: resolvedData.subscription?.connect?.id || item?.subscriptionId,
        },
        query: `
              id
              stripeProductId`,
      });
      if (!subscription || !subscription.stripeProductId) {
        // We call addValidationError to indicate an invalid value.
        addValidationError(
          'You need to connect a subscription to a variation that subscription must have a Stripe product ID'
        );
      }
    },
  },
  access: {
    operation: {
      query: () => true,
      create: permissions.canManageProducts,
      delete: permissions.canManageProducts,
      update: permissions.canManageProducts,
    },
    filter: {
      update: rules.canManageSubscriptions,
      query: rules.canReadProducts,
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    subscription: relationship({
      ref: 'Subscription.variations',
      many: false,
    }),
    status: select({
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
      defaultValue: 'active',
    }),
    memberships: relationship({
      ref: 'Membership.variation',
      many: true,
    }),
    price: decimal({
      access: {
        update: () => false,
      },
      scale: 2,
      precision: 4,
      validation: {
        isRequired: true,
      },
    }),
    about: document({
      formatting: true,
      layouts: [
        [1, 1],
        [1, 1, 1],
        [2, 1],
        [1, 2],
        [1, 2, 1],
      ],
      links: true,
      dividers: true,
    }),
    chargeInterval: select({
      access: {
        update: () => false,
      },
      options: [
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
        { value: 'year', label: 'Year' },
      ],
      validation: {
        isRequired: true,
      },
    }),
    chargeIntervalCount: integer({
      access: {
        update: () => false,
      },
      validation: {
        isRequired: true,
      },
    }),
    totalCount: integer(),
    stripePriceId: text({
      access: {
        update: () => false,
      },
      isIndexed: 'unique',
    }),
  },
});
