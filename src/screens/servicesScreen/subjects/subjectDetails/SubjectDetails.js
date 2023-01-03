import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
  FlatList
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider, TextInput } from 'react-native-paper';

import { styles } from './styles';
import { Colors } from '../../../../themes/Colors';
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
import AttachFiles from '../../../../component/attachFiles/AttachFiles';
import moment from 'moment';
import SubjectDetailsComponent from '../../../../component/subjectDetailsComponent/SubjectDetailsComponent';

const SubjectDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route?.params;
  console.log('item-----', item);

  const [fileId, setFileId] = useState(item?.attachFileIds);
  const [commentThreadId, setCommentThreadId] = useState(null);
  const [comments, setComments] = useState([]);
  const [commenttext, setCommentText] = useState('');
  const [commentId, setCommentId] = useState(null);

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
        // console.log('comments data', data.comments);
        console.log('items data', data.comments.items[0].childComment[0]);

        // console.log('commentsChild data', data.comments.items[0].childComment);

        setComments(data.comments.items[0]);
      } else {
        console.log('no comments');
      }
    }
  });

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
    ],
    onCompleted: (data) => {
      console.log('add comment data', data.addComment.status[0].statusCode);
      if (data.addComment.status[0].statusCode == 200) {
        setCommentId(null);
      }
    }
  });

  if (AddCommentError) {
    console.log('addCommentError', AddCommentError);
  }

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
