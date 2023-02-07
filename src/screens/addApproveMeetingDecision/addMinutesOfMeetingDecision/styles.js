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
  txtTitle: {
    ...Fonts.PoppinsBold[24],
    color: Colors.bold,
    marginTop: SIZES[8]
  },
  viewContainer: {
    marginTop: SIZES[4],
    backgroundColor: Colors.gray,
    paddingVertical: SIZES[10],
    paddingHorizontal: SIZES[16]
  },
  txtNameTitle: {
    ...Fonts.PoppinsRegular[12],
    color: Colors.secondary
  },
  txtCommittee: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    color: Colors.line
  },
  textInput: {
    paddingVertical: SIZES[10],
    marginTop: SIZES[4]
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
    width: '38%'
  },
  txtNextBtn: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.white
  },
  txtError: { ...Fonts.PoppinsRegular[12], color: Colors.Rejected }
});
