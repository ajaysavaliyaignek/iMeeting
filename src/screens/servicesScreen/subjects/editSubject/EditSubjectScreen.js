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
import { Button } from '../../../../component/button/Button';
import Header from '../../../../component/header/Header';
import {
  GET_All_COMMITTEE,
  GET_All_MEETING,
  GET_All_SUBJECTS,
  GET_All_SUBJECTS_CATEGORY,
  GET_FILE
} from '../../../../graphql/query';
import { UPDATE_SUBJECTS } from '../../../../graphql/mutation';
import Loader from '../../../../component/Loader/Loader';
import { SIZES } from '../../../../themes/Sizes';
import DropDownPicker from '../../../../component/DropDownPicker/DropDownPicker';
import AttachFiles from '../../../../component/attachFiles/AttachFiles';

const EditSubjectScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route?.params;
  const [title, setTitle] = useState(item.subjectTitle);
  const [discription, setDescription] = useState(item.description);
  const [valueCategory, setValueCategory] = useState(item.subjectCategoryId);
  const [valueCommittee, setValueCommittee] = useState(item.committeeId);
  const [valueMeeting, setValueMeeting] = useState(item?.meetingId);
  const [fileResponse, setFileResponse] = useState([]);
  const [filesId, setFilesId] = useState([]);
  const [token, setToken] = useState('');
  const [category, setCategory] = useState([]);
  const [committees, setCommittee] = useState([]);
  const [meetings, setMeetings] = useState([]);

  item?.attachFileIds.map((id) => {
    const { loading, error } = useQuery(GET_FILE, {
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

  useEffect(() => {
    const fileId = fileResponse.map((file) => file.fileEnteryId);

    setFilesId(fileId);
  }, [fileResponse]);

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
  const { loading: CommitteeLoading, error: CommitteeError } = useQuery(
    GET_All_COMMITTEE,
    {
      fetchPolicy: 'cache-and-network',
      variables: { isDeleted: false },
      onCompleted: (data) => {
        if (data) {
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

  const [addSubject, { data, loading, error }] = useMutation(UPDATE_SUBJECTS, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: [
      {
        query: GET_All_SUBJECTS,
        variables: {
          committeeIds: '',
          searchValue: '',
          screen: 0,
          page: -1,
          pageSize: -1
        }
      }
    ],
    onCompleted: (data) => {
      console.log(data.updateSubject.status);
    }
  });

  if (error) {
    console.log('addsubject error--', error);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Edit subject'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        {SubjectCategoryLoading ? (
          <Loader color={Colors.primary} size={'small'} />
        ) : (
          <ScrollView
            style={styles.subContainer}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.txtEditSubject}>Edit subject</Text>
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
            <View style={[styles.titleContainer, { marginTop: SIZES[16] }]}>
              <Text style={styles.txtTitle}>TITLE</Text>
              <TextInput
                value={title}
                style={styles.textInput}
                onChangeText={(text) => setTitle(text)}
              />
            </View>
            <View style={styles.discriptionContainer}>
              <Text style={styles.txtTitle}>DISCRIPTION</Text>
              <TextInput
                value={discription}
                style={styles.textInput}
                multiline={true}
                onChangeText={(text) => setDescription(text)}
              />
            </View>
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
        )}

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
                      subjectId: item.subjectId,
                      committeeId: valueCommittee,
                      subjectTitle: title,
                      description: discription,
                      subjectCategoryId: valueCategory,
                      draft: false,
                      attachFileIds: filesId,
                      meetingId: valueMeeting !== null ? valueMeeting : 0,
                      id: 0
                    }
                  },
                  onCompleted: (data) => {
                    if (data.updateSubject.status.statusCode == '200') {
                      navigation.navigate('Details', {
                        title: 'Subjects',
                        active: '1'
                      });
                    }
                  }
                });

                // navigation.navigate('Details', {
                //   title: 'Subjects',
                //   active: '1'
                // });
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
      </View>
    </SafeAreaView>
  );
};

export default EditSubjectScreen;
