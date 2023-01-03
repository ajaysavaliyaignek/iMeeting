import { View, Text, SafeAreaView, TextInput, ScrollView } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import * as Progress from 'react-native-progress';
import { useNavigation, useRoute } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import { Divider } from 'react-native-paper';
import { useLazyQuery, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { Button } from '../../../../component/button/Button';
import Header from '../../../../component/header/Header';
import { SIZES } from '../../../../themes/Sizes';
import { styles } from './styles';
import {
  GET_All_COMMITTEE,
  GET_COMMITTEES_BY_ROLE,
  GET_COMMITTEE_BY_ID,
  GET_FILE,
  GET_MEETING_BY_ID
} from '../../../../graphql/query';
import { UserContext } from '../../../../context';
import DropDownPicker from '../../../../component/DropDownPicker/DropDownPicker';
import AttachFiles from '../../../../component/attachFiles/AttachFiles';

const EditMeetingGeneralScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route?.params;
  const { meetingsData, setMeetingsData } = useContext(UserContext);

  const [committee, setCommittee] = useState(null);
  const [committeeData, setCommitteeData] = useState(null);
  const [fileResponse, setFileResponse] = useState([]);
  const [filesId, setFilesId] = useState([]);
  const [token, setToken] = useState('');
  const [meeting, setMeeting] = useState(null);
  const [valueCommitee, setValue] = useState(item?.committeeId);
  const [title, setTitle] = useState(item?.meetingTitle);
  const [discription, setDiscription] = useState(item.description);

  const [fetchFile, getFile] = useLazyQuery(GET_FILE);

  const {
    data,
    error: MeetingError,
    loading
  } = useQuery(GET_MEETING_BY_ID, {
    variables: {
      meetingId: item.meetingId
    },
    onCompleted: (data) => {
      if (data) {
        setMeeting(data.meeting);
      }
    },
    onError: (data) => {
      console.log('error in get meeting by id', data);
    }
  });

  // get committee by id
  const Committee = useQuery(GET_COMMITTEE_BY_ID, {
    variables: {
      organizationId: item.committeeId
    },
    onCompleted: (data) => {
      if (data) {
        setCommitteeData(data.committee);
      }
    },
    onError: (data) => {
      console.log('error in get committee by id', data);
    }
  });
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

  item?.attachFileIds?.map((id) => {
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

  useEffect(() => {
    const fileId = fileResponse.map((file) => file.fileEnteryId);

    setFilesId(fileId);
  }, [fileResponse]);
  console.log('file id', filesId);

  useEffect(() => {
    getToken();
  }, [token]);

  const getToken = async () => {
    const user = await AsyncStorage.getItem('@user').catch((e) =>
      console.log(e)
    );
    setToken(JSON.parse(user)?.dataToken);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Edit meeting'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />

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
          {/* title */}

          {/* dropdown committee */}
          <DropDownPicker
            data={committee?.map((item) => ({
              label: item.committeeTitle,
              value: item.organizationId
            }))}
            placeholder={committeeData?.committeeTitle}
            setData={setValue}
            title={'CHOOSE COMMITTEE'}
            value={valueCommitee}
            disable={true}
          />

          <View style={styles.discriptionContainer}>
            <Text style={styles.txtTitle}>TITLE</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setTitle(text)}
              value={title}
            />
          </View>
          <View style={styles.categoryContainer}>
            <Text style={styles.txtTitle}>DESCRIPTION</Text>
            <TextInput
              style={styles.textInput}
              multiline={true}
              onChangeText={(text) => setDiscription(text)}
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
            isShowAttchTitle={true}
          />
        </ScrollView>
      </View>

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
            title={'Next'}
            onPress={() => {
              setMeetingsData({
                ...meetingsData,
                attachFiles: filesId,
                committee: valueCommitee,
                title: title,
                discription: discription
              });
              navigation.navigate('EditMeetingUser', {
                item: item
              });
              // navigation.setParams();
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

export default EditMeetingGeneralScreen;
