import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  ToastAndroid,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import moment from 'moment';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Divider } from 'react-native-paper';
import momentDurationFormatSetup from 'moment-duration-format';

import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { styles } from './styles';
import { SIZES } from '../../../../themes/Sizes';
import { Colors } from '../../../../themes/Colors';
import { Button } from '../../../../component/button/Button';
import { Fonts } from '../../../../themes';

import {
  GET_All_APPOINTMENT,
  GET_ANSWER,
  GET_APPOINTMENT_BY_ID,
  GET_FILE,
  GET_USER_PAYLOAD
} from '../../../../graphql/query';

import { DELETE_APPOINTMENT } from '../../../../graphql/mutation';
import Clipboard from '@react-native-clipboard/clipboard';
import AttachFiles from '../../../../component/attachFiles/AttachFiles';
import UserDetailsComponent from '../../../../component/userDetailsComponent/UserDetailsComponent';

const AppointmentsDetails = () => {
  const navigation = useNavigation();
  momentDurationFormatSetup(moment);
  const route = useRoute();
  const { item, isDisable } = route?.params;
  console.log(item);
  console.log(isDisable);
  const [fileResponse, setFileResponse] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [role, setRole] = useState(item.yourRoleName);
  const [user, setUser] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [valueIndex, setValueIndex] = useState(null);
  let fileId = item?.attachFileIds;

  // get mappointment by id
  const { data, error, loading } = useQuery(GET_APPOINTMENT_BY_ID, {
    variables: {
      id: item.appointmentId
    },
    onCompleted: (data) => {
      if (data) {
        console.log('get appointment by id', data);
        setAppointment(data.appointment);
        // setRole(data.meeting.yourRoleName);
      }
    },
    onError: (data) => {
      console.log('error in get appointment by id', data);
    }
  });

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
          id: +item?.appointmentId,
          userId: +data.userPayload.userId,
          type: 2
        }
      });
    }
  });

  fileId?.map((id) => {
    const { loading, error } = useQuery(GET_FILE, {
      variables: {
        fileEntryId: id
      },
      onCompleted: (data) => {
        if (data) {
          setFileResponse((prev) => {
            const pevDaa = prev?.filter((ite) => {
              return ite.fileEnteryId !== data.fileEnteryId;
            });
            return [...pevDaa, data.uploadedFile];
          });
        }
      }
    });
    if (error) {
      console.log('file error', error);
    }
  });

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
  const [deleteAppointment] = useMutation(DELETE_APPOINTMENT, {
    refetchQueries: [
      {
        query: GET_All_APPOINTMENT,
        variables: {
          searchValue: '',
          page: -1,
          pageSize: -1
        }
      }
    ],
    onCompleted: (data) => {
      if (data.deleteAppointment.status[0].statusCode == '200') {
        navigation.goBack();
      }
    },
    onError: (data) => {
      console.log('dele appointment error', data);
    }
  });

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

  const details = (title, discription) => {
    return (
      <View style={{ marginTop: SIZES[24] }}>
        <Text style={styles.txtDetailTitle}>{title}</Text>
        <Text style={styles.txtDetailDiscription}>{discription}</Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Appointment details'}
        rightIconName={IconName.Search}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.subContainer}
      >
        <View style={styles.detailsContainer}>
          <Text style={styles.txtTitle}>General</Text>
          {details('Committee', item?.committeeName)}
          {details('Your role', item?.yourRoleName)}
          {details('Title', item?.appointmentTitle)}
          {details('Description', appointment?.appointmentDescription)}
          {details('Creator', appointment?.creatorName)}
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.txtTitle}>Date & Time</Text>
          <View>
            {details(
              'Start date',
              `${moment(appointment?.setDate).format('DD MMM,YYYY')},${
                appointment?.setTime
              }`
            )}
            <View>
              <Text style={styles.txtDuration}>{durationHourMin}</Text>
            </View>
          </View>
          {details('Timezone', appointment?.timeZone)}

          {details(
            'Repeat',
            appointment?.repeat == 0
              ? "Dosen't repeat"
              : appointment?.repeat == 1
              ? 'Repeat daily'
              : appointment?.repeat == 2
              ? 'Repeat weekly'
              : appointment?.repeat == 3
              ? 'Repeat monthly'
              : 'Repeat yearly'
          )}
          {role == 'Member' && details('Required', 'Yes')}
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
              <TouchableOpacity
                style={{
                  marginLeft: SIZES[16],
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.primary
                }}
                onPress={() => navigation.navigate('YourAnswer', { item })}
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
            </View>
          )}
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.txtTitle}>Location</Text>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            {details('Location Title', appointment?.locationName)}
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.primary
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('LocationDetails', {
                    locationId: appointment?.locationId,
                    platform: appointment?.platformName,
                    locationType: 2
                  })
                }
              >
                <Text style={styles.txtLink}>View details</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            {details('Vi-nce platform', appointment?.platformName)}

            {appointment?.platformlink && (
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.primary,
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '70%',
                  marginBottom: fileResponse?.length > 0 ? 0 : SIZES[24]
                }}
              >
                <Text style={[styles.txtLink, { width: '80%' }]}>
                  {appointment?.platformlink}
                </Text>
                <TouchableOpacity
                  style={{ marginTop: 32, marginLeft: 14 }}
                  onPress={() => {
                    Clipboard.setString(appointment?.platformlink);
                    if (
                      appointment?.platformlink !== '' ||
                      appointment?.platformlink !== null
                    ) {
                      if (Platform.OS == 'android') {
                        ToastAndroid.show(
                          `Copied Text :-  ${appointment?.platformlink}`,
                          ToastAndroid.SHORT
                        );
                      } else {
                        Alert.alert(
                          `Copied Text :-  ${appointment?.platformlink}`
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

          {fileResponse?.length > 0 && (
            <AttachFiles
              fileResponse={fileResponse}
              setFileResponse={setFileResponse}
              showAttachButton={false}
              deleted={false}
              download={true}
            />
          )}
        </View>
        <Divider style={[styles.divider, { marginTop: SIZES[24] }]} />
        <View style={{ marginTop: SIZES[40], marginHorizontal: SIZES[16] }}>
          <Text style={styles.txtTitle}>Users</Text>
        </View>
        <Divider style={[styles.divider, { marginTop: SIZES[24] }]} />
        <UserDetailsComponent
          users={appointment?.userDetails}
          isUserRequired={true}
          isSwitchOnRow={true}
          isSwichDisabled={true}
          searchText={''}
        />
      </ScrollView>
      {role == 'Head' || role == 'Secretory' ? (
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
                  navigation.navigate('EditAppointmentGeneral', {
                    data: appointment
                  })
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

export default AppointmentsDetails;
