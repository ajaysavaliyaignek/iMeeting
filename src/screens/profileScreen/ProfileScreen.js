import { SafeAreaView, View, Text } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button } from '../../component/button/Button';
import { Client } from '../../graphql/Client';
import { styles } from './styles';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';
import { Fonts } from '../../themes';
import ProfileDetails from './profileDetails/ProfileDetails';
import CommitteeList from '../dashboardScreen/committeeList/CommitteeList';

const ProfileScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Details');

  const Logout = async () => {
    try {
      await AsyncStorage.getAllKeys()
        .then(async (keys) => {
          await AsyncStorage.multiRemove(keys);
        })

        .then(async () => {
          await Client().cache.reset();
          Client().resetStore();
        })
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
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Header name={'Profile'} /> */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: SIZES[16],
          marginVertical: SIZES[10]
        }}
      >
        <Text
          style={{
            ...Fonts.PoppinsSemiBold[14],
            color: Colors.bold,
            marginLeft: '45%'
          }}
        >
          Profile
        </Text>
        <Button
          title={'Logout'}
          textStyle={{ color: Colors.primary }}
          layoutStyle={{
            backgroundColor: null,
            paddingVertical: 0,
            justifyContent: 'flex-end',
            borderBottomWidth: 1,
            borderBottomColor: Colors.primary
          }}
          onPress={() => {
            Logout();
          }}
        />
      </View>
      <View style={styles.subContainer}>
        <View style={styles.btnContainer}>
          <Button
            title={'Details'}
            layoutStyle={[
              styles.btnUsers,
              {
                backgroundColor:
                  activeTab === 'Details' ? Colors.white : 'transparent'
              }
            ]}
            textStyle={styles.txtBtnServices}
            onPress={() => {
              setActiveTab('Details');
            }}
          />

          {/* add external user button */}
          <Button
            title={'Committees'}
            layoutStyle={[
              styles.btnUsers,
              {
                backgroundColor:
                  activeTab === 'Committees' ? Colors.white : 'transparent'
              }
            ]}
            textStyle={styles.txtBtnServices}
            onPress={() => setActiveTab('Committees')}
          />
        </View>
        {/* avatar */}

        {/* details */}
        {/* FIRST NAME */}
        {activeTab == 'Details' && <ProfileDetails />}
        {activeTab == 'Committees' && (
          <CommitteeList isProfileCommittee={true} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
