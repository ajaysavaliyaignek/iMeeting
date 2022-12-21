import {
  ViewStyle,
  ImageStyle,
  TextStyle,
  StyleSheet,
  Animated,
} from "react-native";

import { Fonts } from '../../../../../themes';
import { Colors } from '../../../../..//themes/Colors';
import { SIZES } from '../../../../../themes/Sizes';

export const _container = (
  borderColor: string,
  borderWidth: number,
): ViewStyle => ({
  flex: 1,
  borderWidth,
  borderColor,
  opacity: 1,
  marginTop: 10,
  borderRadius: 12,
  overflow: "hidden",
  paddingVertical: 16,
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
});

export const _animatedViewStyle = (
  backgroundColor: string,
  animatedWidth: Animated.AnimatedInterpolation,
): ViewStyle => ({
  backgroundColor,
  width: animatedWidth,
});

interface Style {
  container: ViewStyle;
  choiceTextStyle: TextStyle;
  pollItemContainer: ViewStyle;
  percentageTextStyle: TextStyle;
  checkMarkImageStyle: ImageStyle;
}

export default StyleSheet.create<Style>({
  container: {},
  choiceTextStyle: {
    flexShrink: 1,
    flexWrap: "wrap",
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    paddingHorizontal: SIZES[16]
  },
  pollItemContainer: {
    marginRight: SIZES[20],
    flexDirection: "row",
    alignItems: "center",
  },
  percentageTextStyle: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.bold,
    lineHeight: 24,
   
  },
  votesCount: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary,
    marginRight: SIZES[16],
  
  },
});
