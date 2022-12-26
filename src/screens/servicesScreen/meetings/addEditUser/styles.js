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

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    height: Platform.OS == 'ios' ? SIZES[36] : null,
    backgroundColor: Colors.gray,
    paddingHorizontal: SIZES[16],
    borderRadius: SIZES[10],
    marginVertical: SIZES[22],
    marginHorizontal: SIZES[16]
  },
  textInput: {
    ...Fonts.PoppinsRegular[14],
    flex: 1,
    marginLeft: SIZES[6]
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
