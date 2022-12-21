import { Text } from 'react-native';
import React from 'react';
import { TextInput } from 'react-native-paper';

import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';

const Input = ({
  onChangeText,
  value,
  label,
  secureTextEntry,
  right,
  style,
  onChange,
  onPressOut,
  labelStyle,
  placeholder,
  keyboardType
}) => {
  return (
    <TextInput
      onPressOut={onPressOut}
      autoCapitalize={false}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      onBlur={onChange}
      value={value}
      label={
        <Text
          style={[
            { ...Fonts.PoppinsRegular[12], color: Colors.secondary },
            labelStyle
          ]}
        >
          {label}
        </Text>
      }
      right={right}
      underlineColor={Colors.line}
      activeUnderlineColor={Colors.line}
      style={[{ ...Fonts.PoppinsRegular[14], color: Colors.bold }, style]}
      placeholder={placeholder}
    />
  );
};

export default Input;
