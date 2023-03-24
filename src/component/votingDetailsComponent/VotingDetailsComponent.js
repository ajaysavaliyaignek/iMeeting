import { View, Text, TouchableOpacity, Switch } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';

import { styles } from './styles';
import { SIZES } from '../../themes/Sizes';
import { Colors } from '../../themes/Colors';
import RNPoll from '../../component/poll/RNPoll';
import { GET_VOTING_DETAILS } from '../../graphql/query';
import { UPDATE_USER_ANSWER } from '../../graphql/mutation';
import { getHighlightedText } from '../highlitedText/HighlitedText';
import VotingQueAnsComponent from '../votingQueAnsComponent/VotingQueAnsComponent';

const VotingDetailsComponent = ({ item, index, meetingData, searchText }) => {
  const navigation = useNavigation();
  const [answerIds, setAnswerIds] = useState([]);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    if (item?.isMultipleSelect && answerIds?.length > 0) {
      addVotingAnswer({
        variables: {
          voting: {
            answerIds: answerIds,
            votingId: item?.votingId,
            isMultipleSelect: item?.isMultipleSelect,
            isPrivate: item?.isPrivate
          }
        }
      });
    }
  }, [answerIds]);

  const [
    addVotingAnswer,
    { data, loading: addVotingAnswerLoading, error: addAnswerVotingError }
  ] = useMutation(UPDATE_USER_ANSWER, {
    refetchQueries: [
      {
        query: GET_VOTING_DETAILS,
        variables: {
          meetingId: meetingData?.meetingId,
          subjectId: 0,
          type: 1,
          searchValue: ''
        }
      }
    ],
    onCompleted: (data) => {
      if (data) {
        console.log('add voting answer', data.addUserAnswer);
      }
    }
  });

  const onChoicePress = (data) => {
    setAnswerIds([...answerIds, data?.id]);

    if (item.isMultipleSelect !== true) {
      addVotingAnswer({
        variables: {
          voting: {
            answerIds: [data?.id],
            votingId: item?.votingId,
            isMultipleSelect: item?.isMultipleSelect,
            isPrivate: item?.isPrivate
          }
        }
      });
    }
  };

  return (
    <View style={styles.subContainer} key={index.toString()}>
      <View style={styles.rowContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.txtTypeTitle}>Type</Text>
          <Text style={styles.txtType}>
            {item?.subjectId == 0 ? 'Meeting' : 'Subject'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          {meetingData?.yourRoleName !== 'Member' && (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => {
                navigation.navigate('AddVoting', {
                  meetingDetails: meetingData,
                  isAddVotingScreen: false,
                  votingDetails: item
                });
              }}
            >
              <Text style={styles.txtEditBtn}>Edit</Text>
            </TouchableOpacity>
          )}
          {!item?.isPrivate && (
            <TouchableOpacity
              style={[styles.editBtn, { marginLeft: SIZES[12] }]}
              onPress={() => {
                navigation.navigate('ViewVotingHistory', {
                  votingId: item.votingId
                });
              }}
            >
              <Text style={styles.txtEditBtn}>View History</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {item?.subjectId !== 0 && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: SIZES[16]
          }}
        >
          <Text style={styles.txtTypeTitle}>Title subject</Text>
          <Text style={styles.txtType}>{item?.subjectName}</Text>
        </View>
      )}
      <VotingQueAnsComponent
        answerIds={answerIds}
        item={item}
        meetingData={meetingData}
        setAnswerIds={setAnswerIds}
        onChoicePress={onChoicePress}
        index={index}
        searchText={searchText}
        disable={disable}
        setDisable={setDisable}
      />
      <Divider style={styles.divider} />
      <View
        style={[
          styles.rowContainer,
          {
            borderBottomWidth: SIZES[1],
            borderBottomColor: Colors.line,
            paddingVertical: SIZES[8]
          }
        ]}
      >
        <Text style={styles.txtLabel}>Private</Text>
        <Switch
          value={item?.isPrivate}
          disabled={true}
          // onValueChange={() => setIsAttachFileSwitchOn(!isAttachFileSwitchOn)}
          color={Colors.switch}
        />
      </View>
      <View
        style={[
          styles.rowContainer,
          {
            borderBottomWidth: SIZES[1],
            borderBottomColor: Colors.line,
            paddingVertical: SIZES[8],
            marginBottom: SIZES[16]
          }
        ]}
      >
        <Text style={styles.txtLabel}>Select multiple</Text>
        <Switch
          value={item?.isMultipleSelect}
          disabled={true}
          // onValueChange={() => setIsCommentsSwitchOn(!isCommentsSwitchOn)}
          color={Colors.switch}
        />
      </View>
    </View>
  );
};

export default VotingDetailsComponent;
