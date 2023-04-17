import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Divider } from 'react-native-paper';

import { styles } from './styles';
import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import {
  GET_All_COMMENTS_THREAD,
  GET_FILE,
  GET_MEETING_BY_ID,
  GET_SUBJECT_BY_ID,
  GET_TASK_BY_ID
} from '../../../../graphql/query';
import { SIZES } from '../../../../themes/Sizes';
import moment from 'moment';
import AttachFiles from '../../../../component/attachFiles/AttachFiles';
import CommentCard from '../../../../component/Cards/commentCard/CommentCard';
import { Colors } from '../../../../themes/Colors';
import { DELETE_TASK, UPDATE_COMMENT } from '../../../../graphql/mutation';
import { Button } from '../../../../component/button/Button';
import Loader from '../../../../component/Loader/Loader';

const TaskDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item, isLiveMeeting } = route?.params;
  const [meetingName, setMeetingName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [fileResponse, setFileResponse] = useState([]);
  const [commentId, setCommentId] = useState(null);
  const [commentThreadId, setCommentThreadId] = useState(item?.commentThreadId);
  const [comments, setComments] = useState([]);
  const [commenttext, setCommentText] = useState('');
  const [taskDetails, setTaskDetails] = useState(null);

  //Get meeting attachments
  item?.attachFiles?.map((id) => {
    const getFile = useQuery(GET_FILE, {
      fetchPolicy: 'cache-and-network',
      variables: {
        fileEntryId: id
      },

      onCompleted: (data) => {
        fileResponse.push(data.uploadedFile);
      }
    });
    if (getFile.error) {
      console.log('File error', getFile.error);
    }
  });

  // get meeting by id
  if ((item?.meetingId !== 0) | (item?.meetingId !== null)) {
    const {} = useQuery(GET_MEETING_BY_ID, {
      fetchPolicy: 'cache-and-network',
      variables: {
        meetingId: item?.meetingId
      },
      onCompleted: (data) => {
        if (data) {
          setMeetingName(data?.meeting?.meetingTitle);
        }
      },
      onError: (data) => {
        console.log('error in get meeting by id', data);
      }
    });
  }

  // get subject by id
  if (item?.subjectId !== 0 || item?.subjectId !== null) {
    // get subject by id
    const {} = useQuery(GET_SUBJECT_BY_ID, {
      fetchPolicy: 'cache-and-network',
      variables: { subjectId: item.subjectId },
      onCompleted: (data, error) => {
        if (data) {
          // setCommentThreadId(data.subject.commentThreadId);
          setSubjectName(data?.subject?.subjectTitle);
        }
        if (error) {
          console.log('subject error', error.message);
        }
      }
    });
  }

  const getTaskById = useQuery(GET_TASK_BY_ID, {
    fetchPolicy: 'cache-and-network',
    variables: { id: item.taskId },
    onCompleted: (data) => {
      if (data) {
        setTaskDetails(data.task);
      }
    },
    onError: (data) => {
      console.log('get task by id error', data.message);
    }
  });

  // addComment
  const [
    addComment,
    { data: AddCommentData, loading: AddCommentLoading, error: AddCommentError }
  ] = useMutation(UPDATE_COMMENT, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: [
      {
        query: GET_All_COMMENTS_THREAD,

        variables: { commentCategoryId: commentThreadId, sort: '' }
      }
    ],
    onCompleted: (data) => {
      if (data.addComment.status.statusCode == 200) {
        setCommentId(null);
      }
    }
  });

  if (AddCommentError) {
    console.log('addCommentError', AddCommentError);
  }

  const {
    loading: CommentsLoading,
    error: CommentsError,
    data: CommentsData
  } = useQuery(GET_All_COMMENTS_THREAD, {
    fetchPolicy: 'cache-and-network',
    variables: { commentCategoryId: commentThreadId, sort: '' },
    onCompleted: (data) => {
      if (data) {
        setComments(data.comments.items[0]);
      } else {
        console.log('no comments');
      }
    },
    onError: (data) => {
      console.log('CommentsError error', data.message);
    }
  });

  const GeneralDetails = ({ title, discription }) => {
    return (
      <View style={styles.subView}>
        <Text style={styles.txtSubDetails}>{title}</Text>
        <Text style={styles.txtSubDiscription}>{discription}</Text>
      </View>
    );
  };

  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: ['tasks'],
    onCompleted: (data) => {
      if (data.deleteTask.status.statusCode == '200') {
        navigation.goBack();
      }
    }
  });

  const onDeleteHandler = (id) => {
    Alert.alert('Delete Subject', 'Are you sure you want to delete this?', [
      {
        text: 'Delete',
        onPress: () =>
          deleteTask({
            variables: {
              id: id
            }
          }),
        style: 'destructive'
      },
      {
        text: 'Cancel',
        // onPress: () => {
        //   deleteSubject({
        //     variables: {
        //       subjectId: id
        //     }
        //   });
        // },
        style: 'cancel'
      }
    ]);
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Task details'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => {
          navigation.goBack();
        }}
      />
      {getTaskById.loading ? (
        <Loader color={Colors.primary} size={'large'} />
      ) : taskDetails ? (
        <ScrollView style={styles.subContainer}>
          <View style={{ marginTop: SIZES[24], marginBottom: SIZES[16] }}>
            <Text style={styles.txtTitle}>General</Text>
            <GeneralDetails title={'Title'} discription={taskDetails?.title} />
            <GeneralDetails
              title={'Description'}
              discription={taskDetails?.description}
            />
            <GeneralDetails
              title={'Committee'}
              discription={
                taskDetails?.committeeName !== '' &&
                taskDetails?.committeeName !== null
                  ? taskDetails?.committeeName
                  : '-'
              }
            />
            <GeneralDetails
              title={'Meeting'}
              discription={
                meetingName !== '' && meetingName !== null ? meetingName : '-'
              }
            />
            <GeneralDetails
              title={'Subject'}
              discription={
                subjectName !== '' && subjectName !== null ? subjectName : '-'
              }
            />
          </View>
          <View style={{ marginTop: SIZES[24], marginBottom: SIZES[16] }}>
            <Text style={styles.txtTitle}>User name & time</Text>
            <GeneralDetails
              title={'Executor'}
              discription={taskDetails?.executorName}
            />
            <GeneralDetails
              title={'Deadline'}
              discription={moment(taskDetails?.deadlineDate).format(
                'DD MMM, YYYY'
              )}
            />
            <GeneralDetails
              title={'Priority'}
              discription={taskDetails?.priority}
            />
            <GeneralDetails
              title={'Creator'}
              discription={taskDetails?.userName}
            />
            <GeneralDetails
              title={'Date of creation'}
              discription={moment(taskDetails?.dateOfCreation).format(
                'DD MMM, YYYY'
              )}
            />
          </View>
          {fileResponse?.length > 0 && (
            <AttachFiles
              showAttachButton={false}
              isShowAttchTitle={true}
              download={true}
              deleted={false}
              fileResponse={fileResponse}
              setFileResponse={setFileResponse}
            />
          )}

          {taskDetails?.taskStatus !== 'Deleted' && (
            <View>
              <Text style={styles.txtcommentsTitle}>Comments</Text>

              <View>
                <FlatList
                  data={comments?.childComment}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => {
                    return index.toString();
                  }}
                  renderItem={({ item, index }) => (
                    <CommentCard
                      item={item}
                      commentThreadId={commentThreadId}
                      index={index}
                      setComment={setCommentText}
                      setCommentId={setCommentId}
                      commenttext={commenttext}
                    />
                  )}
                />
              </View>

              {
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
                      if (commentId == null) {
                        addComment({
                          variables: {
                            comment: {
                              comment: commenttext,
                              commentId: 0,
                              parentCommentId: comments.commentId
                            }
                          }
                        });
                      } else {
                        addComment({
                          variables: {
                            comment: {
                              comment: commenttext,
                              commentId: commentId
                            }
                          }
                        });
                      }

                      setCommentText('');
                    }}
                  >
                    <Icon
                      name={IconName.Send}
                      height={SIZES[22]}
                      width={SIZES[20]}
                    />
                  </TouchableOpacity>
                </View>
              }
            </View>
          )}
        </ScrollView>
      ) : null}
      {item?.isHead && item?.taskStatus !== 'Deleted' && !isLiveMeeting && (
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
              onPress={() =>
                navigation.navigate('AddTask', {
                  meetingDetails: null,
                  isMeetingTask: false,
                  isEdit: true,
                  taskData: item
                })
              }
              layoutStyle={styles.cancelBtnLayout}
              textStyle={styles.txtCancelButton}
            />
            <Button
              title={'Delete'}
              onPress={() => {
                onDeleteHandler(item?.taskId);
              }}
              layoutStyle={[styles.nextBtnLayout]}
              textStyle={styles.txtNextBtn}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default TaskDetails;
