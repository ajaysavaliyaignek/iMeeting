import { View, Text, SafeAreaView } from 'react-native';
import React, { useContext, useState } from 'react';
import * as Progress from 'react-native-progress';
import DeviceInfo from 'react-native-device-info';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';

import Header from '../../../../component/header/Header';
import { IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { styles } from './styles';
import { SIZES } from '../../../../themes/Sizes';
import { Fonts } from '../../../../themes';
import { Divider } from 'react-native-paper';
import { Button } from '../../../../component/button/Button';

import {
  GET_All_APPOINTMENT,
  GET_ALL_LOCATION,
  GET_PLATFORMLINK
} from '../../../../graphql/query';
import { UPDATE_APPOINTMENT } from '../../../../graphql/mutation';
import { UserContext } from '../../../../context';
import DropDownPicker from '../../../../component/DropDownPicker/DropDownPicker';

const AddAppointmentLocation = () => {
  const navigation = useNavigation();
  const { setSelectedUsers, appointmentsData, setAppointmentsData } =
    useContext(UserContext);

  console.log('meeting data from addmeetinglocation', appointmentsData);
  const [openLocation, setOpenLocation] = useState(false);
  const [valueLocation, setValueLocation] = useState(null);
  const [openVideoConference, setOpenVideoConference] = useState(false);
  const [valueVideoConference, setValueVideoConference] = useState(null);
  const [onFocus, setIsFocus] = useState(false);

  const [platform, setPlatform] = useState(null);
  const [location, setLocation] = useState([]);
  const [error, setError] = useState([]);
  const [items, setItems] = useState([
    { label: 'Office 2', value: 'Office 2' }
  ]);

  const {
    loading: LocationLoading,
    error: LocationError,
    data: LocationData
  } = useQuery(GET_ALL_LOCATION, {
    variables: {
      locationType: 2
    },

    onCompleted: (data) => {
      console.log('get location', data?.locations);
      // setSubjectData(data?.subjects.items);

      setLocation(data?.locations.items);
    }
  });
  if (LocationError) {
    console.log('LocationError', LocationError);
  }

  // get platform link
  const {
    loading: platformLoading,
    error: platformError,
    data: platformData
  } = useQuery(GET_PLATFORMLINK, {
    variables: {
      platformId: valueVideoConference
    },

    onCompleted: (data) => {
      console.log('get platform link', data.videoConferencePlatformLink);
      // setSubjectData(data?.subjects.items);
      if (data) {
        setPlatform(data?.videoConferencePlatformLink);
      }
    }
  });
  if (platformError) {
    console.log('platformError', platformError);
  }

  const [addAppointment] = useMutation(UPDATE_APPOINTMENT, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: [
      {
        query: GET_All_APPOINTMENT,
        variables: { searchValue: '', page: -1, pageSize: -1 }
      }
    ],
    onCompleted: (data) => {
      console.log('add appointment', data.updateAppointment);
      if (data.updateAppointment.status[0].statusCode == '200') {
        navigation.navigate('AppointmentsList');
        setSelectedUsers([]);
        setAppointmentsData([]);
      }
    },
    onError: (data) => {
      console.log('add appointment error', data);
    }
  });

  const handleViewDetails = () => {
    navigation.navigate('LocationDetails', {
      locationId: valueLocation,
      platform: platform,
      locationType: 2
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Add appointment'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.navigate('AppointmentsList')}
      />
      <View style={styles.subContainer}>
        <View style={styles.progressContainer}>
          <Progress.Bar
            color={Colors.switch}
            progress={1}
            borderColor={Colors.white}
            unfilledColor={'#e6e7e9'}
            width={DeviceInfo.isTablet() ? 800 : 264}
          />
          <Text style={styles.txtProgress}>Step 4/4</Text>
        </View>

        <Text style={styles.txtAddSubjectTitle}>Location</Text>

        {/* dropdown location */}
        <DropDownPicker
          data={location?.map((item) => ({
            label: item.title,
            value: item.locationId
          }))}
          disable={false}
          placeholder={''}
          setData={setValueLocation}
          title={'LOCATION'}
          value={valueLocation}
        />

        <View style={styles.buttonContainer}>
          <Button
            title={'View details'}
            onPress={() =>
              valueLocation == null
                ? setError('Please select location')
                : handleViewDetails()
            }
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Add location'}
            onPress={() =>
              navigation.navigate('AddLocation', { locationType: 2 })
            }
            layoutStyle={[
              // {
              //     opacity: title === "" || discription === "" ? 0.5 : null,
              // },
              styles.cancelBtnLayout
            ]}
            textStyle={styles.txtCancelButton}
          />
        </View>

        {/* dropdown video conference */}
        <DropDownPicker
          data={[
            {
              value: 1,
              label: 'Google Meet'
            },
            {
              value: 2,
              label: 'Microsoft Teams'
            }
          ]}
          disable={false}
          placeholder={''}
          setData={setValueVideoConference}
          title={'VIDEO CONFERENCING PLATFORM'}
          value={valueVideoConference}
        />
      </View>

      {/* bottom button container */}
      <View
        style={{
          backgroundColor: Colors.white,
          justifyContent: 'flex-end'
        }}
      >
        {/* Divider */}
        <Divider style={styles.divider} />
        <View
          style={[styles.buttonContainer, { paddingHorizontal: SIZES[16] }]}
        >
          <Button
            title={'Back'}
            onPress={() => {
              navigation.goBack();
              setAppointmentsData({
                ...appointmentsData,
                locationId: valueLocation,
                platformId: platform.platformId,
                videoConference: valueVideoConference
              });
            }}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Save'}
            onPress={() => {
              console.log({
                appointmentDescription: appointmentsData?.discription,
                appointmentId: 0,
                appointmentTitle: appointmentsData?.title,
                attachFileIds: appointmentsData?.attachFiles,
                committeeId: appointmentsData?.committee,
                locationId: valueLocation,
                platformId: valueVideoConference,
                repeat: appointmentsData?.Repeat,
                required: appointmentsData?.userRequired,
                setDate: appointmentsData?.startDate,
                setTime: appointmentsData?.startTime,
                endDate: appointmentsData?.endDate,
                endTime: appointmentsData?.endTime,
                timeZone: appointmentsData?.TimeZone,
                userIds: appointmentsData?.users
              });
              addAppointment({
                variables: {
                  appointment: {
                    appointmentDescription: appointmentsData?.discription,
                    appointmentId: 0,
                    appointmentTitle: appointmentsData?.title,
                    attachFileIds: appointmentsData?.attachFiles,
                    committeeId: appointmentsData?.committee,
                    locationId: valueLocation,
                    platformId: valueVideoConference,
                    repeat: appointmentsData?.Repeat,
                    required: appointmentsData?.userRequired,
                    setDate: appointmentsData?.startDate,
                    setTime: appointmentsData?.startTime,
                    endDate: appointmentsData?.endDate,
                    endTime: appointmentsData?.endTime,
                    timeZone: appointmentsData?.TimeZone,
                    userIds: appointmentsData?.users
                  }
                }
              });
            }}
            layoutStyle={[
              // {
              //     opacity: title === "" || discription === "" ? 0.5 : null,
              // },
              styles.nextBtnLayout
            ]}
            textStyle={styles.txtNextBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddAppointmentLocation;
