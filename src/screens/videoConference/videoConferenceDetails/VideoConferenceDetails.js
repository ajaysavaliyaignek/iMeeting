import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import moment from 'moment';
import { Divider } from 'react-native-paper';
import momentDurationFormatSetup from 'moment-duration-format';
import Clipboard from '@react-native-clipboard/clipboard';
import { useLazyQuery, useQuery } from '@apollo/client';

import Header from '../../../component/header/Header';
import { Icon, IconName } from '../../../component';
import { styles } from './styles';
import { SIZES } from '../../../themes/Sizes';
import { Colors } from '../../../themes/Colors';
import { Button } from '../../../component/button/Button';
import { Fonts } from '../../../themes';
import UserDetailsComponent from '../../../component/userDetailsComponent/UserDetailsComponent';
import { GET_ANSWER, GET_USER_PAYLOAD } from '../../../graphql/query';

const VideoConferenceDetails = () => {
  const navigation = useNavigation();
  momentDurationFormatSetup(moment);
  const route = useRoute();
  const { item, isDisable } = route?.params;
  console.log('item from video conference details', item);
  const [appointment, setAppointment] = useState(null);
  const [user, setUser] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [role, setRole] = useState(item.yourRoleName);

  // get answer
  const [getAnswer, getAnswerType] = useLazyQuery(GET_ANSWER, {
    onCompleted: (data) => {
      console.log('answer data', data.answer);
      setAnswer(data.answer);
    },
    onError: (data) => {
      console.log('getAnswer error', data.message);
    }
  });

  const getUserDetails = useQuery(GET_USER_PAYLOAD, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      setUser(data.userPayload.userId);
      getAnswer({
        variables: {
          id: +item?.appointmentId,
          userId: +data.userPayload.userId,
          type: 4
        }
      });
    }
  });

  // time duration
  const DurationTime = moment(
    `${appointment?.endDate} ${appointment?.endTime}`,
    ['YYYY-MM-DD hh:mm A']
  ).diff(
    moment(`${appointment?.setDate} ${appointment?.setTime}`, [
      'YYYY-MM-DD hh:mm A'
    ]),
    'minutes'
  );
  const durationHourMin = moment
    .duration(DurationTime, 'minutes')
    .format('h [hrs], m [min]');

  // delete appointment

  const onDeleteHandler = () => {
    Alert.alert('Delete meeting', 'Are you sure you want to delete this?', [
      {
        text: 'Delete',
        onPress: () =>
          deleteAppointment({
            variables: {
              id: item.appointmentId
            }
          }),
        style: 'destructive'
      },
      {
        text: 'Cancel',
        // onPress: () => navigation.navigate("Login"),
        style: 'cancel'
      }
    ]);
  };

  const details = (title, discription, isLink) => {
    return (
      <View style={{ marginTop: SIZES[24] }}>
        <Text style={styles.txtDetailTitle}>{title}</Text>
        <View
          style={{
            flexDirection: isLink ? 'row' : null,
            alignItems: isLink ? 'center' : null
          }}
        >
          <Text style={styles.txtDetailDiscription}>{discription}</Text>
          {isLink && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: SIZES[16],
                borderBottomColor: Colors.primary,
                borderBottomWidth: 1,
                paddingBottom: 4
              }}
            >
              <Text
                style={{ ...Fonts.PoppinsSemiBold[14], color: Colors.primary }}
              >
                {'meet.goo/fjdf-fsgl-fds'}
              </Text>
              <TouchableOpacity
                style={{ marginLeft: SIZES[12] }}
                onPress={() => {
                  Clipboard.setString('meet.goo/fjdf-fsgl-fds');
                  if (discription !== '' || discription !== null) {
                    if (Platform.OS == 'android') {
                      ToastAndroid.show(
                        `Copied Text :-  ${'meet.goo/fjdf-fsgl-fds'}`,
                        ToastAndroid.SHORT
                      );
                    } else {
                      Alert.alert(
                        `Copied Text :-  ${'meet.goo/fjdf-fsgl-fds'}`
                      );
                    }
                  }
                }}
              >
                <Icon
                  name={IconName.CopyText}
                  height={SIZES[20]}
                  width={SIZES[20]}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Video conference details'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.subContainer}
      >
        <View style={styles.detailsContainer}>
          {/* general details */}
          <Text style={styles.txtTitle}>General</Text>
          {details('Vi-nce platform', 'Google Meet', true)}
          {details('Your role', 'Head')}
          {details('Title', 'Meeting for main design page')}
          {details(
            'Description',
            'We need to discuss what should be the main page and we have more question'
          )}
          {details('Creator', 'Esther Howard')}
        </View>

        {/* date and time details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.txtTitle}>Date & Time</Text>
          <View>
            {details('Start date', '17 Feb, 2022, 08:00 PM')}
            <View>
              <Text style={styles.txtDuration}>{'20 minutes'}</Text>
            </View>
          </View>
          {details('Timezone', 'GMT-8 (USA)')}

          {details(
            'Repeat',
            'No repeat'
            /* appointment?.repeat == 0
              ? "Dosen't repeat"
              : appointment?.repeat == 1
              ? 'Repeat daily'
              : appointment?.repeat == 2
              ? 'Repeat weekly'
              : appointment?.repeat == 3
              ? 'Repeat monthly'
              : 'Repeat yearly' */
          )}
          {role == 'Member' && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {item.answers == 'Suggest time' ? (
                <View>
                  {details('Your answer', 'Your suggestion time')}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 48,
                      marginLeft: SIZES[8]
                    }}
                  >
                    <Text
                      style={{
                        ...Fonts.PoppinsSemiBold[14],
                        color: Colors.bold
                      }}
                    >
                      03:00 PM
                    </Text>
                  </View>
                </View>
              ) : (
                details(
                  'Your answer',
                  answer?.suggestionTime == ''
                    ? answer?.answer
                    : `Your suggestion time - ${user?.suggestionTime}`
                )
              )}
              {!item?.isDisable && (
                <TouchableOpacity
                  style={{
                    marginLeft: SIZES[16],
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.primary
                  }}
                  onPress={() =>
                    navigation.navigate('YourAnswer', { item, userID: user })
                  }
                >
                  <Text
                    style={{
                      ...Fonts.PoppinsSemiBold[14],
                      color: Colors.primary
                    }}
                  >
                    Edit
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* users details */}
        <View style={{ marginTop: SIZES[24], marginHorizontal: SIZES[16] }}>
          <Text style={styles.txtTitle}>Users</Text>
        </View>
        <Divider style={[styles.divider, { marginTop: SIZES[24] }]} />
        <UserDetailsComponent
          users={appointment?.userDetails}
          isUserRequired={true}
          isSwitchOnRow={true}
          isSwichDisabled={true}
          searchText={''}
          visibleIndex={-1}
          setVisibleIndex={() => {}}
        />
      </ScrollView>

      {/* edit delete button */}
      {role == 'Head' || role == 'Secretary' ? (
        <View style={styles.bottomContainer}>
          <Divider style={styles.divider} />
          {!isDisable && (
            <View style={styles.btnContainer}>
              <Button
                title={'Edit'}
                layoutStyle={[styles.btnLayout, { backgroundColor: '#F3F6F9' }]}
                textStyle={{
                  ...Fonts.PoppinsSemiBold[14],
                  color: Colors.primary
                }}
                onPress={() =>
                  navigation.navigate(
                    'AddEditMeetingAppointmentVideoConference',
                    {
                      screenName: 'Edit appointment',
                      type: 'Appointment',
                      screensArray: [
                        'general',
                        'users',
                        'dateandtime',
                        'location'
                      ],
                      isEdit: true,
                      details: item
                    }
                  )
                }
              />
              <Button
                title={'Delete'}
                layoutStyle={[styles.btnLayout, { backgroundColor: '#DD7878' }]}
                onPress={onDeleteHandler}
              />
              <Button title={'Start'} layoutStyle={[styles.btnLayout]} />
            </View>
          )}
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default VideoConferenceDetails;
