import * as React from "react";
import { View, ScrollView, StyleProp, ViewStyle } from "react-native";
/**
 * ? Local Imports
 */
import styles from "./RNPoll.style";
import RNPollItem from "./components/RNPollItem";
import { countPercentage } from "./utils/RNPoll.utils";

export type CustomStyleProp =
  | StyleProp<ViewStyle>
  | Array<StyleProp<ViewStyle>>;

export interface IChoice {
  id: number;
  votes: number;
  choice: string;
}

export interface IRNPollProps {
  totalVotes: number;
  hasBeenVoted?: boolean;
  votedChoiceByID?: number;
  disableBuiltInIncreaseVote?: boolean;
  choices: Array<IChoice>;
  style?: CustomStyleProp;
  pollContainerStyle?: CustomStyleProp;
  PollContainer?: any;
  PollItemContainer?: any;
  isAddAnswer: Boolean;
  onChoicePress: (selectedChoice: IChoice) => void;
}

const RNPoll: React.FC<IRNPollProps> = ({
  style,
  choices,
  totalVotes,
  pollContainerStyle,
  hasBeenVoted = false,
  disableBuiltInIncreaseVote = false,
  votedChoiceByID = undefined,
  PollItemContainer = View,
  PollContainer = View,
  onChoicePress,
  isAddAnswer,
  ...rest
}) => {
  const [_hasBeenVoted, setHasBeenVoted] = React.useState(hasBeenVoted);
  const [votedChoice, setVotedChoice] = React.useState(votedChoiceByID);
  const [isDisable, setIsDisable] = React.useState(false);
  const [_disableBuiltInIncreaseVote, setDisableBuiltInIncreaseVote] = React.useState(disableBuiltInIncreaseVote);

  return (
    <View style={style}>
      <ScrollView
        style={styles.scrollViewStyle}
        showsVerticalScrollIndicator={false}
      >
        <PollContainer
          style={[styles.pollContainer, pollContainerStyle]}
          {...rest}
        >
          {choices.map((eachChoice: IChoice) => {
            const { choice, id, votes } = eachChoice;
            const percentage = _hasBeenVoted
              ? countPercentage(votes, totalVotes)
              : countPercentage(votes, totalVotes);

            return (
              <RNPollItem
                {...rest}
                id={id}
              isAddAnswer={isAddAnswer}
                key={id}
                text={choice}
                eachChoice={eachChoice}
                disabled={isDisable}
                percentage={percentage}
                hasBeenVoted={_hasBeenVoted}
                votedChoiceByID={votedChoice}
                PollItemContainer={PollItemContainer}
                onPress={() => {
                  setIsDisable(true)
                  setHasBeenVoted(true);
                  setVotedChoice(id);
                  onChoicePress && onChoicePress(eachChoice);
                }}
              />
            );
          })}
        </PollContainer>
      </ScrollView>
    </View>
  );
};

export default RNPoll;
