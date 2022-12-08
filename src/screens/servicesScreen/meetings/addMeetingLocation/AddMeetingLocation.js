import { View, Text, SafeAreaView } from 'react-native';
import React, { useContext, useState } from 'react';
import * as Progress from 'react-native-progress';
import DeviceInfo from 'react-native-device-info';
import { Dropdown } from 'react-native-element-dropdown';

import Header from '../../../../component/header/Header';
import { IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { styles } from './styles';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SIZES } from '../../../../themes/Sizes';
import { Fonts } from '../../../../themes';
import { Divider } from 'react-native-paper';
import { Button } from '../../../../component/button/Button';
import { useQuery } from '@apollo/client';
import { GET_ALL_LOCATION, GET_PLATFORMLINK } from '../../../../graphql/query';
import { UserContext } from '../../../../context';

const AddMeetingLocation = () => {
  const navigation = useNavigation();
  const { meetingsData, setMeetingsData } = useContext(UserContext);

  console.log('meeting data from addmeetinglocation', meetingsData);
  const [openLocation, setOpenLocation] = useState(false);
  const [onFocus, setIsFocus] = useState(false);
  const [valueLocation, setValueLocation] = useState(
    meetingsData?.location ? meetingsData?.location : null
  );
  const [openVideoConference, setOpenVideoConference] = useState(false);
  const [valueVideoConference, setValueVideoConference] = useState(
    meetingsData?.videoConference ? meetingsData?.videoConference : null
  );
  const [platform, setPlatform] = useState(null);
  const [location, setLocation] = useState([]);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([
    { label: 'Google meet', value: 1 },
    { label: 'Team meet', value: 2 }
  ]);

  const {
    loading: LocationLoading,
    error: LocationError,
    data: LocationData
  } = useQuery(GET_ALL_LOCATION, {
    variables: {
      locationType: 1
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

  const handleViewDetails = () => {
    navigation.navigate('LocationDetails', {
      locationId: valueLocation,
      platform: platform,
      locationType: 1
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Add meeting'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <View style={styles.progressContainer}>
          <Progress.Bar
            color={Colors.switch}
            progress={0.8}
            borderColor={Colors.white}
            unfilledColor={'#e6e7e9'}
            width={DeviceInfo.isTablet() ? 800 : 264}
          />
          <Text style={styles.txtProgress}>Step 4/5</Text>
        </View>

        <Text style={styles.txtAddSubjectTitle}>Location</Text>
        {error && (
          <Text style={{ alignSelf: 'center', color: Colors.Rejected }}>
            {error}
          </Text>
        )}
        <View style={styles.locationContainer}>
          <Text style={styles.txtTitle}>LOCATION</Text>
          <Dropdown
            placeholderStyle={{
              ...Fonts.PoppinsRegular[12],
              color: Colors.secondary
            }}
            data={location?.map((item) => ({
              label: item.title,
              value: item.locationId
            }))}
            style={{
              borderWidth: 0,
              paddingRight: SIZES[16],
              paddingLeft: 0
            }}
            textStyle={{ ...Fonts.PoppinsRegular[14] }}
            // search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={''}
            arrowIconStyle={{
              height: SIZES[12],
              width: SIZES[14]
            }}
            searchPlaceholder="Search..."
            value={valueLocation}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setValueLocation(item.value);
              setIsFocus(false);
            }}
          />
          <Divider style={styles.divider} />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            // disable={valueLocation == null}
            title={'View details'}
            onPress={() => {
              valueLocation == null
                ? setError('Please select location')
                : handleViewDetails();
            }}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Add location'}
            onPress={() =>
              navigation.navigate('AddLocation', { locationType: 1 })
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

        <View style={styles.videoContainer}>
          <Text style={styles.txtTitle}>VIDEO CONFERENCING PLATFORM</Text>
          <Dropdown
            placeholderStyle={{
              ...Fonts.PoppinsRegular[12],
              color: Colors.secondary
            }}
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
            style={{
              borderWidth: 0,
              paddingRight: SIZES[16],
              paddingLeft: 0
            }}
            textStyle={{ ...Fonts.PoppinsRegular[14] }}
            // search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={''}
            arrowIconStyle={{
              height: SIZES[12],
              width: SIZES[14]
            }}
            searchPlaceholder="Search..."
            value={valueVideoConference}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setValueVideoConference(item.value);
              setIsFocus(false);
            }}
          />
          <Divider style={styles.divider} />
        </View>
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
            onPress={() => {
              navigation.goBack();
              setMeetingsData({
                ...meetingsData,
                platform: platform,
                location: valueLocation,
                videoConference: valueVideoConference
              });
            }}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Next'}
            onPress={() => {
              setMeetingsData({
                ...meetingsData,
                platform: platform,
                location: valueLocation,
                videoConference: valueVideoConference
              });
              navigation.navigate('AddMeetingSubjects');
            }}
            layoutStyle={[
              {
                opacity:
                  valueLocation == null || valueVideoConference == null
                    ? 0.5
                    : null
              },
              styles.nextBtnLayout
            ]}
            textStyle={styles.txtNextBtn}
            disable={
              valueLocation == null || valueVideoConference == null
                ? true
                : false
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddMeetingLocation;
