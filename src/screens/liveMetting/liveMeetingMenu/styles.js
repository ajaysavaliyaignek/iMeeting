import { StyleSheet } from 'react-native';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  subContainer: { flex: 1, backgroundColor: Colors.white },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SIZES[16]
  },
  cancelBtnLayout: {
    backgroundColor: '#F3F6F9',
    width: '48%'
  },
  txtCancelButton: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  nextBtnLayout: {
    width: '48%'
  },
  txtNextBtn: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.white
  },
  bgIcon: {
    height: SIZES[44],
    width: SIZES[44],
    borderRadius: SIZES[22],
    backgroundColor: `rgba(248, 248, 248, 1)`,
    alignItems: 'center',
    justifyContent: 'center'
  },
  txtMenu: {
    ...Fonts.PoppinsRegular[10],
    color: Colors.secondary,
    marginTop: SIZES[4]
  },
  menuBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES[16],
    marginVertical: SIZES[8]
  },
  badgeView: {
    height: SIZES[16],
    width: SIZES[16],
    borderRadius: SIZES[8],
    backgroundColor: Colors.primary,
    position: 'absolute',
    top: -4,
    right: -4,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1
  },
  txtBadge: {
    color: Colors.white,
    ...Fonts.PoppinsSemiBold[12],
    fontSize: 9
  }
});
