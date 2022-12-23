import { View, Text, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { IconName } from '../../../../component';
import { useNavigation } from '@react-navigation/native';
import AddMeetingGeneralScreen from '../addMeetingGeneral/AddMeetingGeneral';
import { styles } from './styles';
import Header from '../../../../component/header/Header';
import AddMeetingUser from '../addMeetingUser/AddMeetingUser';
import AddMeetingDateAndTime from '../addMeetingDateAndTime/AddMeetingDateAndTime';
import { Colors } from '../../../../themes/Colors';
import { Divider } from 'react-native-paper';
import { Button } from '../../../../component/button/Button';
import AddMeetingLocation from '../addMeetingLocation/AddMeetingLocation';
import AddMeetingSubjects from '../addMeetingSubjects/AddMeetingSubjects';
import { useMutation } from '@apollo/client';
import { UPDATE_MEETING } from '../../../../graphql/mutation';
import moment from 'moment';
import { GET_All_MEETING } from '../../../../graphql/query';

const AddMeeting = () => {
  const navigation = useNavigation();
  const [activeScreen, setActiveScreen] = useState('general');
  const [title, setTitle] = useState('');
  const [discription, setDiscription] = useState('');
  const [valueCommitee, setValue] = useState(null);
  const [filesId, setFilesId] = useState(null);
  const [fileResponse, setFileResponse] = useState([]);
  const [buttonText, setButtonText] = useState('Next');
  const [previousUser, setPreviousUser] = useState([]);
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [valueRepeat, setValueRepeat] = useState(null);
  const [valueTimeZone, setValueTimeZone] = useState(null);
  const [valueLocation, setValueLocation] = useState(null);
  const [valueVideoConference, setValueVideoConference] = useState(null);
  const [calendarValue, setCalendarValue] = useState(
    moment(new Date()).format('YYYY-MM-DD')
  );
  const [previousSubject, setPreviousSubject] = useState([]);
  let users = [];
  let requiredUsers = [];
  let subjects = [];

  // userId array
  users = previousUser?.map((item) => item.userId);
  console.log('users', users);

  // required user array
  requiredUsers = previousUser?.map((item) => item.isRequired);
  console.log('requiredUsers', requiredUsers);

  // selected subjects array
  subjects = previousSubject?.map((item) => item.subjectId);
  console.log('userId', subjects);

  const [addMeeting, { data, loading: addMeetingLoading, error }] = useMutation(
    UPDATE_MEETING,
    {
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
        console.log('addmeeting data', data.updateMeeting);
        if (data.updateMeeting.status[0].statusCode == '200') {
          navigation.navigate('Details', {
            title: 'Meetings',
            active: '0'
          });
        }
      },
      onError: (data) => {
        console.log('addmeeting error--', data.message);
      }
    }
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Add meeting'}
        rightIconName={IconName.Close}
        onRightPress={() =>
          navigation.navigate('Details', {
            title: 'Meetings',
            active: '0'
          })
        }
      />
      {activeScreen == 'general' && (
        <AddMeetingGeneralScreen
          setActiveScreen={setActiveScreen}
          setTitle={setTitle}
          setDiscription={setDiscription}
          setValue={setValue}
          setFilesId={setFilesId}
          valueCommitee={valueCommitee}
          title={title}
          discription={discription}
          fileResponse={fileResponse}
          setFileResponse={setFileResponse}
          filesId={filesId}
        />
      )}
      {activeScreen == 'Users' && (
        <AddMeetingUser
          setActiveScreen={setActiveScreen}
          previousUser={previousUser}
          setPreviousUser={setPreviousUser}
          users={users}
          requiredUsers={requiredUsers}
          committee={valueCommitee}
        />
      )}
      {activeScreen == 'DateTime' && (
        <AddMeetingDateAndTime
          startDateTime={startDateTime}
          setStartDateTime={setStartDateTime}
          endDateTime={endDateTime}
          setEndDateTime={setEndDateTime}
          valueRepeat={valueRepeat}
          setValueRepeat={setValueRepeat}
          valueTimeZone={valueTimeZone}
          setValueTimeZone={setValueTimeZone}
        />
      )}
      {activeScreen == 'Location' && (
        <AddMeetingLocation
          valueLocation={valueLocation}
          setValueLocation={setValueLocation}
          valueVideoConference={valueVideoConference}
          setValueVideoConference={setValueVideoConference}
        />
      )}
      {activeScreen == 'Subjects' && (
        <AddMeetingSubjects
          subjects={subjects}
          calendarValue={calendarValue}
          setCalendarValue={setCalendarValue}
          previousSubject={previousSubject}
          setPreviousSubject={setPreviousSubject}
          committee={valueCommitee}
        />
      )}
      <View
        style={{
          backgroundColor: Colors.white,
          justifyContent: 'flex-end'
        }}
      >
        {/* Divider */}
        <Divider style={styles.divider} />
        {activeScreen == 'general' ? (
          <View style={styles.buttonContainer}>
            <Button
              disable={
                title == '' || discription == '' || valueCommitee == null
                  ? true
                  : false
              }
              title={buttonText}
              onPress={() => {
                setActiveScreen('Users');
                // setMeetingsData({
                //   ...meetingsData,
                //   attachFiles: filesId,
                //   committee: valueCommitee,
                //   title: title,
                //   discription: discription
                // });
                // navigation.navigate('AddMeetingUser');
              }}
              layoutStyle={[
                {
                  opacity:
                    title === '' || discription === '' || valueCommitee == null
                      ? 0.5
                      : null
                },
                styles.nextBtnLayout
              ]}
              textStyle={styles.txtNextBtn}
            />
          </View>
        ) : (
          <View
            style={[
              styles.buttonContainer,
              { flexDirection: 'row', justifyContent: 'space-between' }
            ]}
          >
            <Button
              title={'Back'}
              onPress={() => {
                if (activeScreen == 'Users') {
                  setActiveScreen('general');
                }

                if (activeScreen == 'DateTime') {
                  setActiveScreen('Users');
                }
                if (activeScreen == 'Location') {
                  setActiveScreen('DateTime');
                }
                if (activeScreen == 'Subjects') {
                  setActiveScreen('Location');
                }

                // setMeetingsData({
                //   ...meetingsData,
                //   users: users,
                //   userRequired: requiredUsers,
                //   userDetails: previousUser
                // });
              }}
              layoutStyle={styles.cancelBtnLayout}
              textStyle={styles.txtCancelButton}
            />
            <Button
              title={buttonText}
              onPress={() => {
                if (activeScreen == 'Users') {
                  setActiveScreen('DateTime');
                }
                if (activeScreen == 'DateTime') {
                  setActiveScreen('Location');
                }
                if (activeScreen == 'Location') {
                  setActiveScreen('Subjects');
                  setButtonText('Submit');
                }
                if (activeScreen == 'Subjects') {
                  console.log('add meeting data', {
                    attachFileIds: filesId,
                    committeeId: valueCommitee,
                    creatorName: '',
                    description: discription,
                    endDate: moment(endDateTime).format('YYYY-MM-DD'),
                    endTime: moment(endDateTime).format('LT'),
                    locationId: valueLocation,
                    meetingId: 0,
                    meetingTitle: title,

                    platformId: valueVideoConference,
                    repeat: valueRepeat,
                    repeatName: valueRepeat,
                    required: requiredUsers,
                    setDate: moment(startDateTime).format('YYYY-MM-DD'),
                    setTime: moment(startDateTime).format('LT'),
                    subjectIds: subjects,
                    timeZone: valueTimeZone,
                    userIds: users,
                    subjectStatusIds: [],
                    meetingStatusId: 0,
                    deadlineDate: calendarValue
                  });
                  addMeeting({
                    variables: {
                      meeting: {
                        attachFileIds: filesId,
                        committeeId: valueCommitee,
                        creatorName: '',
                        description: discription,
                        endDate: moment(endDateTime).format('YYYY-MM-DD'),
                        endTime: moment(endDateTime).format('LT'),
                        locationId: valueLocation,
                        meetingId: 0,
                        meetingTitle: title,

                        platformId:
                          valueVideoConference == null
                            ? 0
                            : valueVideoConference,
                        repeat: valueRepeat,

                        required: requiredUsers,
                        setDate: moment(startDateTime).format('YYYY-MM-DD'),
                        setTime: moment(startDateTime).format('LT'),
                        subjectIds: subjects,
                        timeZone: valueTimeZone,
                        userIds: users,
                        subjectStatusIds: [],
                        meetingStatusId: 0,
                        deadlineDate: calendarValue
                      }
                    }
                  });
                }

                // setMeetingsData({
                //   ...meetingsData,
                //   users: users,
                //   userRequired: requiredUsers,
                //   userDetails: previousUser
                // });
                // navigation.navigate('AddMeetingDateAndTime');
              }}
              layoutStyle={[
                styles.nextBtnLayout,
                {
                  opacity:
                    activeScreen == 'Users'
                      ? users?.length <= 0 && requiredUsers?.length <= 0
                        ? 0.5
                        : 1
                      : activeScreen == 'DateTime'
                      ? startDateTime != '' &&
                        endDateTime != '' &&
                        valueTimeZone != null &&
                        valueRepeat != null
                        ? 1
                        : 0.5
                      : activeScreen == 'Location'
                      ? valueLocation != null && valueVideoConference !== null
                        ? 1
                        : 0.5
                      : activeScreen == 'Subjects'
                      ? subjects.length > 0 && calendarValue != ''
                        ? 1
                        : 0.5
                      : 1,
                  width: '48%'
                }
              ]}
              textStyle={styles.txtNextBtn}
              disable={
                activeScreen == 'Users'
                  ? users?.length <= 0 && requiredUsers?.length <= 0
                    ? true
                    : false
                  : activeScreen == 'DateTime'
                  ? startDateTime != '' &&
                    endDateTime != '' &&
                    valueTimeZone != null &&
                    valueRepeat != null
                    ? false
                    : true
                  : activeScreen == 'Location'
                  ? valueLocation != null && valueVideoConference !== null
                    ? false
                    : true
                  : activeScreen == 'Subjects'
                  ? subjects.length > 0 && calendarValue != ''
                    ? false
                    : true
                  : false
              }
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AddMeeting;
