import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { getHighlightedText } from '../highlitedText/HighlitedText';
import RNPoll from '../poll/RNPoll';
import { styles } from './styles';
import { SIZES } from '../../themes/Sizes';
import { useNavigation } from '@react-navigation/native';

const VotingQueAnsComponent = ({
  item,
  meetingData,
  answerIds,
  setAnswerIds,
  onChoicePress,
  index,
  searchText,
  disable,
  setDisable,
  isVotingDetails
}) => {
  const navigation = useNavigation();
  const choices = item?.answerIds?.map((answer, i) => {
    return {
      id: answer,
      choice: item?.answers[i],
      votes: item?.optionCounts[i],
      percentage: item?.optionPercentages[i]
    };
  });
  return (
    <View style={styles.questionContainer}>
      {!item?.isPrivate && isVotingDetails && (
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
      <Text style={styles.txtQuestion}>
        {getHighlightedText(`${index + 1}. ${item?.votingTitle}`, searchText)}
      </Text>
      <RNPoll
        choices={choices}
        totalVotes={meetingData?.userDetails?.length}
        isAddAnswer={true}
        answerIds={answerIds}
        setAnswerIds={setAnswerIds}
        disable={disable}
        setDisable={setDisable}
        isMultipleSelect={item?.isMultipleSelect}
        onChoicePress={onChoicePress}
      />
    </View>
  );
};

export default VotingQueAnsComponent;
