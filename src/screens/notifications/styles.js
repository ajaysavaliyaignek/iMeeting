import { StyleSheet } from 'react-native';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  subContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: SIZES[16]
  },
  cancelBtnLayout: {
    backgroundColor: '#F3F6F9',
    paddingVertical: SIZES[16],
    paddingHorizontal: SIZES[16],
    borderRadius: SIZES[4]
    // marginVertical: SIZES[12],
    // width: '30%'
  },
  txtCancelButton: {
    ...Fonts.PoppinsSemiBold[12],
    color: Colors.primary
  },
  nextBtnLayout: {
    // marginVertical: SIZES[12],
    backgroundColor: '#DD7878',
    paddingVertical: SIZES[16],
    paddingHorizontal: SIZES[16],
    borderRadius: SIZES[4],
    marginLeft: 8
  },
  txtNextBtn: {
    ...Fonts.PoppinsSemiBold[12],
    color: Colors.white
  }
});
