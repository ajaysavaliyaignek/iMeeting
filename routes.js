import { Platform, SafeAreaView, Text, View } from "react-native";
import React from "react";
import DeviceInfo from "react-native-device-info";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import DashboardScreen from "./src/screens/dashboardScreen/DashboardScreen";
import ServicesScreen from "./src/screens/servicesScreen/ServicesScreen";
import CalenderScreen from "./src/screens/calenderScreen/CalenderScreen";
import ProfileScreen from "./src/screens/profileScreen/ProfileScreen";
import LoginScreen from "./src/screens/authScreen/LoginScreen";
import CreateAccount from "./src/screens/authScreen/createAccount/CreateAccountStep1";
import CreateAccountStep2 from "./src/screens/authScreen/createAccount/CreateAccountStep2";
import CreateAccountStep3 from "./src/screens/authScreen/createAccount/CreateAccountStep3";
import MailNotification from "./src/screens/authScreen/createAccount/MailNotification";
import { Icon, IconName } from "./src/component";
import Normalize from "./src/themes/mixins";
import { Colors } from "./src/themes/Colors";
import { Fonts } from "./src/themes";
import CommitteesDetails from "./src/screens/dashboardScreen/CommitteesDetails";
import StatisticScreen from "./src/screens/dashboardScreen/StatisticScreen";
import CommitteeScreen from "./src/screens/dashboardScreen/CommitteeScreen";
import AddSubjectScreen from "./src/screens/servicesScreen/subjects/AddSubjectScreen";
import SubjectDetails from "./src/screens/servicesScreen/subjects/SubjectDetails";
import EditSubjectScreen from "./src/screens/servicesScreen/subjects/EditSubjectScreen";
import SubjectDownload from "./src/screens/servicesScreen/subjects/SubjectDownload";
import MeetingDetails from "./src/screens/servicesScreen/meetings/MeetingDetails";
import EditMeeting from "./src/screens/servicesScreen/meetings/EditMeeting";
import DetailsScreen from "./src/screens/servicesScreen/DetailsScreen";
import AddMeetingGeneralScreen from "./src/screens/servicesScreen/meetings/AddMeetingGeneral";
import AddMeetingUser from "./src/screens/servicesScreen/meetings/AddMeetingUser";
import TimelineScreen from "./src/screens/servicesScreen/meetings/TimelineScreen";
import SelectUsers from "./src/screens/SelectUsers";
import AddExternalUser from "./src/screens/servicesScreen/meetings/AddExternalUser";

const bottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainBottomTab = () => {
  return (
    <bottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#e6e7e9",
          backgroundColor: Colors.white,
        },
        tabBarShowLabel:false
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
                  borderTopWidth: focused ? 1 : 0,
                  width:DeviceInfo.isTablet()? "400%":"90%",
                  alignItems: "center",
                  justifyContent:DeviceInfo.isTablet()?"space-between": "center",
                  height: "100%",
                  flexDirection:DeviceInfo.isTablet()?"row":null,
                  
                }}
              >
                <Icon
                  name={
                    focused ? IconName.Dashboard_Focused : IconName.Dashboard
                  }
                  height={20}
                  width={20}
                />
                <Text style={{...Fonts.PoppinsRegular[10],color:Colors.secondary}}>Dashboard</Text>
              </View>
            );
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarLabelStyle: { ...Fonts.PoppinsRegular[10] },
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
                  borderTopWidth: focused ? 1 : 0,
                  width: DeviceInfo.isTablet()? "400%":"90%",
                  alignItems: "center",
                  justifyContent: DeviceInfo.isTablet()?"space-between": "center",
                  height: "100%",
                  flexDirection:DeviceInfo.isTablet()?"row":null,
                }}
              >
                <Icon
                  name={focused ? IconName.Services_Focused : IconName.Services}
                  height={20}
                  width={20}
                />
                <Text style={{...Fonts.PoppinsRegular[10],color:Colors.secondary}}>Services</Text>
              </View>
            );
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarLabelStyle: { ...Fonts.PoppinsRegular[10] },
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
                  borderTopWidth: focused ? 1 : 0,
                  width: DeviceInfo.isTablet()? "400%":"90%",
                  alignItems: "center",
                  justifyContent: DeviceInfo.isTablet()?"space-between": "center",
                  height: "100%",
                  flexDirection:DeviceInfo.isTablet()?"row":null,
                }}
              >
                <Icon
                  name={focused ? IconName.Calendar_Focused : IconName.Calendar}
                  height={20}
                  width={20}
                />
                <Text style={{...Fonts.PoppinsRegular[10],color:Colors.secondary}}>Calendar</Text>
              </View>
            );
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarLabelStyle: { ...Fonts.PoppinsRegular[10] },
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
                  borderTopWidth: focused ? 1 : 0,
                  width: DeviceInfo.isTablet()? "350%":"90%",
                  alignItems: "center",
                  justifyContent: DeviceInfo.isTablet()?"space-between": "center",
                  height: "100%",
                  flexDirection:DeviceInfo.isTablet()?"row":null,
                }}
              >
                <Icon
                  name={focused ? IconName.Account_Focused : IconName.Account}
                  height={20}
                  width={20}
                />
                <Text style={{...Fonts.PoppinsRegular[10],color:Colors.secondary}}>Profile</Text>
              </View>
            );
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarLabelStyle: { ...Fonts.PoppinsRegular[10] },
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
      <Stack.Screen name="SubjectDetails" component={SubjectDetails} />
      <Stack.Screen name="EditSubject" component={EditSubjectScreen} />
      <Stack.Screen name="SubjectDownload" component={SubjectDownload} />
      <Stack.Screen name="MeetingDetails" component={MeetingDetails} />
      <Stack.Screen name="AddMeetingGeneral" component={AddMeetingGeneralScreen} />
      <Stack.Screen name="AddMeetingUser" component={AddMeetingUser} />
      <Stack.Screen name="EditMeeting" component={EditMeeting} />
      <Stack.Screen name="Timeline" component={TimelineScreen} />
      <Stack.Screen name="SelectUsers" component={SelectUsers} />
      <Stack.Screen name="AddExternalUser" component={AddExternalUser} />
     
    </Stack.Navigator>
   
  );
};

export default MainStack;
