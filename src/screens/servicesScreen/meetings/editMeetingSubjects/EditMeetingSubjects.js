import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList
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
import AddSubjectsCard from '../addMeetingSubjects/AddSubjectsCard';

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
  console.log('meeting data from add meeting subjects', {
    item,
    meetingsData
  });

  console.log('selected subjects from add meeting subjects', selectedSubjects);
  const [calendarValue, setCalendarValue] = useState('5-11 September');
  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState(selectedSubjects);
  const [subjectsId, setSubjectsId] = useState([]);
  const [subject, setSubject] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [openIndex, setOpenIndex] = useState(-1);
  const [selectSubjects, setSelectedSubjects] = useState([]);
  const [previosSubjects, setPreviosSubjects] = useState([]);
  const [backUpUser, setBackupUser] = useState([]);
  let subjects = [];

  item?.subjectIds?.map((id) => {
    const { loading, error } = useQuery(GET_SUBJECT_BY_ID, {
      variables: {
        subjectId: id
      },
      onCompleted: (data) => {
        console.log('subject by id from subjects', data);
        if (data) {
          setSubject((prev) => {
            const pevDaa = prev.filter((ite) => {
              return ite.subjectId !== data.subject.subjectId;
            });
            return [...pevDaa, data.subject];
          });
          setPreviosSubjects((prev) => {
            const pevDaa = prev.filter((ite) => {
              return ite.subjectId !== data.subject.subjectId;
            });
            return [...pevDaa, data.subject];
          });
          setBackupUser((prev) => {
            const pevDaa = prev.filter((ite) => {
              return ite.subjectId !== data.subject.subjectId;
            });
            return [...pevDaa, data.subject];
          });
        }
      }
    });
    if (error) {
      console.log('file error', error);
    }
  });

  const onUpdateSelection = (items) => {
    let newUsers = [];

    items?.map((subject) => {
      let indexPreviousUser =
        previosSubjects?.length > 0
          ? previosSubjects?.findIndex(
              (obj) => obj.subjectId === subject?.subjectId
            )
          : -1;
      if (indexPreviousUser === -1) {
        let index =
          backUpUser?.length > 0
            ? backUpUser?.findIndex(
                (obj) => obj.subjectId === subject.subjectId
              )
            : -1;
        if (index == -1) {
          newUsers.push(JSON.parse(JSON.stringify(subject)));
        } else {
          newUsers.push(JSON.parse(JSON.stringify(backUpUser[index])));
        }
      } else {
        newUsers.push(
          JSON.parse(JSON.stringify(previosSubjects[indexPreviousUser]))
        );

        // newUsers.push(previousUser[indexPreviousUser]);
      }
    });

    setPreviosSubjects(newUsers);
    setFilterData(newUsers);
  };

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStartHandler = (e) => {
    console.log('startHandler', e);
  };

  const onSpeechEndHandler = (e) => {
    console.log('onSpeechEndHandler', e);
  };

  const onSpeechResultsHandler = (e) => {
    console.log('onSpeechResultsHandler', e);
    let text = e.value[0];
    setSearchText(text);
  };
  const startRecording = async () => {
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.log('voice error', error);
    }
  };

  // get ALL SUBJECTS
  const {
    loading: SubjectsLoading,
    error: SubjectsError,
    data: SubjectsData
  } = useQuery(GET_All_SUBJECTS, {
    variables: {
      searchValue: searchText,
      screen: 1,
      committeeId: meetingsData?.committee
    },

    onCompleted: (data) => {
      setFilterData(data?.subjects.items);
      console.log(data.subjects.items, 'commiitee by id');
      setSubjectData(data?.subjects.items);
    }
  });

  if (SubjectsError) {
    console.log('subjects error---', SubjectsError);
  }

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
      }
    ],
    onCompleted: (data) => {
      console.log('addmeeting data', data.updateMeeting);
      if (data.updateMeeting.status[0].statusCode == '200') {
        setSelectedUsers([]);
        setMeetingsData([]);
        setSelectedSubjects([]);

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

  useEffect(() => {
    console.log('pre data', previosSubjects);

    subjects = previosSubjects?.map((item) => item.subjectId);
    console.log('userId', subjects);
  }, [previosSubjects]);

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
            />
            <TouchableOpacity onPress={() => startRecording()}>
              <Icon
                name={IconName.Speaker}
                height={SIZES[15]}
                width={SIZES[10]}
              />
            </TouchableOpacity>
          </View>
          <Divider style={styles.divider} />

          <ScrollView showsVerticalScrollIndicator={false}>
            <FlatList
              data={previosSubjects}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              renderItem={({ item, index }) => {
                return (
                  <AddSubjectsCard
                    item={item}
                    searchText={searchText}
                    index={index}
                    visibleIndex={visibleIndex}
                    setVisibleIndex={setVisibleIndex}
                    openIndex={openIndex}
                    setOpenIndex={setOpenIndex}
                    deleted={true}
                  />
                );
              }}
            />

            <View style={styles.deadlineContainer}>
              <Text style={styles.txtTitle}>DEADLINE SUGGESTING</Text>
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
                    setSelectedSubjects: setSelectedSubjects,
                    onUpdateSelection: onUpdateSelection,
                    previosSubjects: previosSubjects
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
                      platformlink: meetingsData.platform.platformlink,
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
