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
    paddingHorizontal: SIZES[16]
  },
  txtTitle: {
    ...Fonts.PoppinsBold[24],
    color: Colors.bold,
    marginTop: SIZES[24]
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  txtHeading: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold
  },
  requiredContainer: {
    marginVertical: SIZES[16]
  },
  txtAll: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary,
    marginRight: SIZES[16]
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SIZES[16]
  },
  txtUserName: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    marginLeft: SIZES[16]
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
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  }
});
