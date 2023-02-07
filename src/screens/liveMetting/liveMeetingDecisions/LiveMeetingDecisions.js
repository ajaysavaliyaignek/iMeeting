import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';

import { styles } from './styles';
import SerachAndButtoncomponent from '../../../component/serachAndButtoncomponent/SerachAndButtoncomponent';
import SubjectListComponent from '../../../component/detailsComponent/subjectsListComponent/SubjectListComponent';

const LiveMeetingDecisions = ({
  item: meetingData,
  socketEventUpdateMessage
}) => {
  const navigation = useNavigation();
  const client = useApolloClient();
  const [searchText, setSearchText] = useState('');

  const searchFilterSubject = (text) => {
    if (text) {
      const newData = selectedSubjects.filter((item) => {
        const itemData = item.subjectTitle ? item.subjectTitle : '';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });
      setSearchText(text);
      setFilterData(newData);
    } else {
      setSearchText(text);
      setFilterData(selectedSubjects);
    }
  };

  useEffect(() => {
    if (socketEventUpdateMessage == 'subjects') {
      client.refetchQueries({
        include: ['decisions', 'subjects']
      });
    }
  }, [socketEventUpdateMessage]);

  return (
    <View style={styles.container}>
      <SerachAndButtoncomponent
        buttonText={'Add decision'}
        isButtonShow={meetingData?.yourRoleName != 'Member' ? false : true}
        role={meetingData?.yourRoleName}
        onPress={() =>
          navigation.navigate('AddEditDecision', {
            meetingDetails: meetingData,
            isEdit: false,
            decisionData: null
          })
        }
        onChangeText={(text) => setSearchText(text)}
      />
      <SubjectListComponent
        committeeIds={''}
        meetingId={meetingData.meetingId}
        meetingData={meetingData}
        deleted={false}
        searchText={searchText}
        isSubjectStatus={false}
        editable={meetingData?.yourRoleName == 'Member' ? false : true}
        searchFilterSubject={() => {}}
        setSearchText={setSearchText}
        socketEventUpdateMessage={socketEventUpdateMessage}
        isDecisionSubject={true}
        isApproveMeetingSubject={false}
      />
    </View>
  );
};

export default LiveMeetingDecisions;
