import { relationship, text } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { permissions } from '../access';
import { permissionFields } from './roleFields';
import { Lists } from '.keystone/types';

export const Role: Lists.Role = list({
  access: {
    operation: {
      create: permissions.canManageRoles,
      delete: permissions.canManageRoles,
      query: () => true,
      update: permissions.canManageRoles,
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    ...permissionFields,
    assignedTo: relationship({
      ref: 'User.role',
      many: true,
      ui: {
        itemView: { fieldMode: 'read' },
      },
    }),
  },
});
