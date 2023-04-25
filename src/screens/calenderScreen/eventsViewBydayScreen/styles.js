import { StyleSheet } from 'react-native';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES[16],
    paddingVertical: SIZES[10]
  },
  txtHeader: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.bold,
    marginLeft: SIZES[24]
  },
  headeRightView: { flexDirection: 'row', alignItems: 'center' },
  searchIconView: { marginRight: SIZES[24] },
  subContainer: {
    flex: 1,
    padding: SIZES[16],
    backgroundColor: Colors.white
  },
  txtDateTitle: {
    ...Fonts.PoppinsBold[24],
    color: Colors.bold,
    marginTop: SIZES[8]
  }
});
