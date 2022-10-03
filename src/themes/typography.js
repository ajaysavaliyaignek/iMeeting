import { SIZES } from './Sizes';

export const FontNames = {
  PoppinsBold: 'Poppins-Bold',
  PoppinsRegular: 'Poppins-Regular',
  PoppinsSemiBold: 'Poppins-SemiBold'
};

const typography = {
  PoppinsBold: {
    20: {
      fontFamily: FontNames.PoppinsBold,
      fontSize: SIZES[20]
    },
    24: {
      fontFamily: FontNames.PoppinsBold,
      fontSize: SIZES[24]
    },
    32: {
      fontFamily: FontNames.PoppinsBold,
      fontSize: SIZES[32]
    }
  },

  PoppinsRegular: {
    12: {
      fontFamily: FontNames.PoppinsRegular,
      fontSize: SIZES[12]
    },

    14: {
      fontFamily: FontNames.PoppinsRegular,
      fontSize: SIZES[14]
    },

    10: {
      fontFamily: FontNames.PoppinsRegular,
      fontSize: SIZES[10]
    }
  },

  PoppinsSemiBold: {
    12: {
      fontFamily: FontNames.PoppinsSemiBold,
      fontSize: SIZES[12]
    },
    14: {
      fontFamily: FontNames.PoppinsSemiBold,
      fontSize: SIZES[14]
    },
    20: {
      fontFamily: FontNames.PoppinsSemiBold,
      fontSize: SIZES[20]
    }
  }
};

export default typography;
