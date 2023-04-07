import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  SafeAreaView
} from 'react-native';
import React, { useState } from 'react';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import Header from '../../component/header/Header';
import { Colors } from '../../themes/Colors';
import Normalize from '../../themes/mixins';
import { Icon, IconName } from '../../component';
import DashboardCard from '../../component/Cards/DashboardCard';
import { Fonts } from '../../themes';
import CommitteesCard from '../../component/Cards/CommitteesCard';
import {
  GET_All_APPOINTMENT,
  GET_All_COMMITTEE,
  GET_All_MEETING,
  GET_ALL_TASKS,
  GET_ALL_VIDEO_CONFERENCES,
  GET_EVENT_COUNTS
} from '../../graphql/query';
import { useQuery } from '@apollo/client';
import CommitteeList from './committeeList/CommitteeList';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [counts, setCounts] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const {} = useQuery(GET_EVENT_COUNTS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      setCounts(data.counts);
    },
    onError: (data) => {
      console.log('event count error', data.message);
    }
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* header */}
      <Header name={'Dashboard'} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* statasticsView */}
        <TouchableOpacity
          style={styles.statasticsView}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Statistic')}
        >
          <Text style={styles.txtStatisticsBtn}>Statistics</Text>
          <Icon
            name={IconName.Arrow_Right}
            height={Normalize(12)}
            width={Normalize(6)}
          />
        </TouchableOpacity>
        <Divider style={styles.divider} />

        {/* general View */}
        <View style={{ padding: Normalize(16) }}>
          <DashboardCard
            name={IconName.Meetings_Dashboard}
            height={Normalize(20)}
            width={Normalize(20)}
            title={'Meeting'}
            cardBackgroundColor={'rgba(101, 142, 180, 0.1)'}
            count={counts?.meetingCounts}
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
          <DashboardCard
            name={IconName.Appointments}
            height={Normalize(20)}
            width={Normalize(20)}
            title={'Appointment'}
            cardBackgroundColor={'rgba(171, 158, 200, 0.1)'}
            count={counts?.appointmentCounts}
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
          <DashboardCard
            name={IconName.Video_Conferences}
            height={Normalize(14)}
            width={Normalize(22)}
            title={'Video conferences'}
            cardBackgroundColor={'rgba(231, 157, 115, 0.1)'}
            count={counts?.videoConferenceCounts}
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
          <DashboardCard
            name={IconName.Tasks}
            height={Normalize(20)}
            width={Normalize(18)}
            title={'Task'}
            cardBackgroundColor={'rgba(221, 120, 120, 0.1)'}
            count={counts?.taskCounts}
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
        </View>

        {/* committes  */}
        <Text style={styles.txtCommittees}>Committees</Text>
        <CommitteeList
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    width: '100%'
  },
  statasticsView: {
    marginVertical: Normalize(10),
    marginHorizontal: Normalize(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  divider: {
    width: '100%',
    height: Normalize(1),
    backgroundColor: Colors.line,
    marginLeft: Normalize(16)
  },
  txtCommittees: {
    ...Fonts.PoppinsBold[24],
    color: Colors.bold,
    marginLeft: Normalize(16)
  },
  txtStatisticsBtn: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  }
});
