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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES[16],
    marginVertical: SIZES[10]
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
  },
  modal: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(100, 100, 100, 0.7)'
  },

  mainBoxView: {
    paddingTop: 16,
    backgroundColor: Colors.white,
    shadowColor: Colors.gray,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 14,
    position: 'absolute',
    bottom: '30%',
    width: SIZES[280]
  },
  txtClose: {
    alignSelf: 'center',
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.bold
  },
  txtWarn: {
    ...Fonts.PoppinsSemiBold[12],
    color: Colors.secondary,
    textAlign: 'center'
  },
  textContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  alertBtn: {
    paddingVertical: 12
  },
  txtFinalCloseBtn: {
    alignSelf: 'center',
    ...Fonts.PoppinsBold[14],
    color: Colors.Rejected
  },
  tinyLogo: {
    height: 20,
    width: 20
  },
  notification: {
    height: SIZES[24],
    width: SIZES[24],
    alignItems: 'center',
    justifyContent: 'center'
  },
  countView: {
    borderColor: Colors.white,
    borderWidth: 1,
    height: SIZES[16],
    width: SIZES[16],
    borderRadius: SIZES[8],
    backgroundColor: Colors.primary,
    position: 'absolute',
    top: -8,
    right: -8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1
  },
  txtCount: {
    color: Colors.white,
    ...Fonts.PoppinsSemiBold[12],
    fontSize: 8
  },
  closeButtonView: {
    height: SIZES[24],
    width: SIZES[24],
    alignItems: 'center',
    justifyContent: 'center'
  }
});
