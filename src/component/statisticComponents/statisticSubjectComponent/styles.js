import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';
import { Fonts } from '../../../themes';

export const styles = StyleSheet.create({
  container: {
    paddingBottom: SIZES[16],
    flex: 1
  },
  chartContainer: {
    marginVertical: SIZES[16],
    backgroundColor: Colors.gray,
    borderRadius: SIZES[12]
  },
  btnContainer: {
    paddingVertical: SIZES[8],
    width: '33%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES[8]
  },
  btnView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: SIZES[10],
    padding: SIZES[2]
  },
  txtBtn: { ...Fonts.PoppinsSemiBold[12], color: Colors.bold }
});
