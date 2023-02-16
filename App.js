import 'react-native-gesture-handler';
// import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { ApolloProvider } from '@apollo/client';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useColorScheme } from 'react-native';

import { View, Text, useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';

import MainStack from './routes';
import { AppProvider } from './src/context';
import { Client } from './src/graphql/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const App = () => {
//   const [token, setToken] = useState(null);
//   const [url, setUrl] = useState('');

//   const darkTheme = {
//     ...DefaultTheme,
//     roundness: 2,
//     colors: {
//       ...DefaultTheme.colors,
//       primary: '#1A1A1A',
//       accent: '#FAFAFA'
//     }
//   };

//   const lightTheme = {
//     ...DefaultTheme,
//     roundness: 2,
//     colors: {
//       ...DefaultTheme.colors,
//       primary: '#FAFAFA',
//       accent: '#1A1A1A'
//     }
//   };

//   const scheme = useColorScheme();

//   useEffect(() => {
//     const getToken = () => {
//       AsyncStorage.getItem('@token')
//         .then((result) => {
//           if (result) {
//             setToken('MainBottomTab');
//           } else {
//             setToken('Login');
//           }
//         })
//         .catch((e) => console.log(e));

//       // setToken(JSON.parse(user)?.dataToken);
//     };
//     getToken();
//   }, []);

//   return (
//     <AppProvider>
//       <ApolloProvider client={Client()}>
//         <PaperProvider theme={scheme === 'dark' ? darkTheme : lightTheme}>
//           <NavigationContainer>
//             {token && <MainStack initialRouteName={token} />}
//           </NavigationContainer>
//         </PaperProvider>
//       </ApolloProvider>
//     </AppProvider>
//   );
// };

// export default App;

const App = () => {
  const [token, setToken] = useState(null);
  const [url, setUrl] = useState('');

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
