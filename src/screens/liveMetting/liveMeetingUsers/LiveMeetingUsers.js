import { View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useApolloClient, useLazyQuery, useQuery } from '@apollo/client';

import { SIZES } from '../../../themes/Sizes';
import { Button } from '../../../component/button/Button';
import { styles } from './styles';
import { Colors } from '../../../themes/Colors';
import UserDetailsComponent from '../../../component/userDetailsComponent/UserDetailsComponent';
import { GET_LIVE_MEETING_USERS } from '../../../graphql/query';
import { Fonts } from '../../../themes';
import SerachAndButtoncomponent from '../../../component/serachAndButtoncomponent/SerachAndButtoncomponent';
import SpeakerDetails from '../../../component/speakerDetails/SpeakerDetails';

const LiveMeetingUsers = ({ item, socketEventUpdateMessage }) => {
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState('');
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState('AllUsers');
  const [userData, setUserData] = useState(item.userDetails);
  const [filterUserData, setFilterUserData] = useState(item.userDetails);
  const [speakerData, setSpeekerData] = useState([]);
  const [filterSpeakerData, setFilterSpeakerData] = useState([]);
  const [duration, setDuration] = useState('');
  const client = useApolloClient();

  const [getSpeakerData, getMeetingUser] = useLazyQuery(
    GET_LIVE_MEETING_USERS,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        meetingId: item.meetingId,
        isSpeaker: true
      },
      onCompleted: (data) => {
        setSpeekerData(data.liveMeetingUsers.userDetails);
        setFilterSpeakerData(data.liveMeetingUsers.userDetails);
      },
      onError: (data) => {
        console.log('GET_LIVE_MEETING_USERS error', data.message);
      }
    }
  );

  const searchFilterUsers = (text) => {
    if (text) {
      const newData = (filterSpeakerData || filterUserData)?.filter((item) => {
        const itemData = item.userName ? item.userName : '';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });
      setSearchText(text);
      setSpeekerData(newData);
      setUserData(newData);
    } else {
      setSearchText(text);
      setSpeekerData(filterSpeakerData);
      setUserData(filterUserData);
    }
  };

  useEffect(() => {
    if (socketEventUpdateMessage == 'liveMeetingUsers') {
      client.refetchQueries({
        include: ['liveMeetingUsers']
      });
    }
  }, [socketEventUpdateMessage]);

  useEffect(() => {
    // const interval = setInterval(() => {
    getSpeakerData({ meetingId: item.meetingId, isSpeaker: true });
    // }, 1000);
    // setDuration(liveSpeaker[0]?.speakingDuration);
    // return () => clearInterval(interval);
  }, []);

  const navigateToEditSpeaker = (items) => {
    navigation.navigate('AddSpeaker', {
      meetingId: item.meetingId,
      activeScreen: 'EditSpeaker',
      speaker: items
    });
  };
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setVisibleIndex(-1);
      }}
      activeOpacity={1}
    >
      <SerachAndButtoncomponent
        isButtonShow={false}
        role={'Member'}
        onChangeText={(text) => {
          searchFilterUsers(text);
        }}
        value={searchText}
      />
      {/* <View style={styles.searchContainer}>
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
      </View> */}
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
      {activeTab == 'Speaker' && item?.yourRoleName !== 'Member' && (
        <Button
          title={'Add speaker'}
          layoutStyle={{
            backgroundColor: '#F3F6F9',
            marginBottom: SIZES[24],
            marginHorizontal: SIZES[16]
            // marginVertical: SIZES[12]
          }}
          textStyle={{ ...Fonts.PoppinsSemiBold[14], color: Colors.primary }}
          onPress={() => {
            navigation.navigate('AddSpeaker', {
              meetingId: item.meetingId,
              activeScreen: 'AddSpeaker',
              speaker: null
            });
          }}
        />
      )}
      <Divider style={styles.divider} />
      {activeTab == 'AllUsers' && (
        <UserDetailsComponent
          users={userData}
          isGeneralUser={true}
          openPopup={false}
          visibleIndex={visibleIndex}
          setVisibleIndex={setVisibleIndex}
          searchText={searchText}
        />
      )}
      {activeTab == 'Speaker' && (
        <View style={{ flex: 1 }}>
          <UserDetailsComponent
            users={speakerData}
            isSpeaker={true}
            openPopup={item?.yourRoleName !== 'Member' ? true : false}
            visibleIndex={visibleIndex}
            setVisibleIndex={setVisibleIndex}
            searchText={searchText}
            editable={true}
            onPressEdit={navigateToEditSpeaker}
            meetingData={item}
          />
          {
            <SpeakerDetails
              speakerData={speakerData}
              getSpeakerData={getSpeakerData}
              item={item}
            />
          }
        </View>
      )}
      {/* <UserDetailsComponent users={item.userDetails} /> */}
    </TouchableOpacity>
  );
};

export default LiveMeetingUsers;
