import { StyleSheet } from 'react-native';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  subContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: SIZES[16]
  },
  profilePicContainer: {
    alignSelf: 'center',
    marginBottom: SIZES[24]
  },
  titleContainer: {
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.line,
    marginBottom: SIZES[24]
    // flexGrow: 1
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
    justifyContent: 'space-between'
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: SIZES[10],
    padding: SIZES[2],
    justifyContent: 'space-between',
    marginHorizontal: SIZES[16]
  },
  txtBtnServices: { ...Fonts.PoppinsSemiBold[12], color: Colors.bold },
  btnExternalUser: {
    backgroundColor: Colors.Blue_Light,
    marginBottom: SIZES[16]
  },
  txtBtnExternal: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  btnUsers: {
    paddingVertical: SIZES[8],
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES[8]
  },
  txtContacts: {
    ...Fonts.PoppinsBold[24],
    color: Colors.bold,
    marginBottom: SIZES[16]
  }
});
