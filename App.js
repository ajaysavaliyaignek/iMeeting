import 'react-native-gesture-handler';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { ApolloProvider } from '@apollo/client';
import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MainStack from './routes';
import { AppProvider } from './src/context';
import { Client } from './src/graphql/Client';
import * as SplashScreen from 'react-native-splash-screen';

const App = () => {
  const [token, setToken] = useState(null);

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
        .catch((e) => console.log('get token error', e));
    };
    getToken();
  }, []);

  // useEffect(() => {
  //   setTimeout(() => SplashScreen.hide(), 1000); //hides the splash screen on app load.
  // }, []);

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
