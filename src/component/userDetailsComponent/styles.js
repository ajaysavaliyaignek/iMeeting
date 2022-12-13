import { StyleSheet } from 'react-native';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  noSelectedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  txtNoUsers: {
    ...Fonts.PoppinsSemiBold[20],
    color: Colors.primary
  }
});
