import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import React, { useState } from 'react';
import { styles } from './styles';
import Header from '../../../component/header/Header';
import { Icon, IconName } from '../../../component';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../../themes/Colors';
import SubjectDetailsComponent from '../../../component/subjectDetailsComponent/SubjectDetailsComponent';
import { DELETE_SUBJECTS, UPDATE_COMMENT } from '../../../graphql/mutation';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_All_COMMENTS_THREAD,
  GET_All_SUBJECTS,
  GET_SUBJECT_BY_ID
} from '../../../graphql/query';
import LiveMeetingSubjectVotingsDetails from '../liveMeetingSubjectVotingDetails/LiveMeetingSubjectVotingsDetails';
import LiveMeetingSubjectTaskDetails from '../liveMeetingSubjectTaskDetails/LiveMeetingSubjectTaskDetails';
import LiveMeetingSubjectDecision from '../liveMeetingSubjectDecision/LiveMeetingSubjectDecision';
import { Button } from '../../../component/button/Button';
import { Divider } from 'react-native-paper';

const LiveMeetingSubjectDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item, meetingData } = route?.params;
  const [activeTab, setActiveTab] = useState('Details');
  const [commentThreadId, setCommentThreadId] = useState(null);
  const [comments, setComments] = useState([]);
  const [commenttext, setCommentText] = useState('');
  const [commentId, setCommentId] = useState(null);

  // get subject by id
  const {
    loading: SubjectLoading,
    error: SubjectError,
    data: SubjectsData
  } = useQuery(GET_SUBJECT_BY_ID, {
    fetchPolicy: 'cache-and-network',
    variables: { subjectId: item.subjectId },
    onCompleted: (data, error) => {
      console.log('subject data', data);
      if (data) {
        setCommentThreadId(data.subject.commentThreadId);
      }
      if (error) {
        console.log('subject error', error.message);
      }
    }
  });

  // get comment thread id
  const {
    loading: CommentsLoading,
    error: CommentsError,
    data: CommentsData
  } = useQuery(GET_All_COMMENTS_THREAD, {
    fetchPolicy: 'cache-and-network',
    variables: { commentCategoryId: commentThreadId },
    onCompleted: (data) => {
      if (data) {
        // console.log('comments data', data.comments);
        console.log('items data', data.comments.items[0].childComment[0]);

        // console.log('commentsChild data', data.comments.items[0].childComment);

        setComments(data.comments.items[0]);
      } else {
        console.log('no comments');
      }
    },
    onError: (data) => {
      console.log('CommentsError error', data.message);
    }
  });

  // update comment
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
    ],
    onCompleted: (data) => {
      console.log('add comment data', data.addComment.status[0].statusCode);
      if (data.addComment.status[0].statusCode == 200) {
        setCommentId(null);
      }
    },
    onError: (data) => {
      console.log('addCommentError', data.message);
    }
  });

  const navigationMenu = [
    { id: '0', name: 'Details' },
    { id: '1', name: 'Votings' },
    { id: '2', name: 'Tasks' },
    { id: '3', name: 'Decisions' }
  ];

  // alert for delete subject
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

  // delete subject
  const [deleteSubject, { data, loading, error }] = useMutation(
    DELETE_SUBJECTS,
    {
      // export const GET_All_SUBJECTS = gql`
      refetchQueries: [
        {
          query: GET_All_SUBJECTS,
          variables: {
            committeeIds: '',
            searchValue: '',
            screen: 0,
            page: -1,
            pageSize: -1
          }
        }
      ],
      onCompleted: (data, error) => {
        if (data) {
          if (
            data.deleteSubject.status.statusMessage === 'Deleted Successfully'
          ) {
            navigation.goBack();
          }
        }
        if (error) {
          Alert.alert('Delete Subject Error', [
            {
              text: error,

              style: 'default'
            }
          ]);
        }
      }
    }
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Subject details'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <View style={styles.menuContainer}>
          {navigationMenu.map((menu) => {
            return (
              <TouchableOpacity
                key={menu.id}
                style={[
                  styles.btnContainer,
                  {
                    backgroundColor:
                      activeTab == menu.name ? Colors.white : 'transparent'
                  }
                ]}
                onPress={() => {
                  setActiveTab(menu.name);
                }}
              >
                <Text style={styles.txtMenu}>{menu.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {activeTab == 'Details' && (
          <SubjectDetailsComponent
            item={item}
            addComment={addComment}
            commentId={commentId}
            setCommentId={setCommentId}
            commenttext={commenttext}
            setCommentText={setCommentText}
            commentThreadId={commentThreadId}
            comments={comments}
            setComments={setComments}
          />
        )}
        {activeTab == 'Votings' && (
          <LiveMeetingSubjectVotingsDetails
            meetingData={meetingData}
            item={item}
          />
        )}
        {activeTab == 'Tasks' && (
          <LiveMeetingSubjectTaskDetails
            meetingData={meetingData}
            item={item}
          />
        )}
        {activeTab == 'Decisions' && (
          <LiveMeetingSubjectDecision meetingData={meetingData} item={item} />
        )}
      </View>
      {meetingData?.yourRoleName !== 'Member' && (
        <View
          style={{
            backgroundColor: Colors.white,
            justifyContent: 'flex-end'
          }}
        >
          {/* Divider */}
          <Divider style={styles.divider} />

          <View
            style={[
              styles.buttonContainer,
              { flexDirection: 'row', justifyContent: 'space-between' }
            ]}
          >
            <Button
              title={'Edit'}
              layoutStyle={styles.cancelBtnLayout}
              textStyle={styles.txtCancelButton}
              onPress={() => {
                navigation.navigate('AddSubject', {
                  committee: item?.committeeId,
                  isEdit: true,
                  subjectDetails: item,
                  screenName: 'Edit subject',
                  meetingName: meetingData?.meetingTitle,
                  meetingId: meetingData?.meetingId
                });
              }}
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
      )}
    </SafeAreaView>
  );
};

export default LiveMeetingSubjectDetails;
