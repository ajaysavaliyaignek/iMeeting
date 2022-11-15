import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Checkbox from 'expo-checkbox';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

const CheckBox = ({ value, onValueChange, disabled }) => {
  return (
    <Checkbox
      color={Colors.primary}
      style={styles.Checkbox}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    />
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  Checkbox: {
    borderRadius: SIZES[4],
    height: SIZES[24],
    width: SIZES[24]
  }
});
