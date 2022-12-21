import { StyleSheet } from 'react-native';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';

export const styles = StyleSheet.create({
  txtTitle: {
    ...Fonts.PoppinsRegular[12],
    color: Colors.secondary
  }
});
