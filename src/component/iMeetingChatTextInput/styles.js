import { Platform, StyleSheet } from 'react-native';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

export const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    borderWidth: SIZES[1],
    borderColor: Colors.line,
    borderRadius: SIZES[8],
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: SIZES[16],

    marginBottom: Platform.OS == 'ios' ? SIZES[16] : null
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  attachIconView: {
    marginRight: SIZES[18],
    marginLeft: SIZES[8]
  },
  textInput: {
    flex: 1,
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    marginVertical: Platform.OS == 'android' ? null : 14
  },
  usernameText: {
    ...Fonts.PoppinsRegular[14],
    Colors: Colors.white
  }
});
