import { View, SafeAreaView, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider } from 'react-native-paper';

import { styles } from './styles';
import { Colors } from '../../../../themes/Colors';
import { Button } from '../../../../component/button/Button';
import { IconName } from '../../../../component';
import Header from '../../../../component/header/Header';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_All_COMMENTS_THREAD,
  GET_All_SUBJECTS,
  GET_SUBJECT_BY_ID
} from '../../../../graphql/query';
import { DELETE_SUBJECTS, UPDATE_COMMENT } from '../../../../graphql/mutation';
import SubjectDetailsComponent from '../../../../component/subjectDetailsComponent/SubjectDetailsComponent';

const SubjectDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route?.params;

  const [commentThreadId, setCommentThreadId] = useState(null);
  const [comments, setComments] = useState([]);
  const [commenttext, setCommentText] = useState('');
  const [commentId, setCommentId] = useState(null);

  const {
    loading: SubjectLoading,
    error: SubjectError,
    data: SubjectsData
  } = useQuery(GET_SUBJECT_BY_ID, {
    fetchPolicy: 'cache-and-network',
    variables: { subjectId: item.subjectId },
    onCompleted: (data) => {
      if (data) {
        setCommentThreadId(data.subject.commentThreadId);
      }
    },
    onError: (data) => {
      console.log('subject error', data.message);
    }
  });

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
    },
    onError: (data) => {
      console.log('addCommentError', data.message);
    }
  });

  const [deleteSubject, { data, loading, error }] = useMutation(
    DELETE_SUBJECTS,
    {
      // export const GET_All_SUBJECTS = gql`
      refetchQueries: [
        {
          query: GET_All_SUBJECTS,
          variables: { searchValue: '', screen: 0, page: -1, pageSize: -1 }
        }
      ]
    }
  );
  if (data) {
    if (data.deleteSubject.status.statusMessage === 'Deleted Successfully') {
      navigation.navigate('Details');
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

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Subject details'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />

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

      {item.status.entitys.isDisable == 'true' && (
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
      )}
    </SafeAreaView>
  );
};

export default SubjectDetails;
