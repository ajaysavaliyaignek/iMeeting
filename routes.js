import { Text, useWindowDimensions, View } from 'react-native';
import React from 'react';
import DeviceInfo from 'react-native-device-info';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import DashboardScreen from './src/screens/dashboardScreen/DashboardScreen';
import ServicesScreen from './src/screens/servicesScreen/ServicesScreen';
import CalenderScreen from './src/screens/calenderScreen/CalenderScreen';
import ProfileScreen from './src/screens/profileScreen/ProfileScreen';
import LoginScreen from './src/screens/authScreen/loginScreen/LoginScreen';
import CreateAccount from './src/screens/authScreen/createAccount/CreateAccountStep1';
import CreateAccountStep2 from './src/screens/authScreen/createAccount/CreateAccountStep2';
import CreateAccountStep3 from './src/screens/authScreen/createAccount/CreateAccountStep3';
import MailNotification from './src/screens/authScreen/createAccount/MailNotification';
import { Icon, IconName } from './src/component';
import { Colors } from './src/themes/Colors';
import { Fonts } from './src/themes';
import CommitteesDetails from './src/screens/dashboardScreen/CommitteesDetails';
import StatisticScreen from './src/screens/dashboardScreen/StatisticScreen';
import CommitteeScreen from './src/screens/dashboardScreen/CommitteeScreen';
import SubjectDownload from './src/screens/servicesScreen/subjects/subjectDowmload/SubjectDownload';
import SelectUsers from './src/screens/SelectUsers';
import { SIZES } from './src/themes/Sizes';
import DetailsScreen from './src/screens/servicesScreen/detailsScreen/DetailsScreen';
import AddSubjectScreen from './src/screens/servicesScreen/subjects/addSubjects/AddSubjectScreen';
import EditSubjectScreen from './src/screens/servicesScreen/subjects/editSubject/EditSubjectScreen';
import SubjectDetails from './src/screens/servicesScreen/subjects/subjectDetails/SubjectDetails';
import AppointmentsList from './src/screens/servicesScreen/appointments/appointmetList/AppointmentsList';
import AddSubjectCategory from './src/screens/servicesScreen/subjects/addSubjectCategory/AddSubjectCategory';
import Subjects from './src/screens/servicesScreen/Subjects';
import AddDraftSubject from './src/screens/servicesScreen/subjects/addDraftSybject/AddDraftSubject';
import AppointmentsDetails from './src/screens/servicesScreen/appointments/appointmentDetails/AppointmentDetails';
import TasksList from './src/screens/servicesScreen/tasks/tasksList/TasksList';
import FilterTask from './src/screens/servicesScreen/tasks/filterTask/FilterTask';
import LiveMeetingMenu from './src/screens/liveMetting/liveMeetingMenu/LiveMeetingMenu';
import AddSpeaker from './src/screens/liveMetting/addSpeaker/AddSpeaker';
import AddVoting from './src/screens/liveMetting/addVoting/AddVoting';
import AddEditMeetingAppointmentVideoConference from './src/screens/servicesScreen/addEditMeetingAppointmentVideoConference/AddEditMeetingAppointmentVideoConference.js';
import TimelineScreen from './src/screens/servicesScreen/meetings/timeline/TimelineScreen';
import AddExternalUser from './src/screens/servicesScreen/meetings/addExternalUser/AddExternalUser';
import LocationDetails from './src/screens/servicesScreen/meetings/locationDetails/LocationDetails';
import AddLocation from './src/screens/servicesScreen/meetings/addLocation/AddLocation';
import EditLocation from './src/screens/servicesScreen/meetings/editLocation/EditLocation';
import DeadlineSuggestion from './src/screens/servicesScreen/meetings/deadlineSuggestion/DeadlineSuggestion';
import SelectUser from './src/screens/servicesScreen/meetings/selectUser/SelectUser';
import SelectSubjects from './src/screens/servicesScreen/meetings/selectSubjects/SelectSubjects';
import MeetingDetails from './src/screens/servicesScreen/meetings/meetingDetails/MeetingDetails';
import Role from './src/screens/servicesScreen/meetings/role/Role';
import YourAnswer from './src/screens/servicesScreen/meetings/yourAnswer/YourAnswer';
import Users from './src/screens/servicesScreen/meetings/users/Users';
import AddTask from './src/screens/liveMetting/addTask/AddTask';
import AddEditDecision from './src/screens/liveMetting/addEditDecision/AddEditDecision';
import ViewVotingHistory from './src/screens/liveMetting/liveMeetingVotings/ViewVotingHistory';
import TaskDetails from './src/screens/servicesScreen/tasks/taskDetails/TaskDetails';
import SecretaryPermission from './src/screens/servicesScreen/tasks/secretaryPermission/SecretaryPermission';
import EventsViewByDayScreen from './src/screens/calenderScreen/eventsViewBydayScreen/EventsViewByDayScreen';
import LiveApproveMeetingSubjectDetails from './src/screens/liveMetting/liveApproveMeetingSubjectDetails/LiveApproveMeetingSubjectDetails';
import AddApproveDecision from './src/screens/addApproveMeetingDecision/AddApproveDecision';
import ApproveMeeting from './src/screens/approveMeeting/ApproveMeeting';
import AddMinutesOfMeetingDecision from './src/screens/addApproveMeetingDecision/addMinutesOfMeetingDecision/AddMinutesOfMeetingDecision';
import VideoConferenceList from './src/screens/videoConference/videoConferenceList/VideoConferenceList';
import AddGeneralVideoConference from './src/screens/videoConference/addGeneralVideoConference/AddGeneralVideoConference';
import VideoConferenceDetails from './src/screens/videoConference/videoConferenceDetails/VideoConferenceDetails';

const bottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainBottomTab = () => {
  const { height, width } = useWindowDimensions();
  return (
    <bottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e6e7e9',
          backgroundColor: Colors.white
        },
        tabBarShowLabel: false
      }}
      initialRouteName="ServicesStack"
    >
      <bottomTab.Screen
        name="DashboardStack"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  borderTopColor: focused ? Colors.primary : null,
                  borderTopWidth: focused ? SIZES[1] : 0,
                  width:
                    DeviceInfo.isTablet() || width > height ? '400%' : '90%',
                  alignItems: 'center',
                  justifyContent:
                    DeviceInfo.isTablet() || width > height
                      ? 'space-between'
                      : 'center',
                  height: '100%',
                  flexDirection:
                    DeviceInfo.isTablet() || width > height ? 'row' : null
                }}
              >
                <Icon
                  name={
                    focused ? IconName.Dashboard_Focused : IconName.Dashboard
                  }
                  height={SIZES[20]}
                  width={SIZES[20]}
                />
                <Text
                  style={{
                    ...Fonts.PoppinsRegular[10],
                    color: Colors.secondary
                  }}
                >
                  Dashboard
                </Text>
              </View>
            );
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarLabelStyle: { ...Fonts.PoppinsRegular[10] }
        }}
      />
      <bottomTab.Screen
        name="ServicesStack"
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  borderTopColor: focused ? Colors.primary : null,
                  borderTopWidth: focused ? SIZES[1] : 0,
                  width:
                    DeviceInfo.isTablet() || width > height ? '400%' : '90%',
                  alignItems: 'center',
                  justifyContent:
                    DeviceInfo.isTablet() || width > height
                      ? 'space-between'
                      : 'center',
                  height: '100%',
                  flexDirection:
                    DeviceInfo.isTablet() || width > height ? 'row' : null
                }}
              >
                <Icon
                  name={focused ? IconName.Services_Focused : IconName.Services}
                  height={SIZES[20]}
                  width={SIZES[20]}
                />
                <Text
                  style={{
                    ...Fonts.PoppinsRegular[10],
                    color: Colors.secondary
                  }}
                >
                  Services
                </Text>
              </View>
            );
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarLabelStyle: { ...Fonts.PoppinsRegular[10] }
        }}
        component={ServicesScreen}
      />
      <bottomTab.Screen
        name="CalenderStack"
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  borderTopColor: focused ? Colors.primary : null,
                  borderTopWidth: focused ? SIZES[1] : 0,
                  width:
                    DeviceInfo.isTablet() || width > height ? '400%' : '90%',
                  alignItems: 'center',
                  justifyContent:
                    DeviceInfo.isTablet() || width > height
                      ? 'space-between'
                      : 'center',
                  height: '100%',
                  flexDirection:
                    DeviceInfo.isTablet() || width > height ? 'row' : null
                }}
              >
                <Icon
                  name={focused ? IconName.Calendar_Focused : IconName.Calendar}
                  height={SIZES[20]}
                  width={SIZES[20]}
                />
                <Text
                  style={{
                    ...Fonts.PoppinsRegular[10],
                    color: Colors.secondary
                  }}
                >
                  Calendar
                </Text>
              </View>
            );
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarLabelStyle: { ...Fonts.PoppinsRegular[10] }
        }}
        component={CalenderScreen}
      />
      <bottomTab.Screen
        name="ProfileStack"
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  borderTopColor: focused ? Colors.primary : null,
                  borderTopWidth: focused ? SIZES[1] : 0,
                  width:
                    DeviceInfo.isTablet() || width > height ? '350%' : '90%',
                  alignItems: 'center',
                  justifyContent:
                    DeviceInfo.isTablet() || width > height
                      ? 'space-between'
                      : 'center',
                  height: '100%',
                  flexDirection:
                    DeviceInfo.isTablet() || width > height ? 'row' : null
                }}
              >
                <Icon
                  name={focused ? IconName.Account_Focused : IconName.Account}
                  height={SIZES[20]}
                  width={SIZES[20]}
                />
                <Text
                  style={{
                    ...Fonts.PoppinsRegular[10],
                    color: Colors.secondary
                  }}
                >
                  Profile
                </Text>
              </View>
            );
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarLabelStyle: { ...Fonts.PoppinsRegular[10] }
        }}
        component={ProfileScreen}
      />
    </bottomTab.Navigator>
  );
};

const MainStack = ({ initialRouteName }) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MainBottomTab" component={MainBottomTab} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
      <Stack.Screen name="Step2" component={CreateAccountStep2} />
      <Stack.Screen name="Step3" component={CreateAccountStep3} />
      <Stack.Screen name="Mail Notification" component={MailNotification} />
      <Stack.Screen name="CommitteeDetails" component={CommitteesDetails} />
      <Stack.Screen name="Statistic" component={StatisticScreen} />
      <Stack.Screen name="Committee" component={CommitteeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="AddSubject" component={AddSubjectScreen} />
      <Stack.Screen name="AddSubjectCategory" component={AddSubjectCategory} />
      <Stack.Screen name="AddDraftSubject" component={AddDraftSubject} />
      <Stack.Screen name="SubjectDetails" component={SubjectDetails} />
      <Stack.Screen name="EditSubject" component={EditSubjectScreen} />
      <Stack.Screen name="SubjectDownload" component={SubjectDownload} />
      <Stack.Screen
        name="AddEditMeetingAppointmentVideoConference"
        component={AddEditMeetingAppointmentVideoConference}
      />

      <Stack.Screen name="LocationDetails" component={LocationDetails} />
      <Stack.Screen name="AddLocation" component={AddLocation} />
      <Stack.Screen name="EditLocation" component={EditLocation} />
      <Stack.Screen name="SelectUser" component={SelectUser} />
      <Stack.Screen name="Timeline" component={TimelineScreen} />
      <Stack.Screen name="SelectUsers" component={SelectUsers} />
      <Stack.Screen name="AddExternalUser" component={AddExternalUser} />
      <Stack.Screen name="DeadlineSuggestion" component={DeadlineSuggestion} />
      <Stack.Screen name="SelectSubjects" component={SelectSubjects} />
      <Stack.Screen name="Role" component={Role} />
      <Stack.Screen name="MeetingDetails" component={MeetingDetails} />
      <Stack.Screen name="AppointmentDetails" component={AppointmentsDetails} />
      <Stack.Screen name="AppointmentsList" component={AppointmentsList} />
      <Stack.Screen name="YourAnswer" component={YourAnswer} />
      <Stack.Screen name="subjects" component={Subjects} />

      <Stack.Screen name="Users" component={Users} />
      <Stack.Screen name="TasksList" component={TasksList} />
      <Stack.Screen name="FilterTask" component={FilterTask} />
      <Stack.Screen name="LiveMeetingMenu" component={LiveMeetingMenu} />
      <Stack.Screen name="AddSpeaker" component={AddSpeaker} />
      <Stack.Screen name="AddVoting" component={AddVoting} />
      <Stack.Screen name="AddTask" component={AddTask} />
      <Stack.Screen name="AddEditDecision" component={AddEditDecision} />
      <Stack.Screen
        name="LiveApproveMeetingSubjectDetails"
        component={LiveApproveMeetingSubjectDetails}
      />
      <Stack.Screen name="ApproveMeeting" component={ApproveMeeting} />
      <Stack.Screen name="ViewVotingHistory" component={ViewVotingHistory} />
      <Stack.Screen name="TaskDetails" component={TaskDetails} />
      <Stack.Screen
        name="SecretaryPermission"
        component={SecretaryPermission}
      />
      <Stack.Screen
        name="EventsViewByDayScreen"
        component={EventsViewByDayScreen}
      />
      <Stack.Screen name="AddApproveDecision" component={AddApproveDecision} />
      <Stack.Screen
        name="AddMinutesOfMeetingDecision"
        component={AddMinutesOfMeetingDecision}
      />
      <Stack.Screen
        name="VideoConferenceList"
        component={VideoConferenceList}
      />
      <Stack.Screen
        name="VideoConferenceDetails"
        component={VideoConferenceDetails}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
