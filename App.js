import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useQuery
} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

import MainStack from './routes';
import { AppProvider, UserContext } from './src/context';
import { Client, client } from './src/graphql/Client';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloLink } from 'apollo-link';

const App = () => {
  const [token, setToken] = useState(null);
  const [url, setUrl] = useState('');

  const darkTheme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#1A1A1A',
      accent: '#FAFAFA'
    }
  };

  const lightTheme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#FAFAFA',
      accent: '#1A1A1A'
    }
  };

  const scheme = useColorScheme();

  useEffect(() => {
    const getToken = () => {
      AsyncStorage.getItem('@token')
        .then((result) => {
          if (result) {
            setToken('MainBottomTab');
          } else {
            setToken('Login');
          }
        })
        .catch((e) => console.log(e));

      // setToken(JSON.parse(user)?.dataToken);
    };
    getToken();
  }, []);
  // useEffect(() => {
  //   const getUrl = () => {
  //     AsyncStorage.getItem('@url').then((data) => {
  //       console.log('url', data);
  //       setUrl(data);
  //       setCompanyUrl(data);
  //     });
  //   };

  //   getUrl();
  // }, []);

  // console.log('url from app', url);

  return (
    <AppProvider>
      <ApolloProvider client={Client()}>
        <PaperProvider theme={scheme === 'dark' ? darkTheme : lightTheme}>
          <NavigationContainer>
            {token && <MainStack initialRouteName={token} />}
          </NavigationContainer>
        </PaperProvider>
      </ApolloProvider>
    </AppProvider>
  );
};

export default App;
