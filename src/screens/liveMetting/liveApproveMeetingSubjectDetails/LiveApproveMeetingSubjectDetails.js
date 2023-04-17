import { View, SafeAreaView, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Divider } from 'react-native-paper';

import { styles } from './styles';
import Header from '../../../component/header/Header';
import { IconName } from '../../../component';
import { Colors } from '../../../themes/Colors';
import SubjectDetailsComponent from '../../../component/subjectDetailsComponent/SubjectDetailsComponent';
import { DELETE_SUBJECTS, UPDATE_COMMENT } from '../../../graphql/mutation';
import {
  GET_All_COMMENTS_THREAD,
  GET_All_SUBJECTS,
  GET_SUBJECT_BY_ID
} from '../../../graphql/query';
import LiveMeetingSubjectDecision from '../liveMeetingSubjectDecision/LiveMeetingSubjectDecision';
import { Button } from '../../../component/button/Button';
import NavigationMenuForApproveSubjectsMeeting from '../../../component/navigationMenuForMeetingSubjects/NavigationMenuForApproveSubjectsMeeting';
import DetailsComponent from '../../../component/detailsComponent/meetingDetailsComponent/MeetingDetailsComponent';
import LiveApproveMeetingSubjectVotingsDetails from '../liveApproveMeetingSubjectVotingDetails/LiveApproveMeetingSubjectVotingsDetails';
import LiveApproveMeetingSubjectTaskDetails from '../liveApproveMeetingSubjectTaskDetails/LiveApproveMeetingSubjectTaskDetails';
import ApproveMeetingSubjectDetails from '../../approveMeetingSubjectDetails/ApproveMeetingSubjectDetails';

const LiveApproveMeetingSubjectDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item, meetingData, isMeeting, isMom } = route?.params;
  const [activeTab, setActiveTab] = useState('Details');
  const [commentThreadId, setCommentThreadId] = useState(null);
  const [comments, setComments] = useState([]);
  const [commenttext, setCommentText] = useState('');
  const [commentId, setCommentId] = useState(null);

  console.log({ item: item.status });

  // get subject by id
  const {
    loading: SubjectLoading,
    error: SubjectError,
    data: SubjectsData
  } = useQuery(GET_SUBJECT_BY_ID, {
    fetchPolicy: 'cache-and-network',
    variables: { subjectId: item?.subjectId },
    onCompleted: (data, error) => {
      if (data) {
        setCommentThreadId(data.subject.commentThreadId);
        getComments({
          variables: {
            commentCategoryId: data.subject.commentThreadId,
            sort: ''
          }
        });
      }
      if (error) {
        console.log('subject error', error.message);
      }
    }
  });

  // get comment thread id
  const [
    getComments,
    { loading: CommentsLoading, error: CommentsError, data: CommentsData }
  ] = useLazyQuery(GET_All_COMMENTS_THREAD, {
    fetchPolicy: 'cache-and-network',

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

  // update comment
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
    },
    onError: (data) => {
      console.log('addCommentError', data.message);
    }
  });

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
        style: 'cancel'
      }
    ]);
  };

  // delete subject
  const [deleteSubject, { data, loading, error }] = useMutation(
    DELETE_SUBJECTS,
    {
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
        name={isMeeting ? 'Minutes of meeting' : 'Subject details'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <NavigationMenuForApproveSubjectsMeeting
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMeeting={isMeeting}
          isMom={isMom}
        />
        {activeTab == 'Details' &&
          (isMeeting ? (
            <DetailsComponent item={meetingData} isLiveMeetingDetails={false} />
          ) : (
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
          ))}
        {activeTab == 'Subjects' && isMeeting && (
          <ApproveMeetingSubjectDetails meetingData={meetingData} />
        )}
        {activeTab == 'Votings' && (
          <LiveApproveMeetingSubjectVotingsDetails
            meetingData={meetingData}
            item={item}
            isMeeting={isMeeting}
          />
        )}
        {activeTab == 'Tasks' && (
          <LiveApproveMeetingSubjectTaskDetails
            meetingData={meetingData}
            item={item}
            isMeeting={isMeeting}
          />
        )}
        {activeTab == 'Decisions' && (
          <LiveMeetingSubjectDecision
            meetingData={meetingData}
            item={item}
            isMom={isMom}
            subjectDecision={true}
          />
        )}
        {activeTab == 'Approve Decisions' && (
          <LiveMeetingSubjectDecision
            meetingData={meetingData}
            item={item}
            isMom={isMom}
            subjectDecision={false}
          />
        )}
      </View>
      {item.status.entitys.isDisable == 'true' && (
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

export default LiveApproveMeetingSubjectDetails;
