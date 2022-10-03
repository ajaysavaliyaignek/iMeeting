import { View, ActivityIndicator } from 'react-native';
import React from 'react';
import { Colors } from '../../themes/Colors';

const Loader = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={Colors.primary} size="large" />
    </View>
  );
};

export default Loader;
