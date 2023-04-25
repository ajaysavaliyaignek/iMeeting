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
import { TextInput } from 'react-native-paper';

import { styles } from './styles';
import { Colors } from '../../themes/Colors';
import CommentCard from '../../component/Cards/commentCard/CommentCard';
import { Icon, IconName } from '../../component';
import { SIZES } from '../../themes/Sizes';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_All_COMMENTS_THREAD,
  GET_All_SUBJECTS,
  GET_FILE,
  GET_SUBJECT_BY_ID
} from '../../graphql/query';
import { DELETE_SUBJECTS, UPDATE_COMMENT } from '../../graphql/mutation';
import AttachFiles from '../../component/attachFiles/AttachFiles';
import moment from 'moment';

const SubjectDetailsComponent = ({
  item,
  addComment,
  commentId,
  setCommentId,
  commenttext,
  setCommentText,
  commentThreadId,
  comments,
  setComments
}) => {
  const navigation = useNavigation();
  console.log('item-----', item);

  const [fileId, setFileId] = useState(item?.attachFileIds);
  const [fileResponse, setFileResponse] = useState([]);

  fileId?.map((id) => {
    const { loading, error } = useQuery(GET_FILE, {
      fetchPolicy: 'cache-and-network',
      variables: {
        fileEntryId: id
      },
      onCompleted: (data) => {
        setFileResponse((prev) => {
          console.log('prev', prev);
          if (prev.fileEnteryId !== id) {
            return [...prev, data.uploadedFile];
          }
        });
      }
    });
    if (error) {
      console.log('file error', error);
    }
  });

  const generalDetails = (title, discription) => {
    return (
      <View style={styles.subView}>
        <Text style={styles.txtSubDetails}>{title}</Text>
        <Text style={styles.txtSubDiscription}>{discription}</Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.subContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.txtTitle}>General</Text>
      {generalDetails('Title', item.subjectTitle)}
      {generalDetails('Description', item.description)}
      {generalDetails('Subject category', item.subjectCategoryName)}
      {generalDetails('Committee ', item.committeeName)}
      {generalDetails('Creator', item.createrName)}
      {generalDetails(
        'Date of creation',
        moment(item.dateOfCreation, 'YYYY-MM-DD hh:mm a').format('MMM DD, YYYY')
      )}

      {/* attach file */}

      {fileResponse?.length > 0 && (
        <AttachFiles
          fileResponse={fileResponse}
          setFileResponse={setFileResponse}
          showAttachButton={false}
          deleted={false}
          download={true}
          isShowAttchTitle={true}
        />
      )}

      {/* comments     */}
      {item.statusTitle == 'Approved' && item.statusTitle !== 'Deleted' && (
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
                  height: SIZES[30],
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
                  console.log('commenttext', commenttext);
                  console.log('parentCommentId', commentThreadId);
                  console.log('commentId', commentId);
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
  );
};

export default SubjectDetailsComponent;
