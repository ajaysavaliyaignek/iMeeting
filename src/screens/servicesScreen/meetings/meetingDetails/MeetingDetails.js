import { View, SafeAreaView, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import moment from 'moment';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useNavigation, useRoute } from '@react-navigation/native';
import momentDurationFormatSetup from 'moment-duration-format';
import { Divider } from 'react-native-paper';

import Header from '../../../../component/header/Header';
import { IconName } from '../../../../component';
import { styles } from './styles';
import { Colors } from '../../../../themes/Colors';
import { Button } from '../../../../component/button/Button';
import { Fonts } from '../../../../themes';
import {
  GET_All_MEETING,
  GET_LIVE_MEETING_TAB_COUNT,
  GET_MEETING_STATUS
} from '../../../../graphql/query';
import {
  DELETE_MEETING,
  UPDATE_MEETING_STATUS
} from '../../../../graphql/mutation';
import DetailsComponent from '../../../../component/detailsComponent/meetingDetailsComponent/MeetingDetailsComponent';
import { UserContext } from '../../../../context';
import { SIZES } from '../../../../themes/Sizes';

const MeetingDetails = () => {
  const navigation = useNavigation();

  const {
    setMeetingsData
    // setSelectedSubjects
  } = useContext(UserContext);
  momentDurationFormatSetup(moment);
  const route = useRoute();
  const { item } = route?.params;

  const [role, setRole] = useState(item?.yourRoleName);
  const [meetingStatus, setMeetingStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  let isSoftClose = false;
  let isLive = false;
  if (item.yourRoleName == 'Head' && item.meetingStatusTitle == 'Soft-Closed') {
    isSoftClose = true;
  }

  // delete meeting
  const [deleteMeeting] = useMutation(DELETE_MEETING, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: [
      {
        query: GET_All_MEETING,
        variables: {
          onlyMyMeeting: false,
          committeeIds: '',
          screen: 0,
          searchValue: '',
          page: -1,
          pageSize: -1
        }
      }
    ],
    onCompleted: (data) => {
      if (data.deleteMeeting.status.statusCode == '200') {
        navigation.goBack();
      }
    },
    onError: (data) => {
      console.log('dele meeting error', data);
    }
  });

  const onDeleteHandler = () => {
    Alert.alert('Delete meeting', 'Are you sure you want to delete this?', [
      {
        text: 'Delete',
        onPress: () =>
          deleteMeeting({
            variables: {
              meetingId: item.meetingId
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

  // getMeetingSubjects for meeting
  const getMeetingSubjects = useQuery(GET_MEETING_STATUS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data) {
        setMeetingStatus(data.meetingStatus.items);
      }
    },
    onError: (data) => {
      console.log('error getMeetingSubjects ', data.message);
    }
  });

  const [updateMeetingStatus] = useMutation(UPDATE_MEETING_STATUS, {
    refetchQueries: ['meetings'],
    onCompleted: (data) => {
      console.log('updateMeetingSttaus', data.updateMeetingStatus.status);
      if (data.updateMeetingStatus.status.statusCode == '200') {
        navigation.navigate('LiveMeetingMenu', {
          item,
          meetingStatus: meetingStatus
        });
      }
    },
    onError: (data) => {
      console.log('updateMeetingSttaus', data.message);
    }
  });

  let date = new Date();
  let newdate = moment()
    // date.toLocaleString('en-Us', { timeZone: item.timeZone })
    .utcOffset(item.timeZone)
    .add(15, 'm')
    .format('YYYY-MM-DD hh:mm A');

  let meetingDate = `${item.setDate} ${item.setTime}`;

  console.log('newdate', newdate);

  console.log(
    moment(newdate, 'YYYY-MM-DD hh:mm A').isSameOrAfter(
      moment(meetingDate, 'YYYY-MM-DD hh:mm A')
    )
  );

  if (
    item.status.entitys.canStart &&
    moment(newdate, 'YYYY-MM-DD hh:mm A').isSameOrAfter(
      moment(meetingDate, 'YYYY-MM-DD hh:mm A')
    )
  ) {
    isLive = true;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Meeting details'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />

      <View style={{ flex: 1 }}>
        <DetailsComponent
          item={item}
          isLiveMeetingDetails={true}
          setLoading={setLoading}
        />

        {role == 'Head' || role == 'Secretary' ? (
          <View style={styles.bottomContainer}>
            <Divider style={styles.divider} />
            {item.meetingStatusTitle !== 'Deleted' && (
              <View style={styles.btnContainer}>
                {item.meetingStatusTitle !== 'Closed' && (
                  <Button
                    title={'Edit'}
                    layoutStyle={[
                      styles.btnLayout,
                      {
                        backgroundColor: '#F3F6F9',
                        width:
                          item.meetingStatusTitle == 'Closed'
                            ? '100%'
                            : !isLive && !isSoftClose
                            ? '48%'
                            : isLive && !isSoftClose
                            ? '30%'
                            : '23%'
                      }
                    ]}
                    textStyle={{
                      ...Fonts.PoppinsSemiBold[14],
                      color: Colors.primary
                    }}
                    onPress={() => {
                      navigation.navigate(
                        'AddEditMeetingAppointmentVideoConference',
                        {
                          screenName: 'Edit meeting',
                          type: 'Meeting',
                          screensArray: [
                            'general',
                            'users',
                            'dateandtime',
                            'location',
                            'subjects'
                          ],
                          isEdit: true,
                          details: item
                        }
                      );
                      setMeetingsData([]);
                    }}
                  />
                )}
                <Button
                  title={'Delete'}
                  layoutStyle={[
                    styles.btnLayout,
                    {
                      backgroundColor: '#DD7878',
                      width:
                        item.meetingStatusTitle == 'Closed'
                          ? '100%'
                          : !isLive && !isSoftClose
                          ? '48%'
                          : isLive && !isSoftClose
                          ? '30%'
                          : '23%'
                    }
                  ]}
                  onPress={onDeleteHandler}
                />
                {isLive && (
                  <Button
                    title={'Start'}
                    layoutStyle={[
                      styles.btnLayout,
                      {
                        width:
                          isLive && !isSoftClose
                            ? '30%'
                            : isLive && isSoftClose
                            ? '23%'
                            : null
                      }
                    ]}
                    onPress={() => {
                      if (
                        item.meetingStatusTitle !== 'Soft-Closed' &&
                        item.meetingStatusTitle !== 'Live'
                      ) {
                        const filterStatus = meetingStatus?.filter((status) => {
                          if (
                            status.meetingStatusTitle == 'Live' ||
                            status.meetingStatusTitle == 'Live'
                          ) {
                            return status;
                          }
                        });

                        console.log(
                          'filterstatus for live meeting',
                          filterStatus
                        );
                        updateMeetingStatus({
                          variables: {
                            meeting: {
                              meetingId: item?.meetingId,
                              meetingStatusId: filterStatus[0]?.meetingStatusId
                            }
                          }
                        });
                      } else {
                        navigation.navigate('LiveMeetingMenu', {
                          item,
                          meetingStatus: meetingStatus
                        });
                      }
                    }}
                  />
                )}
                {isSoftClose && (
                  <Button
                    title={'Approve meeting'}
                    layoutStyle={[
                      styles.btnLayout,
                      {
                        width:
                          item.meetingStatusTitle == 'Closed'
                            ? '100%'
                            : isLive
                            ? '30%'
                            : '23%'
                      }
                    ]}
                    onPress={() => {
                      navigation.navigate('ApproveMeeting', {
                        meetingData: item
                      });
                    }}
                  />
                )}
              </View>
            )}
          </View>
        ) : (
          <View style={{ padding: SIZES[16] }}>
            {item.meetingStatusTitle == 'Live' && (
              <Button
                title={'Start'}
                layoutStyle={[styles.btnLayout, { width: '100%' }]}
                onPress={() => {
                  navigation.navigate('LiveMeetingMenu', {
                    item,
                    meetingStatus: meetingStatus
                  });
                }}
              />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MeetingDetails;
