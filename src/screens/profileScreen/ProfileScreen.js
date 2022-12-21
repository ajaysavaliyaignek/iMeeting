import { SafeAreaView, NativeModules, DeviceEventEmitter } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button } from '../../component/button/Button';
import { ApolloClient, resetCaches } from '@apollo/client';
import { Client } from '../../graphql/Client';

const ProfileScreen = ({ navigation }) => {
  const Logout = () => {
    try {
      AsyncStorage.getAllKeys()
        .then((keys) => {
          AsyncStorage.multiRemove(keys);
        })

        .then(() => Client().resetStore())
        .then(
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }]
          })
        );
      // .then(NativeModules.DevSettings.reload());
    } catch (error) {
      console.log(error);
    }
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'Login' }]
    // });
  };
  return (
    <SafeAreaView>
      <Button
        title={'Logout'}
        onPress={() => {
          Logout();
        }}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
