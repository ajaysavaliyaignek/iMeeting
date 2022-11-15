import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { ApolloProvider } from '@apollo/client';
import { client } from './src/ApolloClient/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MainStack from './routes';
import { AppProvider } from './src/context';

const App = () => {
  const [token, setToken] = useState(null);

  const getToken = async () => {
    const token = await AsyncStorage.getItem('@token')
      .then((result) => {
        setToken(result);
      })
      .catch((e) => console.log(e));

    // setToken(JSON.parse(user)?.dataToken);
  };

  useEffect(() => {
    getToken();
    console.log('token from app', token);
  }, []);

  // const getToken = async () => {
  //   try {
  //     await AsyncStorage.getItem('@user')
  //       .then((result) => {
  //         if (result !== null) {
  //           setToken(JSON.parse(result)?.dataToken);
  //           console.log('token', token.toString());
  //         } else setToken(null);
  //       })
  //       .catch((e) => console.log(e));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getToken();
  // });

  return (
    <AppProvider>
      <ApolloProvider client={client}>
        <PaperProvider>
          <NavigationContainer>
            {token ? (
              <MainStack initialRouteName="MainBottomTab" />
            ) : (
              // <StackAuth />
              <MainStack initialRouteName="MainBottomTab" />
            )}
          </NavigationContainer>
        </PaperProvider>
      </ApolloProvider>
    </AppProvider>
  );
};

export default App;
