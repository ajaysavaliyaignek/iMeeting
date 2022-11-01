import { View, Text, SafeAreaView, TextInput, ScrollView } from 'react-native';
import React, { useState, useCallback } from 'react';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native';
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
import { GET_All_COMMITTEE, GET_FILE } from '../../../../graphql/query';

const AddMeetingGeneralScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [discription, setDiscription] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [committee, setCommittee] = useState(null);
  const [items, setItems] = useState([{ label: 'Design', value: 'design' }]);
  const [fileResponse, setFileResponse] = useState([]);
  const [filesId, setFilesId] = useState([]);
  let fileId = [];

  const [fetchFile, getFile] = useLazyQuery(GET_FILE);

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

          fetch(`http://128.199.26.43:9080/o/imeeting-rest/v1.0/file-upload`, {
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
        name={'Add meeting'}
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
              value={value}
              items={
                committee?.map((item) => ({
                  label: item.committeeTitle,
                  value: item.organizationId
                })) || items
              }
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder={'Subject committee'}
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
              onChangeText={(text) => setTitle(text)}
            />
          </View>
          <View style={styles.categoryContainer}>
            <Text style={styles.txtTitle}>DISCRIPTION</Text>
            <TextInput
              style={styles.textInput}
              multiline={true}
              onChangeText={(text) => setDiscription(text)}
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
                  onDownloadPress={() => navigation.navigate('SubjectDownload')}
                  fileType={file.type}
                  onRemovePress={() => removeFile(file.fileEnteryId)}
                  style={{
                    borderBottomWidth: SIZES[1],
                    borderBottomColor: Colors.Approved
                  }}
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
            onPress={() => navigation.navigate('AddMeetingUser')}
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

export default AddMeetingGeneralScreen;
