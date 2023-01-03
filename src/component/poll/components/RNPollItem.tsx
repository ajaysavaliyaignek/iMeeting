import * as React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import RNBounceable, {
  IRNBounceableProps,
} from "@freakycoder/react-native-bounceable";
/**
 * ? Local Imports
 */
import styles, { _container, _animatedViewStyle } from "./RNPollItem.style";
import {
  convertPercentageString,
  calculateProgressBarAnimation,
} from "../utils/RNPoll.utils";
import { getHighlightedText } from "../../highlitedText/HighlitedText";

const defaultCheckMarkImage = require("../local-assets/checkmark.png");

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

export interface ISource {
  source: string | { uri: string };
}

export interface IRNPollItemProps extends IRNBounceableProps {
  id: number;
  text: string;
  disabled?: boolean;
  percentage: number;
  borderColor?: string;
  hasBeenVoted: boolean;
  votedChoiceByID?: number;
  fillBackgroundColor?: string;
  checkMarkIconImageSource?: ISource;
  choiceTextStyle?: TextStyle;
  percentageTextStyle?: TextStyle;
  checkMarkImageStyle?: ImageStyle;
  style?: CustomStyleProp;
  children?: React.ReactNode;
  renderIcon?(): JSX.Element;
  ImageComponent?: any;
  PollItemContainer?: any;
  onPress: () => void;
  eachChoice:any
}

const RNPollItem: React.FC<IRNPollItemProps> = ({
  id,
  text,
  onPress,
  disabled,
  eachChoice,
  percentage,
  hasBeenVoted,
  votedChoiceByID,
  choiceTextStyle,
  percentageTextStyle,
  checkMarkImageStyle,
  borderColor = "#E7EDF4",
  fillBackgroundColor = "#E7EDF4",
  checkMarkIconImageSource = defaultCheckMarkImage,
  ImageComponent = Image,
  PollItemContainer = View,
  answerIds,
                setAnswerIds,
  ...rest
 
}) => {
  const { width } = calculateProgressBarAnimation({
   percentage,
    hasBeenVoted,
  });
  const [_disableBuiltInIncreaseVote, setDisableBuiltInIncreaseVote] = React.useState(false);

  let _borderWidth = 0.5;
  const isChoiceSelected = votedChoiceByID === id;
  if (hasBeenVoted) {
    _borderWidth = isChoiceSelected ? 0.5 : 1;
  }

  return (
    <RNBounceable bounceEffectIn={0.97} onPress={() => {
      onPress(); setDisableBuiltInIncreaseVote(!_disableBuiltInIncreaseVote)

    
      if (_disableBuiltInIncreaseVote) {
        // eachChoice.votes = eachChoice.votes - 1 
     const newAnswerId = answerIds?.filter(id => eachChoice?.id != id)
      setAnswerIds(newAnswerId)
      }
    //   _disableBuiltInIncreaseVote && {(eachChoice.votes = eachChoice.votes - 1 const 
    // };
     
    }} disabled={votedChoiceByID!==eachChoice?.id? disabled:false} >
      <View style={_container(borderColor, _borderWidth)}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            _animatedViewStyle(fillBackgroundColor, width),
          ]}
        />
        <Text style={[styles.choiceTextStyle, choiceTextStyle]}>
          {text}
        </Text>
      
          <PollItemContainer style={styles.pollItemContainer} {...rest}>
         
              <Text style={styles.votesCount}>{eachChoice.votes} votes</Text>
     
            <Text style={[styles.percentageTextStyle, percentageTextStyle]}>
              {percentage.toFixed(2)} %
            </Text>
          </PollItemContainer>
   
      </View>
    </RNBounceable>
  );
};

export default RNPollItem;
