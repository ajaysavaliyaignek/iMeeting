import { View, Text, TextInput, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors } from '../../../../themes/Colors';
import { SIZES } from '../../../../themes/Sizes';
import { styles } from './styles';
import { GET_COMMITTEES_BY_ROLE, GET_FILE } from '../../../../graphql/query';
import Loader from '../../../../component/Loader/Loader';
import DropDownPicker from '../../../../component/DropDownPicker/DropDownPicker';
import AttachFiles from '../../../../component/attachFiles/AttachFiles';

const AddEditGeneralScreen = ({
  generaldData,
  setGeneralData,
  details,
  fileResponse,
  setFileResponse
}) => {
  const [committee, setCommittee] = useState(null);
  const [token, setToken] = useState('');

  console.log('filesid', details?.attachFileIds);

  details?.attachFileIds?.map((id) => {
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

  console.log('generaldData?.fileResponse', generaldData?.fileResponse);
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
    const fileId = fileResponse?.map((file) => file?.fileEnteryId);

    setGeneralData({ ...generaldData, filesId: fileId });
  }, [fileResponse]);

  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: SIZES[16] }}
      nestedScrollEnabled={true}
    >
      <Text style={styles.txtAddSubjectTitle}>General</Text>
      <View showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {CommitteeLoading && <Loader color={Colors.primary} />}

        {/* choose committe */}
        <DropDownPicker
          data={committee?.map((comm) => ({
            label: comm.committeeTitle,
            value: comm.organizationId
          }))}
          disable={details == null ? false : true}
          placeholder={''}
          setData={(item) => {
            setGeneralData((prev) => {
              return { ...prev, valueCommitee: item };
            });
          }}
          title={'CHOOSE COMMITTEE'}
          value={generaldData.valueCommitee}
        />

        <View style={styles.discriptionContainer}>
          <Text style={styles.txtTitle}>TITLE</Text>
          <TextInput
            value={generaldData?.title}
            style={styles.textInput}
            onChangeText={(text) => {
              setGeneralData((prev) => {
                return { ...prev, title: text };
              });
              // setTitle(text);
            }}
          />
        </View>
        <View style={styles.categoryContainer}>
          <Text style={styles.txtTitle}>DESCRIPTION</Text>
          <TextInput
            style={styles.textInput}
            multiline={true}
            onChangeText={(text) => {
              setGeneralData((prev) => {
                return { ...prev, discription: text };
              });
            }}
            value={generaldData?.discription}
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
      </View>
    </ScrollView>
  );
};

export default AddEditGeneralScreen;
