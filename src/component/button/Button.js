import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';

import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';
import Loader from '../Loader/Loader';

const _Button = ({
  onPress,
  title,
  textStyle,
  layoutStyle,
  icon,
  disable,
  isLoading
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disable}
      style={[style.layout, { backgroundColor: Colors.primary }, layoutStyle]}
    >
      {isLoading ? (
        <Loader color={Colors.white} />
      ) : (
        <Text style={[style.text, { color: Colors.white }, textStyle]}>
          {icon}
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export const Button = _Button;

const style = StyleSheet.create({
  layout: {
    paddingVertical: SIZES[10],
    borderRadius: SIZES[8],
    // elevation: 4,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  text: {
    textAlign: 'center',
    alignSelf: 'center',
    ...Fonts.PoppinsSemiBold[14]
  }
});
