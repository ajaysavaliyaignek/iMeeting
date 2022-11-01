import { StyleSheet } from 'react-native';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';
import { SIZES } from '../../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  subContainer: {
    backgroundColor: Colors.white,
    flex: 1
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES[10],
    backgroundColor: Colors.gray,
    borderRadius: SIZES[10],
    marginVertical: SIZES[16],
    paddingVertical: SIZES[6],
    marginHorizontal: SIZES[16]
  },
  textInput: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    backgroundColor: 'transparent',
    flex: 1,
    marginHorizontal: SIZES[6]
  },
  committeeView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES[10],
    marginHorizontal: SIZES[16]
  },
  btnCommittees: { flexDirection: 'row', alignItems: 'center' },
  txtBtnCommittees: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary,
    marginRight: SIZES[21]
  },
  txtCommittee: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  },
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
  }
});
