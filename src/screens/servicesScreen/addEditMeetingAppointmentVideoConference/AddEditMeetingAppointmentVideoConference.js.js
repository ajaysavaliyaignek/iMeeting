import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import * as Progress from 'react-native-progress';
import DeviceInfo from 'react-native-device-info';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import { useMutation, useQuery } from '@apollo/client';
import moment from 'moment';

import { IconName } from '../../../component';
import { styles } from './styles';
import Header from '../../../component/header/Header';
import { Colors } from '../../../themes/Colors';
import { Button } from '../../../component/button/Button';
import {
  UPDATE_APPOINTMENT,
  UPDATE_MEETING,
  UPDATE_VIDEO_CONFERENCE
} from '../../../graphql/mutation';
import {
  GET_All_APPOINTMENT,
  GET_All_MEETING,
  GET_ALL_VIDEO_CONFERENCES,
  GET_ALL_VIDEO_CONFERENCES_BY_ID,
  GET_APPOINTMENT_BY_ID,
  GET_MEETING_BY_ID
} from '../../../graphql/query';
import { screenRender } from './screenRender';

const AddEditMeetingAppointmentVideoConference = () => {
  const route = useRoute();
  const { screenName, type, screensArray, isEdit, details } = route?.params;
  const navigation = useNavigation();
  const [curentPosition, setCurrentPosition] = useState(0);
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [fileResponse, setFileResponse] = useState([]);
  // state for details for form data
  const [generaldData, setGeneralData] = useState({
    title: '',
    discription: '',
    valueCommitee: null,
    filesId: [],
    previousUser: [],
    startDateTime: new Date(),
    endDateTime: new Date(),
    valueRepeat: null,
    valueTimeZone: null,
    valueLocation: null,
    valueVideoConference: null,
    calendarValue: moment(new Date()).format('YYYY-MM-DD'),
    previousSubject: [],
    attendanceFeedbackDate: moment(new Date()).format('YYYY-MM-DD'),
    attendanceFeedback: false,
    subjectSuggestion: false,
    platformlink: null
  });

  let users = [];
  let requiredUsers = [];
  let subjects = [];
  let mutationParams = {};
  let appointmentMutationParams = {};
  let videoConferenceParams = {};

  // get user ids
  users = generaldData?.previousUser?.map((item) => item.userId);

  // required user array
  requiredUsers = generaldData?.previousUser?.map((item) => item.isRequired);

  // selected subjects array
  subjects = generaldData?.previousSubject?.map((item) => item.subjectId);

  // set mutation params for meeting and appointment
  if (type == 'Meeting') {
    mutationParams = {
      attachFileIds: generaldData?.filesId,
      committeeId: generaldData?.valueCommitee,
      creatorName: '',
      description: generaldData?.discription,
      endDate: moment(generaldData?.endDateTime).format('YYYY-MM-DD'),
      endTime: moment(generaldData?.endDateTime).format('LT'),
      locationId: generaldData?.valueLocation,
      meetingId: !isEdit ? 0 : details?.meetingId,
      meetingTitle: generaldData?.title,
      platformId:
        generaldData?.valueVideoConference == null
          ? 0
          : generaldData?.valueVideoConference,
      repeat: generaldData?.valueRepeat,
      required: requiredUsers,
      setDate: moment(generaldData?.startDateTime).format('YYYY-MM-DD'),
      setTime: moment(generaldData?.startDateTime).format('LT'),
      subjectIds: subjects,
      timeZone: generaldData?.valueTimeZone,
      userIds: users,
      subjectStatusIds: [],
      meetingStatusId: 0,
      deadlineDate: generaldData?.subjectSuggestion
        ? generaldData?.calendarValue
        : '',
      attendanceFeedbackDate: generaldData?.attendanceFeedback
        ? generaldData?.attendanceFeedbackDate
        : '',
      attendanceFeedback: generaldData?.attendanceFeedback,
      subjectSuggestion: generaldData?.subjectSuggestion
    };
  } else if (type == 'Appointment') {
    appointmentMutationParams = {
      appointmentDescription: generaldData?.discription,
      appointmentId: isEdit ? details?.appointmentId : 0,
      appointmentTitle: generaldData?.title,
      attachFileIds: generaldData?.filesId,
      committeeId: generaldData?.valueCommitee,
      locationId: generaldData?.valueLocation,
      platformId:
        generaldData?.valueVideoConference == null
          ? 0
          : generaldData?.valueVideoConference,
      repeat: generaldData?.valueRepeat,
      required: requiredUsers,
      setDate: moment(generaldData?.startDateTime).format('YYYY-MM-DD'),
      setTime: moment(generaldData?.startDateTime).format('LT'),
      endDate: moment(generaldData?.endDateTime).format('YYYY-MM-DD'),
      endTime: moment(generaldData?.endDateTime).format('LT'),
      timeZone: generaldData?.valueTimeZone,
      userIds: users
    };
  } else if (type == 'VideoConference') {
    videoConferenceParams = {
      videoConferenceId: isEdit ? details?.videoConferenceId : 0,
      videoConferenceTitle: generaldData?.title,
      videoConferenceDescription: generaldData?.discription,
      committeeId:
        generaldData?.valueCommitee == null ? 0 : generaldData?.valueCommitee,
      attachFileIds: generaldData?.filesId,
      repeat: generaldData?.valueRepeat,
      setDate: moment(generaldData?.startDateTime).format('YYYY-MM-DD'),
      setTime: moment(generaldData?.startDateTime).format('LT'),
      endDate: moment(generaldData?.endDateTime).format('YYYY-MM-DD'),
      endTime: moment(generaldData?.endDateTime).format('LT'),
      timeZone: generaldData?.valueTimeZone,
      userIds: users,
      required: requiredUsers,

      platformId:
        generaldData?.valueVideoConference == null
          ? 0
          : generaldData?.valueVideoConference
    };
  }

  // for get meeting and appointment data by id

  if (type == 'Meeting' && isEdit) {
    const {
      data,
      error: MeetingError,
      loading
    } = useQuery(GET_MEETING_BY_ID, {
      fetchPolicy: 'cache-and-network',
      variables: {
        meetingId: details?.meetingId
      },
      onCompleted: (data) => {
        if (data) {
          console.log('meeting by id', data.meeting);
          // setMeeting(data.meeting);
          let meeting = data?.meeting;
          setGeneralData({
            title: meeting?.meetingTitle,
            discription: meeting?.description,
            valueCommitee: meeting?.committeeId,
            filesId: [],
            fileResponse: [],
            previousUser: meeting?.userDetails,
            startDateTime: moment(
              `${meeting?.setDate}, ${meeting?.setTime}`,
              'YYYY-MM-DD, hh:mm a'
            ).format(),
            endDateTime: moment(
              `${meeting?.endDate}, ${meeting?.endTime}`,
              'YYYY-MM-DD, hh:mm a'
            ).format(),
            valueRepeat: meeting?.repeat,
            valueTimeZone: meeting?.timeZone,
            valueLocation: meeting?.locationId,
            valueVideoConference: meeting?.platformlink?.includes('google')
              ? 1
              : 2,
            calendarValue: moment(meeting?.deadlineDate).format('YYYY-MM-DD'),
            previousSubject: [],
            subjectSuggestion: meeting.subjectSuggestion,
            attendanceFeedback: meeting.attendanceFeedback,
            attendanceFeedbackDate: moment(
              meeting?.attendanceFeedbackDate
            ).format('YYYY-MM-DD')
          });
        }
      },
      onError: (data) => {
        console.log('error in get meeting by id', data);
      }
    });
  } else if (type == 'Appointment' && isEdit) {
    const GetAppointmentById = useQuery(GET_APPOINTMENT_BY_ID, {
      fetchPolicy: 'cache-and-network',
      variables: {
        id: details?.appointmentId
      },
      onCompleted: (data) => {
        console.log(
          'appointment by id from edit appointment general',
          data.appointment
        );
        if (data) {
          // setAppointment(data.appointment);
          let appointment = data.appointment;
          setGeneralData({
            title: appointment.appointmentTitle,
            discription: appointment.appointmentDescription,
            valueCommitee: appointment.committeeId,
            filesId: [],
            fileResponse: [],
            previousUser: appointment.userDetails,
            startDateTime: moment(
              `${appointment.setDate}, ${appointment.setTime}`,
              'YYYY-MM-DD, hh:mm a'
            ).format(),
            endDateTime: moment(
              `${appointment.endDate}, ${appointment.endTime}`,
              'YYYY-MM-DD, hh:mm a'
            ).format(),
            valueRepeat: appointment.repeat,
            valueTimeZone: appointment.timeZone,
            valueLocation: appointment.locationId,
            valueVideoConference: appointment.platformlink?.includes('google')
              ? 1
              : 2,
            calendarValue: moment(appointment.deadlineDate).format(
              'YYYY-MM-DD'
            ),
            previousSubject: []
          });
        }
      },
      onError: (data) => console.log('error from get appointment by id', data)
    });
  } else if (type == 'VideoConference' && isEdit) {
    const GetVideoConferenceById = useQuery(GET_ALL_VIDEO_CONFERENCES_BY_ID, {
      fetchPolicy: 'cache-and-network',
      variables: {
        id: details?.videoConferenceId
      },
      onCompleted: (data) => {
        console.log(
          'videoConference by id from edit videoConference general',
          data.videoConference
        );
        if (data) {
          // setAppointment(data.appointment);
          let videoConference = data.videoConference;
          setGeneralData({
            title: videoConference.videoConferenceTitle,
            discription: videoConference.videoConferenceDescription,
            valueCommitee: videoConference.committeeId,
            filesId: [],
            fileResponse: [],
            previousUser: videoConference.userDetails,
            startDateTime: moment(
              `${videoConference.setDate}, ${videoConference.setTime}`,
              'YYYY-MM-DD, hh:mm a'
            ).format(),
            endDateTime: moment(
              `${videoConference.endDate}, ${videoConference.endTime}`,
              'YYYY-MM-DD, hh:mm a'
            ).format(),
            valueRepeat: videoConference.repeat,
            valueTimeZone: videoConference.timeZone,
            valueLocation: videoConference.locationId,
            valueVideoConference: videoConference.platformlink?.includes(
              'google'
            )
              ? 1
              : 2,
            calendarValue: moment(videoConference.deadlineDate).format(
              'YYYY-MM-DD'
            ),
            previousSubject: [],
            platformlink: videoConference.platformlink
          });
        }
      },
      onError: (data) => console.log('error from get appointment by id', data)
    });
  }
  // mutation for add and edit meeting
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
        console.log('add meeting', data.updateMeeting);
        if (data.updateMeeting.status.statusCode == '200') {
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

  // function for add and edit appointment
  const [addAppointment, { loading: updateAppointmentLoading }] = useMutation(
    UPDATE_APPOINTMENT,
    {
      // export const GET_All_SUBJECTS = gql`
      refetchQueries: [
        {
          query: GET_All_APPOINTMENT,
          variables: { searchValue: '', page: -1, pageSize: -1 }
        }
      ],
      onCompleted: (data) => {
        console.log('add appointment', data.updateAppointment);
        if (data.updateAppointment.status.statusCode == '200') {
          navigation.navigate('AppointmentsList');
          setSelectedUsers([]);
          setAppointmentsData([]);
        }
      },
      onError: (data) => {
        console.log('add appointment error', data);
      }
    }
  );

  // function for add and edit video conference
  const [addVideoConference, { loading: updateVideoConference }] = useMutation(
    UPDATE_VIDEO_CONFERENCE,
    {
      // export const GET_All_SUBJECTS = gql`
      refetchQueries: [
        {
          query: GET_ALL_VIDEO_CONFERENCES,
          variables: {
            date: '',
            page: -1,
            pageSize: -1,
            searchValue: '',
            sort: ''
          }
        }
      ],
      onCompleted: (data) => {
        console.log('add videoconference', data.updateVideoConference);
        if (data.updateVideoConference.status.statusCode == '200') {
          navigation.navigate('VideoConferenceList');
        }
      },
      onError: (data) => {
        console.log('add videoconference error', data.message);
      }
    }
  );

  console.log('mutationParams', mutationParams);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => setVisibleIndex(-1)}
        activeOpacity={1}
      >
        {/* header of screen */}
        <Header
          name={screenName}
          rightIconName={IconName.Close}
          onRightPress={() => navigation.goBack()}
        />

        {/* progress bar */}
        <View style={styles.subContainer}>
          <View style={styles.progressContainer}>
            <Progress.Bar
              color={Colors.switch}
              progress={(curentPosition + 1) / screensArray?.length}
              borderColor={Colors.white}
              unfilledColor={'#e6e7e9'}
              width={DeviceInfo.isTablet() ? 800 : 264}
            />
            <Text style={styles.txtProgress}>
              Step {`${curentPosition + 1} / ${screensArray?.length}`}
            </Text>
          </View>

          {/* screen rendering function */}
          {screenRender(
            screensArray[curentPosition],
            generaldData,
            setGeneralData,
            details,
            visibleIndex,
            setVisibleIndex,
            fileResponse,
            setFileResponse,
            screenName
          )}

          {/* button container */}
          <View
            style={{
              backgroundColor: Colors.white,
              justifyContent: 'flex-end'
            }}
          >
            {/* Divider */}
            <Divider style={styles.divider} />

            <View
              style={[
                styles.buttonContainer,
                { flexDirection: 'row', justifyContent: 'space-between' }
              ]}
            >
              {curentPosition != 0 && (
                <Button
                  title={'Back'}
                  onPress={() => {
                    setCurrentPosition(curentPosition - 1);
                  }}
                  layoutStyle={styles.cancelBtnLayout}
                  textStyle={styles.txtCancelButton}
                />
              )}
              <Button
                title={
                  curentPosition == screensArray.length - 1 ? 'Submit' : 'Next'
                }
                onPress={() => {
                  if (curentPosition !== screensArray.length - 1) {
                    setCurrentPosition(curentPosition + 1);
                  }

                  if (curentPosition == screensArray.length - 1) {
                    if (type == 'Meeting') {
                      addMeeting({
                        variables: {
                          meeting: mutationParams
                        }
                      });
                    } else if (type == 'Appointment') {
                      addAppointment({
                        variables: {
                          appointment: appointmentMutationParams
                        }
                      });
                    } else if (type == 'VideoConference') {
                      console.log(
                        'videoConferenceParams',
                        videoConferenceParams
                      );
                      addVideoConference({
                        variables: {
                          videoConference: videoConferenceParams
                        }
                      });
                    }
                  }
                }}
                isLoading={
                  type == 'Meeting'
                    ? addMeetingLoading
                    : type == 'Appointment'
                    ? updateAppointmentLoading
                    : false
                }
                layoutStyle={[
                  styles.nextBtnLayout,
                  {
                    opacity:
                      type !== 'VideoConference' && curentPosition == 0
                        ? generaldData?.title !== '' &&
                          generaldData?.discription !== '' &&
                          generaldData?.valueCommitee != null
                          ? 1
                          : 0.5
                        : curentPosition == 1
                        ? users?.length <= 0 && requiredUsers?.length <= 0
                          ? 0.5
                          : 1
                        : curentPosition == 2
                        ? generaldData?.startDateTime != '' &&
                          generaldData?.endDateTime != '' &&
                          generaldData?.valueTimeZone != null &&
                          generaldData?.valueRepeat != null
                          ? 1
                          : 0.5
                        : curentPosition == 3
                        ? generaldData?.valueLocation != null &&
                          generaldData?.valueVideoConference !== null
                          ? 1
                          : 0.5
                        : curentPosition == 4
                        ? subjects.length > 0 &&
                          generaldData?.calendarValue != ''
                          ? 1
                          : 0.5
                        : 1,
                    width: curentPosition == 0 ? '100%' : '48%'
                  }
                ]}
                textStyle={styles.txtNextBtn}
                disable={
                  type !== 'VideoConference' && curentPosition == 0
                    ? generaldData?.title !== '' &&
                      generaldData?.discription !== '' &&
                      generaldData?.valueCommitee != null
                      ? false
                      : true
                    : curentPosition == 1
                    ? users?.length <= 0 && requiredUsers?.length <= 0
                      ? true
                      : false
                    : curentPosition == 2
                    ? generaldData?.startDateTime != '' &&
                      generaldData?.endDateTime != '' &&
                      generaldData?.valueTimeZone != null &&
                      generaldData?.valueRepeat != null
                      ? false
                      : true
                    : curentPosition == 3
                    ? generaldData?.valueLocation != null &&
                      generaldData?.valueVideoConference !== null
                      ? false
                      : true
                    : curentPosition == 4
                    ? subjects.length > 0 && generaldData?.calendarValue != ''
                      ? false
                      : true
                    : false
                }
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddEditMeetingAppointmentVideoConference;
