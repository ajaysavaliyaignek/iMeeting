import { StyleSheet } from 'react-native';
import { SIZES } from '../../themes/Sizes';

export const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES[16]
  },
  txtDiscription: {},
  round: {
    height: SIZES[8],
    width: SIZES[8],
    borderRadius: SIZES[4],
    marginLeft: SIZES[16],
    marginRight: SIZES[8]
  }
});
