import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
    uri: 'https://imeetingpro.com/o/graphql',
    cache: new InMemoryCache()
    
  });

 
  // http://192.168.1.32:8080/o/graphql