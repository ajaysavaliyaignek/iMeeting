import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Platform,
  Linking
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import moment from 'moment';
import { Divider } from 'react-native-paper';
import momentDurationFormatSetup from 'moment-duration-format';
import Clipboard from '@react-native-clipboard/clipboard';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';

import Header from '../../../component/header/Header';
import { Icon, IconName } from '../../../component';
import { styles } from './styles';
import { SIZES } from '../../../themes/Sizes';
import { Colors } from '../../../themes/Colors';
import { Button } from '../../../component/button/Button';
import { Fonts } from '../../../themes';
import UserDetailsComponent from '../../../component/userDetailsComponent/UserDetailsComponent';
import { GET_ANSWER, GET_USER_PAYLOAD } from '../../../graphql/query';
import { DELETE_VIDEO_CONFERENCE } from '../../../graphql/mutation';
import { UserContext } from '../../../context';

const VideoConferenceDetails = () => {
  const navigation = useNavigation();
  momentDurationFormatSetup(moment);
  const { user } = useContext(UserContext);
  const route = useRoute();
  const { item } = route?.params;
  console.log({ item });
  const [userId, setUser] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [role, setRole] = useState(item.yourRoleName);

  // get answer
  const [getAnswer, getAnswerType] = useLazyQuery(GET_ANSWER, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
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
          id: +item?.videoConferenceId,
          userId: +data.userPayload.userId,
          type: 5
        }
      });
    }
  });

  // time duration
  const DurationTime = moment(`${item?.endDate} ${item?.endTime}`, [
    'YYYY-MM-DD hh:mm A'
  ]).diff(
    moment(`${item?.setDate} ${item?.setTime}`, ['YYYY-MM-DD hh:mm A']),
    'minutes'
  );
  const durationHourMin = moment
    .duration(DurationTime, 'minutes')
    .format('h [hrs], m [min]');

  // delete appointment

  const [deleteVideoConference] = useMutation(DELETE_VIDEO_CONFERENCE, {
    refetchQueries: ['videoConferences', 'videoConference'],
    onCompleted: (data) => {
      navigation.navigate('VideoConferenceList');
    },
    onError: (data) => {
      console.log('deleteVideoConference error', data.message);
    }
  });

  const onDeleteHandler = (id) => {
    Alert.alert(
      'Delete video conference',
      'Are you sure you want to delete this?',
      [
        {
          text: 'Delete',
          onPress: () =>
            deleteVideoConference({
              variables: {
                id: id
              }
            }),
          style: 'destructive'
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const details = (title, discription, isLink, platformlink) => {
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
                paddingBottom: 4,
                width: '60%'
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(platformlink);
                }}
              >
                <Text
                  style={{
                    ...Fonts.PoppinsSemiBold[14],
                    color: Colors.primary
                  }}
                  numberOfLines={1}
                >
                  {platformlink}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginLeft: SIZES[12] }}
                onPress={() => {
                  Clipboard.setString(platformlink);
                  if (discription !== '' || discription !== null) {
                    if (Platform.OS == 'android') {
                      ToastAndroid.show(
                        `Copied Text :-  ${platformlink}`,
                        ToastAndroid.SHORT
                      );
                    } else {
                      Alert.alert(`Copied Text :-  ${platformlink}`);
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
          {item?.platformlink !== null &&
            item?.platformlink !== '' &&
            details(
              'Vi-nce platform',
              item?.platformName,
              true,
              item?.platformlink
            )}
          {details('Your role', item?.yourRoleName)}
          {details('Title', item?.videoConferenceTitle)}
          {details('Description', item?.videoConferenceDescription)}
          {details('Creator', item?.creatorName)}
        </View>

        {/* date and time details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.txtTitle}>Date & Time</Text>
          <View>
            {details(
              'Start date',
              `${moment(item?.setDate).format('DD MMM, YYYY')}, ${
                item?.setTime
              }`
            )}
            <View>
              <Text style={styles.txtDuration}>{`(${durationHourMin})`}</Text>
            </View>
          </View>
          {details('Timezone', item.timeZone)}

          {details(
            'Repeat',

            item?.repeat == 0
              ? "Dosen't repeat"
              : item?.repeat == 1
              ? 'Repeat daily'
              : item?.repeat == 2
              ? 'Repeat weekly'
              : item?.repeat == 3
              ? 'Repeat monthly'
              : 'Repeat yearly'
          )}
          {role == 'Member' && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {details(
                'Your answer',
                answer?.suggestionTime == ''
                  ? answer?.answer
                  : `Your suggestion time - ${
                      answer?.suggestionTime == null ||
                      answer?.suggestionTime == undefined
                        ? '-'
                        : answer?.suggestionTime
                    }`
              )}
              {!item?.isDisable && (
                <TouchableOpacity
                  style={{
                    marginLeft: SIZES[16],
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.primary
                  }}
                  onPress={() =>
                    navigation.navigate('YourAnswer', { item, userID: userId })
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
        {/* <Divider style={[styles.divider, { marginTop: SIZES[24] }]} /> */}
        {item?.userDetails?.length > 0 && (
          <View>
            <View style={{ marginTop: SIZES[16], marginHorizontal: SIZES[16] }}>
              <Text style={styles.txtTitle}>Users</Text>
            </View>
            <Divider style={[styles.divider, { marginTop: SIZES[24] }]} />
            <UserDetailsComponent
              users={item?.userDetails}
              isUserRequired={true}
              isSwitchOnRow={true}
              isSwichDisabled={true}
              searchText={''}
              visibleIndex={-1}
              setVisibleIndex={() => {}}
            />
          </View>
        )}
      </ScrollView>
      {/* edit delete button */}
      <View style={styles.bottomContainer}>
        <Divider style={styles.divider} />
        {!item.isDisable && item?.creatorName == user?.userName ? (
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
                    screenName: 'Edit video conference',
                    type: 'VideoConference',
                    screensArray: [
                      'generalVideoConference',
                      'users',
                      'dateandtime'
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
              onPress={() => onDeleteHandler(item.videoConferenceId)}
            />
            <Button
              title={'Start'}
              layoutStyle={[styles.btnLayout]}
              onPress={() => {
                Linking.openURL(item?.platformlink);
              }}
            />
          </View>
        ) : (
          !item.isDisable && (
            <Button
              title={'Start'}
              layoutStyle={[
                styles.btnLayout,
                { width: '100%', marginVertical: SIZES[16] }
              ]}
              onPress={() => {
                Linking.openURL(item?.platformlink);
              }}
            />
          )
        )}
      </View>
    </SafeAreaView>
  );
};

export default VideoConferenceDetails;
