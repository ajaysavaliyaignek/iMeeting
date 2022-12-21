import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import moment from 'moment';
import { useMutation } from '@apollo/client';

import Avatar from '../../Avatar/Avatar';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import Icon from '../../Icon';
import IconName from '../../Icon/iconName';
import { SIZES } from '../../../themes/Sizes';
import {
  DELETE_COMMENT_THREAD,
  UPDATE_COMMENT
} from '../../../graphql/mutation';
import { GET_All_COMMENTS_THREAD } from '../../../graphql/query';
import EditDeleteModal from '../../EditDeleteModal';
import { styles } from './styles';
import { Divider } from 'react-native-paper';

const Comments = ({
  item,
  commentThreadId,
  itemIndex,
  childIndex,
  setOpenReply,
  setReply,
  reply,
  replyEdit,
  setReplyEdit,
  openReply,
  showReply,
  valueIndex,
  setValueIndex,
  setCommentText,
  setCommentId,
  setChildCommentId,
  child,
  setParentCommentId,
  mainValueIndex,
  setMainValueIndex
}) => {
  const [openModel, setOpenModel] = useState(false);

  const [addComment, { data, loading, error }] = useMutation(UPDATE_COMMENT, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: [
      {
        query: GET_All_COMMENTS_THREAD,
        variables: { commentCategoryId: commentThreadId }
      }
    ]
  });

  if (data) {
    console.log('addComment', data);
  }
  if (error) {
    console.log('addCommentError', error);
  }

  // delete comment
  const [
    deleteComment,
    {
      data: DeleteCommentData,
      loading: DeleteCommentLoading,
      error: DeleteCommentError
    }
  ] = useMutation(DELETE_COMMENT_THREAD, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: [
      {
        query: GET_All_COMMENTS_THREAD,
        variables: { commentCategoryId: commentThreadId }
      }
    ]
  });
  if (DeleteCommentData) {
    console.log('delete data', data);
  }
  if (DeleteCommentError) {
    Alert.alert('Delete Subject Error', [
      {
        text: error,

        style: 'default'
      }
    ]);
  }

  const editDeleteModal = (commentId, comment, parentId) => {
    return (
      <View
        style={{
          position: 'absolute',
          top: SIZES[32],
          right: SIZES[8],
          zIndex: 20
        }}
      >
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.btnView}
            onPress={() => {
              //   setReply(true);
              //   setValueIndex(index);
              setOpenModel(false);
              //   setOpenChildModel(false);
              //   setComment(comment);

              if (child) {
                setChildCommentId(item.commentId);
                setCommentText(comment);
                setParentCommentId(item.commentId);
                setReply(true);
              } else {
                setCommentText(comment);
                setCommentId(item.commentId);
                // setReplyEdit(true);
              }
            }}
          >
            <Text style={styles.txtEditBtn}>Edit</Text>
            <Icon name={IconName.Edit} height={SIZES[18]} width={SIZES[18]} />
          </TouchableOpacity>
          <Divider style={styles.divider} />
          <TouchableOpacity
            style={styles.btnView}
            onPress={() => {
              setOpenModel(false);
              deleteComment({ variables: { commentId: commentId } });
            }}
          >
            <Text style={styles.txtDeleteBtn}>Delete</Text>
            <Icon name={IconName.Delete} height={SIZES[20]} width={SIZES[18]} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      //   key={index}
      onPress={() => {
        setOpenModel(false);
      }}
      activeOpacity={1}
    >
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar
            name={item.userName}
            source={item.profilePicture}
            size={SIZES[32]}
          />
          <View style={{ marginLeft: SIZES[16], marginTop: SIZES[10] }}>
            <Text style={{ ...Fonts.PoppinsSemiBold[14], color: Colors.bold }}>
              {item.userName}
            </Text>
            <Text
              style={{ ...Fonts.PoppinsRegular[14], color: Colors.secondary }}
            >
              {moment(item.commentDate).format('D MMM YYYY, hh:mm A')}
            </Text>
          </View>
        </View>
        <Text
          style={{
            ...Fonts.PoppinsRegular[14],
            color: Colors.bold,
            marginTop: SIZES[16]
          }}
        >
          {item.comment}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {item.childComment.length > 0 && showReply && (
            <TouchableOpacity
              onPress={() => {
                setOpenReply(!openReply);
                if (child) {
                  setReply(false);
                } else {
                  setReplyEdit(false);
                }
              }}
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
                Show {item.childComment.length}{' '}
                {item.childComment.length > 1 ? 'replies' : 'reply'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => {
              if (child) {
                setReply(!reply);
              } else {
                setReplyEdit(!replyEdit);
              }
            }}
            style={{ marginLeft: SIZES[14] }}
          >
            <Text
              style={{
                ...Fonts.PoppinsRegular[14],
                color: '#144B8D',
                marginTop: SIZES[16]
              }}
            >
              Reply
            </Text>
          </TouchableOpacity>
        </View>

        {item.onlyMyComment && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: SIZES[6],
              top: SIZES[16]
            }}
            onPress={() => {
              setOpenModel(!openModel);
            }}
          >
            <Icon name={IconName.Dots} height={SIZES[16]} width={SIZES[6]} />
          </TouchableOpacity>
        )}

        {openModel && editDeleteModal(item.commentId, item.comment)}
      </View>
    </TouchableOpacity>
  );
};

export default Comments;
