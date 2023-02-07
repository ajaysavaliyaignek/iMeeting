import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Image } from 'react-native';

import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';
import Icon from '../Icon';
import Loader from '../Loader/Loader';

const _Button = ({
  onPress,
  title,
  textStyle,
  layoutStyle,
  icon,
  disable,
  isLoading,
  iconName
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
        <View style={{ flexDirection: 'row' }}>
          {iconName && (
            <Image style={{ height: 24, width: 24 }} source={iconName} />
          )}
          <Text
            style={[
              style.text,
              { color: Colors.white, marginLeft: iconName ? SIZES[16] : null },
              textStyle
            ]}
          >
            {icon}
            {title}
          </Text>
        </View>
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
