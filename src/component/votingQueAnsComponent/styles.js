import { StyleSheet } from 'react-native';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

export const styles = StyleSheet.create({
  txtQuestion: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold
  },
  questionContainer: {
    paddingVertical: SIZES[18]
  }
});
