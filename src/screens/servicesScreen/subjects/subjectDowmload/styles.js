import { StyleSheet } from 'react-native';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';
import { SIZES } from '../../../../themes/Sizes';

export const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: SIZES[24],
    paddingVertical: SIZES[24]
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
    color: '#144B8D'
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
  txtDownloadTitle: { ...Fonts.PoppinsBold[24], color: Colors.bold },
  exportContainer: {
    marginTop: SIZES[16],
    zIndex: 20,
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.line,
    marginBottom: SIZES[34]
  },
  txtExportTitle: { ...Fonts.PoppinsRegular[12], color: Colors.secondary },
  txtLabel: { ...Fonts.PoppinsRegular[14], color: Colors.bold },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.line,
    paddingVertical: SIZES[8]
  }
});
