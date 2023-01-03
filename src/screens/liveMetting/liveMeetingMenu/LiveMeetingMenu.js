import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApolloClient, useMutation } from '@apollo/client';

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
import {
  GET_LIVE_MEETING_TAB_COUNT,
  GET_MEETING_BY_ID
} from '../../../graphql/query';
import DetailsComponent from '../../../component/detailsComponent/meetingDetailsComponent/MeetingDetailsComponent';
import { UserContext } from '../../../context';
import { UPDATE_MEETING_STATUS } from '../../../graphql/mutation';

const LiveMeetingMenu = () => {
  const navigation = useNavigation();
  const { user, setUser, companyUrl } = useContext(UserContext);
  const route = useRoute();
  const { item, meetingStatus } = route?.params;
  const [activeTab, setActivetab] = useState('Details');
  const [meeting, setMeeting] = useState(null);
  const [onlyMyTasks, setOnlyMyTasks] = useState(false);
  const [socketEventUpdateMessage, setSocketEventUpdateMessage] = useState('');
  const [tabCounts, setTabCounts] = useState({});
  const client = useApolloClient();
  const socketEventUpdate = useRef(null);

  useEffect(() => {
    socketEventUpdate.current = new WebSocket(
      `wss://${companyUrl}//o/live-meeting?meetingId=${item?.meetingId}`
    );

    socketEventUpdate.current.onopen = () => {
      console.log('socketEventUpdate Connected to the server');
      // setDisableButton(false);
    };
    socketEventUpdate.current.onclose = (e) => {
      console.log(' socketEventUpdate Disconnected. Check internet or server.');
      // setDisableButton(true);
    };
    socketEventUpdate.onerror = (e) => {
      console.log('socketEventUpdate error', e.message);
    };

    return () => {
      console.log('socketEventUpdate close connection');
      socketEventUpdate.current.close();
    };
  }, []);

  useEffect(() => {
    socketEventUpdate.current.onmessage = (e) => {
      console.log('message----', e);
      e && setSocketEventUpdateMessage(e.data);
      e &&
        client.refetchQueries({
          include: ['referencesCounts']
        });
    };
  }, []);

  // get meeting by iod
  const GetMeetingById = useQuery(GET_MEETING_BY_ID, {
    variables: {
      meetingId: item.meetingId
    },
    onCompleted: (data) => {
      if (data) {
        setMeeting(data.meeting);
        // setRole(data.meeting.yourRoleName);
      }
    },
    onError: (data) => {
      console.log('error in get meeting by id', data);
    }
  });

  // get all tab's count
  const GetTabsCounts = useQuery(GET_LIVE_MEETING_TAB_COUNT, {
    variables: {
      id: item.meetingId,
      type: 1
    },
    onCompleted: (data) => {
      if (data) {
        setTabCounts(data.referencesCounts.referencesCounts);
      }
    },
    onError: (data) => {
      console.log('error GetTabsCounts', data);
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
      count: tabCounts?.Subject
    },
    {
      id: 2,
      name: 'Users',
      iconName: IconName.LMUsers,
      iconNameWhite: IconName.LMUsersWhite,
      count: tabCounts?.user
    },
    {
      id: 3,
      name: 'Votings',
      iconName: IconName.LMVotings,
      iconNameWhite: IconName.LMVotingsWhite,
      count: tabCounts?.Voting
    },
    {
      id: 4,
      name: 'Tasks',
      iconName: IconName.LMTasks,
      iconNameWhite: IconName.LMTasksWhite,
      count: tabCounts?.Task
    },
    {
      id: 5,
      name: 'Decisions',
      iconName: IconName.LMDecisions,
      iconNameWhite: IconName.LMDecisionsWhite,
      count: tabCounts?.decision
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

  const [updateMeetingStatus] = useMutation(UPDATE_MEETING_STATUS, {
    refetchQueries: ['meeting'],
    onCompleted: (data) => {
      console.log('updateMeetingSttaus', data.updateMeetingStatus.status[0]);
      if (data.updateMeetingStatus.status[0].statusCode == '200') {
        navigation.goBack();
      }
    },
    onError: (data) => {
      console.log('updateMeetingSttaus', data.message);
    }
  });

  const meetingCloseHandler = () => {
    Alert.alert(
      item.yourRoleName !== 'Member' ? 'Close' : 'Leave a meeting ?',
      'The final closing of the meeting,all decisions and reports will be executed                                                                                Otherwise, use a soft close',
      // '',
      // 'Otherwise use a soft close',

      item.yourRoleName !== 'Member'
        ? [
            {
              text: 'Final close',
              onPress: () => {
                const filterStatus = meetingStatus?.filter((status) => {
                  if (status.meetingStatusTitle == 'Closed') {
                    return status;
                  }
                });
                navigation.goBack();
                console.log('filterstatus for final close', filterStatus);
                // updateMeetingStatus({
                //   variables: {
                //     meeting: {
                //       meetingId: item?.meetingId,
                //       meetingStatusId: filterStatus[0].meetingStatusId
                //     }
                //   }
                // });
              },
              style: 'destructive'
            },
            {
              text: 'Soft close',
              onPress: () => {
                const filterStatus = meetingStatus?.filter((status) => {
                  if (status.meetingStatusTitle == 'Soft-Closed') {
                    return status;
                  }
                });
                console.log('filterstatus for final close', filterStatus);
                navigation.goBack();
                // updateMeetingStatus({
                //   variables: {
                //     meeting: {
                //       meetingId: item?.meetingId,
                //       meetingStatusId: filterStatus[0].meetingStatusId
                //     }
                //   }
                // });
              },
              style: 'destructive'
            },
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel'
            }
          ]
        : [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel'
            },
            {
              text: 'Yes',
              onPress: () => {
                navigation.goBack();
              },
              style: 'destructive'
            }
          ]
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Live meeting'}
        rightIconName={IconName.Close}
        onRightPress={meetingCloseHandler}
      />
      <View style={styles.subContainer}>
        {activeTab == 'Details' && (
          <DetailsComponent item={item} isLiveMeetingDetails={false} />
        )}
        {activeTab == 'Subjects' && (
          <Livemeetingsubjects
            item={item}
            socketEventUpdateMessage={socketEventUpdateMessage}
          />
        )}
        {activeTab == 'Users' && (
          <LiveMeetingUsers
            item={item}
            meeting={meeting}
            socketEventUpdateMessage={socketEventUpdateMessage}
          />
        )}
        {activeTab == 'Votings' && (
          <LiveMeetingVotings
            item={item}
            socketEventUpdateMessage={socketEventUpdateMessage}
          />
        )}
        {activeTab == 'Tasks' && (
          <LiveMeetingTasks
            item={item}
            socketEventUpdateMessage={socketEventUpdateMessage}
          />
        )}
        {activeTab == 'Decisions' && (
          <LiveMeetingDecisions
            item={item}
            socketEventUpdateMessage={socketEventUpdateMessage}
          />
        )}
        {activeTab == 'Online' && <LiveMeetingOnline item={item} />}
        {activeTab == 'Chats' && (
          <LiveMeetingChats
            item={item}
            socketEventUpdateMessage={socketEventUpdateMessage}
          />
        )}
      </View>
      <View
        style={{
          backgroundColor: Colors.white,
          justifyContent: 'flex-end'
          // marginBottom: keyboardHeight
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
