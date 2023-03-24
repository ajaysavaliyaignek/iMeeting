import { StyleSheet } from 'react-native';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

export const styles = StyleSheet.create({
  name: {
    color: Colors.bold,
    ...Fonts.PoppinsRegular[14],
    marginLeft: SIZES[16]
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES[16]
  },
  iconContainer: {
    marginRight: SIZES[16]
  }
});
