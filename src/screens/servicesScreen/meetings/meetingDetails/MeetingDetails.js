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
  GET_ALL_LOCATION_BY_ID,
  GET_All_MEETING,
  GET_ANSWER,
  GET_COMMITTEE_BY_ID,
  GET_FILE,
  GET_MEETING_BY_ID,
  GET_MEETING_STATUS,
  GET_PLATFORMLINK,
  GET_USER_PAYLOAD
} from '../../../../graphql/query';
import { DELETE_MEETING } from '../../../../graphql/mutation';
import DetailsComponent from '../../../../component/detailsComponent/meetingDetailsComponent/MeetingDetailsComponent';
import { UserContext } from '../../../../context';
import Loader from '../../../../component/Loader/Loader';
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
      if (data.deleteMeeting.status[0].statusCode == '200') {
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
    onCompleted: (data) => {
      if (data) {
        setMeetingStatus(data.meetingStatus.items);
      }
    },
    onError: (data) => {
      console.log('error getMeetingSubjects ', data.message);
    }
  });

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
                <Button
                  title={'Edit'}
                  layoutStyle={[
                    styles.btnLayout,
                    { backgroundColor: '#F3F6F9' }
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
                <Button
                  title={'Delete'}
                  layoutStyle={[
                    styles.btnLayout,
                    { backgroundColor: '#DD7878' }
                  ]}
                  onPress={onDeleteHandler}
                />
                <Button
                  title={'Start'}
                  layoutStyle={[styles.btnLayout]}
                  onPress={() => {
                    navigation.navigate('LiveMeetingMenu', {
                      item,
                      meetingStatus: meetingStatus
                    });
                  }}
                />
              </View>
            )}
          </View>
        ) : (
          <View style={{ padding: SIZES[16] }}>
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
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MeetingDetails;
