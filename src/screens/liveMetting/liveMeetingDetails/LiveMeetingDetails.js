import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  Alert
} from 'react-native';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Clipboard from '@react-native-clipboard/clipboard';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';

import { styles } from './styles';
import {
  GET_ALL_LOCATION_BY_ID,
  GET_All_MEETING,
  GET_COMMITTEE_BY_ID,
  GET_MEETING_BY_ID,
  GET_PLATFORMLINK
} from '../../../graphql/query';
import { DELETE_MEETING } from '../../../graphql/mutation';
import { SIZES } from '../../../themes/Sizes';
import { Colors } from '../../../themes/Colors';
import { Fonts } from '../../../themes';
import { Icon, IconName } from '../../../component';
import { Button } from '../../../component/button/Button';

const LiveMeetingDetails = ({ item, meeting }) => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [committe, setCommittee] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [role, setRole] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    const start = moment(
      `${meeting?.setDate},${meeting?.setTime}`,
      'YYYY-MM-DD,hh:mm A'
    );

    const end = moment(
      `${meeting?.endDate},${meeting?.endTime}`,
      'YYYY-MM-DD,hh:mm A'
    );

    const duration = moment.duration(end.diff(start));

    const hours = parseInt(duration.asHours());
    setHours(hours);
    console.log('hours', hours);
    if (hours <= 0) {
      const minutes = parseInt(duration.asMinutes());
      setMinutes(minutes);
    }
  }, []);

  // Calculate the duration
  // Keep in mind you can get the duration in seconds, days, etc.

  console.log('file id', meeting?.attachFileIds);

  // get location
  const Location = useQuery(GET_ALL_LOCATION_BY_ID, {
    fetchPolicy: 'cache-and-network',
    variables: {
      locationId: item.locationId
    },
    onCompleted: (data) => {
      console.log('location by id', data.location);
      if (data) {
        setLocation(data.location);
      }
    },
    onError: (data) => {
      console.log('error in get meeting by id', data);
    }
  });

  // get link
  const Link = useQuery(GET_PLATFORMLINK, {
    fetchPolicy: 'cache-and-network',
    variables: {
      platformId: meeting?.platformId
    },
    onCompleted: (data) => {
      if (data) {
        console.log('platform link', data.videoConferencePlatformLink);
        setPlatform(data.videoConferencePlatformLink);
      }
    },
    onError: (data) => {
      console.log('error in get meeting by id', data);
    }
  });

  // get committee
  const Committee = useQuery(GET_COMMITTEE_BY_ID, {
    fetchPolicy: 'cache-and-network',
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
          screen: 0
        }
      }
    ],
    onCompleted: (data) => {
      if (data.deleteMeeting.status.statusCode == '200') {
        navigation.goBack();
      }
    },
    onError: (data) => {
      console.log('dele meeting error', data);
    }
  });

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.subContainer}
      >
        <View style={styles.detailsContainer}>
          <Text style={styles.txtTitle}>General</Text>
          {details('Committee', committe?.committeeTitle)}
          {details('Your role', meeting?.yourRoleName)}
          {details('Title', meeting?.meetingTitle)}
          {details('Description', meeting?.description)}
          {details('Creator', meeting?.creatorName)}
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.txtTitle}>Date & Time</Text>
          <View>
            {details(
              'Start date',
              `${moment(meeting?.setDate).format('DD MMM,YYYY')},${
                meeting?.setTime
              }`
            )}
            <View>
              <Text style={styles.txtDuration}>
                {' '}
                (Duration {`${hours} hr`} {`${minutes} min`})
              </Text>
            </View>
          </View>
          {details('Timezone', meeting?.timeZone)}

          {details(
            'Repeat',
            meeting?.repeat == 0
              ? "Dosen't repeat"
              : meeting?.repeat == 1
              ? 'Repeat daily'
              : meeting?.repeat == 2
              ? 'Repeat weekly'
              : meeting?.repeat == 3
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
                      {item.suggestedTime}
                    </Text>
                  </View>
                </View>
              ) : (
                details(
                  'Your answer',
                  item.answers ? item.answers : 'No answers'
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

          {details('Location Title', location?.title)}
          <Button
            title={'View details'}
            textStyle={styles.txtLink}
            layoutStyle={styles.btnView}
            onPress={() =>
              navigation.navigate('LocationDetails', {
                locationId: item.locationId,
                platform: platform,
                isLiveMeeting: true,
                role: 'Member',
                locationType: 2
              })
            }
          />

          {details('Vi-nce platform', 'Google Meet')}

          {location?.googleMapURL && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: SIZES[4]
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: Colors.gray,
                  padding: SIZES[14],
                  borderTopLeftRadius: SIZES[8],
                  borderBottomLeftRadius: SIZES[8]
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.primary
                  }}
                >
                  <Text style={styles.txtLink}>{location?.googleMapURL}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: '#E7EDF4',
                  padding: SIZES[14],
                  borderTopRightRadius: SIZES[8],
                  borderBottomRightRadius: SIZES[8]
                }}
                onPress={() => {
                  Clipboard.setString(location?.googleMapURL);
                  if (
                    location?.googleMapURL !== '' ||
                    location?.googleMapURL !== null
                  ) {
                    if (Platform.OS == 'android') {
                      ToastAndroid.show(
                        `Copied Text :-  ${location?.googleMapURL}`,
                        ToastAndroid.SHORT
                      );
                    } else {
                      Alert.alert(`Copied Text :-  ${location?.googleMapURL}`);
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default LiveMeetingDetails;
