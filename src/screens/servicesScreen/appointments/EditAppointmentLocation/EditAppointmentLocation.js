import { View, Text, SafeAreaView } from 'react-native';
import React, { useContext, useState } from 'react';
import * as Progress from 'react-native-progress';
import DeviceInfo from 'react-native-device-info';
import { Dropdown } from 'react-native-element-dropdown';

import Header from '../../../../component/header/Header';
import { IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { styles } from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SIZES } from '../../../../themes/Sizes';
import { Fonts } from '../../../../themes';
import { Divider } from 'react-native-paper';
import { Button } from '../../../../component/button/Button';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_All_APPOINTMENT,
  GET_ALL_LOCATION,
  GET_APPOINTMENT_BY_ID,
  GET_PLATFORMLINK
} from '../../../../graphql/query';
import { UPDATE_APPOINTMENT } from '../../../../graphql/mutation';
import { UserContext } from '../../../../context';
import DropDownPicker from '../../../../component/DropDownPicker/DropDownPicker';

const EditAppointmentLocation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    attachFiles,
    committee,
    title,
    discription,
    users,
    startDate,
    endDate,
    startTime,
    endTime,
    TimeZone,
    Repeat,
    item,
    userRequired
  } = route?.params;
  // console.log('appointment data from addmeetinglocation', {
  //   attachFiles,
  //   committee,
  //   title,
  //   discription,
  //   users,
  //   startDate,
  //   endDate,
  //   startTime,
  //   endTime,
  //   TimeZone,
  //   Repeat,
  //   item,
  //   userRequired
  // });
  console.log('appointment id', item.appointmentId);
  const [valueLocation, setValueLocation] = useState(item.locationId);
  const [onFocus, setIsFocus] = useState(false);
  const [valueVideoConference, setValueVideoConference] = useState(
    item.platformName == 'Google Meet' ? 1 : 2
  );
  const { setSelectedUsers } = useContext(UserContext);
  const [platform, setPlatform] = useState(null);
  const [location, setLocation] = useState([]);
  const [error, setError] = useState('');
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
      setLocation(data?.locations.items);
    },
    onError: (data) => {
      console.log('LocationError', data);
    }
  });

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
      if (data) {
        setPlatform(data?.videoConferencePlatformLink);
      }
    },
    onError: (data) => {
      console.log('platformError', data);
    }
  });

  const [addAppointment] = useMutation(UPDATE_APPOINTMENT, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: [
      {
        query: GET_All_APPOINTMENT,
        variables: { searchValue: '', page: -1, pageSize: -1 }
      },
      {
        query: GET_APPOINTMENT_BY_ID,
        variables: { id: item?.appointmentId }
      }
    ],
    onCompleted: (data) => {
      if (data.updateAppointment.status[0].statusCode == '200') {
        navigation.navigate('AppointmentsList');
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
        name={'Edit appointment'}
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
        {error && (
          <Text style={{ alignSelf: 'center', color: Colors.Rejected }}>
            {error}
          </Text>
        )}

        <DropDownPicker
          data={location?.map((item) => ({
            label: item.title,
            value: item.locationId
          }))}
          disable={false}
          placeholder={item.locationName}
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
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Save'}
            onPress={() => {
              console.log({
                appointmentDescription: discription,
                appointmentId: item.appointmentId,
                appointmentTitle: title,
                attachFileIds: attachFiles,
                committeeId: committee,
                locationId: valueLocation,
                platformId:
                  valueVideoConference !== null ? valueVideoConference : 0,
                repeat: Repeat,
                required: userRequired,
                setDate: startDate,
                setTime: startTime,
                endDate: endDate,
                endTime: endTime,
                timeZone: TimeZone,
                userIds: users
              });
              addAppointment({
                variables: {
                  appointment: {
                    appointmentDescription: discription,
                    appointmentId: item.appointmentId,
                    appointmentTitle: title,
                    attachFileIds: attachFiles,
                    committeeId: committee,
                    locationId: valueLocation,
                    platformId:
                      valueVideoConference !== null ? valueVideoConference : 0,
                    repeat: Repeat,
                    required: userRequired,
                    setDate: startDate,
                    setTime: startTime,
                    endDate: endDate,
                    endTime: endTime,
                    timeZone: TimeZone,
                    userIds: users
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

export default EditAppointmentLocation;
