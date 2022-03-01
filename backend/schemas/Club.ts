import { list } from "@keystone-6/core";
import { text, relationship, select } from "@keystone-6/core/fields";
import { document } from "@keystone-6/fields-document";

export const Club = list({
  fields: {
    name: text(),
    membershipTypes: relationship({
      ref: "MembershipType.club",
      many: true,
    }),
    memberships: relationship({
      ref: "Membership.club",
      many: true,
    }),
    status: select({
      options: [
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" },
      ],
      ui: {
        displayMode: "segmented-control",
      },
    }),
    content: document({
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
  },
});
