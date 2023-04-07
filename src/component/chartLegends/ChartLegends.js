import { View, Text, Platform, TouchableOpacity } from 'react-native';
import React from 'react';
import { Divider } from 'react-native-paper';
import Checkbox from 'expo-checkbox';

import Normalize from '../../themes/mixins';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

const ChartLegends = ({
  backgroundColor,
  name,
  percentage,
  item,
  setOnSelect
}) => {
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: Platform.isPad ? Normalize(0) : SIZES[16],
        marginBottom: SIZES[16]
      }}
      disabled={percentage == `0.00%` ? true : false}
      onPress={() => {
        setOnSelect(item);
      }}
      activeOpacity={0.8}
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
            paddingLeft: SIZES[16],
            width: '40%'
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
              marginLeft: SIZES[24],
              width: '100%'
            }}
            numberOfLines={1}
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
            {percentage == `${NaN}%` ? '0.00%' : percentage}
          </Text>
          <Checkbox
            // disabled={percentage == `0.00%` ? true : false}
            value={item?.isSelected}
            color={Colors.primary}
            onValueChange={(value) => {
              setOnSelect(item, value);
            }}
          />
        </View>
      </View>
      <Divider style={{ width: '100%', backgroundColor: Colors.line }} />
    </TouchableOpacity>
  );
};

export default ChartLegends;
