import { StyleSheet } from 'react-native';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';
import { SIZES } from '../../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  subContainer: {
    paddingHorizontal: SIZES[16],
    paddingTop: SIZES[16],
    backgroundColor: Colors.white,
    flex: 1
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES[16]
  },
  txtProgress: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary
  },
  txtAddSubjectTitle: { ...Fonts.PoppinsBold[24], color: Colors.bold },
  txtTitle: { ...Fonts.PoppinsRegular[12], color: Colors.secondary },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  },
  locationContainer: {
    marginTop: SIZES[24],
    zIndex: 40
  },
  videoContainer: {
    marginTop: SIZES[24],
    zIndex: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SIZES[16],
    zIndex: 20
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
