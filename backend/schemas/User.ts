import { list } from "@keystone-6/core";
import { text, relationship, json } from "@keystone-6/core/fields";
import stripeConfig from "../lib/stripe";

export const User = list({
  hooks: {
    resolveInput: async ({ resolvedData, item }) => {
      // If the User is being created and no stripeCutomerId is provided create the stripe customer
      console.log(resolvedData);

      if (resolvedData.stripeCustomerId === undefined) {
        const customer = await stripeConfig.customers.create({
          email: resolvedData.email,
          name: resolvedData.name,
          phone: resolvedData.phone,
        });
        resolvedData.stripeCustomerId = customer.id;
      }
      return resolvedData;
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    email: text({ validation: { isRequired: true }, isIndexed: true }),
    subjectId: text({ validation: { isRequired: true }, isIndexed: "unique" }),
    preferredName: text(),
    phone: text(),
    posts: relationship({ ref: "Post.author", many: true }),
    role: relationship({
      ref: "Role.assignedTo",
      many: false,
    }),
    householdMembers: json({
      ui: {
        views: require.resolve("../custom-views/household-members.tsx"),
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" },
      },
    }),
    stripeCustomerId: text({
      isIndexed: "unique",
    }),
    memberships: relationship({
      ref: "Membership.user",
      many: true,
    }),
  },
});
