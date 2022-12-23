import { View, Text, SafeAreaView, TextInput, ScrollView } from 'react-native';
import React, { useState, useCallback, useEffect, useContext } from 'react';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import { Divider } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import { useLazyQuery, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { Button } from '../../../../component/button/Button';
import Header from '../../../../component/header/Header';
import { SIZES } from '../../../../themes/Sizes';
import { styles } from './styles';
import { GET_COMMITTEES_BY_ROLE, GET_FILE } from '../../../../graphql/query';
import Loader from '../../../../component/Loader/Loader';
import { UserContext } from '../../../../context';
import DropDownPicker from '../../../../component/DropDownPicker/DropDownPicker';
import AttachFiles from '../../../../component/attachFiles/AttachFiles';

const AddMeetingGeneralScreen = ({
  setActiveScreen,
  setDiscription,
  setValue,
  setTitle,
  setFilesId,
  valueCommitee,
  title,
  discription,
  setFileResponse,
  fileResponse,
  filesId
}) => {
  const navigation = useNavigation();
  // const [title, setTitle] = useState('');
  // const [discription, setDiscription] = useState('');
  // const [valueCommitee, setValue] = useState(null);
  const [committee, setCommittee] = useState(null);
  // const [fileResponse, setFileResponse] = useState([]);
  // const [filesId, setFilesId] = useState(null);
  const [token, setToken] = useState('');

  const { meetingsData, setMeetingsData } = useContext(UserContext);

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
    const fileId = fileResponse.map((file) => file.fileEnteryId);

    setFilesId(fileId);
  }, [fileResponse]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.subContainer}>
        <View style={styles.progressContainer}>
          <Progress.Bar
            color={Colors.switch}
            progress={0.2}
            borderColor={Colors.white}
            unfilledColor={'#e6e7e9'}
            width={DeviceInfo.isTablet() ? 800 : 264}
          />
          <Text style={styles.txtProgress}>Step 1/5</Text>
        </View>
        <Text style={styles.txtAddSubjectTitle}>General</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {CommitteeLoading && <Loader />}

          {/* choose committe */}
          <DropDownPicker
            data={committee?.map((comm) => ({
              label: comm.committeeTitle,
              value: comm.organizationId
            }))}
            disable={false}
            placeholder={''}
            setData={setValue}
            title={'CHOOSE COMMITTEE'}
            value={valueCommitee}
          />

          <View style={styles.discriptionContainer}>
            <Text style={styles.txtTitle}>TITLE</Text>
            <TextInput
              value={title}
              style={styles.textInput}
              onChangeText={(text) => {
                setTitle(text);
              }}
            />
          </View>
          <View style={styles.categoryContainer}>
            <Text style={styles.txtTitle}>DESCRIPTION</Text>
            <TextInput
              style={styles.textInput}
              multiline={true}
              onChangeText={(text) => {
                setDiscription(text);
              }}
              value={discription}
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
      </View>
    </View>
  );
};

export default AddMeetingGeneralScreen;
