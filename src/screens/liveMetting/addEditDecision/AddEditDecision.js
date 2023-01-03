import { View, Text, ScrollView, SafeAreaView, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../../component/header/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import { IconName } from '../../../component';
import { styles } from './styles';
import DropDownPicker from '../../../component/DropDownPicker/DropDownPicker';
import { Divider } from 'react-native-paper';
import AttachFiles from '../../../component/attachFiles/AttachFiles';
import { Button } from '../../../component/button/Button';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';
import {
  GET_ALL_DECISION_BY_ID,
  GET_All_SUBJECTS,
  GET_ALL_SUBJECTS_STATUS,
  GET_COMMITTEES_BY_ROLE,
  GET_FILE
} from '../../../graphql/query';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_DECISION } from '../../../graphql/mutation';

const AddEditDecision = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { meetingDetails, isEdit, decisionId, subjectId } = route?.params;

  const [valueDecision, setValueDecision] = useState(null);
  const [valueCommittee, setValueCommiteee] = useState(
    meetingDetails?.committeeId
  );
  const [decisionDescription, setDecisionDescription] = useState('');
  const [fileResponse, setFileResponse] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [valueSubject, setValueSubject] = useState(
    subjectId ? subjectId : null
  );
  const [committees, setCommittee] = useState([]);
  const [fileId, setFilesId] = useState([]);
  const [decisionItems, setDecisionItems] = useState([]);

  if (isEdit) {
    const getDecionById = useQuery(GET_ALL_DECISION_BY_ID, {
      variables: {
        decision: decisionId
      },
      onCompleted: (data) => {
        console.log('decision data', data);
        setValueSubject(data?.decision?.subjectId);
        setValueDecision(data?.decision?.statusId);
        setValueCommiteee(data?.decision?.committeeId);
        setDecisionDescription(data?.decision?.description);
        data?.decision?.attachFileIds?.map((id) => {
          console.log('id', id);
          const { loading, error } = useQuery(GET_FILE, {
            variables: {
              fileEntryId: id
            },
            onCompleted: (data) => {
              console.log('get file by id', data.uploadedFile);
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
      },
      onError: (data) => {
        console.log('get decision by id error', data.message);
      }
    });
  }

  useEffect(() => {
    const fileId = fileResponse?.map((file) => file?.fileEnteryId);

    setFilesId(fileId);
  }, [fileResponse]);

  // fetch commitees
  const {
    loading: CommitteeLoading,
    error: CommitteeError,
    data: CommitteeData
  } = useQuery(GET_COMMITTEES_BY_ROLE, {
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

  // get subjects for dropdown
  const {
    loading: SubjectsLoading,
    error: SubjectsError,
    data: SubjectsData
  } = useQuery(GET_All_SUBJECTS, {
    variables: {
      committeeIds: '',
      searchValue: '',
      screen: 0,
      page: -1,
      pageSize: -1,
      meetingId: meetingDetails?.meetingId
    },

    onCompleted: (data) => {
      setSubjectList(data?.subjects.items);

      // setSubjectData(data?.subjects.items);
    },
    onError: (data) => {
      console.log('subjects error---', data.message);
    }
  });

  // get decision status for dropdown
  const {
    loading: decisionStatusLoading,
    error: decisionStatusLoadingError,
    data: decisionStatusLoadingData
  } = useQuery(GET_ALL_SUBJECTS_STATUS, {
    variables: {
      subject: false,
      decision: true,
      approveDecision: false,
      momDecision: false
    },

    onCompleted: (data) => {
      console.log('decision status', data.subjectStatus.items);
      // setSubjectList(data?.subjects.items);
      setDecisionItems(data.subjectStatus.items);

      // setSubjectData(data?.subjects.items);
    },
    onError: (data) => {
      console.log('decision error---', data.message);
    }
  });

  const [
    updateDecision,
    { data, loading: addTaskLoading, error: addTaskError }
  ] = useMutation(UPDATE_DECISION, {
    refetchQueries: ['decisions', 'subjects'],
    onCompleted: (data) => {
      if (data) {
        console.log('update Decision', data?.updateDecision?.status);
        if (data.updateDecision.status[0].statusCode == '200') {
          navigation.goBack();
        }
      }
    }
  });

  console.log('value decision', valueDecision);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={isEdit ? 'Edit decision' : 'Add decision'}
        rightIconName={IconName.Close}
        onRightPress={() => {
          navigation.goBack();
        }}
      />
      <ScrollView style={styles.subContainer}>
        <Text style={styles.txtTitleAddVoting}>
          {isEdit ? 'Edit decision' : 'Add decision'}
        </Text>

        <DropDownPicker
          title={'SELECT SUBJECT'}
          data={subjectList?.map((item) => ({
            label: item.subjectTitle,
            value: item.subjectId
          }))}
          setData={setValueSubject}
          value={valueSubject}
          placeholder={''}
        />

        {/* decision types dropdwon */}
        <DropDownPicker
          title={'DECISION'}
          placeholder={''}
          data={decisionItems?.map((item) => ({
            label: item.statusTitle,
            value: item.statusId
          }))}
          value={valueDecision}
          setData={setValueDecision}
        />

        {/* committees dropdwon */}
        <DropDownPicker
          title={'CHOOSE COMMITTEE'}
          placeholder={''}
          data={committees?.map((comm) => ({
            label: comm.committeeTitle,
            value: comm.organizationId
          }))}
          value={valueCommittee}
          setData={setValueCommiteee}
          disable={true}
        />

        <View style={styles.optionsContainer}>
          <Text style={styles.txtTitleVoting}>DESCRIPTION</Text>
          <TextInput
            value={decisionDescription}
            style={styles.textInput}
            onChangeText={(text) => {
              setDecisionDescription(text);
            }}
            multiline={true}
          />
          <Divider style={styles.divider} />
        </View>
        <AttachFiles
          deleted={true}
          download={true}
          fileResponse={fileResponse}
          setFileResponse={setFileResponse}
          showAttachButton={true}
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
            onPress={() => {
              navigation.goBack();
            }}
            layoutStyle={[
              styles.cancelBtnLayout,
              { marginVertical: SIZES[12], width: '48%' }
            ]}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Save'}
            // isLoading={addVotingLoading}
            onPress={() => {
              console.log('update decision data ', {
                decisionId: isEdit ? decisionId : 0,
                subjectId: valueSubject,
                committeeId: valueCommittee,
                statusId: valueDecision,
                description: decisionDescription,
                attachFileIds: fileId,
                meetingId: 0,
                dateOfCreation: '',
                statusTitle: '',
                id: 0
              });
              updateDecision({
                variables: {
                  decision: {
                    decisionId: isEdit ? decisionId : 0,
                    subjectId: valueSubject,
                    committeeId: valueCommittee,
                    statusId: valueDecision,
                    description: decisionDescription,
                    attachFileIds: fileId,
                    meetingId: 0,
                    dateOfCreation: '',
                    statusTitle: '',
                    id: 0
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
    </SafeAreaView>
  );
};

export default AddEditDecision;
