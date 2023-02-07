import { TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { styles } from './styles';
import SubjectListComponent from '../../../component/detailsComponent/subjectsListComponent/SubjectListComponent';
import SerachAndButtoncomponent from '../../../component/serachAndButtoncomponent/SerachAndButtoncomponent';

const Livemeetingsubjects = ({ item, socketEventUpdateMessage }) => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [visibleIndex, setVisibleIndex] = useState(-1);
  console.log('meeting', item);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setVisibleIndex(-1);
      }}
      activeOpacity={1}
    >
      <SerachAndButtoncomponent
        buttonText={'Add subject'}
        isButtonShow={item?.yourRoleName != 'Member' ? true : false}
        onPress={() => {
          navigation.navigate('AddSubject', {
            committee: item?.committeeId,
            isEdit: false,
            subjectDetails: null,
            screenName: 'Add subject',
            meetingName: item?.meetingTitle,
            meetingId: item?.meetingId,
            isLiveMeetingSubject: true
          });
        }}
        setSearchText={setSearchText}
        role={item.yourRoleName}
        onChangeText={(text) => {
          setSearchText(text);
        }}
      />

      <Divider style={styles.divider} />
      <SubjectListComponent
        isLiveMeetingSubject={true}
        isDecisionSubject={false}
        committeeIds={''}
        deleted={false}
        meetingId={item.meetingId}
        searchText={searchText}
        isSubjectStatus={false}
        editable={false}
        setSearchText={setSearchText}
        onPressView={(items) => {
          navigation.navigate('LiveApproveMeetingSubjectDetails', {
            item: items,
            meetingData: item,
            isMeeting: false,
            isMom: false
          });
        }}
        socketEventUpdateMessage={socketEventUpdateMessage}
      />
    </TouchableOpacity>
  );
};

export default Livemeetingsubjects;
