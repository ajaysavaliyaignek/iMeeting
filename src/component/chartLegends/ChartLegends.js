import { View, Text, Platform } from 'react-native';
import React from 'react';
import { Divider } from 'react-native-paper';
import Checkbox from 'expo-checkbox';

import Normalize from '../../themes/mixins';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

const ChartLegends = ({ backgroundColor, name, percentage }) => {
  return (
    <View
      style={{
        paddingHorizontal: Platform.isPad ? Normalize(0) : SIZES[16],
        marginBottom: SIZES[16]
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',

          justifyContent: 'space-between'
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: SIZES[16]
          }}
        >
          <View
            style={{
              height: SIZES[12],
              width: SIZES[12],
              backgroundColor: backgroundColor,
              borderRadius: SIZES[6]
            }}
          />
          <Text
            style={{
              ...Fonts.PoppinsRegular[14],
              color: Colors.bold,
              marginLeft: SIZES[24]
            }}
          >
            {name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: SIZES[16]
          }}
        >
          <Text
            style={{
              ...Fonts.PoppinsRegular[14],
              color: Colors.bold,
              marginRight: SIZES[24]
            }}
          >
            {percentage}
          </Text>
          <Checkbox value={true} color={Colors.primary} />
        </View>
      </View>
      <Divider style={{ width: '100%', backgroundColor: Colors.line }} />
    </View>
  );
};

export default ChartLegends;
