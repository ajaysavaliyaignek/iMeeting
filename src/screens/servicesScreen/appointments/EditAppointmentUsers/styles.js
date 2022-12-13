import { StyleSheet } from 'react-native';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';
import { SIZES } from '../../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  subContainer: {
    paddingTop: SIZES[16],
    backgroundColor: Colors.white,
    flex: 1
  },
  txtAddSubjectTitle: {
    ...Fonts.PoppinsBold[24],
    color: Colors.bold,
    marginHorizontal: SIZES[16]
  },
  buttonContainer: {
    paddingHorizontal: SIZES[16],
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelBtnLayout: {
    backgroundColor: '#F3F6F9',
    marginVertical: SIZES[12],
    width: '48%'
  },
  txtCancelButton: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  nextBtnLayout: {
    marginVertical: SIZES[12],
    width: '48%'
  },
  txtNextBtn: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.white
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  },
  titleContainer: {
    marginTop: SIZES[16],
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.line
  },
  txtTitle: { ...Fonts.PoppinsRegular[12], color: Colors.secondary },

  discriptionContainer: {
    marginTop: SIZES[24],
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.line
  },
  textInput: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    backgroundColor: 'transparent',
    flex: 1,
    marginHorizontal: SIZES[6]
  },
  categoryContainer: {
    marginTop: SIZES[24],
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.line,
    zIndex: 20
  },
  txtAttachFile: {
    ...Fonts.PoppinsRegular[12],
    color: Colors.secondary,
    marginBottom: SIZES[22]
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES[16],
    marginHorizontal: SIZES[16]
  },
  txtProgress: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES[10],
    backgroundColor: Colors.gray,
    borderRadius: SIZES[10],
    marginVertical: SIZES[22],
    height: SIZES[36],
    marginHorizontal: SIZES[16]
  },
  txtBtnCommittees: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary,
    marginRight: SIZES[21]
  },
  committeeView: {
    marginVertical: SIZES[10],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: SIZES[16]
  },
  txtCommittee: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  },
  btnCommittees: { flexDirection: 'row', alignItems: 'center' }
});
