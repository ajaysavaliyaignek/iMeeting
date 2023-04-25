import { StyleSheet } from 'react-native';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES[12]
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  },
  txtCommitteeName: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary,
    width: '30%'
  },
  discription: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    width: '78%'
    // backgroundColor: 'red'
  },
  committeeDetailView: {
    paddingVertical: SIZES[24],
    paddingHorizontal: SIZES[16],
    width: '100%'
  },
  txtCommitteeTitle: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold,
    marginLeft: SIZES[12]
  },
  dotsView: {
    position: 'absolute',
    right: SIZES[16],
    top: SIZES[24],
    width: SIZES[24],
    height: SIZES[24],
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
    width: '90%'
  },
  Checkbox: {
    borderRadius: SIZES[4],
    height: SIZES[24],
    width: SIZES[24]
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textItem: {
    flex: 1,
    fontSize: 16
  }
});
