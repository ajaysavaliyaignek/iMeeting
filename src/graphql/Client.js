import { ApolloClient, InMemoryCache, resetCaches } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';
import { useContext, useEffect, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { UserContext } from '../context';

export const Client = () => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    DeviceEventEmitter.addListener('urlChanged', getUrl);

    return () => {
      DeviceEventEmitter.removeAllListeners('urlChanged');
    };
  }, []);
  console.log('url from client', url);

  useEffect(() => {
    getUrl();
  }, []);

  const getUrl = () => {
    AsyncStorage.getItem('@url').then((data) => {
      console.log('url from client inside function', data);
      setUrl(data);
    });
  };

  const httpLink = createUploadLink({
    uri: `https://${url}//o/graphql`
  });

  const authLink = setContext(async (req, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = await AsyncStorage.getItem('@token');

    // return the headers to the context so httpLink can read them
    return {
      headers: {
        // ...headers,
        Authorization: `Bearer ${token}`
      }
    };
  });

  const client = new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only'
      }
    }
  });
  return client;
};
