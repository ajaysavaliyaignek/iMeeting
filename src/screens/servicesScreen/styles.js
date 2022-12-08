import { StyleSheet } from 'react-native';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';
import DeviceInfo from 'react-native-device-info';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  subContainer: {
    backgroundColor: Colors.white,
    height: '100%',
    width: '100%',
    paddingTop: DeviceInfo.isTablet() ? SIZES[40] : SIZES[16],
    paddingLeft: DeviceInfo.isTablet() ? 186 : SIZES[16],
    paddingRight: DeviceInfo.isTablet() ? 170 : 0
  },
  txtHeading: {
    ...Fonts.PoppinsSemiBold[12],
    color: Colors.bold
  },
  generalView: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES[24],
    justifyContent: 'space-between'
  }
});
