import { StyleSheet } from 'react-native';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  subContainer: {
    backgroundColor: Colors.white,

    paddingHorizontal: SIZES[16],
    flex: 1
  },
  txtTitle: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold,
    marginTop: SIZES[24]
  },

  subView: {
    marginTop: SIZES[24]
  },
  txtSubDetails: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary
  },
  txtSubDiscription: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    marginTop: SIZES[4]
  },
  txtAttachedTitle: {
    ...Fonts.PoppinsRegular[12],
    fontWeight: '500',
    color: Colors.secondary,
    marginTop: SIZES[40],
    marginBottom: SIZES[22]
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
    backgroundColor: '#DD7878',
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
  txtcommentsTitle: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold,
    marginTop: SIZES[26]
  },
  commentsContainer: {
    flexDirection: 'row',
    paddingVertical: SIZES[10],
    paddingHorizontal: SIZES[16],
    borderWidth: SIZES[1],
    borderColor: Colors.line,
    borderRadius: SIZES[8],
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SIZES[16],
    zIndex: 20
  }
});
