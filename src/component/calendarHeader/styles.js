import { StyleSheet } from 'react-native';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES[16]
  },
  header: {
    flexDirection: 'row',
    paddingTop: SIZES[16],
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  dateText: {
    fontSize: SIZES[18],
    color: Colors.bold
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftIcon: {
    transform: [{ rotate: '180deg' }]
  }
});
