import { StyleSheet } from 'react-native';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: { flex: 1 },

  nextBtnLayout: {
    marginVertical: SIZES[12]
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
  subContainer: {
    paddingTop: SIZES[16],
    backgroundColor: Colors.white,
    flex: 1
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES[16],
    paddingHorizontal: SIZES[16],
    width: '100%'
  },
  txtProgress: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary
  },
  buttonContainer: {
    paddingHorizontal: SIZES[16]
  }
});
