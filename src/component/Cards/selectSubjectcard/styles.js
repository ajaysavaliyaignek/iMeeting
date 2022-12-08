import { StyleSheet } from 'react-native';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES[16]
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  },
  txtCommitteeName: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary,
    width: '50%'
  },
  discription: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  },

  txtCommitteeTitle: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold,
    marginLeft: SIZES[16],
    marginTop: SIZES[24]
  },
  dotsView: {
    position: 'absolute',
    right: SIZES[16],
    top: SIZES[32],
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalView: {
    position: 'absolute',
    top: SIZES[60],
    right: SIZES[8]
  },
  userDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES[16],
    marginBottom: SIZES[24]
  },
  Checkbox: {
    borderRadius: SIZES[4],
    height: SIZES[24],
    width: SIZES[24]
  }
});
