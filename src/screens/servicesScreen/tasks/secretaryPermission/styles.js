import { StyleSheet } from 'react-native';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';
import { SIZES } from '../../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  subContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: SIZES[16]
  },
  txtAddSubjectTitle: {
    ...Fonts.PoppinsBold[24],
    color: Colors.bold,
    marginTop: SIZES[8]
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SIZES[16]
  },
  cancelBtnLayout: {
    backgroundColor: '#F3F6F9',
    width: '48%'
  },
  txtCancelButton: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  nextBtnLayout: {
    width: '48%'
  },
  txtNextBtn: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.white
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  }
});
