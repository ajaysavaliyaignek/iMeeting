import { StyleSheet } from 'react-native';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  subContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: SIZES[16]
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    color: Colors.line
  },
  cancelBtnLayout: {
    backgroundColor: '#F3F6F9',
    marginVertical: SIZES[16],
    width: '50%'
  },
  txtCancelButton: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  buttonContainer: {
    paddingHorizontal: SIZES[16],
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  nextBtnLayout: {
    marginVertical: SIZES[12],
    width: '48%'
  },
  txtNextBtn: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.white
  },
  txtTitleAddVoting: {
    ...Fonts.PoppinsBold[24],
    color: Colors.bold,
    marginTop: SIZES[8]
  },
  optionsContainer: {
    marginTop: SIZES[24]
  },
  textInput: {
    marginVertical: SIZES[10]
  },
  txtTitleVoting: {
    ...Fonts.PoppinsRegular[12],
    color: Colors.secondary
  },
  deadlineRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SIZES[4],
    paddingVertical: SIZES[10]
  }
});
