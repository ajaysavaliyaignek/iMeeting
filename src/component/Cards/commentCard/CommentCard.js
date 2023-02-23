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
  commenttext
}) => {
  const [openReply, setOpenReply] = useState(false);
  const [replyEdit, setReplyEdit] = useState(false);
  const [reply, setReply] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [edit, setEdit] = useState(false);
  const [childCommentId, setChildCommentId] = useState(null);
  const [parentCommentId, setParentCommentId] = useState(null);
  const [valueIndex, setValueIndex] = useState(-1);

  const [addComment, { data, loading, error }] = useMutation(UPDATE_COMMENT, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: [
      {
        query: GET_All_COMMENTS_THREAD,
        variables: { commentCategoryId: commentThreadId }
      }
    ],
    onCompleted: (data) => {
      if (data.addComment.status.statusCode == 200) {
        setChildCommentId(null);
      }
    }
  });

  if (data) {
    console.log('addComment', data);
  }
  if (error) {
    console.log('addCommentError', error);
  }

  return (
    <TouchableOpacity
      style={{ marginVertical: SIZES[28], flex: 1 }}
      key={index}
      onPress={() => setOpenModel(false)}
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
        setCommentText={setComment || setCommentText}
        showReply={true}
        valueIndex={valueIndex}
        setValueIndex={setValueIndex}
        setCommentId={setCommentId}
        child={false}
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
            marginBottom: SIZES[24],
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
            onChangeText={(text) => setCommentText(text)}
            value={commentText || commenttext}
          />
          <TouchableOpacity
            disabled={commentText !== '' ? false : true}
            onPress={() => {
              console.log('edit', edit);
              console.log('child comment id', childCommentId);
              if (childCommentId != null) {
                addComment({
                  variables: {
                    comment: {
                      comment: commentText,

                      commentId: item.commentId
                    }
                  }
                });
              } else {
                addComment({
                  variables: {
                    comment: {
                      comment: commentText,

                      parentCommentId: item.commentId
                    }
                  }
                });
              }

              setCommentText('');
              setReply(false);
            }}
          >
            <Icon name={IconName.Send} height={SIZES[22]} width={SIZES[20]} />
          </TouchableOpacity>
        </View>
      )}
      {openReply && item.childComment.length > 0 && (
        <TouchableOpacity
          style={{ marginLeft: SIZES[24], marginTop: SIZES[24], flex: 1 }}
          onPress={() => setOpenChildModel(false)}
          activeOpacity={1}
        >
          {/* <CommentCard /> */}
          {item.childComment.map((comment, index) => {
            console.log('child comments', comment);
            return (
              <View style={{ flex: 1 }}>
                <Comments
                  childIndex={index}
                  item={comment}
                  setReply={setReply}
                  reply={reply}
                  commentThreadId={commentThreadId}
                  setComment={setComment}
                  setOpenReply={setOpenReply}
                  openReply={openReply}
                  showReply={false}
                  valueIndex={valueIndex}
                  setValueIndex={setValueIndex}
                  setCommentText={setCommentText}
                  setChildCommentId={setChildCommentId}
                  child={true}
                  setParentCommentId={setParentCommentId}
                />

                {reply && (
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
                      marginBottom: SIZES[24],
                      flex: 1
                    }}
                  >
                    <TextInput
                      style={{
                        flex: 1,
                        height: SIZES[30],
                        backgroundColor: Colors.white
                      }}
                      underlineColor={Colors.white}
                      activeUnderlineColor={Colors.white}
                      placeholder={'Reply'}
                      onChangeText={(text) => setCommentText(text)}
                      value={commentText}
                    />
                    <TouchableOpacity
                      disabled={commentText !== '' ? false : true}
                      onPress={() => {
                        console.log('edit', edit);
                        console.log('child comment id', childCommentId);
                        if (childCommentId != null) {
                          addComment({
                            variables: {
                              comment: {
                                comment: commentText,

                                commentId: childCommentId
                              }
                            }
                          });
                        } else {
                          addComment({
                            variables: {
                              comment: {
                                comment: commentText,

                                parentCommentId: item.commentId
                              }
                            }
                          });
                        }

                        setCommentText('');
                        setReply(false);
                      }}
                    >
                      <Icon
                        name={IconName.Send}
                        height={SIZES[22]}
                        width={SIZES[20]}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default CommentCard;
