import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import React from 'react';
import Header from '../../component/header/Header';
import { IconName } from '../../component';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import DashboardCard from '../../component/Cards/DashboardCard';
import { SIZES } from '../../themes/Sizes';

const AddEvent = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Add event'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.subContainer}>
        {/* navigate to add meeting page */}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            navigation.navigate('AddEditMeetingAppointmentVideoConference', {
              screenName: 'Add meeting',
              type: 'Meeting',
              screensArray: [
                'general',
                'users',
                'dateandtime',
                'location',
                'subjects'
              ],
              isEdit: false,
              details: null
            });
          }}
        >
          <DashboardCard
            name={IconName.Meetings_Dashboard}
            height={SIZES[20]}
            width={SIZES[20]}
            title={'Meeting'}
            cardBackgroundColor={'rgba(101, 142, 180, 0.1)'}
            addBackgroundColor={'#658EB4'}
            onPressAdd={() =>
              navigation.navigate('AddEditMeetingAppointmentVideoConference', {
                screenName: 'Add meeting',
                type: 'Meeting',
                screensArray: [
                  'general',
                  'users',
                  'dateandtime',
                  'location',
                  'subjects'
                ],
                isEdit: false,
                details: null
              })
            }
          />
        </TouchableOpacity>

        {/* navigate to add appointment page */}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            navigation.navigate('AddEditMeetingAppointmentVideoConference', {
              screenName: 'Add appointment',
              type: 'Appointment',
              screensArray: ['general', 'users', 'dateandtime', 'location'],
              isEdit: false,
              details: null
            });
          }}
        >
          <DashboardCard
            name={IconName.Appointments}
            height={SIZES[20]}
            width={SIZES[20]}
            title={'Appointment'}
            cardBackgroundColor={'rgba(171, 158, 200, 0.1)'}
            addBackgroundColor={'#AB9EC8'}
            onPressAdd={() => {
              navigation.navigate('AddEditMeetingAppointmentVideoConference', {
                screenName: 'Add appointment',
                type: 'Appointment',
                screensArray: ['general', 'users', 'dateandtime', 'location'],
                isEdit: false,
                details: null
              });
            }}
          />
        </TouchableOpacity>

        {/* navigate to add video conference page */}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            navigation.navigate('AddEditMeetingAppointmentVideoConference', {
              screenName: 'Add video conference',
              type: 'VideoConference',
              screensArray: ['generalVideoConference', 'users', 'dateandtime'],
              isEdit: false,
              details: null
            });
          }}
        >
          <DashboardCard
            name={IconName.Video_Conferences}
            height={SIZES[14]}
            width={SIZES[22]}
            title={'Video conferences'}
            cardBackgroundColor={'rgba(231, 157, 115, 0.1)'}
            addBackgroundColor={'#E79D73'}
            onPressAdd={() => {
              navigation.navigate('AddEditMeetingAppointmentVideoConference', {
                screenName: 'Add video conference',
                type: 'VideoConference',
                screensArray: [
                  'generalVideoConference',
                  'users',
                  'dateandtime'
                ],
                isEdit: false,
                details: null
              });
            }}
          />
        </TouchableOpacity>

        {/* navigate to add task page */}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            navigation.navigate('AddTask', {
              meetingDetails: null,
              isMeetingTask: false,
              isEdit: false,
              taskData: null
            });
          }}
        >
          <DashboardCard
            name={IconName.Tasks}
            height={SIZES[20]}
            width={SIZES[18]}
            title={'Task'}
            cardBackgroundColor={'rgba(221, 120, 120, 0.1)'}
            addBackgroundColor={'#DD7878'}
            onPressAdd={() => {
              navigation.navigate('AddTask', {
                meetingDetails: null,
                isMeetingTask: false,
                isEdit: false,
                taskData: null
              });
            }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddEvent;
