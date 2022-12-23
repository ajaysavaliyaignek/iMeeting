import { View, Text, SafeAreaView } from 'react-native';
import React, { useContext, useState } from 'react';
import * as Progress from 'react-native-progress';
import DeviceInfo from 'react-native-device-info';
import { useNavigation } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import { useQuery } from '@apollo/client';

import Header from '../../../../component/header/Header';
import { IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { styles } from './styles';
import { SIZES } from '../../../../themes/Sizes';
import { Button } from '../../../../component/button/Button';
import { GET_ALL_LOCATION, GET_PLATFORMLINK } from '../../../../graphql/query';
import { UserContext } from '../../../../context';
import DropDownPicker from '../../../../component/DropDownPicker/DropDownPicker';

const AddMeetingLocation = ({
  valueLocation,
  setValueLocation,
  valueVideoConference,
  setValueVideoConference
}) => {
  const navigation = useNavigation();

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

  const handleViewDetails = () => {
    navigation.navigate('LocationDetails', {
      locationId: valueLocation,

      locationType: 1,
      role: 'Head' || 'Secretary'
    });
  };

  return (
    <View style={{ flex: 1 }}>
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
    </View>
  );
};

export default AddMeetingLocation;
