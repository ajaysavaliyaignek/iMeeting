import { View, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Voice from '@react-native-community/voice';

import { Icon, IconName } from '../../../component';
import { styles } from './styles';
import { SIZES } from '../../../themes/Sizes';
import { Button } from '../../../component/button/Button';
import { useNavigation } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import { GET_SUBJECT_BY_ID } from '../../../graphql/query';
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
      {/* <View style={styles.searchContainer}>
        <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
        <TextInput
          style={styles.textInput}
          placeholder={'Search subjects'}
          onChangeText={(text) => searchFilterSubject(text)}
        />
        <TouchableOpacity onPress={() => {}}>
          <Icon name={IconName.Speaker} height={SIZES[15]} width={SIZES[10]} />
        </TouchableOpacity>
      </View> */}
      {/* <Button
        title={'Add subject'}
        onPress={() =>
          navigation.navigate('AddSubject', {
            committee: item?.committeeId,
            isEdit: false,
            subjectDetails: null,
            screenName: 'Add subject',
            meetingName: item?.meetingTitle,
            meetingId: item?.meetingId
          })
        }
        layoutStyle={styles.cancelBtnLayout}
        textStyle={styles.txtCancelButton}
      /> */}
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
          navigation.navigate('LiveMeetingSubjectDetails', {
            item: items,
            meetingData: item
          });
        }}
        socketEventUpdateMessage={socketEventUpdateMessage}
      />
    </TouchableOpacity>
  );
};

export default Livemeetingsubjects;
