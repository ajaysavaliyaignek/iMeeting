import { StyleSheet } from 'react-native';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';
import { SIZES } from '../../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  subContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: SIZES[16],
    paddingBottom: 200
  },
  profilePicContainer: {
    alignSelf: 'center',
    marginBottom: SIZES[16]
  },
  titleContainer: {
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.line,
    marginBottom: SIZES[24],
    flexGrow: 1
  },
  txtTitle: { ...Fonts.PoppinsRegular[12], color: Colors.secondary },
  textInput: {
    paddingVertical: SIZES[10],
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    flexGrow: 1
  },
  txtLabel: { ...Fonts.PoppinsRegular[14], color: Colors.bold },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.line,
    paddingVertical: SIZES[8]
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
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
  }
});
