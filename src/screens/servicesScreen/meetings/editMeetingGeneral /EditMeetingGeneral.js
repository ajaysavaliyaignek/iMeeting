import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  ScrollView,
  PermissionsAndroid,
  Platform
} from 'react-native';
import React, { useState, useCallback, useEffect, useContext } from 'react';
import * as Progress from 'react-native-progress';
import { useNavigation, useRoute } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import DropDownPicker from 'react-native-dropdown-picker';
import { Divider } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import { useLazyQuery, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';

import { IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { Fonts } from '../../../../themes';
import FilesCard from '../../../../component/Cards/FilesCard';
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

const EditMeetingGeneralScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route?.params;
  const { meetingsData, setMeetingsData } = useContext(UserContext);

  const [open, setOpen] = useState(false);
  const [committee, setCommittee] = useState(null);
  const [committeeData, setCommitteeData] = useState(null);
  const [items, setItems] = useState([{ label: 'Design', value: 'design' }]);
  const [fileResponse, setFileResponse] = useState([]);
  const [filesId, setFilesId] = useState([]);
  const [token, setToken] = useState('');
  const [meeting, setMeeting] = useState(null);
  const [valueCommitee, setValue] = useState(item?.committeeId);
  const [title, setTitle] = useState(item?.meetingTitle);
  const [discription, setDiscription] = useState(item.description);
  const [error, setError] = useState('');
  let fileId = [];

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

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pickMultiple({
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.allFiles]
      });
      const url = await AsyncStorage.getItem('@url');
      response.map((res) => {
        if (res !== null) {
          const formData = new FormData();
          formData.append('file', res);
          console.log('formdata', formData);

          fetch(`https://${url}//o/imeeting-rest/v1.0/file-upload`, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + `${token}`,
              'Content-Type': 'multipart/form-data'
            },
            body: formData
          })
            .then((response) => response.json())
            .then((responseData) => {
              // setFileId(responseData?.fileEnteryId);
              if (responseData) {
                setFileResponse((prev) => {
                  const pevDaa = prev.filter((ite) => {
                    return ite.fileEnteryId !== responseData.fileEnteryId;
                  });
                  return [...pevDaa, responseData];
                });
              }
            })
            .then(() => {})
            .catch((e) => {
              console.log('file upload error--', e);
              // setError(e);
            });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const removeFile = (file) => {
    setFileResponse((prev) => {
      const pevDaa = prev.filter((ite) => {
        return ite.fileEnteryId !== file.fileEnteryId;
      });
      return [...pevDaa];
    });
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
          <View style={styles.titleContainer}>
            <Text style={styles.txtTitle}>CHOOSE COMMITTEE</Text>
            <DropDownPicker
              disabled={true}
              listMode="SCROLLVIEW"
              open={open}
              value={valueCommitee}
              items={
                committee?.map((item) => ({
                  label: item.committeeTitle,
                  value: item.organizationId
                })) || items
              }
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder={committeeData?.committeeTitle}
              placeholderStyle={{
                ...Fonts.PoppinsRegular[14]
              }}
              style={{
                borderWidth: 0,
                paddingLeft: 0,
                paddingRight: SIZES[16]
              }}
              textStyle={{ ...Fonts.PoppinsRegular[14] }}
            />
            {/* <TextInput style={styles.textInput} /> */}
          </View>
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
          <View style={{ marginTop: 24 }}>
            <Text style={styles.txtAttachFile}>ATTACH FILE</Text>
            {fileResponse?.map((file, index) => {
              console.log('from retuen', file);
              return (
                <FilesCard
                  key={index}
                  filePath={file.name}
                  fileSize={file.size}
                  fileUrl={file.downloadUrl}
                  fileType={file.type}
                  onRemovePress={() => removeFile(file)}
                  style={{
                    borderBottomWidth: SIZES[1],
                    borderBottomColor: Colors.Approved
                  }}
                  download={true}
                  deleted={true}
                />
              );
            })}
            <Button
              title={'Attach file'}
              layoutStyle={{ backgroundColor: 'rgba(243, 246, 249,1)' }}
              textStyle={{
                ...Fonts.PoppinsSemiBold[14],
                color: Colors.primary
              }}
              onPress={() => handleDocumentSelection()}
            />
            {error && (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text>{error}</Text>
              </View>
            )}
          </View>
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
