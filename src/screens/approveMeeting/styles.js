import { StyleSheet } from 'react-native';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  subContainer: {
    paddingVertical: SIZES[16],
    backgroundColor: Colors.white,
    flex: 1
  },
  menuContainer: {
    padding: SIZES[2],
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: SIZES[10],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: SIZES[16]
  },
  btnContainer: {
    paddingVertical: SIZES[6],
    paddingHorizontal: SIZES[8],
    backgroundColor: Colors.white,
    borderRadius: SIZES[6],
    alignItems: 'center',
    justifyContent: 'center',
    width: '25%'
  },
  txtMenu: {
    ...Fonts.PoppinsSemiBold[12],
    color: Colors.bold
  },
  nextBtnLayout: {
    marginVertical: SIZES[12],
    width: '48%',
    backgroundColor: '#DD7878'
  },
  txtNextBtn: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.white
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
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
  buttonContainer: {
    paddingHorizontal: SIZES[16]
  }
});
