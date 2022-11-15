import { StyleSheet } from 'react-native';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';
import { SIZES } from '../../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  subContainer: {
    paddingHorizontal: SIZES[16],

    backgroundColor: Colors.white,
    flex: 1
  },
  usersView: {
    marginVertical: SIZES[10],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  txtUsers: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  },
  btnCommittees: { flexDirection: 'row', alignItems: 'center' },
  txtBtnCommittees: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary,
    marginRight: SIZES[21]
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  }
});
