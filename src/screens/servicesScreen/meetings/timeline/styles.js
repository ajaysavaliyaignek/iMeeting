import { StyleSheet } from 'react-native';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';
import { SIZES } from '../../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  txtModalHeader: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold
  },
  txtUserCount: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary
  },
  modal: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: SIZES[8],

    backgroundColor: 'rgba(100, 100, 100, 0.7)'
  },

  mainBoxView: {
    padding: SIZES[16],
    backgroundColor: Colors.white,
    shadowColor: Colors.gray,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: SIZES[16],

    // marginTop: 160
    position: 'absolute',
    bottom: 92,
    height: 400,
    width: '100%'
  },

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
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  userContainer: {
    borderRadius: SIZES[8],
    paddingVertical: SIZES[8],
    borderLeftWidth: SIZES[4],
    marginTop: SIZES[8]
  },
  userDataContainer: {
    marginLeft: SIZES[8]
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  txtUserName: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.bold,
    marginLeft: SIZES[8]
  },
  txtTime: {
    ...Fonts.PoppinsRegular[10],
    color: Colors.secondary,
    marginTop: SIZES[4]
  },

  closeContainer: {
    position: 'absolute',
    bottom: SIZES[24],
    backgroundColor: Colors.white,
    width: '100%',
    marginHorizontal: SIZES[16],
    marginTop: SIZES[8],
    paddingVertical: SIZES[16],
    borderRadius: SIZES[12],
    alignItems: 'center',
    justifyContent: 'center'
  },
  txtClostBtn: {
    ...Fonts.PoppinsBold[20],
    color: '#007AFF'
  }
});
