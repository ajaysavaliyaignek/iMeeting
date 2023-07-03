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
  GET_All_MEETING,
  GET_All_SUBJECTS,
  GET_All_SUBJECTS_CATEGORY,
  GET_ALL_SUBJECTS_STATUS,
  GET_COMMITTEES_BY_ROLE,
  GET_FILE,
  GET_USER_PAYLOAD
} from '../../../../graphql/query';
import {
  UPDATE_SUBJECTS,
  UPDATE_SUBJECT_STATUS
} from '../../../../graphql/mutation';
import { SIZES } from '../../../../themes/Sizes';
import DropDownPicker from '../../../../component/DropDownPicker/DropDownPicker';
import AttachFiles from '../../../../component/attachFiles/AttachFiles';
import SubjectStatusDropdown from '../../../../component/subjectStatusDropdown/SubjectStatusDropdown';

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
  const [user, setUser] = useState({});
  const [statusTitleOption, setstatusTitleOption] = useState([]);
  const [errorUpdateStatus, setError] = useState('');
  const [subjectStatus, setSubjectStatus] = useState(
    isEdit ? subjectDetails?.statusTitle : null
  );
  const [showRequired, setShowRequired] = useState(true);
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
  let subjectStatusId = [];

  if (subjectStatus) {
    subjectStatusId = statusTitleOption.filter((status) => {
      if (status.value == subjectStatus) {
        return status;
      }
    });
  }

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
      screen: 2,
      page: -1,
      pageSize: -1,
      meetingId: meetingId,
      isDraft: false,
      sort: ''
    };
  } else {
    queryParams = {
      searchValue: '',
      screen: 0,
      committeeIds: '',
      page: -1,
      pageSize: -1,
      meetingId: 0
    };
  }

  if (isEdit) {
    const getUserDetails = useQuery(GET_USER_PAYLOAD, {
      fetchPolicy: 'cache-and-network',
      onCompleted: (data) => {
        let users = data.userPayload?.userCommitteesDetail?.filter((user) => {
          if (user.organizationId == subjectDetails?.committeeId) {
            return user;
          }
        });

        setUser(users);
      }
    });
  }

  useEffect(() => {
    if (isEdit) {
      getAllSubjectStatus({
        variables: {
          decision: false,
          subject: true,
          approveDecision: false,
          momDecision: false
        }
      });
    }
  }, [user]);

  const [getAllSubjectStatus] = useLazyQuery(GET_ALL_SUBJECTS_STATUS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data, error) => {
      if (error) {
        toast.error(error.message);
      }
      if (data) {
        setstatusTitleOption(
          data.subjectStatus.items.map((status) => {
            if (
              data.subjectStatus.items.filter((e) => {
                return e.statusTitle === 'Pre-Proposed';
              })[0].statusId === subjectDetails?.statusId
            ) {
              if (user[0]?.roleName == 'Head') {
                return {
                  key: status.statusId,
                  value: status.statusTitle,
                  disabled:
                    status.statusTitle === 'Tentative' ||
                    status.statusTitle === 'Pre-Proposed' ||
                    status.statusTitle === 'Proposed' ||
                    (status.statusTitle === 'Transferred' && true)
                };
              }
              return {
                key: status.statusId,
                value: status.statusTitle,
                disabled:
                  status.statusTitle === 'Tentative' ||
                  status.statusTitle === 'Pre-Proposed' ||
                  status.statusTitle === 'Proposed' ||
                  status.statusTitle === 'Transferred' ||
                  (status.statusTitle === 'Approved' && true)
              };
            } else if (
              data.subjectStatus.items.filter((e) => {
                return e.statusTitle === 'Tentative';
              })[0].statusId === subjectDetails?.statusId
            ) {
              return {
                key: status.statusId,
                value: status.statusTitle,
                disabled:
                  status.statusTitle === 'Tentative' ||
                  status.statusTitle === 'Proposed' ||
                  status.statusTitle === 'Transferred' ||
                  (status.statusTitle === 'Approved' && true)
              };
            } else if (
              data.subjectStatus.items.filter((e) => {
                return e.statusTitle === 'Unassigned';
              })[0].statusId === subjectDetails?.statusId
            ) {
              return {
                key: status.statusId,
                value: status.statusTitle,
                disabled:
                  status.statusTitle === 'Tentative' ||
                  status.statusTitle === 'Pre-Proposed' ||
                  status.statusTitle === 'Proposed' ||
                  status.statusTitle === 'Transferred' ||
                  (status.statusTitle === 'Approved' && true)
              };
            } else if (
              data.subjectStatus.items.filter((e) => {
                return e.statusTitle === 'Proposed';
              })[0].statusId === subjectDetails?.statusId
            ) {
              return {
                key: status.statusId,
                value: status.statusTitle,
                disabled:
                  status.statusTitle === 'Tentative' ||
                  status.statusTitle === 'Pre-Proposed' ||
                  status.statusTitle === 'Proposed' ||
                  status.statusTitle === 'Transferred' ||
                  (status.statusTitle === 'Approved' && true)
              };
            } else if (
              data.subjectStatus.items.filter((e) => {
                return e.statusTitle === 'Transferred';
              })[0].statusId === subjectDetails?.statusId
            ) {
              return {
                key: status.statusId,
                value: status.statusTitle,
                disabled:
                  status.statusTitle === 'Tentative' ||
                  status.statusTitle === 'Unassigned' ||
                  // status.statusTitle === 'Pre-Proposed' ||
                  status.statusTitle === 'Proposed' ||
                  status.statusTitle === 'Transferred' ||
                  status.statusTitle === 'Approved' ||
                  (status.statusTitle === 'Deleted' && true)
              };
            } else if (
              data.subjectStatus.items.filter((e) => {
                return e.statusTitle === 'Approved';
              })[0].statusId === subjectDetails?.statusId
            ) {
              return {
                key: status.statusId,
                value: status.statusTitle,
                disabled:
                  status.statusTitle === 'Tentative' ||
                  status.statusTitle === 'Proposed' ||
                  status.statusTitle === 'Transferred' ||
                  status.statusTitle === 'Approved' ||
                  (status.statusTitle === 'Deleted' && true)
              };
            } else if (
              data.subjectStatus.items.filter((e) => {
                return e.statusTitle === 'Deleted';
              })[0].statusId === subjectDetails?.statusId
            ) {
              return {
                key: status.statusId,
                value: status.statusTitle,
                disabled:
                  status.statusTitle === 'Tentative' ||
                  status.statusTitle === 'Unassigned' ||
                  status.statusTitle === 'Pre-Proposed' ||
                  status.statusTitle === 'Proposed' ||
                  status.statusTitle === 'Transferred' ||
                  status.statusTitle === 'Approved' ||
                  (status.statusTitle === 'Deleted' && true)
              };
            } else {
              return {
                key: status.statusId,
                value: status.statusTitle,
                disabled:
                  status.statusTitle === 'Tentative' ||
                  status.statusId === subjectDetails?.statusId
              };
            }
          })
        );
      }
    }
  });

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
    variables: { head: true, secretary: true, member: false, type: 2 },
    onCompleted: (data) => {
      if (data) {
        setCommittee(data?.committeesByRole?.items);
      }
    },
    onError: (data) => {
      console.log('commitee error', data);
    }
  });
  console.log({ subjectDetails });
  // fetch meetings
  const { loading: MeetingLoading, error: MeetingError } = useQuery(
    GET_All_MEETING,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        onlyMyMeeting: false,
        committeeIds:
          subjectData?.valueCommittee !== null &&
          subjectDetails?.statusTitle !== 'Transferred'
            ? `${subjectData?.valueCommittee}`
            : subjectData?.valueCommittee !== null &&
              subjectDetails?.statusTitle == 'Transferred'
            ? subjectDetails?.status?.entitys?.organizationId
            : '',
        screen: 1,
        searchValue: '',
        page: -1,
        pageSize: -1,
        sort: '',
        date: ''
      },
      onCompleted: (data) => {
        if (data) {
          setMeetings(data.meetings.items);
        }
      },
      onError: (data) => {
        console.log('MeetingError', data.message);
      }
    }
  );

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
      'subjects'
      // {
      //   query: GET_All_SUBJECTS,
      //   variables: queryParams
      // }
    ],
    onCompleted: (data) => {
      if (data?.updateSubject?.status?.statusCode == '200') {
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

  const [updateSubjectStatus, { loading: updateSubjectStatusLoading }] =
    useMutation(UPDATE_SUBJECT_STATUS, {
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
        },
        {
          query: GET_ALL_SUBJECTS_STATUS,
          variables: {
            decision: false,
            subject: true,
            approveDecision: false,
            momDecision: false
          }
        },
        'subjects',
        'meetings'
      ],
      onCompleted: (data) => {
        console.log('update subject status', data.updateSubjectStatus.status);
      },
      onError: (data) => console.log('update subject status error', data)
    });

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
          disable={
            committee
              ? true
              : isEdit && subjectDetails?.statusTitle == 'Transferred'
              ? true
              : isEdit
              ? false
              : false
          }
          placeholder={'' || subjectDetails?.committeeName}
          setData={(item) =>
            setSubjectData({ ...subjectData, valueCommittee: item })
          }
          title={'SELECT COMMITTEE'}
          value={subjectData.valueCommittee}
        />
        {subjectData.valueCommittee == null ? (
          <Text style={{ color: Colors.Rejected, ...Fonts.PoppinsRegular[10] }}>
            *This field is required
          </Text>
        ) : null}

        {/* select meeting */}
        <DropDownPicker
          data={meetings?.map((item) => ({
            label: item.meetingTitle,
            value: item.meetingId
          }))}
          disable={committee ? true : false}
          placeholder={committee != null ? meetingName : ''}
          setData={(item) => {
            setSubjectData({ ...subjectData, valueMeeting: item });
            setError('');
          }}
          title={'SELECT MEETING'}
          value={subjectData?.valueMeeting}
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
        {subjectData?.title == '' ? (
          <Text style={{ color: Colors.Rejected, ...Fonts.PoppinsRegular[10] }}>
            *This field is required
          </Text>
        ) : null}

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
        {subjectData?.discription == '' ? (
          <Text style={{ color: Colors.Rejected, ...Fonts.PoppinsRegular[10] }}>
            *This field is required
          </Text>
        ) : null}
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
          {subjectData?.valueCategory == null ? (
            <Text
              style={{ color: Colors.Rejected, ...Fonts.PoppinsRegular[10] }}
            >
              *This field is required
            </Text>
          ) : null}
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
        {isEdit && (
          <View style={{ marginTop: SIZES[24] }}>
            <Text
              style={{
                ...Fonts.PoppinsRegular[12],
                color: Colors.secondary,
                marginBottom: 10
              }}
            >
              SUBJECT STATUS
            </Text>
            <SubjectStatusDropdown
              item={subjectDetails}
              statusTitleOption={statusTitleOption}
              meetingId={subjectData?.valueMeeting}
              setSubjectStatus={setSubjectStatus}
              setSubjectData={setSubjectData}
              subjectData={subjectData}
            />
          </View>
        )}

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
        {errorUpdateStatus !== '' && (
          <View style={{ alignItems: 'center', paddingBottom: 30 }}>
            <Text
              style={{ ...Fonts.PoppinsSemiBold[14], color: Colors.Rejected }}
            >
              {errorUpdateStatus}
            </Text>
          </View>
        )}
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
            isLoading={loading || updateSubjectStatusLoading}
            onPress={() => {
              if (
                subjectStatus == 'Pre-Proposed' &&
                subjectData?.valueMeeting == null
              ) {
                setError('Please select meeting.');
              } else {
                if (isEdit) {
                  updateSubjectStatus({
                    variables: {
                      subject: {
                        subjectId: subjectDetails?.subjectId,
                        statusId: subjectStatusId[0]?.key,
                        meetingId: subjectData?.valueMeeting
                      }
                    }
                  });
                }

                addSubject({
                  variables: {
                    subject: {
                      subjectId: isEdit ? subjectDetails?.subjectId : 0,
                      committeeId: subjectData?.valueCommittee,
                      subjectTitle: subjectData?.title,
                      description: subjectData?.discription,
                      subjectCategoryId: subjectData?.valueCategory,
                      draft: false,
                      attachFileIds: subjectData?.filesId,
                      meetingId:
                        subjectData?.valueMeeting == null
                          ? 0
                          : subjectData?.valueMeeting,
                      id: isLiveMeetingSubject ? 1 : 0
                    }
                  }
                });
              }
            }}
            disable={
              subjectData?.title === '' ||
              subjectData?.discription === '' ||
              subjectData?.valueCommittee == null ||
              subjectData?.valueCategory == null
                ? true
                : false
            }
            layoutStyle={[
              {
                opacity:
                  subjectData?.title === '' ||
                  subjectData?.discription === '' ||
                  subjectData?.valueCommittee == null ||
                  subjectData?.valueCategory == null
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
