import { keystoneContext } from '@opensaas-clubhouse/backend';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';

const apolloServer = new ApolloServer({
  schema: keystoneContext.graphql.schema,
});

export default startServerAndCreateNextHandler(apolloServer, {
  context: async (req, res) => keystoneContext.withRequest(req, res),
});
