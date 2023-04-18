import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
  useWindowDimensions
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
  GET_All_MEETING,
  GET_LIVE_MEETING_TAB_COUNT,
  GET_MEETING_BY_ID
} from '../../../graphql/query';
import DetailsComponent from '../../../component/detailsComponent/meetingDetailsComponent/MeetingDetailsComponent';
import { UserContext } from '../../../context';
import { UPDATE_MEETING_STATUS } from '../../../graphql/mutation';
import { Fonts } from '../../../themes';

const LiveMeetingMenu = () => {
  const navigation = useNavigation();
  const { user, setUser, companyUrl } = useContext(UserContext);
  const route = useRoute();
  const { item, meetingStatus } = route?.params;
  const [activeTab, setActivetab] = useState('Details');
  const [meeting, setMeeting] = useState(null);
  const [onlyMyTasks, setOnlyMyTasks] = useState(false);
  const [socketEventUpdateMessage, setSocketEventUpdateMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [tabCounts, setTabCounts] = useState({});
  const client = useApolloClient();
  const socketEventUpdate = useRef(null);
  const { width, height } = useWindowDimensions();
  console.log({ height });
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
      setSocketEventUpdateMessage(e.data);
      e &&
        client.refetchQueries({
          include: ['referencesCounts', e.data]
        });
    };
  }, []);

  // get meeting by iod
  const GetMeetingById = useQuery(GET_MEETING_BY_ID, {
    fetchPolicy: 'cache-and-network',
    variables: {
      meetingId: item.meetingId
    },
    onCompleted: (data) => {
      if (data) {
        console.log(data.meeting);
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
    fetchPolicy: 'cache-and-network',
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

  const menus =
    item.yourRoleName !== 'Member'
      ? [
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
        ]
      : [
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
            name: 'Online',
            iconName: IconName.LMOnline,
            iconNameWhite: IconName.LMOnlineWhite
          },
          {
            id: 6,
            name: 'Chats',
            iconName: IconName.LMChat,
            iconNameWhite: IconName.LMChatWhite
          }
        ];

  const [updateMeetingStatus] = useMutation(UPDATE_MEETING_STATUS, {
    refetchQueries: [
      GET_All_MEETING,
      {
        variables: {
          onlyMyMeeting: false,
          committeeIds: '',
          screen: 0,
          searchValue: '',
          page: -1,
          pageSize: -1
        }
      }
    ],
    onCompleted: (data) => {
      if (data.updateMeetingStatus.status.statusCode == '200') {
        navigation.navigate('Details', {
          title: 'Meetings',
          active: '0'
        });
        setOpenModal(false);
      }
    },
    onError: (data) => {
      console.log('updateMeetingStaus error', data.message);
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Live meeting'}
        rightIconName={IconName.Close}
        onRightPress={() => setOpenModal(true)}
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={openModal}
        onRequestClose={() => {
          setOpenModal(!openModal);
        }}
      >
        <View style={styles.modal}>
          <View style={styles.mainBoxView}>
            <View style={styles.textContainer}>
              <Text style={styles.txtClose}>Close</Text>
              <Text style={styles.txtWarn}>
                The final closing of the meeting, all decisions and reports will
                be executed.
              </Text>
              <Text style={[styles.txtWarn, { marginTop: 16 }]}>
                Otherwise, use a soft close.
              </Text>
            </View>
            <Divider style={styles.divider} />
            {item.yourRoleName !== 'Member' ? (
              <View>
                <TouchableOpacity style={styles.alertBtn}>
                  <Text
                    style={styles.txtFinalCloseBtn}
                    onPress={() => {
                      const filterStatus = meetingStatus?.filter((status) => {
                        if (status.meetingStatusTitle == 'Closed') {
                          return status;
                        }
                      });
                      updateMeetingStatus({
                        variables: {
                          meeting: {
                            meetingId: item?.meetingId,
                            meetingStatusId: filterStatus[0]?.meetingStatusId
                          }
                        }
                      });
                    }}
                  >
                    Final close
                  </Text>
                </TouchableOpacity>
                <Divider style={styles.divider} />
                <TouchableOpacity
                  style={styles.alertBtn}
                  onPress={() => {
                    if (meeting?.meetingStatusTitle !== 'Soft-Closed') {
                      const filterStatus = meetingStatus?.filter((status) => {
                        if (status.meetingStatusTitle == 'Soft-Closed') {
                          return status;
                        }
                      });
                      updateMeetingStatus({
                        variables: {
                          meeting: {
                            meetingId: item?.meetingId,
                            meetingStatusId: filterStatus[0]?.meetingStatusId
                          }
                        }
                      });
                    } else {
                      navigation.navigate('Details', {
                        title: 'Meetings',
                        active: '0'
                      });
                      setOpenModal(false);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.txtFinalCloseBtn,
                      { ...Fonts.PoppinsSemiBold[14] }
                    ]}
                  >
                    Soft close
                  </Text>
                </TouchableOpacity>
                <Divider style={styles.divider} />
                <TouchableOpacity
                  style={styles.alertBtn}
                  onPress={() => setOpenModal(false)}
                >
                  <Text
                    style={[
                      styles.txtFinalCloseBtn,
                      { ...Fonts.PoppinsSemiBold[14], color: Colors.primary }
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  style={styles.alertBtn}
                  onPress={() => {
                    setOpenModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.txtFinalCloseBtn,
                      { ...Fonts.PoppinsSemiBold[14], color: Colors.primary }
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <Divider style={styles.divider} />
                <TouchableOpacity
                  style={styles.alertBtn}
                  onPress={() => {
                    navigation.goBack();
                    setOpenModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.txtFinalCloseBtn,
                      { ...Fonts.PoppinsSemiBold[14] }
                    ]}
                  >
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default LiveMeetingMenu;
