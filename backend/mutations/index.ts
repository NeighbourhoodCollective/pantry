import { mergeSchemas } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';
import membershipSignup from './membershipSignup';
import stripeManage from './stripeManage';

// make a fake graphql tagged template literal
const graphql = String.raw;

export const extendGraphqlSchema = (schema: GraphQLSchema) =>
  mergeSchemas({
    schemas: [schema],
    typeDefs: graphql`
      type Mutation {
        membershipSignup(variationId: ID!, returnUrl: String!): JSON
        stripeManage(returnUrl: String!): JSON
      }
    `,
    resolvers: {
      Mutation: {
        membershipSignup,
        stripeManage,
      },
    },
  });
