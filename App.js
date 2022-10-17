import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { ApolloProvider } from '@apollo/client';
import { client } from './src/ApolloClient/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MainStack from './routes';

const App = () => {
  const [token, setToken] = useState('');

  const getToken = async () => {
    try {
      await AsyncStorage.getItem('@user')
        .then((result) => {
          if (result !== null) {
            setToken(JSON.parse(result)?.dataToken);
            console.log('token', token.toString());
          } else setToken(null);
        })
        .catch((e) => console.log(e));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  });

  return (
    <ApolloProvider client={client}>
      <PaperProvider>
        <NavigationContainer>
          {token !== '' ? (
            <MainStack initialRouteName="MainBottomTab" />
          ) : (
            // <StackAuth />
            <MainStack initialRouteName="MainBottomTab" />
          )}
        </NavigationContainer>
      </PaperProvider>
    </ApolloProvider>
  );
};

export default App;
