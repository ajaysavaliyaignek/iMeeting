import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import { Divider } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { Icon, IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { styles } from './styles';
import { SIZES } from '../../../../themes/Sizes';
import { Button } from '../../../../component/button/Button';
import AddSubjectsCard from './AddSubjectsCard';
import { GET_All_SUBJECTS } from '../../../../graphql/query';
import { Fonts } from '../../../../themes';
import moment from 'moment';

const AddEditSubjects = ({
  generaldData,
  setGeneralData,
  details,
  visibleIndex,
  setVisibleIndex
}) => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [openIndex, setOpenIndex] = useState(-1);
  const [selectSubjects, setSelectedSubjects] = useState([]);
  const [previosSubjects, setPreviosSubjects] = useState([]);

  const [openCalendar, setOpenCalendar] = useState(false);
  let subjects = [];

  let backUpUser = [];

  useEffect(() => {
    subjects = previosSubjects?.map((item) => item);
    selectSubjects?.map((item) => {
      subjects.push(item);
    });
    setFilterData(subjects);
    setGeneralData({ ...generaldData, previousSubject: subjects });
  }, [previosSubjects, selectSubjects]);

  // get subjects by meeting id
  if (details != null) {
    const {
      loading: SubjectsLoading,
      error: SubjectsError,
      data: SubjectsData
    } = useQuery(GET_All_SUBJECTS, {
      fetchPolicy: 'cache-and-network',
      variables: {
        committeeIds: '',
        searchValue: searchText,
        screen: 0,
        page: -1,
        pageSize: -1,
        meetingId: details?.meetingId
      },

      onCompleted: (data) => {
        let subjectData = [];
        data.subjects.items?.map((subject) => {
          backUpUser.push(JSON.parse(JSON.stringify(subject)));
          subjectData.push(JSON.parse(JSON.stringify(subject)));
        });
        // backUpSubject = subjectData;
        setPreviosSubjects(subjectData);
      }
    });

    if (SubjectsError) {
      console.log('subjects error---', SubjectsError);
    }
  }

  // select user from the select users screen
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
            ? backUpUser?.findIndex((obj) => obj.userId === subject.userId)
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

    setSelectedSubjects(newUsers);
  };

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

  const searchFilterSubject = (text) => {
    if (text) {
      const newData = filterData?.filter((item) => {
        const itemData = item.subjectTitle ? item.subjectTitle : '';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });

      setSearchText(text);
      setGeneralData({ ...generaldData, previousSubject: newData });
    } else {
      setSearchText(text);
      setGeneralData({ ...generaldData, previousSubject: filterData });
    }
  };

  const handleConfirmCalendar = (date) => {
    setGeneralData({
      ...generaldData,
      attendanceFeedbackDate: moment(date).format('YYYY-MM-DD')
    });
    setOpenCalendar(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={styles.txtAddSubjectTitle}>Subjects</Text>

        <View style={styles.searchContainer}>
          <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
          <TextInput
            style={styles.textInput}
            placeholder={'Search'}
            onChangeText={(text) => searchFilterSubject(text)}
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

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {generaldData?.previousSubject?.length > 0 ? (
            generaldData?.previousSubject.map((subject, index) => {
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
            })
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                paddingVertical: SIZES[24]
              }}
            >
              <Text
                style={{ ...Fonts.PoppinsSemiBold[14], color: Colors.primary }}
              >
                No selected subject
              </Text>
            </View>
          )}
          <Divider style={styles.divider} />
          <View>
            <View style={styles.rowContainer}>
              <Text style={styles.txtLabel}>Attendance feedback</Text>
              <Switch
                value={generaldData.attendanceFeedback}
                onValueChange={() =>
                  setGeneralData({
                    ...generaldData,
                    attendanceFeedback: !generaldData.attendanceFeedback
                  })
                }
                color={Colors.switch}
              />
            </View>
            {generaldData.attendanceFeedback && (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: SIZES[16]
                }}
                onPress={() => setOpenCalendar(true)}
              >
                <Text
                  style={{
                    marginRight: SIZES[8],
                    ...Fonts.PoppinsSemiBold[14],
                    color: Colors.bold
                  }}
                >
                  {generaldData?.attendanceFeedbackDate}
                </Text>
                <Icon
                  name={IconName.Calendar}
                  height={SIZES[20]}
                  width={SIZES[20]}
                />
              </TouchableOpacity>
            )}
            <Divider style={styles.divider} />
          </View>

          <View>
            <View style={styles.rowContainer}>
              <Text style={styles.txtLabel}>Subject suggestion</Text>
              <Switch
                value={generaldData.subjectSuggestion}
                onValueChange={() =>
                  setGeneralData({
                    ...generaldData,
                    subjectSuggestion: !generaldData.subjectSuggestion
                  })
                }
                color={Colors.switch}
              />
            </View>
            {generaldData.subjectSuggestion && (
              <TouchableOpacity
                style={styles.deadlineRowContainer}
                onPress={() =>
                  navigation.navigate('DeadlineSuggestion', {
                    setCalendarValue: setGeneralData,
                    generaldData: generaldData,
                    isTaskdeadline: false
                  })
                }
              >
                <Text
                  style={{
                    marginRight: SIZES[8],
                    ...Fonts.PoppinsSemiBold[14],
                    color: Colors.bold
                  }}
                >
                  {generaldData?.calendarValue}
                </Text>
                <Icon
                  name={IconName.Calendar}
                  width={SIZES[18]}
                  height={SIZES[20]}
                />
              </TouchableOpacity>
            )}
            <Divider style={styles.divider} />
          </View>
          <View style={styles.deadlineContainer}>
            {/* <Text style={styles.txtTitle}>RECIEVING SUBJECTS DEADLINE</Text> */}

            <Button
              title={'Select subjects'}
              layoutStyle={styles.selectsubjectBtnLayout}
              textStyle={styles.txtCancelButton}
              onPress={() =>
                navigation.navigate('SelectSubjects', {
                  committee: generaldData?.valueCommitee,
                  onUpdateSelection: onUpdateSelection,
                  previosSubjects: generaldData?.previousSubject,
                  meetingName: generaldData?.title
                })
              }
            />
          </View>
          <DateTimePickerModal
            isVisible={openCalendar}
            mode="date"
            onConfirm={handleConfirmCalendar}
            onCancel={() => setOpenCalendar(false)}
            // generaldData?.startDateTime != '' &&
            //           generaldData?.endDateTime != ''
            minimumDate={new Date(generaldData?.startDateTime)}
            maximumDate={new Date(generaldData?.endDateTime)}
            // date={new Date()}
            // timePickerModeAndroid="spinner"
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default AddEditSubjects;
