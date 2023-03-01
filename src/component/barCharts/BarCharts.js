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

const BarCharts = ({ chartColor, title }) => {
  const data2012 = [
    { quarter: 1, earnings: 13000 },
    { quarter: 2, earnings: 16500 },
    { quarter: 3, earnings: 14250 },
    { quarter: 4, earnings: 19000 },
    { quarter: 5, earnings: 19000 },
    { quarter: 6, earnings: 19000 }
  ];

  const data2013 = [
    { quarter: 1, earnings: 15000 },
    { quarter: 2, earnings: 12500 },
    { quarter: 3, earnings: 19500 },
    { quarter: 4, earnings: 13000 },
    { quarter: 5, earnings: 13000 },
    { quarter: 6, earnings: 13000 }
  ];

  const data2014 = [
    { quarter: 1, earnings: 11500 },
    { quarter: 2, earnings: 13250 },
    { quarter: 3, earnings: 20000 },
    { quarter: 4, earnings: 15500 },
    { quarter: 5, earnings: 15500 },
    { quarter: 6, earnings: 15500 }
  ];

  const data2015 = [
    { quarter: 1, earnings: 18000 },
    { quarter: 2, earnings: 13250 },
    { quarter: 3, earnings: 15000 },
    { quarter: 4, earnings: 12000 },
    { quarter: 5, earnings: 12000 },
    { quarter: 6, earnings: 12000 }
  ];
  const data2016 = [
    { quarter: 1, earnings: 18000 },
    { quarter: 2, earnings: 13250 },
    { quarter: 3, earnings: 15000 },
    { quarter: 4, earnings: 12000 },
    { quarter: 5, earnings: 12000 },
    { quarter: 6, earnings: 12000 }
  ];
  const data2017 = [
    { quarter: 1, earnings: 18000 },
    { quarter: 2, earnings: 13250 },
    { quarter: 3, earnings: 15000 },
    { quarter: 4, earnings: 12000 },
    { quarter: 5, earnings: 12000 },
    { quarter: 6, earnings: 12000 }
  ];

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
      <VictoryChart
        domainPadding={SIZES[24]}
        width={SIZES[350]}
        height={SIZES[400]}
        theme={VictoryTheme.material}
      >
        <VictoryAxis
          tickValues={[1, 2, 3, 4, 5, 6]}
          tickFormat={[
            'iMeeting',
            'Accounting',
            'Sport committee',
            'Municiple corporation',
            'CEO conference',
            'Manchester United Mee...'
          ]}
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
          tickFormat={(x) => `${x / 10000 / 2}`}
          style={{
            tickLabels: {
              ...Fonts.PoppinsRegular[14],
              color: Colors.bold,
              textAnchor: 'start',
              padding: SIZES[10]
            }
          }}
        />
        <VictoryStack colorScale={chartColor}>
          <VictoryBar
            data={data2012}
            x="quarter"
            y="earnings"
            cornerRadius={{ top: SIZES[4], bottom: SIZES[4] }}
            barWidth={SIZES[32]}
          />
          <VictoryBar
            data={data2013}
            x="quarter"
            y="earnings"
            cornerRadius={{ top: SIZES[4], bottom: SIZES[4] }}
            barWidth={SIZES[32]}
          />
          <VictoryBar
            data={data2014}
            x="quarter"
            y="earnings"
            cornerRadius={{ top: SIZES[4], bottom: SIZES[4] }}
            barWidth={SIZES[32]}
          />
          <VictoryBar
            data={data2015}
            x="quarter"
            y="earnings"
            cornerRadius={{ top: SIZES[4], bottom: SIZES[4] }}
            barWidth={SIZES[32]}
          />
          <VictoryBar
            data={data2016}
            x="quarter"
            y="earnings"
            cornerRadius={{ top: SIZES[4], bottom: SIZES[4] }}
            barWidth={SIZES[32]}
          />
          <VictoryBar
            data={data2017}
            x="quarter"
            y="earnings"
            cornerRadius={{ top: SIZES[4], bottom: SIZES[4] }}
            barWidth={SIZES[32]}
          />
        </VictoryStack>
      </VictoryChart>
    </View>
  );
};

export default BarCharts;
