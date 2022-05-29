import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { createUploadLink } from 'apollo-upload-client';
import withApollo from 'next-with-apollo';
import getConfig from 'next/config';

function createClient({ headers, initialState }: any) {
  const { publicRuntimeConfig } = getConfig();
  return new ApolloClient({
    link: ApolloLink.from([
      onError(({ response, graphQLErrors, networkError, forward }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        if (networkError)
          console.log(
            `[Network error]: ${networkError}. Backend is unreachable. Is it running?`
          );
      }) as any,
      // this uses apollo-link-http under the hood, so all the options here come from that package
      createUploadLink({
        uri:
          publicRuntimeConfig?.backend || 'http://localhost:3000/api/graphql',
        fetchOptions: {
          credentials: 'include',
        },
        // pass the headers along from this request. This enables SSR with logged in state
        headers,
      }),
    ]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // TODO: We will add this together!
            // allProducts: paginationField(),
          },
        },
      },
    }).restore(initialState || {}),
  });
}

export const withData = withApollo(createClient, { getDataFromTree });
