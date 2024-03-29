import { Platform, StyleSheet } from 'react-native';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: SIZES[16],
    height: Platform.OS == 'ios' ? SIZES[36] : null,
    backgroundColor: Colors.gray,
    paddingHorizontal: SIZES[16],
    borderRadius: SIZES[10]
  },
  textInput: {
    ...Fonts.PoppinsRegular[14],
    flex: 1,
    marginLeft: SIZES[6]
  },

  txtCancelButton: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    color: Colors.line
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: SIZES[10],
    marginHorizontal: SIZES[16],
    marginVertical: SIZES[16],
    padding: SIZES[2],
    justifyContent: 'space-between'
  },
  btnServices: {
    paddingVertical: SIZES[8],
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES[8]
  },
  txtBtnServices: { ...Fonts.PoppinsSemiBold[12], color: Colors.bold },
  activeSpeakerContainer: {
    backgroundColor: Colors.gray,
    padding: SIZES[14],
    marginHorizontal: SIZES[16],
    flexDirection: 'row',
    marginBottom: SIZES[8],
    borderRadius: SIZES[12],
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  nameContainer: {
    marginLeft: SIZES[8],
    marginTop: SIZES[10]
  },
  txtName: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.bold
  },
  txtSpeaker: {
    ...Fonts.PoppinsRegular[12],
    color: Colors.secondary
  },
  iconView: {
    marginLeft: SIZES[21],
    justifyContent: 'flex-end'
  },
  txtRunningTime: {
    ...Fonts.PoppinsSemiBold[20],
    color: Colors.bold
  },
  txtTimeDuration: {
    ...Fonts.PoppinsSemiBold[20],
    color: Colors.secondary
  },
  modal: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(100, 100, 100, 0.7)'
  },

  mainBoxView: {
    padding: 16,
    backgroundColor: Colors.white,
    shadowColor: Colors.gray,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 14,
    position: 'absolute',
    bottom: '30%',
    width: SIZES[280]
  },
  cancelBtnLayout: {
    backgroundColor: '#F3F6F9',
    marginVertical: SIZES[16],
    width: '48%'
  },
  txtCancelButton: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  buttonContainer: {
    
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  nextBtnLayout: {
    marginVertical: SIZES[12],
    width: '48%'
  },
  txtNextBtn: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.white
  },
  txtTitle:{
    ...Fonts.PoppinsSemiBold[20],
    color:Colors.bold,
    marginBottom:SIZES[10]
  }
});
