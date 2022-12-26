import { View, ActivityIndicator } from 'react-native';
import React from 'react';
import { Colors } from '../../themes/Colors';

const Loader = ({ layOutStyle, color }) => {
  return (
    <View
      style={[
        { flex: 1, alignItems: 'center', justifyContent: 'center' },
        layOutStyle
      ]}
    >
      <ActivityIndicator color={color} size="large" />
    </View>
  );
};

export default Loader;
