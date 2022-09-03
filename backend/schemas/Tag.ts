import { list } from '@keystone-6/core';
import { text, relationship } from '@keystone-6/core/fields';
import { Lists } from '.keystone/types';

export const Tag: Lists.Tag = list({
  ui: {
    isHidden: true,
  },
  fields: {
    name: text(),
    posts: relationship({
      ref: 'Post.tags',
      many: true,
    }),
  },
});
