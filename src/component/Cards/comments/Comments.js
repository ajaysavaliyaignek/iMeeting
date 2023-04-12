import { View, Text, TouchableOpacity, Alert } from 'react-native';
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
  setMainValueIndex,
  setEdit
}) => {
  const [openModel, setOpenModel] = useState(false);

  // delete comment
  const [
    deleteComment,
    {
      data: DeleteCommentData,
      loading: DeleteCommentLoading,
      error: DeleteCommentError
    }
  ] = useMutation(DELETE_COMMENT_THREAD, {
    refetchQueries: [
      {
        query: GET_All_COMMENTS_THREAD,
        variables: { commentCategoryId: commentThreadId, sort: '' }
      }
    ],
    onCompleted: (data) => {
      console.log('delete data', data);
    },
    onError: (data) => {
      if (data) {
        Alert.alert('Delete Subject Error', [
          {
            text: data.message,

            style: 'default'
          }
        ]);
      }
    }
  });

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
              setOpenModel(false);

              if (child) {
                setReplyEdit(true);
                setCommentText(comment);
                setCommentId(item.commentId);
                setEdit(false);
                // setChildCommentId(item.commentId);
                // setCommentText(comment);
                // setParentCommentId(item.commentId);
                // setReply(true);
              } else {
                // setReplyEdit(true);
                setCommentText(comment);
                setCommentId(item.commentId);
                setEdit(false);
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
                // if (child) {
                //   setReply(false);
                // } else {
                setReplyEdit(false);
                // }
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
              // if (child) {
              //   setReply(!reply);
              // } else {
              setReplyEdit(!replyEdit);
              // }
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
              top: SIZES[16],
              height: SIZES[26],
              width: SIZES[26]
            }}
            onPress={() => {
              setOpenModel(!openModel);
            }}
            activeOpacity={0.6}
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
