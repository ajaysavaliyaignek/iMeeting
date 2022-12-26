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
  txtAddSubjectTitle: {
    ...Fonts.PoppinsBold[24],
    color: Colors.bold
  },

  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  },
  titleContainer: {
    marginTop: SIZES[16],
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.line,
    zIndex: 20
  },
  txtTitle: { ...Fonts.PoppinsRegular[12], color: Colors.secondary },

  discriptionContainer: {
    marginTop: SIZES[24],
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.line
  },
  textInput: {
    paddingVertical: SIZES[10],
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  },
  categoryContainer: {
    marginTop: SIZES[24],
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.line
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
    marginBottom: SIZES[16]
  },
  txtProgress: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary
  }
});
