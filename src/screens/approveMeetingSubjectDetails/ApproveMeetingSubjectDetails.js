import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import SerachAndButtoncomponent from '../../component/serachAndButtoncomponent/SerachAndButtoncomponent';
import SubjectListComponent from '../../component/detailsComponent/subjectsListComponent/SubjectListComponent';

const ApproveMeetingSubjectDetails = ({ meetingData }) => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');

  return (
    <View style={{ flex: 1 }}>
      <SerachAndButtoncomponent
        isButtonShow={false}
        role={'Member'}
        onChangeText={setSearchText}
        value={searchText}
      />
      <SubjectListComponent
        isLiveMeetingSubject={true}
        isApproveMeetingSubject={true}
        committeeIds={''}
        meetingId={meetingData.meetingId}
        meetingData={meetingData}
        deleted={false}
        searchText={searchText}
        isSubjectStatus={false}
        editable={true}
        searchFilterSubject={() => {}}
        setSearchText={setSearchText}
        isDecisionSubject={true}
        onPressView={(items) => {
          navigation.navigate('LiveApproveMeetingSubjectDetails', {
            item: items,
            meetingData: meetingData,
            isMeeting: false,
            isMom: true
          });
        }}
      />
    </View>
  );
};

export default ApproveMeetingSubjectDetails;
