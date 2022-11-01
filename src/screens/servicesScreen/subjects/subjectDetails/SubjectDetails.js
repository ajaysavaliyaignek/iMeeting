import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  FlatList
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider, TextInput } from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob';

import { styles } from './styles';
import FilesCard from '../../../../component/Cards/FilesCard';
import { Colors } from '../../../../themes/Colors';
import { Fonts } from '../../../../themes';
import { Button } from '../../../../component/button/Button';
import CommentCard from '../../../../component/Cards/commentCard/CommentCard';
import { Icon, IconName } from '../../../../component';
import Header from '../../../../component/header/Header';
import { SIZES } from '../../../../themes/Sizes';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_All_COMMENTS_THREAD,
  GET_All_SUBJECTS,
  GET_FILE,
  GET_SUBJECT_BY_ID
} from '../../../../graphql/query';
import { DELETE_SUBJECTS, UPDATE_COMMENT } from '../../../../graphql/mutation';

const SubjectDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route?.params;
  console.log('item-----', item);

  const [openReply, setOpenReply] = useState(false);
  const [fileId, setFileId] = useState(item?.attachFileIds);
  const [commentThreadId, setCommentThreadId] = useState(null);
  const [fileResponse, setFileResponse] = useState([]);
  const [comments, setComments] = useState([]);
  const [commenttext, setCommentText] = useState('');
  const keyboardVerticalOffset = Platform.OS === 'ios' ? -350 : -600;

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

  fileId?.map((id) => {
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

  console.log('file response', fileResponse);

  const {
    loading: SubjectLoading,
    error: SubjectError,
    data: SubjectsData
  } = useQuery(GET_SUBJECT_BY_ID, {
    variables: { subjectId: item.subjectId },
    onCompleted: (data) => {
      console.log('subject data', data);
      if (data) {
        setCommentThreadId(data.subject.commentThreadId);
      }
    }
  });

  if (SubjectsData) {
    console.log('SubjectsData', SubjectsData.subject);
  }

  if (SubjectError) {
    console.log('subject error', SubjectError);
  }

  console.log('commentThreadId', commentThreadId);

  const {
    loading: CommentsLoading,
    error: CommentsError,
    data: CommentsData
  } = useQuery(GET_All_COMMENTS_THREAD, {
    variables: { commentCategoryId: commentThreadId },
    onCompleted: (data) => {
      if (data) {
        console.log('comments data', data.comments.items);
        setComments(data.comments.items);
      } else {
        console.log('no comments');
      }
    }
  });

  if (CommentsData) {
    console.log('CommentsData', CommentsData.comments.items);
  }

  if (CommentsError) {
    console.log('CommentsError error', CommentsError);
  }

  // addComment
  const [
    addComment,
    { data: AddCommentData, loading: AddCommentLoading, error: AddCommentError }
  ] = useMutation(UPDATE_COMMENT, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: [
      {
        query: GET_All_COMMENTS_THREAD,

        variables: { commentCategoryId: commentThreadId }
      }
    ]
  });

  if (AddCommentData) {
    console.log('addComment', AddCommentData);
  }
  if (AddCommentError) {
    console.log('addCommentError', AddCommentError);
  }

  const [deleteSubject, { data, loading, error }] = useMutation(
    DELETE_SUBJECTS,
    {
      // export const GET_All_SUBJECTS = gql`
      refetchQueries: [{ query: GET_All_SUBJECTS }]
    }
  );
  if (data) {
    if (data.deleteSubject.status.statusMessage === 'Deleted Successfully') {
      navigation.navigate('Details');
    }
    console.log('delete data', data.deleteSubject.status);
  }
  if (error) {
    Alert.alert('Delete Subject Error', [
      {
        text: error,

        style: 'default'
      }
    ]);
  }

  const onDeleteHandler = (id) => {
    Alert.alert('Delete Subject', 'Are you sure you want to delete this?', [
      {
        text: 'Delete',
        onPress: () =>
          deleteSubject({
            variables: {
              subjectId: id
            }
          }),
        style: 'destructive'
      },
      {
        text: 'Cancel',
        // onPress: () => navigation.navigate("Login"),
        style: 'cancel'
      }
    ]);
  };

  const generalDetails = (title, discription) => {
    return (
      <View style={styles.subView}>
        <Text style={styles.txtSubDetails}>{title}</Text>
        <Text style={styles.txtSubDiscription}>{discription}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Subject details'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.subContainer}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <Text style={styles.txtTitle}>General</Text>
          {generalDetails('Title', item.subjectTitle)}
          {generalDetails('Discription', item.description)}
          {generalDetails('Subject category', item.subjectCategoryName)}
          {generalDetails('Committeee ', item.committeeName)}
          {generalDetails('Creator', item.createrName)}
          {generalDetails('Date of creation', item.dateOfCreation)}

          {/* attach file */}
          <Text style={styles.txtAttachedTitle}>ATTACHED FILES</Text>
          {fileResponse?.map((file, index) => {
            return (
              <FilesCard
                download={true}
                deleted={false}
                key={index}
                filePath={file.name}
                fileSize={file.size}
                onDownloadPress={() => checkPermission(file.downloadUrl)}
                fileType={file.type}
              />
            );
          })}

          {/* comments     */}
          <Text style={styles.txtcommentsTitle}>Comments</Text>

          <View>
            <FlatList
              data={comments[0]?.childComment}
              showsVerticalScrollIndicator={false}
              keyExtractor={({ item, index }) => `${item?.commentId}`}
              renderItem={({ item, index }) => (
                <CommentCard item={item} commentThreadId={commentThreadId} />
              )}
            />
            {/* <CommentCard /> */}

            {/* <TouchableOpacity
              onPress={() => setOpenReply(!openReply)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: SIZES[16]
              }}
            >
              <Icon
                name={openReply ? IconName.Arrow_Down : IconName.Arrow_Right}
                height={SIZES[10]}
                width={SIZES[10]}
              />

              <Text
                style={{
                  ...Fonts.PoppinsRegular[14],
                  color: Colors.primary,
                  marginLeft: SIZES[8]
                }}
              >
                Show 2 replies
              </Text>
            </TouchableOpacity> */}
          </View>

          {/* {openReply && (
              <View style={{ marginLeft: SIZES[24], marginTop: SIZES[24] }}>
                {comments}
                <CommentCard />
                <Text
                  style={{
                    ...Fonts.PoppinsRegular[14],
                    color: '#144B8D',
                    marginTop: SIZES[16]
                  }}
                >
                  Reply
                </Text>
              </View>
            )} */}
          <View
            style={{
              paddingVertical: SIZES[14],
              paddingHorizontal: SIZES[16],
              borderWidth: SIZES[1],
              borderColor: Colors.line,
              borderRadius: SIZES[8],
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: SIZES[32],
              marginBottom: SIZES[24]
            }}
          >
            <TextInput
              style={{
                flex: 1,
                height: SIZES[30],
                backgroundColor: Colors.white
              }}
              value={commenttext}
              underlineColor={Colors.white}
              activeUnderlineColor={Colors.white}
              placeholder={'Your comment'}
              onChangeText={(text) => setCommentText(text)}
            />
            <TouchableOpacity
              onPress={() => {
                console.log('commenttext', commenttext);
                console.log('parentCommentId', comments[0]?.parentCommentId);
                addComment({
                  variables: {
                    comment: {
                      comment: commenttext,
                      commentId: 0,
                      parentCommentId: comments[0]?.commentId
                    }
                  }
                });
                setCommentText('');
              }}
            >
              <Icon name={IconName.Send} height={SIZES[22]} width={SIZES[20]} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
            title={'Edit'}
            onPress={() => navigation.navigate('EditSubject', { item })}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Delete'}
            onPress={() => {
              onDeleteHandler(item.subjectId);
            }}
            layoutStyle={[styles.nextBtnLayout]}
            textStyle={styles.txtNextBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SubjectDetails;
