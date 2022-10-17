import { StyleSheet } from 'react-native';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    height: '100%'
  },
  subContainer: {
    padding: SIZES[16]
  },
  txtHeader: {
    ...Fonts.PoppinsBold[32],
    color: Colors.bold,
    marginVertical: SIZES[32]
  },
  textInput: {
    backgroundColor: Colors.white,
    height: SIZES[62],
    ...Fonts.PoppinsRegular[14]
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line,
    marginTop: SIZES[16]
  },
  createButtonContainer: {
    alignSelf: 'center',
    borderBottomColor: Colors.primary,
    borderBottomWidth: SIZES[1]
  },
  txtCreateAccount: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary,
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.primary
  },
  loginButton: {
    marginVertical: SIZES[12],
    width: '100%'
  },
  txtButton: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.white
  },
  errorView: {
    paddingHorizontal: SIZES[20],
    paddingVertical: SIZES[10],
    borderWidth: SIZES[1],
    borderColor: 'red',
    alignSelf: 'center'
  },
  btnView: {
    paddingHorizontal: SIZES[16]
  }
});
