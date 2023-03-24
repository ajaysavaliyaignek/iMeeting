import { View, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider } from 'react-native-paper';

import { styles } from './styles';
import Header from '../../component/header/Header';
import { IconName } from '../../component';
import { Colors } from '../../themes/Colors';
import { Button } from '../../component/button/Button';
import NavigationMenuForApproveSubjectsMeeting from '../../component/navigationMenuForMeetingSubjects/NavigationMenuForApproveSubjectsMeeting';
import DetailsComponent from '../../component/detailsComponent/meetingDetailsComponent/MeetingDetailsComponent';
import { SIZES } from '../../themes/Sizes';
import LiveApproveMeetingSubjectVotingsDetails from '../liveMetting/liveApproveMeetingSubjectVotingDetails/LiveApproveMeetingSubjectVotingsDetails';
import LiveApproveMeetingSubjectTaskDetails from '../liveMetting/liveApproveMeetingSubjectTaskDetails/LiveApproveMeetingSubjectTaskDetails';
import ApproveMeetingSubjectDetails from '../approveMeetingSubjectDetails/ApproveMeetingSubjectDetails';
import LiveMeetingSubjectDecision from '../liveMetting/liveMeetingSubjectDecision/LiveMeetingSubjectDecision';
import { GET_MEETING_BY_ID } from '../../graphql/query';
import { useQuery } from '@apollo/client';

const ApproveMeeting = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item, meetingData, isMeeting } = route?.params;
  const [activeTab, setActiveTab] = useState('Details');
  const [meeting, setMeeting] = useState(null);
  console.log('item', item);
  // console.log('meetingData', meetingData);
  // get meeting by iod
  const GetMeetingById = useQuery(GET_MEETING_BY_ID, {
    fetchPolicy: 'cache-and-network',
    variables: {
      meetingId: item?.meetingId
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

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Minutes of meeting'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <NavigationMenuForApproveSubjectsMeeting
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMeeting={true}
        />
        {activeTab == 'Details' && (
          <DetailsComponent item={meeting} isLiveMeetingDetails={false} />
        )}
        {activeTab == 'Subjects' && (
          <ApproveMeetingSubjectDetails meetingData={meeting} />
        )}
        {activeTab == 'Votings' && (
          <LiveApproveMeetingSubjectVotingsDetails
            meetingData={meeting}
            item={item}
            isMeeting={true}
          />
        )}
        {activeTab == 'Tasks' && (
          <LiveApproveMeetingSubjectTaskDetails
            meetingData={meeting}
            item={item}
            isMeeting={true}
          />
        )}
        {activeTab == 'Decisions' && (
          <LiveMeetingSubjectDecision
            meetingData={meeting}
            item={item}
            isMeeting={true}
          />
        )}
      </View>
      {meeting?.yourRoleName !== 'Member' &&
        activeTab !== 'Decisions' &&
        meeting?.meetingStatusTitle !== 'Closed' && (
          <View
            style={{
              backgroundColor: Colors.white,
              justifyContent: 'flex-end',
              paddingHorizontal: SIZES[16]
            }}
          >
            <Divider style={styles.divider} />
            <Button
              title={'Minutes of meeting decision'}
              layoutStyle={[
                styles.nextBtnLayout,
                { backgroundColor: '#81AB96', width: '100%' }
              ]}
              textStyle={styles.txtNextBtn}
              onPress={() => {
                navigation.navigate('AddMinutesOfMeetingDecision', {
                  isEdit: false,
                  momDecisionData: null,
                  meetingData: meeting
                });
              }}
            />
          </View>
        )}
    </SafeAreaView>
  );
};

export default ApproveMeeting;
