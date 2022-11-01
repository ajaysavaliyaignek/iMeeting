import { StyleSheet } from 'react-native';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';
import { SIZES } from '../../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  subContainer: {
    paddingHorizontal: SIZES[16],
    paddingTop: SIZES[24],
    backgroundColor: Colors.white,
    flex: 1
  },
  txtAddSubjectTitle: { ...Fonts.PoppinsBold[24], color: Colors.bold },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES[24]
  },
  txtRole: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    marginLeft: SIZES[16]
  },
  buttonContainer: {
    paddingHorizontal: SIZES[16]
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  }
});
