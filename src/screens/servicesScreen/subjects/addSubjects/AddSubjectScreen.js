import { View, Text, SafeAreaView, TextInput, ScrollView } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Divider } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';

import { styles } from './styles';
import { IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { Fonts } from '../../../../themes';
import FilesCard from '../../../../component/Cards/FilesCard';
import { Button } from '../../../../component/button/Button';
import Header from '../../../../component/header/Header';
import {
  GET_All_COMMITTEE,
  GET_All_SUBJECTS,
  GET_All_SUBJECTS_CATEGORY,
  GET_FILE
} from '../../../../graphql/query';
import { UPDATE_SUBJECTS } from '../../../../graphql/mutation';
import Loader from '../../../../component/Loader/Loader';
import { SIZES } from '../../../../themes/Sizes';

const AddSubjectScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [discription, setDescription] = useState('');
  const [openCategory, setOpenCategory] = useState(false);
  const [openCommittee, setOpenCommitee] = useState(false);
  const [openMeeting, setOpenMeeting] = useState(false);
  const [valueCategory, setValueCategory] = useState(null);
  const [valueCommittee, setValueCommittee] = useState(null);
  const [valueMeeting, setValueMeeting] = useState();
  const [fileResponse, setFileResponse] = useState([]);
  const [filesId, setFilesId] = useState([]);
  const [token, setToken] = useState('');
  const [category, setCategory] = useState([]);
  const [committees, setCommittee] = useState([]);
  const [items, setItems] = useState([{ label: 'Design', value: 'design' }]);
  let fileId = [];

  // useEffect(() => {
  //   getToken();
  // }, []);

  // const getToken = async () => {
  //   const user = await AsyncStorage.getItem('@user').catch((e) =>
  //     console.log(e)
  //   );
  //   setToken(JSON.parse(user)?.dataToken);
  //   console.log('token', token);
  // };
  // fetch file
  const [fetchFile, getFile] = useLazyQuery(GET_FILE);

  // fetch subject category
  const { loading: SubjectCategoryLoading, error: SubjeCategoryError } =
    useQuery(GET_All_SUBJECTS_CATEGORY, {
      onCompleted: (data) => {
        if (data) {
          console.log('subject category', data.subjectCategories.items);
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

  const [addSubject, { data, loading, error }] = useMutation(UPDATE_SUBJECTS, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: [{ query: GET_All_SUBJECTS }]
  });
  if (data) {
    console.log(data);
  }
  if (error) {
    console.log('addsubject error--', error);
  }

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
        name={'Add subject'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        {SubjectCategoryLoading ? (
          <Loader />
        ) : (
          <ScrollView
            style={styles.subContainer}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.txtAddSubjectTitle}>Add subject</Text>
            {/* title */}
            <View style={styles.titleContainer}>
              <Text style={styles.txtTitle}>TITLE</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => setTitle(text)}
              />
            </View>
            <View style={styles.discriptionContainer}>
              <Text style={styles.txtTitle}>DISCRIPTION</Text>
              <TextInput
                style={styles.textInput}
                multiline={true}
                onChangeText={(text) => setDescription(text)}
              />
            </View>
            <View style={styles.categoryContainer}>
              <Text style={styles.txtTitle}>SUBJECT CATEGORY</Text>
              <DropDownPicker
                listMode="SCROLLVIEW"
                open={openCategory}
                value={valueCategory}
                items={category.map((item) => ({
                  label: item.categoryTitle,
                  value: item.id
                }))}
                setOpen={() => {
                  setOpenCommitee(false);
                  setOpenCategory(!openCategory);
                }}
                setValue={setValueCategory}
                setItems={setItems}
                placeholder={'Select category'}
                placeholderStyle={{
                  ...Fonts.PoppinsRegular[12],
                  color: Colors.secondary
                }}
                arrowIconStyle={{
                  height: SIZES[12],
                  width: SIZES[14]
                }}
                style={{
                  borderWidth: 0,
                  paddingRight: SIZES[16],
                  paddingLeft: 0
                }}
                textStyle={{ ...Fonts.PoppinsRegular[14] }}
              />
            </View>
            <View style={styles.committeeContainer}>
              <Text style={styles.txtTitle}>SELECT COMMITTEE</Text>
              <DropDownPicker
                listMode="SCROLLVIEW"
                open={openCommittee}
                value={valueCommittee}
                items={committees?.map((item) => ({
                  label: item.committeeTitle,
                  value: item.organizationId
                }))}
                setOpen={() => {
                  setOpenCommitee(!openCommittee);
                  setOpenCategory(false);
                }}
                setValue={setValueCommittee}
                setItems={setItems}
                placeholder={'Select committee'}
                placeholderStyle={{
                  ...Fonts.PoppinsRegular[12],
                  color: Colors.secondary
                }}
                arrowIconStyle={{
                  height: SIZES[12],
                  width: SIZES[14]
                }}
                style={{
                  borderWidth: 0,
                  paddingRight: SIZES[16],
                  paddingLeft: 0
                }}
                textStyle={{ ...Fonts.PoppinsRegular[14] }}
              />
            </View>

            <View style={styles.meetingContainer}>
              <Text style={styles.txtTitle}>SELECT MEETING</Text>
              <DropDownPicker
                listMode="SCROLLVIEW"
                open={openMeeting}
                value={valueMeeting}
                items={committees?.map((item) => ({
                  label: item.committeeTitle,
                  value: item.organizationId
                }))}
                setOpen={() => {
                  setOpenMeeting(!openMeeting);
                  setOpenCategory(false);
                  setOpenCommitee(false);
                }}
                setValue={setValueMeeting}
                setItems={setItems}
                placeholder={'Select meeting'}
                placeholderStyle={{
                  ...Fonts.PoppinsRegular[12],
                  color: Colors.secondary
                }}
                arrowIconStyle={{
                  height: SIZES[12],
                  width: SIZES[14]
                }}
                style={{
                  borderWidth: 0,
                  paddingRight: SIZES[16],
                  paddingLeft: 0
                }}
                textStyle={{ ...Fonts.PoppinsRegular[14] }}
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
                    onDownloadPress={() =>
                      navigation.navigate('SubjectDownload')
                    }
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
                layoutStyle={{
                  backgroundColor: 'rgba(243, 246, 249,1)',
                  marginBottom: 32
                }}
                textStyle={{
                  ...Fonts.PoppinsSemiBold[14],
                  color: Colors.primary
                }}
                onPress={() => handleDocumentSelection()}
              />
            </View>
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
                console.log('subjectTitle', title);
                console.log('description', discription);
                console.log('attachFileIds', filesId);
                console.log('valueCommittee', valueCommittee);
                console.log('valueCategory', valueCategory);
                addSubject({
                  variables: {
                    subject: {
                      subjectId: 0,
                      committeeId: valueCommittee,
                      subjectTitle: title,
                      description: discription,
                      subjectCategoryId: valueCategory,
                      draft: false,
                      attachFileIds: filesId
                    }
                  },
                  onCompleted: () => {
                    navigation.navigate('Details', {
                      title: 'Subjects',
                      active: '1'
                    });
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

export default AddSubjectScreen;
