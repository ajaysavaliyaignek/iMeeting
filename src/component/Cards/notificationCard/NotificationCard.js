import { View, Text, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Divider } from 'react-native-paper';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useMutation } from '@apollo/client';

import { styles } from './styles';
import { SIZES } from '../../../themes/Sizes';
import {
  DELETE_NOTIFICATIONS,
  UPDATE_NOTIFICATION
} from '../../../graphql/mutation';
import {
  GET_ALL_NOTIFICATIONS,
  GET_NOTIFICATION_COUNT
} from '../../../graphql/query';

const NotificationCard = ({ item, index, onComponentOpen }) => {
  const ref = useRef();
  const [updateNotification] = useMutation(UPDATE_NOTIFICATION, {
    refetchQueries: [
      {
        query: GET_ALL_NOTIFICATIONS
      },
      { query: GET_NOTIFICATION_COUNT }
    ],
    onCompleted: (data) => {
      if (data.updateNotification.status.statusCode == 200) {
        ref.current.close();
      }
    },
    onError: (data) => {
      console.log('update notification error', data.message);
    }
  });

  const [deleteNotification] = useMutation(DELETE_NOTIFICATIONS, {
    refetchQueries: [
      {
        query: GET_ALL_NOTIFICATIONS
      },
      { query: GET_NOTIFICATION_COUNT }
    ],
    onCompleted: (data) => {
      console.log('delete notification', data.deleteNotification.status);
      if (data.deleteNotification.status.statusCode == 200) {
        ref.current.close();
      }
    },
    onError: (data) => {
      console.log('delete notification error', data.message);
    }
  });
  const onPressRead = () => {
    updateNotification({
      variables: {
        notification: {
          userNotificationEventId: item.userNotificationEventId,
          archived: true
        }
      }
    });
  };

  const onPressDelete = () => {
    deleteNotification({
      variables: {
        userNotificationEventId: item.userNotificationEventId
      }
    });
  };

  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: item.archived == false ? [-100, 0] : [-60, 0],
      outputRange: [0.7, 0]

      // extrapolate: 'clamp'
    });
    return (
      <Animated.View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: SIZES[16],
          transform: [{ scale: scale }],
          width: item.archived == false ? '45%' : null
        }}
      >
        {item.archived == false && (
          <TouchableOpacity
            style={styles.cancelBtnLayout}
            onPress={onPressRead}
          >
            <Text style={styles.txtCancelButton}>Read</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.nextBtnLayout} onPress={onPressDelete}>
          <Text style={styles.txtNextBtn}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  useEffect(() => {
    if (item.isOpened == false) {
      ref.current.close();
    }
  });
  return (
    <View>
      <Divider style={styles.divider} />
      <Swipeable
        ref={ref}
        renderRightActions={renderRightActions}
        //   leftThreshold={100}
        rightThreshold={0}
        onSwipeableOpen={() => {
          onComponentOpen(index);
        }}
        shouldCancelWhenOutside={true}
      >
        <View style={[styles.container, { opacity: item.archived ? 0.5 : 1 }]}>
          <Text style={styles.txtNotification}>{item.notificationText}</Text>
        </View>
      </Swipeable>
    </View>
  );
};

export default NotificationCard;
