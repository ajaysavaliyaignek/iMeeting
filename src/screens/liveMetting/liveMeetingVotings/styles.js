import { Platform, StyleSheet } from 'react-native';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: SIZES[16],
    height: Platform.OS == 'ios' ? SIZES[36] : null,
    backgroundColor: Colors.gray,
    paddingHorizontal: SIZES[16],
    borderRadius: SIZES[10]
  },
  textInput: {
    ...Fonts.PoppinsRegular[14],
    flex: 1,
    marginLeft: SIZES[6]
  },
  cancelBtnLayout: {
    backgroundColor: '#F3F6F9',

    marginHorizontal: SIZES[16],
    marginBottom: SIZES[24]
  },
  txtCancelButton: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    color: Colors.line
  },
  subContainer: { flex: 1, padding: SIZES[16] },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  txtEditBtn: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  editBtn: {
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.primary
  },
  txtTypeTitle: {
    ...Fonts.PoppinsRegular[12],
    color: Colors.secondary
  },
  txtType: {
    ...Fonts.PoppinsRegular[12],
    color: Colors.bold,
    marginLeft: SIZES[8]
  },
  txtQuestion: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold
  },
  questionContainer: {
    paddingVertical: SIZES[18]
  },
  txtLabel: { ...Fonts.PoppinsRegular[14], color: Colors.bold }.color,
  rowContainer: {
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
    color: Colors.bold
  },
  renderContainer: {
    padding: SIZES[16]
  }
});
