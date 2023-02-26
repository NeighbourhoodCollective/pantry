import { allowAll } from '@keystone-6/core/access';
import { list } from '@keystone-6/core';
import { text, relationship } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
import { Lists } from '.keystone/types';

export const Tag = list({
  access: allowAll,
  ui: {
    isHidden: true,
  },
  fields: {
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
    post: relationship({
      ref: 'Post.comments',
      many: false,
    }),
    author: relationship({
      ref: 'User.comments',
      many: false,
    }),
  },
});
