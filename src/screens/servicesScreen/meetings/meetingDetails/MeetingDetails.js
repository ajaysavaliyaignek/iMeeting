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
  GET_PLATFORMLINK,
  GET_USER_PAYLOAD
} from '../../../../graphql/query';
import { DELETE_MEETING } from '../../../../graphql/mutation';
import DetailsComponent from '../../../../component/detailsComponent/meetingDetailsComponent/MeetingDetailsComponent';
import { UserContext } from '../../../../context';

const MeetingDetails = () => {
  const navigation = useNavigation();
  const {
    setMeetingsData
    // setSelectedSubjects
  } = useContext(UserContext);
  momentDurationFormatSetup(moment);
  const route = useRoute();
  const { item } = route?.params;
  console.log('item', item);

  const [fileResponse, setFileResponse] = useState(null);
  const [meeting, setMeeting] = useState(null);
  const [location, setLocation] = useState(null);
  const [committe, setCommittee] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [role, setRole] = useState('');
  const [user, setUser] = useState(null);
  const [answer, setAnswer] = useState(null);
  let file = [];

  item?.attachFileIds.map((id) => {
    const getFile = useQuery(GET_FILE, {
      variables: {
        fileEntryId: id
      },
      onCompleted: (data) => {
        console.log('file from meeting details', data);
        setFileResponse((prev) => {
          console.log('prev', prev);
          const id = file.map((item) => {
            return item.fileEnteryId;
          });
          console.log('id from inside', id);
          console.log(
            'fileEnteryId from inside',
            data.uploadedFile.fileEnteryId
          );
          if (id != data.uploadedFile.fileEnteryId) {
            file.push(data?.uploadedFile);
            setFileResponse(file);
          }
        });
      }
    });
    if (getFile.error) {
      console.log('File error', getFile.error);
    }
  });

  // get meeting
  const { data, error, loading } = useQuery(GET_MEETING_BY_ID, {
    variables: {
      meetingId: item.meetingId
    },
    onCompleted: (data) => {
      console.log('meeting by id', data.meeting);
      if (data) {
        setMeeting(data.meeting);
        setRole(data.meeting.yourRoleName);
      }
    },
    onError: (data) => {
      console.log('error in get meeting by id', data);
    }
  });
  console.log('user', user);

  const [getAnswer, getAnswerType] = useLazyQuery(GET_ANSWER, {
    onCompleted: (data) => {
      console.log('answer data', data.answer);
      setAnswer(data.answer);
    }
  });

  const getUserDetails = useQuery(GET_USER_PAYLOAD, {
    onCompleted: (data) => {
      console.log('user data', data.userPayload.userId);
      setUser(data.userPayload.userId);
      getAnswer({
        variables: {
          id: +item?.meetingId,
          userId: +data.userPayload.userId,
          type: 1
        }
      });
    }
  });

  const DurationTime = moment(`${meeting?.endDate} ${meeting?.endTime}`, [
    'YYYY-MM-DD hh:mm A'
  ]).diff(
    moment(`${meeting?.setDate} ${meeting?.setTime}`, ['YYYY-MM-DD hh:mm A']),
    'minutes'
  );
  const durationHourMin = moment
    .duration(DurationTime, 'minutes')
    .format('h [hrs], m [min]');

  // Calculate the duration
  // Keep in mind you can get the duration in seconds, days, etc.

  console.log('file id', meeting?.attachFileIds);

  // get location
  const Location = useQuery(GET_ALL_LOCATION_BY_ID, {
    variables: {
      locationId: item.locationId
    },
    onCompleted: (data) => {
      if (data) {
        setLocation(data.location);
      }
    },
    onError: (data) => {
      console.log('error in get meeting by id', data);
    }
  });

  // get committee
  const Committee = useQuery(GET_COMMITTEE_BY_ID, {
    variables: {
      organizationId: item.committeeId
    },
    onCompleted: (data) => {
      if (data) {
        setCommittee(data.committee);
      }
    },
    onError: (data) => {
      console.log('error in get committee by id', data);
    }
  });

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

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Meeting details'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />

      <DetailsComponent item={item} isLiveMeetingDetails={true} />

      {role == 'Head' || role == 'Secretary' ? (
        <View style={styles.bottomContainer}>
          <Divider style={styles.divider} />
          {item.meetingStatusTitle !== 'Deleted' && (
            <View style={styles.btnContainer}>
              <Button
                title={'Edit'}
                layoutStyle={[styles.btnLayout, { backgroundColor: '#F3F6F9' }]}
                textStyle={{
                  ...Fonts.PoppinsSemiBold[14],
                  color: Colors.primary
                }}
                onPress={() => {
                  navigation.navigate('EditMeetingGeneral', { item: item });
                  setMeetingsData([]);
                }}
              />
              <Button
                title={'Delete'}
                layoutStyle={[styles.btnLayout, { backgroundColor: '#DD7878' }]}
                onPress={onDeleteHandler}
              />
              <Button
                title={'Start'}
                layoutStyle={[styles.btnLayout]}
                onPress={() => {
                  navigation.navigate('LiveMeetingMenu', { item });
                }}
              />
            </View>
          )}
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default MeetingDetails;
