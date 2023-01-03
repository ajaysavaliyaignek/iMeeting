import { View, Text } from 'react-native';
import React from 'react';
import { getHighlightedText } from '../highlitedText/HighlitedText';
import RNPoll from '../poll/RNPoll';
import { styles } from './styles';

const VotingQueAnsComponent = ({
  item,
  meetingData,
  answerIds,
  setAnswerIds,
  onChoicePress,
  index,
  searchText,
  disable,
  setDisable
}) => {
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
      {/* <RNPoll
              totalVotes={30}
              choices={choices}
              onChoicePress={(selectedChoice) =>
                console.log('SelectedChoice: ', selectedChoice)
              }
              hasBeenVoted={false}
            /> */}
    </View>
  );
};

export default VotingQueAnsComponent;
