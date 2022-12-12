import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { styles } from './styles';
import Header from '../../../component/header/Header';
import { Icon, IconName } from '../../../component';
import { Button } from '../../../component/button/Button';
import { Divider } from 'react-native-paper';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';
import { act } from 'react-test-renderer';
import LiveMeetingDetails from '../liveMeetingDetails/LiveMeetingDetails';
import Livemeetingsubjects from '../liveMeetingSubjects/Livemeetingsubjects';
import LiveMeetingUsers from '../liveMeetingUsers/LiveMeetingUsers';
import LiveMeetingVotings from '../liveMeetingVotings/LiveMeetingVotings';
import LiveMeetingTasks from '../liveMeetingTasks/LiveMeetingTasks';
import LiveMeetingOnline from '../liveMeetingOnline/LiveMeetingOnline';
import LiveMeetingDecisions from '../liveMeetingDecisions/LiveMeetingDecisions';
import LiveMeetingChats from '../liveMeetingChats/LiveMeetingChats';
import { useQuery } from '@apollo/client';
import { GET_MEETING_BY_ID } from '../../../graphql/query';
import DetailsComponent from '../../../component/detailsComponent/MeetingDetailsComponent';

const LiveMeetingMenu = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route?.params;
  const [activeTab, setActivetab] = useState('Details');
  const [meeting, setMeeting] = useState(null);
  const [count, setCount] = useState(null);

  // get meeting by iod
  const GetMeetingById = useQuery(GET_MEETING_BY_ID, {
    variables: {
      meetingId: item.meetingId
    },
    onCompleted: (data) => {
      console.log('meeting by id', data.meeting);
      if (data) {
        setMeeting(data.meeting);
        // setRole(data.meeting.yourRoleName);
      }
    },
    onError: (data) => {
      console.log('error in get meeting by id', data);
    }
  });

  const menus = [
    {
      id: 0,
      name: 'Details',
      iconName: IconName.LMDetails,
      iconNameWhite: IconName.LMDetailsWhite,
      count: 0
    },
    {
      id: 1,
      name: 'Subjects',
      iconName: IconName.LMSubjects,
      iconNameWhite: IconName.LMSubjectsWhite,
      count: meeting?.subjectIds?.length
    },
    {
      id: 2,
      name: 'Users',
      iconName: IconName.LMUsers,
      iconNameWhite: IconName.LMUsersWhite,
      count: meeting?.userDetails?.length
    },
    {
      id: 3,
      name: 'Votings',
      iconName: IconName.LMVotings,
      iconNameWhite: IconName.LMVotingsWhite,
      count: 0
    },
    {
      id: 4,
      name: 'Tasks',
      iconName: IconName.LMTasks,
      iconNameWhite: IconName.LMTasksWhite,
      count: 0
    },
    {
      id: 5,
      name: 'Decisions',
      iconName: IconName.LMDecisions,
      iconNameWhite: IconName.LMDecisionsWhite,
      count: 0
    },
    {
      id: 6,
      name: 'Online',
      iconName: IconName.LMOnline,
      iconNameWhite: IconName.LMOnlineWhite
    },
    {
      id: 7,
      name: 'Chats',
      iconName: IconName.LMChat,
      iconNameWhite: IconName.LMChatWhite
    }
  ];
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Live meeting'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        {activeTab == 'Details' && (
          <DetailsComponent item={item} isLiveMeetingDetails={false} />
        )}
        {activeTab == 'Subjects' && (
          <Livemeetingsubjects item={item} setCount={setCount} />
        )}
        {activeTab == 'Users' && (
          <LiveMeetingUsers item={item} meeting={meeting} />
        )}
        {activeTab == 'Votings' && <LiveMeetingVotings />}
        {activeTab == 'Tasks' && <LiveMeetingTasks />}
        {activeTab == 'Decisions' && <LiveMeetingDecisions />}
        {activeTab == 'Online' && <LiveMeetingOnline />}
        {activeTab == 'Chats' && <LiveMeetingChats />}
      </View>
      <View
        style={{
          backgroundColor: Colors.white,
          justifyContent: 'flex-end'
        }}
      >
        {/* Divider */}
        <Divider style={styles.divider} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginLeft: SIZES[16], marginBottom: SIZES[16] }}
        >
          {menus.map((menu, index) => {
            return (
              <TouchableOpacity
                onPress={() => setActivetab(menu.name)}
                style={styles.menuBtn}
                activeOpacity={1}
              >
                <View
                  style={[
                    styles.bgIcon,
                    {
                      backgroundColor:
                        activeTab == menu.name
                          ? Colors.primary
                          : `rgba(248, 248, 248, 1)`
                    }
                  ]}
                >
                  <Icon
                    name={
                      activeTab == menu.name
                        ? menu.iconNameWhite
                        : menu.iconName
                    }
                  />
                </View>
                <Text style={styles.txtMenu}>{menu.name}</Text>
                {menu.count > 0 && (
                  <View
                    style={[
                      styles.badgeView,
                      {
                        borderColor:
                          activeTab == menu.name ? Colors.white : null,
                        borderWidth: activeTab == menu.name ? 1 : null
                      }
                    ]}
                  >
                    <Text style={styles.txtBadge}>{menu.count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default LiveMeetingMenu;
