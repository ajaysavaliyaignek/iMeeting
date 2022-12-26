import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Divider, Switch } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@apollo/client';

import SubjectsCard from '../../../component/Cards/subjectCard/SubjectsCard';
import { SIZES } from '../../../themes/Sizes';
import { Button } from '../../../component/button/Button';
import { GET_All_MEETING, GET_All_SUBJECTS } from '../../../graphql/query';
import { Icon, IconName } from '../../../component';
import { Colors } from '../../../themes/Colors';
import Loader from '../../../component/Loader/Loader';
import { styles } from './styles';
import { Fonts } from '../../../themes';
import { UserContext } from '../../../context';
import MeetingsCard from '../../../component/Cards/meetingCard/MeetingdCard';
import SubjectListComponent from '../../../component/detailsComponent/subjectsListComponent/SubjectListComponent';

const DetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { title, active } = route?.params;
  const [activeTab, setActiveTab] = useState(active);
  const [headerTitle, setHeaderTitle] = useState(title);
  const [search, setSearch] = useState(false);
  const [onlyMyMeetings, setOnlyMyMeetings] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [meetingData, setMeetingData] = useState([]);
  const [filterMeetingData, setFilterMeetingData] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [committeeId, setCommitteeId] = useState('');
  const [committeeName, setCommitteeName] = useState('');
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const { setSelectedUsers, setMeetingsData, setSelectedSubjects } =
    useContext(UserContext);
  console.log('commiteee', committee);

  useEffect(() => {
    const committeeId = committee?.map((com) => {
      return com.organizationId;
    });
    const committeeName = committee?.map((com) => {
      return com.committeeTitle;
    });
    setCommitteeId(committeeId?.join());
    setCommitteeName(committeeName?.join());
  }, [committee]);

  // get ALL MEETINGS
  const {
    loading: loadingGetMeetings,
    error: errorGetMeetings,
    data: dataGetMeetings
  } = useQuery(GET_All_MEETING, {
    // fetchPolicy: 'no-cache',
    variables: {
      onlyMyMeeting: onlyMyMeetings,
      committeeIds: committeeId,
      screen: 0,
      searchValue: searchText,
      page: -1,
      pageSize: -1
    },
    onCompleted: (data) => {
      if (data) {
        setFilterMeetingData(data?.meetings.items);

        setMeetingData(data?.meetings.items);
      }
    },
    onError: (data) => {
      console.log('GetMeetings error---', data.message);
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => setVisibleIndex(-1)}
        activeOpacity={1}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              height: SIZES[24],
              width: SIZES[24],
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon
              name={IconName.Arrow_Left}
              height={SIZES[14]}
              width={SIZES[14]}
            />
          </TouchableOpacity>
          <Text style={styles.txtHeader}>{headerTitle}</Text>
          <View style={styles.headeRightView}>
            <TouchableOpacity
              style={styles.searchIconView}
              onPress={() => setSearch(!search)}
            >
              <Icon
                name={IconName.Search}
                height={SIZES[18]}
                width={SIZES[18]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (activeTab === '0') {
                  setSelectedUsers([]);
                  setMeetingsData([]);
                  setSelectedSubjects([]);
                  navigation.navigate(
                    'AddEditMeetingAppointmentVideoConference',
                    {
                      screenName: 'Add meeting',
                      type: 'Meeting',
                      screensArray: [
                        'general',
                        'users',
                        'dateandtime',
                        'location',
                        'subjects'
                      ],
                      isEdit: false,
                      details: null
                    }
                  );
                } else if (activeTab === '1') {
                  navigation.navigate('AddSubject', {
                    committee: null,
                    isEdit: false,
                    subjectDetails: null,
                    screenName: 'Add subject'
                  });
                }
              }}
              activeOpacity={0.5}
              style={{
                height: SIZES[24],
                width: SIZES[24],
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon name={IconName.Plus} height={SIZES[14]} width={SIZES[14]} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.subContainer}>
          {search ? (
            <View>
              <View style={styles.searchRowContainer}>
                <Icon
                  name={IconName.Search}
                  height={SIZES[12]}
                  width={SIZES[12]}
                />
                <TextInput
                  style={{ flex: 1, marginLeft: SIZES[6] }}
                  onChangeText={(text) => {
                    activeTab === '0'
                      ? setSearchText(text)
                      : activeTab === '1'
                      ? setSearchText(text)
                      : null;
                  }}
                  value={searchText}
                  placeholder={
                    activeTab === '0'
                      ? 'Search meeting'
                      : activeTab === '1'
                      ? 'Search subject'
                      : ''
                  }
                />
                <TouchableOpacity
                  onPress={() => {
                    setSearchText('');
                    setFilterData(subjectData);
                    setFilterMeetingData(meetingData);
                  }}
                >
                  <Icon
                    name={IconName.Close}
                    height={SIZES[8]}
                    width={SIZES[8]}
                  />
                </TouchableOpacity>
              </View>
              <Divider style={styles.divider} />
            </View>
          ) : (
            <View>
              {/* committes */}
              <TouchableOpacity
                style={styles.committeeView}
                activeOpacity={0.5}
                onPress={() => {
                  if (activeTab === '0') {
                    navigation.navigate('Committee', {
                      Data: filterMeetingData,
                      activeTab: '0',
                      setCommittee: setCommittee,
                      committee: committee
                    });
                  } else if (activeTab === '1') {
                    navigation.navigate('Committee', {
                      Data: filterData,
                      activeTab: '1',
                      setCommittee: setCommittee,
                      committee: committee
                    });
                  }
                  // navigation.navigate('Committee');
                }}
              >
                <Text style={styles.txtCommittee}>Committee</Text>
                <View
                  style={[
                    styles.btnCommittees,
                    {
                      width:
                        committee.length == 1
                          ? null
                          : committee.length > 2
                          ? '77%'
                          : null
                    }
                  ]}
                >
                  <Text style={styles.txtBtnCommittees} numberOfLines={1}>
                    {committeeName !== '' ? committeeName : 'All'}
                  </Text>
                  <Icon
                    name={IconName.Arrow_Right}
                    height={SIZES[12]}
                    width={SIZES[6]}
                  />
                </View>
              </TouchableOpacity>

              <Divider style={[styles.divider, { marginLeft: SIZES[16] }]} />
              <View style={styles.btnContainer}>
                <Button
                  title={'Meetings'}
                  layoutStyle={[
                    styles.btnServices,
                    {
                      backgroundColor:
                        activeTab === '0' ? Colors.white : 'transparent'
                    }
                  ]}
                  textStyle={styles.txtBtnServices}
                  onPress={() => {
                    setActiveTab('0');
                    setHeaderTitle('Meetings');
                  }}
                />

                <Button
                  title={'Subjects'}
                  layoutStyle={[
                    styles.btnServices,
                    {
                      backgroundColor:
                        activeTab === '1' ? Colors.white : 'transparent'
                    }
                  ]}
                  textStyle={styles.txtBtnServices}
                  onPress={() => {
                    setActiveTab('1');
                    setHeaderTitle('Subjects');
                  }}
                />
                <Button
                  title={'Delegations'}
                  layoutStyle={[
                    styles.btnServices,
                    {
                      backgroundColor:
                        activeTab === '2' ? Colors.white : 'transparent'
                    }
                  ]}
                  textStyle={styles.txtBtnServices}
                  onPress={() => {
                    setActiveTab('2');
                    setHeaderTitle('Delegations');
                  }}
                />
              </View>
              <Divider style={styles.divider} />
            </View>
          )}

          {/* meetings list */}

          {activeTab === '0' && (
            <View style={{ flex: 1 }}>
              <View style={styles.switchContainer}>
                <Text style={styles.txtSwitchLabel}>Only my meetings</Text>
                <Switch
                  color={Colors.switch}
                  value={onlyMyMeetings}
                  onChange={() => setOnlyMyMeetings(!onlyMyMeetings)}
                />
              </View>
              <Divider style={styles.divider} />
              {loadingGetMeetings ? (
                <Loader color={Colors.primary} />
              ) : errorGetMeetings ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text
                    style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}
                  >
                    {errorGetMeetings.message}
                  </Text>
                </View>
              ) : filterMeetingData.length > 0 ? (
                <FlatList
                  data={
                    // meetingsData
                    filterMeetingData
                  }
                  keyExtractor={(item, index) => {
                    return index.toString();
                  }}
                  renderItem={({ item, index }) => (
                    <MeetingsCard
                      item={item}
                      index={index}
                      text={searchText}
                      visibleIndex={visibleIndex}
                      setVisibleIndex={setVisibleIndex}
                    />
                  )}
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text
                    style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}
                  >
                    No meetings found
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* subjects list */}

          {activeTab === '1' && (
            <SubjectListComponent
              meetingId={null}
              committeeIds={committeeId}
              searchText={searchText}
              isSubjectStatus={true}
              deleted={true}
              download={true}
              editable={true}
            />
          )}
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DetailsScreen;
