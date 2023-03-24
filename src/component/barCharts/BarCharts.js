import { View, Text } from 'react-native';
import React from 'react';
import {
  LineSegment,
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryStack,
  VictoryTheme
} from 'victory-native';

import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';
import {
  committeeArrayy,
  CommitteeDataArrray
} from '../statisticComponents/statisticMeetingStatusComponent/BarChartData';
import { ScrollView } from 'react-native';

const BarCharts = ({ chartColor, title, barchartCommittees, barchartData }) => {
  return (
    <View style={{ marginBottom: SIZES[16], flex: 1 }}>
      <Text
        style={{
          ...Fonts.PoppinsBold[20],
          color: Colors.bold,
          marginTop: SIZES[24],
          marginLeft: SIZES[16],
          backgroundColor: '#f8f8f8'
        }}
      >
        {title}
      </Text>
      <View>
        <VictoryChart
          domainPadding={SIZES[24]}
          // width={SIZES[350]}
          height={SIZES[600]}
          theme={VictoryTheme.material}
          padding={{ bottom: 150, right: 20, left: 40, top: 20 }}
        >
          <VictoryAxis
            tickValues={barchartCommittees}
            gridComponent={<LineSegment />}
            tickLabelComponent={
              <VictoryLabel
                angle={90}
                verticalAnchor="middle"
                textAnchor="start"
                style={{
                  ...Fonts.PoppinsRegular[14],
                  color: Colors.bold
                }}
              />
            }
          />
          <VictoryAxis
            dependentAxis
            // tickValues={[1, 2, 3, 4, 5, 6]}
            tickFormat={(x) => `${x}`}
            style={{
              tickLabels: {
                ...Fonts.PoppinsRegular[14],
                color: Colors.bold,
                textAnchor: 'start'
              }
            }}
            tickLabelComponent={
              <VictoryLabel
                verticalAnchor="middle"
                textAnchor="end"
                style={{
                  ...Fonts.PoppinsRegular[14],
                  color: Colors.bold
                }}
              />
            }
          />
          <VictoryStack colorScale={chartColor}>
            {barchartData?.map((item, index) => {
              return (
                <VictoryBar
                  data={item}
                  x="x"
                  y="y"
                  cornerRadius={{ top: SIZES[4], bottom: SIZES[4] }}
                  barWidth={SIZES[32]}
                />
              );
            })}
          </VictoryStack>
        </VictoryChart>
      </View>
    </View>
  );
};

export default BarCharts;
