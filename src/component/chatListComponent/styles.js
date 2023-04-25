import { StyleSheet } from 'react-native';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

export const styles = StyleSheet.create({
  nameTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%'
  },
  txtUserName: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.bold
  },
  rightContainer: {
    marginLeft: SIZES[16],
    marginTop: SIZES[8],
    width: '60%'
  },
  txtTime: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    marginLeft: SIZES[8]
  },
  message: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    marginTop: SIZES[4]
  },
  tagsStyles: {
    body: {
      ...Fonts.PoppinsRegular[14],
      color: Colors.bold,
      marginTop: SIZES[4]
    }
  }
});
