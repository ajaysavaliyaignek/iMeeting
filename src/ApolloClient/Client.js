import { ApolloClient, InMemoryCache } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';

export const BASE_URL = 'http://localhost:8080/';

const httpLink = createUploadLink({
  uri: `${BASE_URL}/o/graphql`
});

const authLink = setContext(async (req, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await AsyncStorage.getItem('@token');
  console.log('token from client inner from link', token);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      // ...headers,
      Authorization: `Bearer ${token}`
    }
  };
});

console.log('authLink', authLink);
export const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache()
});

// export const client = new ApolloClient({

//   headers: {
//     Authorization: async () => {
//       const token = await AsyncStorage.getItem('@token');
//       return token;
//     }
//   },
//   uri: `${BASE_URL}/o/graphql`,
//   cache: new InMemoryCache()
// });

// http://192.168.1.32:8080/o/graphql
// 192.168.1.18
// http://128.199.26.43:9080/
