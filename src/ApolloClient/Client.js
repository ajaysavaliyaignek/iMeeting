import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://128.199.26.43:9080/o/graphql',
  cache: new InMemoryCache()
});

// http://192.168.1.32:8080/o/graphql
// 192.168.1.18
// http://128.199.26.43:9080/
