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
  const { committee } = route?.params;
  console.log('committee from add subjects', committee);
  const [title, setTitle] = useState('');
  const [discription, setDescription] = useState('');
  const [valueCategory, setValueCategory] = useState(null);
  const [valueCommittee, setValueCommittee] = useState(committee || null);
  const [valueMeeting, setValueMeeting] = useState(0);
  const [fileResponse, setFileResponse] = useState([]);
  const [filesId, setFilesId] = useState([]);
  const [token, setToken] = useState('');
  const [category, setCategory] = useState([]);
  const [committees, setCommittee] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [committeeData, setCommitteeData] = useState([]);

  // fetch file
  const [fetchFile, getFile] = useLazyQuery(GET_FILE);

  // fetch subject category
  const { loading: SubjectCategoryLoading, error: SubjeCategoryError } =
    useQuery(GET_All_SUBJECTS_CATEGORY, {
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
  const { loading: CommitteeLoading, error: CommitteeError } = useQuery(
    GET_All_COMMITTEE,
    {
      variables: { isDeleted: true },
      onCompleted: (data) => {
        if (data) {
          console.log('committees', data?.committees.items);
          setCommittee(data.committees.items);
        }
      }
    }
  );
  if (CommitteeError) {
    console.log('commitee error', CommitteeError);
  }

  // fetch meetings
  const { loading: MeetingLoading, error: MeetingError } = useQuery(
    GET_All_MEETING,
    {
      variables: { onlyMyMeeting: false, screen: 1 },
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

  useEffect(() => {
    const fileId = fileResponse.map((file) => file.fileEnteryId);

    setFilesId(fileId);
  }, [fileResponse]);

  const [addSubject, { data, loading, error }] = useMutation(UPDATE_SUBJECTS, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: [
      {
        query: GET_All_SUBJECTS,
        variables: {
          searchValue: '',
          screen: committee ? 1 : 0,
          committeeIds: '',
          page: -1,
          pageSize: -1
        }
      }
    ],
    onCompleted: (data) => {
      console.log(data);
      if (data.updateSubject.status[0].statusCode == '200') {
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

  const Committee = useQuery(GET_COMMITTEE_BY_ID, {
    variables: {
      organizationId: committee
    },
    onCompleted: (data) => {
      console.log('get committee by id', data);
      if (data) {
        setCommitteeData(data.committee);
      }
    },
    onError: (data) => {
      console.log('error in get committee by id', data);
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Add subject'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.subContainer}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.txtAddSubjectTitle}>Add subject</Text>
        {/* select committee */}
        <DropDownPicker
          data={committees?.map((item) => ({
            label: item.committeeTitle,
            value: item.organizationId
          }))}
          disable={false}
          placeholder={''}
          setData={setValueCommittee}
          title={'SELECT COMMITTEE'}
          value={valueCommittee}
        />

        {/* select meeting */}
        <DropDownPicker
          data={meetings?.map((item) => ({
            label: item.meetingTitle,
            value: item.meetingId
          }))}
          disable={false}
          placeholder={''}
          setData={setValueMeeting}
          title={'SELECT MEETING'}
          value={valueMeeting}
        />
        {/* title */}
        <View style={styles.titleContainer}>
          <Text style={styles.txtTitle}>TITLE</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setTitle(text)}
          />
        </View>
        <View style={styles.discriptionContainer}>
          <Text style={styles.txtTitle}>DESCRIPTION</Text>
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
              addSubject({
                variables: {
                  subject: {
                    subjectId: 0,
                    committeeId: valueCommittee,
                    subjectTitle: title,
                    description: discription,
                    subjectCategoryId: valueCategory,
                    draft: false,
                    attachFileIds: filesId,
                    meetingId: valueMeeting,
                    id: 0
                  }
                },
                onCompleted: (data) => {
                  console.log(data.updateSubject);
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

export default AddSubjectScreen;
