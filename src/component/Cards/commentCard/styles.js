import { StyleSheet } from 'react-native';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray,
    borderRadius: SIZES[6],
    width: SIZES[130]
  },
  btnView: {
    paddingVertical: SIZES[10],
    paddingHorizontal: SIZES[16],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  txtEditBtn: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.primary
  },
  txtDeleteBtn: {
    ...Fonts.PoppinsRegular[14],
    color: '#DD7878'
  },
  divider: { width: '100%', height: SIZES[1], backgroundColor: Colors.line }
});
