import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    paddingBottom: SIZES[16],
    flex: 1
  },
  chartContainer: {
    marginVertical: SIZES[16],
    backgroundColor: Colors.gray,
    borderRadius: SIZES[12]
  }
});
