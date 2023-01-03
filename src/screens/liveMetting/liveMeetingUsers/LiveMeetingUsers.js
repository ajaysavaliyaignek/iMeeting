import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SIZES } from '../../../themes/Sizes';
import { Icon, IconName } from '../../../component';
import { Button } from '../../../component/button/Button';
import { styles } from './styles';
import { Divider } from 'react-native-paper';
import { Colors } from '../../../themes/Colors';
import UserDetailsComponent from '../../../component/userDetailsComponent/UserDetailsComponent';
import { useApolloClient, useQuery } from '@apollo/client';
import { GET_LIVE_MEETING_USERS } from '../../../graphql/query';
import { Fonts } from '../../../themes';
import { useNavigation } from '@react-navigation/native';
import Avatar from '../../../component/Avatar/Avatar';

const LiveMeetingUsers = ({ item, socketEventUpdateMessage }) => {
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState('');
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState('AllUsers');
  const [userData, setUserData] = useState(item.userDetails);
  const [speakerData, setSpeekerData] = useState([]);
  const [filterSpeakerData, setFilterSpeakerData] = useState([]);
  const client = useApolloClient();

  const getMeetingUser = useQuery(GET_LIVE_MEETING_USERS, {
    variables: {
      meetingId: item.meetingId,
      isSpeaker: true
    },
    onCompleted: (data) => {
      setSpeekerData(data.liveMeetingUsers.userDetails);
      setFilterSpeakerData(data.liveMeetingUsers.userDetails);
    }
  });

  const searchFilterUsers = (text) => {
    if (text) {
      const newData = filterSpeakerData?.filter((item) => {
        const itemData = item.userName ? item.userName : '';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });
      setSearchText(text);
      setSpeekerData(newData);
    } else {
      setSearchText(text);
      setSpeekerData(filterSpeakerData);
    }
  };

  useEffect(() => {
    if (socketEventUpdateMessage == 'Updated Speaker') {
      client.refetchQueries({
        include: ['liveMeetingUsers']
      });
    }
  }, [socketEventUpdateMessage]);

  let liveSpeaker = speakerData?.filter((speaker) => {
    if (speaker.status == 'Speaking') {
      return speaker;
    } else {
      return;
    }
  });

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
            meetingId={item.meetingId}
          />
          {liveSpeaker.length > 0 && (
            <View style={styles.activeSpeakerContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '40%'
                }}
              >
                <Avatar name={liveSpeaker[0]?.userName} size={SIZES[32]} />
                <View style={styles.nameContainer}>
                  <Text style={styles.txtName} numberOfLines={1}>
                    {liveSpeaker[0]?.userName}
                  </Text>
                  <Text style={styles.txtSpeaker}>Speaker</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.txtRunningTime}>
                  {liveSpeaker[0]?.speakingDuration} /{' '}
                  <Text style={styles.txtTimeDuration}>
                    {`${liveSpeaker[0]?.duration}:00`}
                  </Text>
                </Text>
                <View style={styles.iconView}>
                  <Icon
                    name={IconName.Arrow_Right}
                    height={SIZES[12]}
                    width={SIZES[6]}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      )}
      {/* <UserDetailsComponent users={item.userDetails} /> */}
    </TouchableOpacity>
  );
};

export default LiveMeetingUsers;
