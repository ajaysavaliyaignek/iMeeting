import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import { SIZES } from '../../../themes/Sizes';
import { Icon, IconName } from '../../../component';
import { Button } from '../../../component/button/Button';
import { styles } from './styles';
import { Divider } from 'react-native-paper';
import { Colors } from '../../../themes/Colors';
import UserDetailsComponent from '../../../component/userDetailsComponent/UserDetailsComponent';
import { useQuery } from '@apollo/client';
import { GET_LIVE_MEETING_USERS } from '../../../graphql/query';

const LiveMeetingUsers = ({ item }) => {
  console.log('item from LM Users', item);
  const [searchText, setSearchText] = useState('');
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState('AllUsers');
  const [filterData, setFilterData] = useState(item.userDetails);
  const [userData, setUserData] = useState(item.userDetails);

  const searchFilterUsers = (text) => {
    console.log('text', text);
    if (text) {
      const newData = filterData?.filter((item) => {
        const itemData = item.userName ? item.userName : '';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });
      setSearchText(text);
      setUserData(newData);
    } else {
      setSearchText(text);
      setUserData(filterData);
    }
  };

  const getMeetingUser = useQuery(GET_LIVE_MEETING_USERS, {
    variables: {
      meetingId: item.meetingId,
      isSpeaker: true
    },
    onCompleted: (data) => {
      console.log('is speaker data', data.liveMeetingUsers.userDetails);
    }
  });
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setVisibleIndex(-1);
      }}
      activeOpacity={1}
    >
      <View style={styles.searchContainer}>
        <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
        <TextInput
          style={styles.textInput}
          value={searchText}
          placeholder={'Search users'}
          onChangeText={(text) => searchFilterUsers(text)}
        />
        <TouchableOpacity onPress={() => startRecording()}>
          <Icon name={IconName.Speaker} height={SIZES[15]} width={SIZES[10]} />
        </TouchableOpacity>
      </View>
      <View style={styles.btnContainer}>
        <Button
          title={'All'}
          layoutStyle={[
            styles.btnServices,
            {
              backgroundColor:
                activeTab === 'AllUsers' ? Colors.white : 'transparent'
            }
          ]}
          textStyle={styles.txtBtnServices}
          onPress={() => {
            setActiveTab('AllUsers');
          }}
        />

        <Button
          title={'Speaker'}
          layoutStyle={[
            styles.btnServices,
            {
              backgroundColor:
                activeTab == 'Speaker' ? Colors.white : 'transparent'
            }
          ]}
          textStyle={styles.txtBtnServices}
          onPress={() => {
            setActiveTab('Speaker');
          }}
        />
      </View>
      <Divider style={styles.divider} />
      {activeTab == 'AllUsers' && (
        <UserDetailsComponent
          users={userData}
          isGeneralUser={true}
          openPopup={true}
          visibleIndex={visibleIndex}
          setVisibleIndex={setVisibleIndex}
          searchText={searchText}
        />
      )}
      {activeTab == 'Speaker' && (
        <UserDetailsComponent
          users={userData}
          isSpeaker={true}
          openPopup={true}
          visibleIndex={visibleIndex}
          setVisibleIndex={setVisibleIndex}
          searchText={searchText}
        />
      )}
      {/* <UserDetailsComponent users={item.userDetails} /> */}
    </TouchableOpacity>
  );
};

export default LiveMeetingUsers;
