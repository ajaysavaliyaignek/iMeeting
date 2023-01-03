import { Platform, StyleSheet } from 'react-native';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';

export const styles = StyleSheet.create({
  inputMessageContainer: {
    flexDirection: 'row',
    borderWidth: SIZES[1],
    borderColor: Colors.line,
    borderRadius: SIZES[8],
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: SIZES[16]
  },
  container: {
    flex: 1,
    padding: SIZES[16]
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  attachIconView: {
    marginRight: SIZES[18],
    marginLeft: SIZES[8]
  },
  textInput: {
    flex: 1,
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    marginVertical: Platform.OS == 'android' ? null : 14
  },
  usernameText: {
    ...Fonts.PoppinsRegular[14],
    Colors: Colors.white
  },
  renderSuggestionContainer: {
    padding: SIZES[8]
  },
  editorStyles: {
    flex: 1
  }
});
