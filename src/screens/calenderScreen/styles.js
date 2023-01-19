import { StyleSheet } from 'react-native';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  subContainer: {
    flex: 1,
    paddingVertical: SIZES[16],
    backgroundColor: Colors.white
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    paddingHorizontal: SIZES[16],
    paddingVertical: SIZES[10]
  },
  txtHeader: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.bold,

    marginLeft: '30%'
  },
  headeRightView: { flexDirection: 'row', alignItems: 'center' },
  searchIconView: { marginRight: SIZES[24] },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: SIZES[10],
    marginHorizontal: SIZES[16],
    padding: SIZES[2],
    justifyContent: 'space-between'
  },
  txtBtnServices: { ...Fonts.PoppinsSemiBold[12], color: Colors.bold },
  btnExternalUser: {
    backgroundColor: Colors.Blue_Light,
    marginBottom: SIZES[16]
  },
  txtBtnExternal: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  btnUsers: {
    paddingVertical: SIZES[8],
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES[8]
  }
});
