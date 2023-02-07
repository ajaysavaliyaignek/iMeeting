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
    backgroundColor: Colors.white,
    flex: 1
  },
  txtTitle: { ...Fonts.PoppinsBold[20], color: Colors.bold },
  txtDetailTitle: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary
  },
  txtDetailDiscription: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    marginTop: SIZES[4]
  },
  detailsContainer: {
    marginVertical: SIZES[24]
  },
  txtDuration: {
    position: 'absolute',
    right: 0,
    bottom: 4,
    ...Fonts.PoppinsRegular[14],
    color: '#AEB0B5'
  },
  txtLink: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary,
    marginTop: 45
  },
  txtAttachFile: {
    ...Fonts.PoppinsRegular[12],
    color: Colors.secondary,
    marginBottom: SIZES[22]
  },
  divider: {
    width: '100%',
    color: Colors.line,
    height: 1
  },
  committeeView: {
    marginVertical: SIZES[10],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  txtCommittee: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  },
  txtBtnCommittees: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary,
    marginRight: SIZES[21]
  },
  btnCommittees: { flexDirection: 'row', alignItems: 'center' },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: SIZES[12]
  },
  btnLayout: {
    width: '23%'
  },
  bottomContainer: {
    paddingHorizontal: SIZES[16],
    backgroundColor: Colors.white
  }
});
