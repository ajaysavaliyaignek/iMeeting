import { View, Text, SafeAreaView, FlatList } from 'react-native';
import React, { useState } from 'react';
import Header from '../../component/header/Header';
import { styles } from './styles';
import { useQuery } from '@apollo/client';
import { SwipeListView } from 'react-native-swipe-list-view';

import { GET_ALL_NOTIFICATIONS } from '../../graphql/query';
import NotificationCard from '../../component/Cards/notificationCard/NotificationCard';
import Loader from '../../component/Loader/Loader';
import { Colors } from '../../themes/Colors';
import { Fonts } from '../../themes';
import { IconName } from '../../component';
import { useNavigation } from '@react-navigation/native';

const Notifications = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  let notificationData = [];

  const { loading, error } = useQuery(GET_ALL_NOTIFICATIONS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      console.log('motifications', data.notifications);
      notificationData = data.notifications.items.map((item, index) => {
        let isOpened = false;
        return { ...item, isOpened };
      });
      setNotifications(notificationData);
    },
    onError: (data) => {
      console.log('get all notification error', data.message);
    }
  });

  const onComponentOpen = (ind) => {
    let tempData = notifications;
    tempData.map((item, index) => {
      if (index == ind) {
        item.isOpened = true;
      } else {
        item.isOpened = false;
      }
    });

    let temp = [];
    tempData.map((item) => {
      temp.push(item);
    });
    setNotifications(temp);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Notifications'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.subContainer}>
        {loading ? (
          <Loader color={Colors.primary} size={'large'} />
        ) : error ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}>
              {error.message == 'Network request failed'
                ? 'No Internet connection'
                : error.message}
            </Text>
          </View>
        ) : notifications.length > 0 ? (
          <FlatList
            data={notifications}
            key={(item) => item.userNotificationEventId.toString()}
            renderItem={({ item, index }) => {
              return (
                <NotificationCard
                  item={item}
                  index={index}
                  onComponentOpen={(x) => {
                    onComponentOpen(x);
                  }}
                />
              );
            }}
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}>
              No notification found.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Notifications;
