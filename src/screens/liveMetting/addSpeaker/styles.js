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
  txtTitle: { ...Fonts.PoppinsRegular[12], color: Colors.secondary },
  timeContainer: {
    marginTop: SIZES[24]
  },
  textInput: {
    marginVertical: SIZES[6],
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    backgroundColor: 'transparent'
    // flex: 1,
    // marginHorizontal: SIZES[6],
    // // height: SIZES[36],
    // paddingVertical: 8
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    color: Colors.line
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
    width: '48%'
  },
  txtNextBtn: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.white
  },
  txtUsername: {
    marginTop: SIZES[24],
    ...Fonts.PoppinsBold[20],
    color: Colors.bold
  },
  txtRole: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary
  },
  txtRunningTime: {
    ...Fonts.PoppinsSemiBold[20],
    color: Colors.bold,
    marginTop: SIZES[50],
    alignSelf: 'center'
  },
  txtTimeDuration: {
    ...Fonts.PoppinsSemiBold[20],
    color: Colors.secondary
  }
});
