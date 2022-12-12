import { StyleSheet } from 'react-native';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    marginTop: SIZES[16],
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.line,
    zIndex: 20
  },
  txtDropdown: {
    ...Fonts.PoppinsRegular[14]
  },
  arrowIcon: {
    height: SIZES[14],
    width: SIZES[14],
    color: Colors.line
  },
  txtTitle: { ...Fonts.PoppinsRegular[12], color: Colors.secondary },
  dropDown: {
    paddingRight: SIZES[10],
    marginTop: SIZES[6]
  }
});
