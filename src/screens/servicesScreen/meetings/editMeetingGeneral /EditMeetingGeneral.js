import { View, Text, SafeAreaView, TextInput, ScrollView } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import * as Progress from 'react-native-progress';
import { useNavigation, useRoute } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import DropDownPicker from 'react-native-dropdown-picker';
import { Divider } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import { useLazyQuery, useQuery } from '@apollo/client';

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
  GET_COMMITTEE_BY_ID,
  GET_FILE,
  GET_MEETING_BY_ID
} from '../../../../graphql/query';
import { BASE_URL } from '../../../../ApolloClient/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditMeetingGeneralScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route?.params;
  console.log('item', item);

  const [open, setOpen] = useState(false);

  const [committee, setCommittee] = useState(null);
  const [committeeData, setCommitteeData] = useState(null);
  const [items, setItems] = useState([{ label: 'Design', value: 'design' }]);
  const [fileResponse, setFileResponse] = useState([]);
  const [filesId, setFilesId] = useState([]);
  const [token, setToken] = useState('');
  const [meeting, setMeeting] = useState(null);
  console.log('committeeData', committeeData);
  const [valueCommitee, setValue] = useState(item?.committeeId);
  const [title, setTitle] = useState(item?.meetingTitle);
  const [discription, setDiscription] = useState(item.description);
  let fileId = [];

  const checkPermission = async (file) => {
    console.log('check permission');
    if (Platform.OS === 'ios') {
      downloadFile(file);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'Application needs access to your storage to download File'
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadFile(file);
          console.log('Storage Permission Granted.');
        } else {
          // If permission denied then show alert
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log('++++' + err);
      }
    }
  };

  const downloadFile = (file) => {
    console.log('downloadfile');
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = file;
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true
      }
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then((res) => {
        // Alert after successful downloading
        console.log('res -> ', res.respInfo.redirects[0]);
        alert('File Downloaded Successfully.');
        if (Platform.OS == 'ios') {
          RNFetchBlob.ios.openDocument(res.respInfo.redirects[0]);
        }
      });
  };

  const getFileExtention = (fileUrl) => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  const [fetchFile, getFile] = useLazyQuery(GET_FILE);

  const { data, error, loading } = useQuery(GET_MEETING_BY_ID, {
    variables: {
      meetingId: item.meetingId
    },
    onCompleted: (data) => {
      console.log('meeting by id', data.meeting);
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
      console.log('get committee by id', data);
      if (data) {
        setCommitteeData(data.committee);
      }
    },
    onError: (data) => {
      console.log('error in get committee by id', data);
    }
  });
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
  item?.attachFileIds?.map((id) => {
    const { loading, error } = useQuery(GET_FILE, {
      variables: {
        fileEntryId: id
      },
      onCompleted: (data) => {
        setFileResponse((prev) => {
          console.log('prev', prev);
          if (prev.fileEnteryId !== id) {
            return [...prev, data.uploadedFile];
          }
        });
      }
    });
    if (error) {
      console.log('file error', error);
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

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pickMultiple({
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.allFiles]
      });

      response.map((res) => {
        if (res !== null) {
          const formData = new FormData();
          formData.append('file', res);
          console.log('formdata', formData);

          fetch(`${BASE_URL}/o/imeeting-rest/v1.0/file-upload`, {
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
              fileId.push(responseData?.fileEnteryId);
              console.log('fileId', fileId);
              setFilesId(fileId);

              if (fileId) {
                fileId.map((id) =>
                  fetchFile({
                    variables: {
                      fileEntryId: id
                    },
                    onCompleted: (data) => {
                      console.log(data, 'inner file dartas');
                      setFileResponse((prev) => {
                        console.log('prev', prev);
                        if (prev.fileEnteryId !== id) {
                          return [...prev, data.uploadedFile];
                        }
                      });
                    }
                  })
                );
              }
            })
            .then(() => {})
            .catch((e) => console.log('file upload error--', e));
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const removeFile = (id) => {
    const filteredData = fileResponse?.filter(
      (item) => item.fileEnteryId !== id
    );
    //Updating List Data State with NEW Data.
    setFileResponse(filteredData);
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
                  onDownloadPress={() => checkPermission(file.downloadUrl)}
                  fileType={file.type}
                  onRemovePress={() => removeFile(file.fileEnteryId)}
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
              navigation.navigate('EditMeetingUser', {
                attachFiles: filesId,
                committee: valueCommitee,
                title: title,
                discription: discription,
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
