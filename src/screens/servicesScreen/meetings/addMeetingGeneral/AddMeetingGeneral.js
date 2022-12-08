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
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import DropDownPicker from 'react-native-dropdown-picker';
import { Divider } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import { useLazyQuery, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { Fonts } from '../../../../themes';
import FilesCard from '../../../../component/Cards/FilesCard';
import { Button } from '../../../../component/button/Button';
import Header from '../../../../component/header/Header';
import { SIZES } from '../../../../themes/Sizes';
import { styles } from './styles';
import { GET_COMMITTEES_BY_ROLE, GET_FILE } from '../../../../graphql/query';
import Loader from '../../../../component/Loader/Loader';

import { UserContext } from '../../../../context';

const AddMeetingGeneralScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [discription, setDiscription] = useState('');
  const [open, setOpen] = useState(false);
  const [valueCommitee, setValue] = useState(null);
  const [committee, setCommittee] = useState(null);
  const [items, setItems] = useState([{ label: 'Design', value: 'design' }]);
  const [fileResponse, setFileResponse] = useState([]);
  const [filesId, setFilesId] = useState(null);
  const [token, setToken] = useState('');
  const { meetingsData, setMeetingsData } = useContext(UserContext);

  const [fetchFile, getFile] = useLazyQuery(GET_FILE);

  // fetch commitees
  const {
    loading: CommitteeLoading,
    error: CommitteeError,
    data: CommitteeData
  } = useQuery(GET_COMMITTEES_BY_ROLE, {
    variables: { head: true, secretary: true, member: false },
    onCompleted: (data) => {
      console.log('committees by  role', data?.committeesByRole.items);
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

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pickMultiple({
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
        copyTo: 'cachesDirectory'
      });
      const url = await AsyncStorage.getItem('@url');
      const user = await AsyncStorage.getItem('@token');

      // console.log('file response', response);
      console.log('token', user);
      response.map((res) => {
        if (res !== null) {
          const formData = new FormData();
          formData.append('file', res);
          console.log('formdata', formData);
          console.log('companyUrl', url);

          fetch(`https://${url}//o/imeeting-rest/v1.0/file-upload`, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + `${user}`,
              'Content-Type': 'multipart/form-data'
            },
            body: formData
          })
            .then((response) => response.json())
            .then((responseData) => {
              console.log('response data', responseData);
              if (responseData) {
                setFileResponse((prev) => {
                  const pevDaa = prev.filter((ite) => {
                    return ite.fileEnteryId !== responseData.fileEnteryId;
                  });
                  return [...pevDaa, responseData];
                });
              }
            })

            .catch((e) => console.log('file upload error--', e));
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    const fileId = fileResponse.map((file) => file.fileEnteryId);

    setFilesId(fileId);
  }, [fileResponse]);

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
        name={'Add meeting'}
        rightIconName={IconName.Close}
        onRightPress={() =>
          navigation.navigate('Details', {
            title: 'Meetings',
            active: '0'
          })
        }
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
            {CommitteeLoading && <Loader />}
            <Text style={styles.txtTitle}>CHOOSE COMMITTEE</Text>
            <DropDownPicker
              listMode="SCROLLVIEW"
              open={open}
              value={valueCommitee}
              items={
                committee
                  ? committee?.map((comm) => ({
                      label: comm.committeeTitle,
                      value: comm.organizationId
                    }))
                  : items
              }
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder={''}
              placeholderStyle={{
                ...Fonts.PoppinsRegular[12],
                color: Colors.secondary
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
            />
          </View>
          <View style={{ marginTop: 24 }}>
            <Text style={styles.txtAttachFile}>ATTACH FILE</Text>
            {fileResponse?.map((file, index) => {
              return (
                <FilesCard
                  key={index}
                  filePath={file.name}
                  fileSize={file.size}
                  // onDownloadPress={() => checkPermission(file.downloadUrl)}
                  fileType={file.type}
                  onRemovePress={() => removeFile(file)}
                  style={{
                    borderBottomWidth: SIZES[1],
                    borderBottomColor: Colors.Approved
                  }}
                  download={true}
                  deleted={true}
                  fileUrl={file.downloadUrl}
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
            disable={
              title == '' || discription == '' || valueCommitee == null
                ? true
                : false
            }
            title={'Next'}
            onPress={() => {
              setMeetingsData({
                ...meetingsData,
                attachFiles: filesId,
                committee: valueCommitee,
                title: title,
                discription: discription
              });
              navigation.navigate('AddMeetingUser');
            }}
            layoutStyle={[
              {
                opacity:
                  title === '' || discription === '' || valueCommitee == null
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

export default AddMeetingGeneralScreen;
