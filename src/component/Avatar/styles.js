import { StyleSheet } from 'react-native';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

const style = (size, rounded) =>
  StyleSheet.create({
    container: {
      width: size,
      aspectRatio: 1.0,
      borderRadius: rounded ? size - SIZES[2] / SIZES[2] : 0,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: SIZES[2],
      borderColor: Colors.line
    },
    initialsText: {
      ...Fonts.PoppinsSemiBold[34],
      fontSize: size / SIZES[2] - SIZES[2],
      alignItems: 'center',
      textTransform: 'uppercase'
    },
    imageStyle: {
      height: size,
      width: size,
      borderRadius: size / SIZES[2]
    }
  });

export default style;
