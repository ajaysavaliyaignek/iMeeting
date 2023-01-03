import { StyleSheet } from 'react-native';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: SIZES[24],
    paddingHorizontal: SIZES[16]
  },
  txtDecisionTitle: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold
  },
  txtCommitteeName: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary,
    width: '30%'
  },
  discription: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    width: '60%'
  },
  txtDetailTitle: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary
  },
  txtDetailDiscription: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    marginTop: SIZES[4]
  },
  cancelBtnLayout: {
    backgroundColor: '#F3F6F9',
    marginVertical: SIZES[12],
    width: '100%'
  },
  txtCancelButton: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  }
});
