import { StyleSheet } from 'react-native';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';
import { SIZES } from '../../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  txtTitle: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold
  },
  subContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: SIZES[16]
  },
  subView: {
    marginTop: SIZES[24]
  },
  txtSubDetails: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary
  },
  txtSubDiscription: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    marginTop: SIZES[4]
  },
  txtcommentsTitle: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold,
    marginTop: SIZES[26]
  },
  buttonContainer: {
    paddingHorizontal: SIZES[16],
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelBtnLayout: {
    backgroundColor: '#F3F6F9',
    marginVertical: SIZES[12],
    width: '48%'
  },
  txtCancelButton: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  nextBtnLayout: {
    marginVertical: SIZES[12],
    backgroundColor: '#DD7878',
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
