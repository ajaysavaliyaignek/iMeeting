import { StyleSheet } from 'react-native';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: SIZES[24],
    marginHorizontal: SIZES[16]
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
  btnExternalUser: {
    backgroundColor: Colors.Blue_Light,
    marginBottom: SIZES[16]
  },
  txtBtnExternal: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  txtContacts: {
    ...Fonts.PoppinsBold[24],
    color: Colors.bold,
    marginBottom: SIZES[16]
  }
});
