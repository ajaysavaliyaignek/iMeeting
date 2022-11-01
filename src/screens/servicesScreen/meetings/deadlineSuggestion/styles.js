import { StyleSheet } from 'react-native';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';
import { SIZES } from '../../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  subContainer: {
    paddingTop: SIZES[24],
    backgroundColor: Colors.white,
    flex: 1,
    paddingHorizontal: SIZES[16]
  },
  txtAddSubjectTitle: {
    ...Fonts.PoppinsBold[24],
    color: Colors.bold,
    marginBottom: SIZES[16]
  },
  upcomingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SIZES[24]
  },
  txtBtn: {
    ...Fonts.PoppinsRegular[14]
  },
  btnLayout: {
    width: '33%',
    borderRadius: 100,
    paddingVertical: SIZES[8],
    paddingHorizontal: SIZES[12]
  }
});
