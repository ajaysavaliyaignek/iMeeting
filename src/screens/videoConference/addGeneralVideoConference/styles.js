import { StyleSheet } from 'react-native';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES[16]
  },
  txtAddSubjectTitle: {
    ...Fonts.PoppinsBold[24],
    color: Colors.bold
  },
  loginButton: {
    marginVertical: SIZES[12],
    width: '100%'
  },
  txtButton: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.white
  },
  txtLink: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  discriptionContainer: {
    marginTop: SIZES[24],
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.line
  },
  textInput: {
    paddingVertical: SIZES[10],
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  },
  txtTitle: { ...Fonts.PoppinsRegular[12], color: Colors.secondary },
  categoryContainer: {
    marginTop: SIZES[24],
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.line
  }
});
