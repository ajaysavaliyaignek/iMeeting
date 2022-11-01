import { StyleSheet } from 'react-native';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    paddingTop: SIZES[16],
    backgroundColor: Colors.white
  },

  dateText: {
    flex: 6,
    fontSize: SIZES[18]
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftIcon: {
    transform: [{ rotate: '180deg' }]
  }
});
