import { StyleSheet } from 'react-native';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES[10],
    paddingHorizontal: SIZES[16]
  },
  txtSwitchLabel: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  }
});
