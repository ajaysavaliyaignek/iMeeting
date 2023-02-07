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

const ApproveMeeting = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item, meetingData, isMeeting } = route?.params;
  const [activeTab, setActiveTab] = useState('Details');

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
          <DetailsComponent item={meetingData} isLiveMeetingDetails={false} />
        )}
        {activeTab == 'Subjects' && (
          <ApproveMeetingSubjectDetails meetingData={meetingData} />
        )}
        {activeTab == 'Votings' && (
          <LiveApproveMeetingSubjectVotingsDetails
            meetingData={meetingData}
            item={item}
            isMeeting={true}
          />
        )}
        {activeTab == 'Tasks' && (
          <LiveApproveMeetingSubjectTaskDetails
            meetingData={meetingData}
            item={item}
            isMeeting={true}
          />
        )}
        {activeTab == 'Decisions' && (
          <LiveMeetingSubjectDecision
            meetingData={meetingData}
            item={item}
            isMeeting={true}
          />
        )}
      </View>
      {meetingData?.yourRoleName !== 'Member' && activeTab !== 'Decisions' && (
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
                meetingData: meetingData
              });
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ApproveMeeting;
