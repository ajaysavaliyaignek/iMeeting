import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable
} from 'react-native';
import React, { useState } from 'react';

import Avatar from '../../Avatar/Avatar';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import Icon from '../../Icon';
import IconName from '../../Icon/iconName';
import { SIZES } from '../../../themes/Sizes';
import moment from 'moment';
import { useMutation } from '@apollo/client';
import { UPDATE_COMMENT } from '../../../graphql/mutation';
import { GET_All_COMMENTS_THREAD } from '../../../graphql/query';
import EditDeleteModal from '../../EditDeleteModal';

const CommentCard = ({ item, commentThreadId }) => {
  console.log('item from comment card', item);
  const [openReply, setOpenReply] = useState(false);
  const [reply, setReply] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [commentText, setCommentText] = useState('');
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
  return (
    <View style={{ marginTop: SIZES[28] }}>
      {item.onlyMyComment && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: SIZES[6],
            top: SIZES[16]
          }}
          onPress={() => {
            setOpenModel(!openModel);
            console.log('dots pressed');
          }}
        >
          <Icon name={IconName.Dots} height={SIZES[16]} width={SIZES[6]} />
        </TouchableOpacity>
      )}
      {openModel && (
        <View
          style={{
            position: 'absolute',
            top: SIZES[60],
            right: SIZES[8]
          }}
        >
          <Text>hello</Text>
        </View>
      )}
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
            {moment(item.commentDate).format('D MMMM YYYY,hh:mm A')}
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
        {item.childComment.length > 0 && (
          <TouchableOpacity
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
              Show {item.childComment.length}{' '}
              {item.childComment.length > 1 ? 'replies' : 'reply'}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            setReply(!reply);
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
      {openReply && item.childComment !== [] && (
        <View style={{ marginLeft: SIZES[24], marginTop: SIZES[24] }}>
          {/* <CommentCard /> */}
          {item.childComment.map((comment) => {
            return (
              <>
                {comment.onlyMyComment && (
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      right: SIZES[6],
                      top: SIZES[16]
                    }}
                  >
                    <Icon
                      name={IconName.Dots}
                      height={SIZES[16]}
                      width={SIZES[6]}
                    />
                  </TouchableOpacity>
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Avatar
                    name={comment.userName}
                    source={comment.profilePicture}
                    size={SIZES[32]}
                  />
                  <View style={{ marginLeft: SIZES[16], marginTop: SIZES[10] }}>
                    <Text
                      style={{
                        ...Fonts.PoppinsSemiBold[14],
                        color: Colors.bold
                      }}
                    >
                      {comment.userName}
                    </Text>
                    <Text
                      style={{
                        ...Fonts.PoppinsRegular[14],
                        color: Colors.secondary
                      }}
                    >
                      {moment(comment.commentDate).format(
                        'D MMMM YYYY,hh:mm A'
                      )}
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
                  {comment.comment}
                </Text>
              </>
            );
          })}

          <TouchableOpacity
            onPress={() => {
              setReply(!reply);
            }}
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
      )}
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
            marginBottom: SIZES[24]
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
              console.log('comment', commentText);
              console.log('parentCommentId', item.parentCommentId);
              addComment({
                variables: {
                  comment: {
                    comment: commentText,
                    commentId: 0,
                    parentCommentId: item.commentId
                  }
                }
              });
              setCommentText('');
            }}
          >
            <Icon name={IconName.Send} height={SIZES[22]} width={SIZES[20]} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CommentCard;
