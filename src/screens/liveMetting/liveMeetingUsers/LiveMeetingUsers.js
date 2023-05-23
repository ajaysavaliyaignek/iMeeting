import { View, TouchableOpacity, Modal, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import {
  useApolloClient,
  useLazyQuery,
  useMutation,
  useQuery
} from '@apollo/client';

import { SIZES } from '../../../themes/Sizes';
import { Button } from '../../../component/button/Button';
import { styles } from './styles';
import { Colors } from '../../../themes/Colors';
import UserDetailsComponent from '../../../component/userDetailsComponent/UserDetailsComponent';
import {
  GET_All_SUBJECTS,
  GET_LIVE_MEETING_USERS
} from '../../../graphql/query';
import { Fonts } from '../../../themes';
import SerachAndButtoncomponent from '../../../component/serachAndButtoncomponent/SerachAndButtoncomponent';
import SpeakerDetails from '../../../component/speakerDetails/SpeakerDetails';
import { PUBLISH_EVENTS } from '../../../graphql/mutation';
import { MultipleSelectList } from 'react-native-dropdown-select-list';

const LiveMeetingUsers = ({ item, socketEventUpdateMessage }) => {
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState('');
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState('AllUsers');
  const [userData, setUserData] = useState(item.userDetails);
  const [subjectData, setSubjectData] = useState([]);
  const [filterUserData, setFilterUserData] = useState(item.userDetails);
  const [speakerData, setSpeekerData] = useState([]);
  const [filterSpeakerData, setFilterSpeakerData] = useState([]);
  const [duration, setDuration] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const client = useApolloClient();

  const {
    loading: SubjectsLoading,
    error: SubjectsError,
    data: SubjectsData
  } = useQuery(GET_All_SUBJECTS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      committeeIds: '',
      searchValue: searchText,
      screen: 2,
      page: -1,
      pageSize: -1,
      meetingId: item.meetingId,
      isDraft: false,
      sort: ''
    },

    onCompleted: (data) => {
      let newData = data?.subjects.items.map((item) => {
        return { value: item.subjectTitle, key: item.subjectId };
      });
      console.log({ data: newData });
      setSubjectData(newData);
    },
    onError: (data) => {
      console.log('subjects error---', data.message);
    }
  });
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
    getSpeakerData({ meetingId: item.meetingId, isSpeaker: true });
  }, []);

  const navigateToEditSpeaker = (items) => {
    navigation.navigate('AddSpeaker', {
      meetingId: item.meetingId,
      activeScreen: 'EditSpeaker',
      speaker: items
    });
  };

  const [publishEvent, { loading }] = useMutation(PUBLISH_EVENTS, {
    refetchQueries: ['liveMeetingUsers'],
    onCompleted: (data) => {
      console.log({ data: data.publishEvent.status });
      if (data.publishEvent.status.statusCode == '200') {
        setOpenModal(false);
        setVisibleIndex(-1);
        alert('Publish successfully.');
      }
    },
    onError: (data) => {
      console.log('publish event error', data.message);
      alert('Something went wrong.');
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
      <SerachAndButtoncomponent
        isButtonShow={false}
        role={'Member'}
        onChangeText={(text) => {
          searchFilterUsers(text);
        }}
        value={searchText}
      />

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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: SIZES[24],
            paddingHorizontal: SIZES[16],
            justifyContent: 'space-between'
          }}
        >
          <Button
            title={'Add speaker'}
            layoutStyle={{
              backgroundColor: '#F3F6F9',
              width: '48%'

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
          <Button
            title={'Publish'}
            layoutStyle={{
              backgroundColor: Colors.primary,
              width: '48%'
              // marginVertical: SIZES[12]
            }}
            textStyle={{ ...Fonts.PoppinsSemiBold[14], color: Colors.white }}
            onPress={() => {
              setOpenModal(true);
            }}
          />
        </View>
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
           
            onPressPublish={(ite) => {
             
              publishEvent({
                variables: {
                  meeting: {
                    availableId: [ite.subjectId],
                    type: 22,
                    meetingId: item.meetingId,
                    subjectIds: []
                  }
                }
              });
            }}
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={openModal}
        onRequestClose={() => {
          setOpenModal(!openModal);
        }}
      >
        <View style={styles.modal}>
          <View style={[styles.mainBoxView]}>
            <Text style={styles.txtTitle}>Publish Speaker</Text>
            <MultipleSelectList
              maxHeight={200}
              search={false}
              checkBoxStyles={{ height: 20, width: 20 }}
              setSelected={(val) => {
                setSelectedSubjects(val);
              }}
              data={subjectData}
              save="key"
              onSelect={() => {}}
              label="Subjects"
              dropdownTextStyles={{
                ...Fonts.PoppinsRegular[14],
                color: Colors.bold
              }}
            />

            <View style={styles.buttonContainer}>
              <Button
                title={'Cancel'}
                onPress={() => {
                  setOpenModal(false);
                  setSelectedSubjects([]);
                }}
                layoutStyle={[
                  styles.cancelBtnLayout,
                  { marginVertical: SIZES[12], width: '48%' }
                ]}
                textStyle={styles.txtCancelButton}
              />
              <Button
                title={'Save'}
                isLoading={loading}
                onPress={() => {
                  console.log({ selectedSubjects });
                  publishEvent({
                    variables: {
                      meeting: {
                        availableId: [],
                        type: 22,
                        meetingId: item.meetingId,
                        subjectIds: selectedSubjects
                      }
                    }
                  });
                }}
                layoutStyle={[styles.nextBtnLayout]}
                textStyle={styles.txtNextBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
      {/* <UserDetailsComponent users={item.userDetails} /> */}
    </TouchableOpacity>
  );
};

export default LiveMeetingUsers;
