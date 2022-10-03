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
  placeholder
}) => {
  return (
    <TextInput
      onPressOut={onPressOut}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      onSubmitEditing={onChange}
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
      style={style}
      placeholder={placeholder}
    />
  );
};

export default Input;
