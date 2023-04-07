import { StyleSheet } from 'react-native';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES[12],
    zIndex: 10,
    flex: 1
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
    color: Colors.bold
  },
  committeeDetailView: {
    paddingVertical: SIZES[24],
    paddingHorizontal: SIZES[16],
    width: '90%'
  },
  txtCommitteeTitle: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold
  },
  dotsView: {
    position: 'absolute',
    right: SIZES[16],
    top: SIZES[32],
    width: SIZES[26],
    height: SIZES[26],
    alignItems: 'center',
    justifyContent: 'center'
  },
  discriptionView: {
    paddingVertical: SIZES[6],
    paddingHorizontal: SIZES[24],
    borderRadius: SIZES[8]
  },
  modalView: {
    position: 'absolute',
    top: SIZES[60],
    right: SIZES[8],
    zIndex: 20
  },
  item: {
    padding: SIZES[16],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textItem: {
    flex: 1,
    fontSize: SIZES[16]
  }
});
