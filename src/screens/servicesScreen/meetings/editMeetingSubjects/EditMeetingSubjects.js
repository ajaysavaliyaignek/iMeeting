import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import * as Progress from 'react-native-progress';
import DeviceInfo from 'react-native-device-info';
import { useNavigation, useRoute } from '@react-navigation/native';
import Voice from '@react-native-community/voice';

import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { styles } from './styles';
import { SIZES } from '../../../../themes/Sizes';
import { Divider } from 'react-native-paper';
import { Button } from '../../../../component/button/Button';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_All_MEETING,
  GET_All_SUBJECTS,
  GET_MEETING_BY_ID,
  GET_SUBJECT_BY_ID
} from '../../../../graphql/query';
import { UPDATE_MEETING } from '../../../../graphql/mutation';
import { UserContext } from '../../../../context';
import { Fonts } from '../../../../themes';

const EditMeetingSubjects = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    selectedSubjects,
    setSelectedUsers,
    meetingsData,
    setMeetingsData
    // setSelectedSubjects
  } = useContext(UserContext);
  const { item } = route?.params;

  const [calendarValue, setCalendarValue] = useState(item.suggestedTime);
  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [subjectsId, setSubjectsId] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [viewIndex, setViewIndex] = useState(-1);
  const [openIndex, setOpenIndex] = useState(-1);
  const [selectSubjects, setSelectedSubjects] = useState([]);
  const [previosSubjects, setPreviosSubjects] = useState([]);
  const [backUpSubject, setBackUpSubject] = useState([]);
  let subjects = [];

  const {
    loading: SubjectsLoading,
    error: SubjectsError,
    data: SubjectsData
  } = useQuery(GET_All_SUBJECTS, {
    variables: {
      committeeIds: '',
      searchValue: searchText,
      screen: 0,
      page: -1,
      pageSize: -1,
      meetingId: item.meetingId
    },

    onCompleted: (data) => {
      console.log('meeting selected subjects', data.subjects.items);
      let subjectData = [];
      data.subjects.items?.map((subject) => {
        backUpSubject.push(JSON.parse(JSON.stringify(subject)));
        subjectData.push(JSON.parse(JSON.stringify(subject)));
      });
      // backUpSubject = subjectData;
      setPreviosSubjects(subjectData);
      setFilterData(subjectData);
      setBackUpSubject(subjectData);
    }
  });

  if (SubjectsError) {
    console.log('subjects error---', SubjectsError);
  }

  // get meeting by id
  const {
    loading: MeetingLoading,
    error: MeetingError,
    data: MeetingData
  } = useQuery(GET_MEETING_BY_ID, {
    variables: {
      meetingId: item.meetingId
    },

    onCompleted: (data) => {
      console.log('meeting by id', data);
      setCalendarValue(data.meeting.deadlineDate);
    }
  });

  if (MeetingError) {
    console.log('subjects error---', MeetingError);
  }

  const onUpdateSelection = (items) => {
    let newSubjects = [];
    console.log('new added subjects', items);
    console.log('previous subject', previosSubjects);
    console.log('backup subject', backUpSubject);

    setSelectedSubjects(items);
    setFilterData(items);
  };

  // edit meeting mutation
  const [addMeeting, { data, loading, error }] = useMutation(UPDATE_MEETING, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: [
      {
        query: GET_All_MEETING,
        variables: {
          onlyMyMeeting: false,
          committeeIds: '',
          screen: 0,
          searchValue: '',
          page: -1,
          pageSize: -1
        }
      },
      {
        query: GET_MEETING_BY_ID,
        variables: {
          meetingId: item?.meetingId
        }
      },
      {
        query: GET_All_SUBJECTS,
        variables: {
          committeeIds: '',
          searchValue: '',
          screen: 0,
          page: -1,
          pageSize: -1,
          meetingId: item?.meetingId
        }
      },
      {
        query: GET_All_SUBJECTS,
        variables: {
          searchValue: '',
          screen: 1,
          committeeIds: `${meetingsData?.committee}`
        }
      }
    ],
    onCompleted: (data) => {
      if (data.updateMeeting.status.statusCode == '200') {
        setSelectedUsers([]);
        setMeetingsData([]);

        navigation.navigate('Details', {
          title: 'Meetings',
          active: '0'
        });
      }
    },
    onError: (data) => {
      console.log('addmeeting data', data.message);
    }
  });

  subjects = previosSubjects?.map((item) => item.subjectId);
  selectSubjects?.map((item) => {
    subjects.push(item.subjectId);
  });
  console.log('userId', subjects);

  // delete subject from selected subject
  const onDeletehandler = (item) => {
    Alert.alert('Remove subject', 'Are you sure you want to remove this?', [
      {
        text: 'Delete',
        onPress: () => {
          const filterData = previosSubjects.filter(
            (subject) => subject?.subjectId !== item.subjectId
          );
          setPreviosSubjects(filterData);
          const filterNewData = selectSubjects.filter(
            (subject) => subject?.subjectId !== item.subjectId
          );
          setSelectedSubjects(filterNewData);
        },
        style: 'destructive'
      },
      {
        text: 'Cancel',
        // onPress: () => navigation.navigate("Login"),
        style: 'cancel'
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setVisibleIndex(-1)}
        style={{ flex: 1 }}
      >
        <Header
          name={'Edit meeting'}
          rightIconName={IconName.Close}
          onRightPress={() => {
            navigation.navigate('Details', {
              title: 'Meetings',
              active: '0'
            });
          }}
        />
        <View style={styles.subContainer}>
          <View style={styles.progressContainer}>
            <Progress.Bar
              color={Colors.switch}
              progress={1}
              borderColor={Colors.white}
              unfilledColor={'#e6e7e9'}
              width={DeviceInfo.isTablet() ? 800 : 264}
            />
            <Text style={styles.txtProgress}>Step 5/5</Text>
          </View>
          <Text style={styles.txtAddSubjectTitle}>Subjects</Text>

          <View style={styles.searchContainer}>
            <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
            <TextInput
              style={styles.textInput}
              placeholder={'Search'}
              onChangeText={(text) => setSearchText(text)}
              value={searchText}
            />
            <TouchableOpacity>
              <Icon
                name={IconName.Speaker}
                height={SIZES[15]}
                width={SIZES[10]}
              />
            </TouchableOpacity>
          </View>
          <Divider style={styles.divider} />

          <ScrollView>
            {/* for existing subject list */}
            {previosSubjects?.map((subject, index) => {
              return (
                <AddSubjectsCard
                  item={subject}
                  searchText={searchText}
                  index={index}
                  visibleIndex={visibleIndex}
                  setVisibleIndex={setVisibleIndex}
                  openIndex={openIndex}
                  setOpenIndex={setOpenIndex}
                  deleted={true}
                  onDeletehandler={onDeletehandler}
                  isPreviousSubject={true}
                />
              );
            })}

            {/* for new selected subjects list */}
            {selectSubjects?.map((subject, index) => {
              return (
                <AddSubjectsCard
                  item={subject}
                  searchText={searchText}
                  index={index}
                  visibleIndex={viewIndex}
                  setVisibleIndex={setViewIndex}
                  openIndex={openIndex}
                  setOpenIndex={setOpenIndex}
                  deleted={true}
                  onDeletehandler={onDeletehandler}
                  isNewSubject={true}
                />
              );
            })}
            {previosSubjects.length <= 0 ||
              (selectSubjects.length <= 0 && (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: SIZES[16]
                  }}
                >
                  <Text
                    style={{
                      ...Fonts.PoppinsSemiBold[14],
                      color: Colors.primary
                    }}
                  >
                    No Selected Subjects
                  </Text>
                </View>
              ))}

            <View style={styles.deadlineContainer}>
              <Text style={styles.txtTitle}>RECIEVING SUBJECTS DEADLINE</Text>
              <TouchableOpacity
                style={styles.deadlineRowContainer}
                onPress={() =>
                  navigation.navigate('DeadlineSuggestion', {
                    setCalendarValue: setCalendarValue
                  })
                }
              >
                <TextInput value={calendarValue} editable={false} />
                <Icon
                  name={IconName.Calendar}
                  width={SIZES[18]}
                  height={SIZES[20]}
                />
              </TouchableOpacity>

              <Divider style={styles.divider} />
              <Button
                title={'Select subjects'}
                layoutStyle={styles.selectsubjectBtnLayout}
                textStyle={styles.txtCancelButton}
                onPress={() =>
                  navigation.navigate('SelectSubjects', {
                    committee: meetingsData?.committee,
                    onUpdateSelection: onUpdateSelection,
                    previosSubjects: selectSubjects
                  })
                }
              />
            </View>
          </ScrollView>
        </View>
        <View
          style={{
            backgroundColor: Colors.white,
            justifyContent: 'flex-end',
            zIndex: 0
          }}
        >
          {/* Divider */}
          <Divider style={styles.divider} />
          <View
            style={[styles.buttonContainer, { paddingHorizontal: SIZES[16] }]}
          >
            <Button
              title={'Back'}
              onPress={() => {
                navigation.goBack();
                setMeetingsData({
                  ...meetingsData,
                  subjectid: subjectsId,
                  deadlineDate: calendarValue
                });
              }}
              layoutStyle={styles.cancelBtnLayout}
              textStyle={styles.txtCancelButton}
            />
            <Button
              title={'Submit'}
              onPress={() => {
                console.log('edit meeting data');
                addMeeting({
                  variables: {
                    meeting: {
                      attachFileIds: meetingsData.attachFiles,
                      committeeId: meetingsData.committee,
                      creatorName: '',
                      description: meetingsData.discription,
                      endDate: meetingsData.endDate,
                      endTime: meetingsData.endTime,
                      locationId: meetingsData.location,
                      meetingId: item.meetingId,
                      meetingTitle: meetingsData.title,

                      platformId:
                        meetingsData.videoConference !== null
                          ? meetingsData.videoConference
                          : 0,
                      repeat: 0,
                      repeatName: meetingsData.Repeat,
                      required: meetingsData.userRequired,
                      setDate: meetingsData.startDate,
                      setTime: meetingsData.startTime,
                      subjectIds: subjects,
                      timeZone: meetingsData.TimeZone,
                      userIds: meetingsData.users,

                      meetingStatusId: 0,
                      deadlineDate: calendarValue
                    }
                  }
                });
              }}
              layoutStyle={[
                // {
                //     opacity: title === "" || discription === "" ? 0.5 : null,
                // },
                styles.nextBtnLayout
              ]}
              textStyle={styles.txtNextBtn}
            />
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EditMeetingSubjects;
