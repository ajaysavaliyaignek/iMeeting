import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
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
import { Icon, IconName } from '../../component';
import { useQuery } from '@apollo/client';
import { GET_NOTIFICATION_COUNT } from '../../graphql/query';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Details');
  const [count, setCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { loading } = useQuery(GET_NOTIFICATION_COUNT, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      setCount(data.notificationsCount.count);
    },
    onError: (data) => {
      console.log('get all notification count error', data.message);
    }
  });

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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Notifications');
          }}
          style={{
            height: SIZES[24],
            width: SIZES[24],
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Image
            style={styles.tinyLogo}
            source={require('../../assets/Icons/bell.png')}
          />
          {count > 0 && (
            <View
              style={{
                borderColor: Colors.white,
                borderWidth: 1,
                height: SIZES[16],
                width: SIZES[16],
                borderRadius: SIZES[8],
                backgroundColor: Colors.primary,
                position: 'absolute',
                top: -10,
                right: -10,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1
              }}
            >
              <Text
                style={{
                  color: Colors.white,
                  ...Fonts.PoppinsSemiBold[12],
                  fontSize: 9
                }}
              >
                {count < 10 ? `0${count}` : count}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => {
            navigation.navigate('Notifications');
          }}
        >
          <Icon
            name={IconName.Notification_Focused}
            height={SIZES[20]}
            width={SIZES[20]}
          />

          <View
            style={{
              borderColor: Colors.white,
              borderWidth: 1,
              height: SIZES[16],
              width: SIZES[16],
              borderRadius: SIZES[8],
              backgroundColor: Colors.primary,
              position: 'absolute',
              top: -10,
              right: -10,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1
            }}
          >
            <Text
              style={{
                color: Colors.white,
                ...Fonts.PoppinsSemiBold[12],
                fontSize: 9
              }}
            >
              {count < 10 ? `0${count}` : count > 0 && count}
            </Text>
          </View>
        </TouchableOpacity> */}
        <Text
          style={{
            ...Fonts.PoppinsSemiBold[14],
            color: Colors.bold
            // marginLeft: '45%'
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
          <CommitteeList
            isProfileCommittee={true}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
