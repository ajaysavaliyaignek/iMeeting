import { View, Text, SafeAreaView, TextInput, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';

import { styles } from './styles';
import { IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { Fonts } from '../../../../themes';
import { Button } from '../../../../component/button/Button';
import Header from '../../../../component/header/Header';
import {
  GET_All_COMMITTEE,
  GET_All_MEETING,
  GET_All_SUBJECTS,
  GET_All_SUBJECTS_CATEGORY,
  GET_COMMITTEES_BY_ROLE,
  GET_COMMITTEE_BY_ID,
  GET_FILE
} from '../../../../graphql/query';
import { UPDATE_SUBJECTS } from '../../../../graphql/mutation';
import { SIZES } from '../../../../themes/Sizes';
import DropDownPicker from '../../../../component/DropDownPicker/DropDownPicker';
import AttachFiles from '../../../../component/attachFiles/AttachFiles';

const AddSubjectScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    committee,
    isEdit,
    subjectDetails,
    screenName,
    meetingName,
    meetingId,
    isLiveMeetingSubject
  } = route?.params;

  const [token, setToken] = useState('');
  const [category, setCategory] = useState([]);
  const [committees, setCommittee] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [fileResponse, setFileResponse] = useState([]);
  const [subjectData, setSubjectData] = useState({
    title: isEdit ? subjectDetails?.subjectTitle : '',
    discription: isEdit ? subjectDetails?.description : '',
    valueCommittee: isEdit
      ? subjectDetails?.committeeId
      : committee != null
      ? committee
      : null,
    valueMeeting: isEdit
      ? subjectDetails?.meetingId
      : meetingId
      ? meetingId
      : 0,
    valueCategory: isEdit ? subjectDetails?.subjectCategoryId : null,
    filesId: []
  });
  let queryParams = [];
  if (committee && meetingId == null) {
    queryParams = {
      searchValue: '',
      screen: 1,
      committeeIds: `${committee}`
    };
  } else if (meetingId) {
    queryParams = {
      committeeIds: '',
      searchValue: '',
      screen: 0,
      page: -1,
      pageSize: -1,
      meetingId: meetingId
    };
  } else {
    queryParams = {
      searchValue: '',
      screen: 0,
      committeeIds: '',
      page: -1,
      pageSize: -1
    };
  }

  // fetch file
  const [fetchFile, getFile] = useLazyQuery(GET_FILE);

  subjectDetails?.attachFileIds?.map((id) => {
    const { loading, error } = useQuery(GET_FILE, {
      fetchPolicy: 'cache-and-network',
      variables: {
        fileEntryId: id
      },
      onCompleted: (data) => {
        if (data) {
          setFileResponse((prev) => {
            const pevDaa = prev.filter((ite) => {
              return ite.fileEnteryId !== data.fileEnteryId;
            });
            return [...pevDaa, data.uploadedFile];
          });
        }
      }
    });
    if (error) {
      console.log('file error', error);
    }
  });

  // fetch subject category
  const { loading: SubjectCategoryLoading, error: SubjeCategoryError } =
    useQuery(GET_All_SUBJECTS_CATEGORY, {
      fetchPolicy: 'cache-and-network',
      onCompleted: (data) => {
        if (data) {
          setCategory(data.subjectCategories.items);
        }
      }
    });

  if (SubjeCategoryError) {
    console.log('category error', SubjeCategoryError);
  }

  // fetch commitees
  // fetch commitees
  const {
    loading: CommitteeLoading,
    error: CommitteeError,
    data: CommitteeData
  } = useQuery(GET_COMMITTEES_BY_ROLE, {
    fetchPolicy: 'cache-and-network',
    variables: { head: true, secretary: true, member: false },
    onCompleted: (data) => {
      if (data) {
        setCommittee(data?.committeesByRole?.items);
      }
    },
    onError: (data) => {
      console.log('commitee error', data);
    }
  });
  // fetch meetings
  const { loading: MeetingLoading, error: MeetingError } = useQuery(
    GET_All_MEETING,
    {
      fetchPolicy: 'cache-and-network',
      variables: { onlyMyMeeting: false, screen: 1 },
      onCompleted: (data) => {
        if (data) {
          setMeetings(data.meetings.items);
        }
      }
    }
  );
  if (MeetingError) {
    console.log('MeetingError', MeetingError);
  }

  useEffect(() => {
    getToken();
  }, [token]);

  const getToken = async () => {
    const user = await AsyncStorage.getItem('@user').catch((e) =>
      console.log(e)
    );
    setToken(JSON.parse(user)?.dataToken);
  };

  useEffect(() => {
    const fileId = fileResponse?.map((file) => file.fileEnteryId);

    setSubjectData({ ...subjectData, filesId: fileId });
  }, [fileResponse]);

  const [addSubject, { data, loading, error }] = useMutation(UPDATE_SUBJECTS, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: [
      {
        query: GET_All_SUBJECTS,
        variables: queryParams
      }
    ],
    onCompleted: (data) => {
      console.log('update subject', data.updateSubject?.status);
      if (data?.updateSubject?.status[0]?.statusCode == '200') {
        if (committee) {
          navigation.goBack();
        } else {
          navigation.navigate('Details', {
            title: 'Subjects',
            active: '1'
          });
        }
      }
    }
  });

  if (error) {
    console.log('addsubject error--', error);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={screenName}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.subContainer}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.txtAddSubjectTitle}>{screenName}</Text>
        {/* select committee */}
        <DropDownPicker
          data={committees?.map((item) => ({
            label: item.committeeTitle,
            value: item.organizationId
          }))}
          disable={committee ? true : isEdit ? true : false}
          placeholder={''}
          setData={(item) =>
            setSubjectData({ ...subjectData, valueCommittee: item })
          }
          title={'SELECT COMMITTEE'}
          value={subjectData.valueCommittee}
        />

        {/* select meeting */}
        <DropDownPicker
          data={meetings?.map((item) => ({
            label: item.meetingTitle,
            value: item.meetingId
          }))}
          disable={committee ? true : false}
          placeholder={committee != null ? meetingName : ''}
          setData={(item) =>
            setSubjectData({ ...subjectData, valueMeeting: item })
          }
          title={'SELECT MEETING'}
          value={subjectData.valueMeeting}
        />
        {/* title */}
        <View style={styles.titleContainer}>
          <Text style={styles.txtTitle}>TITLE</Text>
          <TextInput
            value={subjectData?.title}
            style={styles.textInput}
            onChangeText={(text) =>
              setSubjectData({ ...subjectData, title: text })
            }
          />
        </View>
        <View style={styles.discriptionContainer}>
          <Text style={styles.txtTitle}>DESCRIPTION</Text>
          <TextInput
            value={subjectData?.discription}
            style={styles.textInput}
            multiline={true}
            onChangeText={(text) =>
              setSubjectData({ ...subjectData, discription: text })
            }
          />
        </View>
        <View>
          {/* select category */}
          <DropDownPicker
            data={category.map((item) => ({
              label: item.categoryTitle,
              value: item.id
            }))}
            disable={false}
            placeholder={''}
            setData={(item) =>
              setSubjectData({ ...subjectData, valueCategory: item })
            }
            title={'SUBJECT CATEGORY'}
            value={subjectData?.valueCategory}
          />
          <Button
            title={'Add category'}
            textStyle={{ ...Fonts.PoppinsRegular[12] }}
            layoutStyle={{
              paddingHorizontal: SIZES[10],
              marginTop: SIZES[10]
            }}
            onPress={() => navigation.navigate('AddSubjectCategory')}
          />
        </View>

        {/* attach files */}
        <AttachFiles
          fileResponse={fileResponse}
          setFileResponse={setFileResponse}
          showAttachButton={true}
          styleFileCard={{
            borderBottomWidth: SIZES[1],
            borderBottomColor: Colors.Approved
          }}
          deleted={true}
          download={true}
          isShowAttchTitle={true}
        />
      </ScrollView>

      <View
        style={{
          backgroundColor: Colors.white,
          justifyContent: 'flex-end'
        }}
      >
        {/* Divider */}
        <Divider style={styles.divider} />
        <View style={styles.buttonContainer}>
          <Button
            title={'Cancel'}
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Save'}
            onPress={() => {
              console.log({
                subjectId: isEdit ? subjectDetails.subjectId : 0,
                committeeId: subjectData.valueCommittee,
                subjectTitle: subjectData.title,
                description: subjectData.discription,
                subjectCategoryId: subjectData.valueCategory,
                draft: false,
                attachFileIds: subjectData.filesId,
                meetingId: subjectData.valueMeeting,
                id: 0
              });
              addSubject({
                variables: {
                  subject: {
                    subjectId: isEdit ? subjectDetails.subjectId : 0,
                    committeeId: subjectData.valueCommittee,
                    subjectTitle: subjectData.title,
                    description: subjectData.discription,
                    subjectCategoryId: subjectData.valueCategory,
                    draft: false,
                    attachFileIds: subjectData.filesId,
                    meetingId:
                      subjectData.valueMeeting == null
                        ? 0
                        : subjectData.valueMeeting,
                    id: isLiveMeetingSubject ? 1 : 0
                  }
                }
              });
            }}
            disable={
              subjectData.title === '' ||
              subjectData.discription === '' ||
              subjectData.valueCommittee == null ||
              subjectData.valueCategory == null
                ? true
                : false
            }
            layoutStyle={[
              {
                opacity:
                  subjectData.title === '' ||
                  subjectData.discription === '' ||
                  subjectData.valueCommittee == null ||
                  subjectData.valueCategory == null
                    ? 0.5
                    : null
              },
              styles.nextBtnLayout
            ]}
            textStyle={styles.txtNextBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddSubjectScreen;
