import { StyleSheet } from 'react-native';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: SIZES[16],
    padding: SIZES[16],
    borderRadius: SIZES[8],
    borderLeftWidth: SIZES[4]
  },
  txtEventTitle: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold
  },
  dotView: {
    height: SIZES[4],
    width: SIZES[4],
    borderRadius: SIZES[2],
    backgroundColor: '#C4C4C4',
    marginHorizontal: SIZES[8]
  },
  timeLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES[4],
    marginBottom: SIZES[16]
  },
  txtTimeLocation: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary
  },
  userImageView: {
    width: SIZES[34],
    height: SIZES[34],
    borderRadius: SIZES[100],
    borderColor: '#FDF5F1',
    backgroundColor: '#fff',
    borderWidth: 1,
    overflow: 'hidden',
    position: 'absolute'
  },
  usersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  userCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 0
  },
  txtAttendance: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.bold,
    marginLeft: SIZES[8]
  },
  txtTotalCount: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.secondary
  }
});
