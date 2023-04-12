import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import Icon from '../../Icon';
import IconName from '../../Icon/iconName';
import { SIZES } from '../../../themes/Sizes';
import {
  DELETE_COMMENT_THREAD,
  UPDATE_COMMENT
} from '../../../graphql/mutation';
import { GET_All_COMMENTS_THREAD } from '../../../graphql/query';
import Comments from '../comments/Comments';
import { Colors } from '../../../themes/Colors';

const CommentCard = ({
  item,
  commentThreadId,
  index,
  setComment,
  setCommentId,
  commenttext,
  child
}) => {
  const [openReply, setOpenReply] = useState(false);
  const [replyEdit, setReplyEdit] = useState(false);
  const [reply, setReply] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [edit, setEdit] = useState(true);
  const [childCommentId, setChildCommentId] = useState(null);
  const [parentCommentId, setParentCommentId] = useState(null);
  const [valueIndex, setValueIndex] = useState(-1);

  const [addComment, { data, loading, error }] = useMutation(UPDATE_COMMENT, {
    refetchQueries: [
      {
        query: GET_All_COMMENTS_THREAD,
        variables: { commentCategoryId: commentThreadId, sort: '' }
      }
    ],
    onCompleted: (data) => {
      if (data.addComment.status.statusCode == 200) {
        setChildCommentId(null);
        setComment('');
        setReply(false);
      }
    },
    onError: (data) => {
      console.log('add comment error', data);
    }
  });

  return (
    <TouchableOpacity
      style={{ marginTop: SIZES[28], flex: 1 }}
      key={index}
      onPress={() => setValueIndex(-1)}
      activeOpacity={1}
    >
      <Comments
        item={item}
        itemIndex={index}
        setOpenReply={setOpenReply}
        openReply={openReply}
        replyEdit={replyEdit}
        setReplyEdit={setReplyEdit}
        commentThreadId={commentThreadId}
        setCommentText={setComment}
        showReply={true}
        valueIndex={valueIndex}
        setValueIndex={setValueIndex}
        setCommentId={setCommentId}
        child={child}
        setEdit={setEdit}
      />

      {replyEdit && (
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

            flex: 1
          }}
        >
          <TextInput
            style={{
              flex: 1,

              backgroundColor: Colors.white
            }}
            underlineColor={Colors.white}
            activeUnderlineColor={Colors.white}
            placeholder={'Reply'}
            onChangeText={(text) => setComment(text)}
            value={commenttext}
          />
          <TouchableOpacity
            disabled={commenttext !== '' ? false : true}
            onPress={() => {
              if (!replyEdit) {
                addComment({
                  variables: {
                    comment: {
                      comment: commenttext,
                      parentCommentId: 0,
                      commentId: item.commentId
                    }
                  }
                });
              } else if (!edit) {
                addComment({
                  variables: {
                    comment: {
                      comment: commenttext,
                      parentCommentId: 0,
                      commentId: item.commentId
                    }
                  }
                });
              } else {
                addComment({
                  variables: {
                    comment: {
                      comment: commenttext,
                      commentId: 0,
                      parentCommentId: item.commentId
                    }
                  }
                });
              }
            }}
          >
            <Icon name={IconName.Send} height={SIZES[22]} width={SIZES[20]} />
          </TouchableOpacity>
        </View>
      )}
      {openReply && item.childComment.length > 0 && (
        <TouchableOpacity
          style={{ marginLeft: !child ? SIZES[24] : null, flex: 1 }}
          onPress={() => setOpenChildModel(false)}
          activeOpacity={1}
        >
          {/* <CommentCard /> */}
          {item?.childComment?.map((comment, index) => {
            return (
              <CommentCard
                item={comment}
                commentThreadId={commentThreadId}
                index={index}
                setComment={setComment}
                setCommentId={setCommentId}
                commenttext={commenttext}
                child={true}
              />
            );
          })}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default CommentCard;
