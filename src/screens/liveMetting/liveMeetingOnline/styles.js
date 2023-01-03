import { StyleSheet } from 'react-native';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES[16]
  },
  txtMeetingName: {
    ...Fonts.PoppinsBold[24],
    color: Colors.bold,
    marginTop: SIZES[8]
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.primary,
    marginTop: SIZES[16]
  },
  txtLink: {
    ...Fonts.PoppinsSemiBold[20],
    color: Colors.primary
  },
  txtPlatfomLink: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.bold,
    marginBottom: SIZES[16]
  }
});
