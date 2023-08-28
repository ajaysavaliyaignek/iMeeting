import { View, Text, Linking } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';

import { Colors } from '../../../../themes/Colors';
import { styles } from './styles';
import { Button } from '../../../../component/button/Button';
import { GET_ALL_LOCATION, GET_GOOGLE_AUTHORIZATION, GET_PLATFORMLINK } from '../../../../graphql/query';
import DropDownPicker from '../../../../component/DropDownPicker/DropDownPicker';
import { Fonts } from '../../../../themes';

const AddEditLocation = ({
  generaldData,
  setGeneralData,
  type,
  showRequired,
  setShowRequired,
  isEdit
}) => {
  const navigation = useNavigation();
  const [location, setLocation] = useState([]);
  const [error, setError] = useState(null);

  // get all location for location dropdown
  const {
    loading: LocationLoading,
    error: LocationError,
    data: LocationData
  } = useQuery(GET_ALL_LOCATION, {
    fetchPolicy: 'cache-and-network',
    variables: {
      locationType: type == 'Meeting' ? 1 : 4
    },

    onCompleted: (data) => {
      // setSubjectData(data?.subjects.items);

      setLocation(data?.locations.items);
    }
  });
  if (LocationError) {
    console.log('LocationError', LocationError);
  }

  // on press view location details
  const handleViewDetails = () => {
    navigation.navigate('LocationDetails', {
      locationId: generaldData?.valueLocation,

      locationType: type == 'Meeting' ? 1 : 4,
      role: 'Head',
      isLiveMeeting: false
    });
  };

      // fetch google authorization
      const {data:googleAuthData} = useQuery(GET_GOOGLE_AUTHORIZATION, {
        fetchPolicy: 'cache-and-network',
        onCompleted: (data) => {
          console.log({data})
          // if (data) {
          //   setCommittee(data?.committeesByRole?.items);
          // }
        },
        onError: (data) => {
          console.log('google auth error', data);
        }
      });

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.subContainer}>
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
          setData={(item) => {
            setGeneralData({ ...generaldData, valueLocation: item });
            setError('');
            setShowRequired(false);
          }}
          title={'LOCATION'}
          value={generaldData?.valueLocation}
        />
        {showRequired && generaldData?.generaldData?.valueLocation == null ? (
          <Text style={{ color: Colors.Rejected, ...Fonts.PoppinsRegular[10] }}>
            *This field is required
          </Text>
        ) : null}

        <View style={styles.buttonContainer}>
          <Button
            // disable={valueLocation == null}
            title={'View details'}
            onPress={() => {
              generaldData?.valueLocation == null
                ? setError('Please select location')
                : handleViewDetails();
            }}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Add location'}
            onPress={() =>
              navigation.navigate('AddLocation', {
                locationType: type == 'Meeting' ? 1 : 4
              })
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
          disable={
            isEdit
              ? generaldData.valueVideoConference !== null
                ? true
                : false
              : false
          }
          placeholder={''}
          setData={(item) =>
            setGeneralData({ ...generaldData, valueVideoConference: item })
          }
          title={'VIDEO CONFERENCING PLATFORM'}
          value={generaldData?.valueVideoConference}
        />
          {generaldData?.valueVideoConference===1&&<Button

onPress={() => Linking.openURL(googleAuthData?.googleAuthURL?.googleAuthURL)}
        title={googleAuthData?.googleAuthURL?.isAuthorized ? "Authorized" : "Authorize"}
        disable={googleAuthData?.googleAuthURL?.isAuthorized ? true : false}
        layoutStyle={[

          styles.loginButton,
          {
            backgroundColor: googleAuthData?.googleAuthURL?.isAuthorized ? "green" : Colors.primary
          },
        ]}
        textStyle={styles.txtButton}
      />}
      </View>
    </View>
  );
};

export default AddEditLocation;
