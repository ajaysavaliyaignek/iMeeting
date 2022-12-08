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
import moment from 'moment';
import { useMutation } from '@apollo/client';
import { Divider } from 'react-native-paper';

import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { styles } from './styles';
import { SIZES } from '../../../../themes/Sizes';
import { Button } from '../../../../component/button/Button';
import AddSubjectsCard from './AddSubjectsCard';
import { GET_All_MEETING } from '../../../../graphql/query';
import { UPDATE_MEETING } from '../../../../graphql/mutation';
import { UserContext } from '../../../../context';
import Loader from '../../../../component/Loader/Loader';

const AddMeetingSubjects = () => {
  const navigation = useNavigation();

  const { selectedSubjects, setSelectedUsers, meetingsData, setMeetingsData } =
    useContext(UserContext);

  console.log('meetingsData', meetingsData);

  const [calendarValue, setCalendarValue] = useState(
    meetingsData?.deadlineDate
      ? meetingsData?.deadlineDate
      : moment(new Date()).format('YYYY-MM-DD')
  );
  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState(selectedSubjects);
  const [subjectsId, setSubjectsId] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [openIndex, setOpenIndex] = useState(-1);

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

  useEffect(() => {
    const userId = selectedSubjects?.map((item) => {
      return item.subjectId;
    });
    setSubjectsId(userId);
    setFilterData(selectedSubjects);
  }, [selectedSubjects]);
  console.log('suvjectid', subjectsId);

  const searchFilterSubject = (text) => {
    if (text) {
      const newData = selectedSubjects?.filter((item) => {
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

  const [addMeeting, { data, loading: addMeetingLoading, error }] = useMutation(
    UPDATE_MEETING,
    {
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
        }
      ],
      onCompleted: (data) => {
        console.log('addmeeting data', data.updateMeeting);
        if (data.updateMeeting.status[0].statusCode == '200') {
          setSelectedUsers([]);
          setMeetingsData([]);
          navigation.navigate('Details', {
            title: 'Meetings',
            active: '0'
          });
        }
      },
      onError: (data) => {
        console.log('addmeeting error--', data.message);
      }
    }
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Add meeting'}
        rightIconName={IconName.Close}
        onRightPress={() =>
          navigation.navigate('Details', {
            title: 'Meetings',
            active: '0'
          })
        }
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
            onChangeText={(text) => searchFilterSubject(text)}
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

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {filterData.length > 0 ? (
            filterData?.map((subjects, index) => {
              return (
                <AddSubjectsCard
                  item={subjects}
                  searchText={searchText}
                  index={index}
                  visibleIndex={visibleIndex}
                  setVisibleIndex={setVisibleIndex}
                  openIndex={openIndex}
                  setOpenIndex={setOpenIndex}
                  subjectsId={subjectsId}
                  deleted={true}
                />
              );
            })
          ) : (
            <View>
              <Text>No subjects found</Text>
            </View>
          )}

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
                  committee: meetingsData.committee
                })
              }
            />
          </View>
        </ScrollView>
      </View>
      {addMeetingLoading ? (
        <Loader />
      ) : (
        <View
          style={{
            backgroundColor: Colors.white,
            justifyContent: 'flex-end'
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
                console.log('add meeting data', {
                  attachFileIds: meetingsData.attachFiles,
                  committeeId: meetingsData.committee,
                  creatorName: '',
                  description: meetingsData.discription,
                  endDate: meetingsData.endDate,
                  endTime: meetingsData.endTime,
                  locationId: meetingsData.location,
                  meetingId: 0,
                  meetingTitle: meetingsData.title,
                  platformlink: meetingsData.platform.platformlink,
                  platformId: meetingsData.videoConference,
                  repeat: meetingsData.Repeat,
                  repeatName: meetingsData.Repeat,
                  required: meetingsData.userRequired,
                  setDate: meetingsData.startDate,
                  setTime: meetingsData.startTime,
                  subjectIds: subjectsId,
                  timeZone: meetingsData.TimeZone,
                  userIds: meetingsData.users,
                  subjectStatusIds: [],
                  meetingStatusId: 0,
                  deadlineDate: calendarValue
                });
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
                      meetingId: 0,
                      meetingTitle: meetingsData.title,
                      platformlink: meetingsData.platform.platformlink,
                      platformId: meetingsData.videoConference,
                      repeat: meetingsData.Repeat,

                      required: meetingsData.userRequired,
                      setDate: meetingsData.startDate,
                      setTime: meetingsData.startTime,
                      subjectIds: subjectsId,
                      timeZone: meetingsData.TimeZone,
                      userIds: meetingsData.users,
                      subjectStatusIds: [],
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
      )}
    </SafeAreaView>
  );
};

export default AddMeetingSubjects;
