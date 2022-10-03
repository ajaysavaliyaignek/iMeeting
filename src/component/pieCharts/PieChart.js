import { View, Text } from 'react-native';
import React from 'react';
import { VictoryPie } from 'victory-native';

import { Colors } from '../../themes/Colors';
import { Fonts } from '../../themes';
import Normalize from '../../themes/mixins';
import { SIZES } from '../../themes/Sizes';

const PieChart = ({ title, chartData, chartColor }) => {
  return (
    <View>
      <Text
        style={{
          ...Fonts.PoppinsBold[20],
          color: Colors.bold,
          marginTop: SIZES[24],
          marginLeft: SIZES[16],
          backgroundColor: Colors.gray
        }}
      >
        {title}
      </Text>
      <VictoryPie
        labelPosition={'endAngle'}
        data={chartData}
        width={Normalize(350)}
        height={Normalize(265)}
        innerRadius={Normalize(60)}
        style={{
          labels: {
            fill: Colors.bold,
            ...Fonts.PoppinsRegular[12],
            padding: 7
          }
        }}
        padAngle={6}
        colorScale={chartColor}
      />
    </View>
  );
};

export default PieChart;
