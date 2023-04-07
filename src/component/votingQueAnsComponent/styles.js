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
  },
  txtEditBtn: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  editBtn: {
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.primary,

    width: '30%',
    alignSelf: 'flex-end',
    alignItems: 'center'
  }
});
