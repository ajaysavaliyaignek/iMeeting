import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { ApolloProvider } from '@apollo/client';
import { client } from './src/ApolloClient/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CredentialContext } from './src/context';
import MainStack from './routes';

const App = () => {
  const [storeCredentials, setStoreCredentials] = useState('');

  const checkLogin = async () => {
    try {
      let userData = await AsyncStorage.getItem('@user').then((res) => {
        return JSON.parse(res);
      });
      console.log(`async user data ${JSON.stringify(userData)}`);

      if (userData !== null) {
        setStoreCredentials(userData);

        console.log('storeCredentials---', storeCredentials);
      } else {
        setStoreCredentials(null);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <ApolloProvider client={client}>
      <PaperProvider>
        <CredentialContext.Provider
          value={{ storeCredentials, setStoreCredentials }}
        >
          <CredentialContext.Consumer>
            {({ storeCredentials }) => (
              <NavigationContainer>
                {storeCredentials ? (
                  <MainStack initialRouteName="MainBottomTab" />
                ) : (
                  // <StackAuth />
                  <MainStack initialRouteName="Login" />
                )}
              </NavigationContainer>
            )}
          </CredentialContext.Consumer>
        </CredentialContext.Provider>
      </PaperProvider>
    </ApolloProvider>
  );
};

export default App;
