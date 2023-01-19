import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
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
  GET_FILE
} from '../../../../graphql/query';
import { UPDATE_SUBJECTS } from '../../../../graphql/mutation';
import { SIZES } from '../../../../themes/Sizes';
import DropDownPicker from '../../../../component/DropDownPicker/DropDownPicker';
import AttachFiles from '../../../../component/attachFiles/AttachFiles';

const AddDraftSubject = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { meetingId } = route?.params;
  const [title, setTitle] = useState('');
  const [discription, setDescription] = useState('');
  const [valueCategory, setValueCategory] = useState(null);
  const [valueCommittee, setValueCommittee] = useState(null);
  const [valueMeeting, setValueMeeting] = useState(meetingId);
  const [fileResponse, setFileResponse] = useState([]);
  const [filesId, setFilesId] = useState([]);
  const [token, setToken] = useState('');
  const [category, setCategory] = useState([]);
  const [committees, setCommittee] = useState([]);
  const [meetings, setMeetings] = useState([]);
  let fileId = [];

  // fetch file
  const [fetchFile, getFile] = useLazyQuery(GET_FILE);

  // fetch subject category
  const { loading: SubjectCategoryLoading, error: SubjeCategoryError } =
    useQuery(GET_All_SUBJECTS_CATEGORY, {
      fetchPolicy: 'cache-and-network',
      onCompleted: (data) => {
        if (data) {
          console.log('subject category', data.subjectCategories.items);
          setCategory(data.subjectCategories.items);
        }
      }
    });

  if (SubjeCategoryError) {
    console.log('category error', SubjeCategoryError);
  }

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
      variables: {
        onlyMyMeeting: false,
        committeeIds: '',
        screen: 0,
        searchValue: '',
        page: -1,
        pageSize: -1
      },
      onCompleted: (data) => {
        if (data) {
          console.log('meetings', data?.meetings.items);
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
  console.log('token from add subject', token);

  const [addSubject, { data, loading, error }] = useMutation(UPDATE_SUBJECTS, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: ['subjects'],
    onCompleted: (data) => {
      if (data?.updateSubject?.status[0]?.statusCode == '200') {
        navigation.goBack();
      }
    }
  });
  if (data) {
    console.log(data);
  }
  if (error) {
    console.log('addsubject error--', error);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Add draft subject'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.subContainer}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.txtAddSubjectTitle}>Add draft subject</Text>

        {/* select committee */}
        {/* <DropDownPicker
          data={committees?.map((item) => ({
            label: item.committeeTitle,
            value: item.organizationId
          }))}
          disable={false}
          placeholder={''}
          setData={setValueCommittee}
          title={'SELECT COMMITTEE'}
          value={valueCommittee}
        /> */}

        {/* select meeting */}
        {/* <DropDownPicker
          data={meetings?.map((item) => ({
            label: item.meetingTitle,
            value: item.meetingId
          }))}
          disable={true}
          placeholder={''}
          setData={setValueMeeting}
          title={'SELECT MEETING'}
          value={valueMeeting}
        /> */}

        {/* title */}
        <View style={styles.titleContainer}>
          <Text style={styles.txtTitle}>TITLE</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setTitle(text)}
          />
        </View>
        <View style={styles.discriptionContainer}>
          <Text style={styles.txtTitle}>DISCRIPTION</Text>
          <TextInput
            style={styles.textInput}
            multiline={true}
            onChangeText={(text) => setDescription(text)}
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
            setData={setValueCategory}
            title={'SUBJECT CATEGORY'}
            value={valueCategory}
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
              console.log('subjectTitle', title);
              console.log('description', discription);
              console.log('attachFileIds', filesId);
              console.log('valueCommittee', valueCommittee);
              console.log('valueCategory', valueCategory);
              console.log('meetingId', meetingId);
              addSubject({
                variables: {
                  subject: {
                    subjectId: 0,
                    committeeId: 0,
                    subjectTitle: title,
                    description: discription,
                    subjectCategoryId: valueCategory,
                    draft: true,
                    attachFileIds: filesId,
                    meetingId: meetingId,
                    id: 0
                  }
                }
              });
            }}
            disable={title === '' || discription === '' ? true : false}
            layoutStyle={[
              {
                opacity: title === '' || discription === '' ? 0.5 : null
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

export default AddDraftSubject;
