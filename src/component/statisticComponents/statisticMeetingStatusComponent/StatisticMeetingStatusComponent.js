import { View, Text, ScrollView, Platform } from 'react-native';
import React from 'react';
import { styles } from './styles';
import PieChart from '../../pieCharts/PieChart';
import { SIZES } from '../../../themes/Sizes';
import ChartLegends from '../../chartLegends/ChartLegends';
import BarCharts from '../../barCharts/BarCharts';

const StatisticMeetingStatusComponent = () => {
  const chartDataMeeting = [
    { y: 7, x: `7%\nTentative` },
    { y: 35, x: `35%\nPre-schedule` },
    { y: 29, x: `29%\nScheduled` },
    { y: 16, x: `16%\nCancelled` },
    { y: 8, x: `8%\nClosed` },
    { y: 5, x: `5%\nLive` }
  ];

  const chartColorMeeting = [
    '#144B8D',
    '#5A81AF',
    '#A1B7D1',
    '#E6C54F',
    '#DD7878',
    '#81AB96'
  ];
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View
        style={[
          styles.chartContainer,
          {
            flexDirection: Platform.isPad ? 'row' : 'column',
            alignItems: Platform.isPad ? 'center' : null,
            justifyContent: Platform.isPad ? 'space-between' : null
          }
        ]}
      >
        <PieChart
          chartColor={chartColorMeeting}
          chartData={chartDataMeeting}
          title={'Meeting Status'}
        />

        <View
          style={{
            width: Platform.isPad ? '50%' : null,
            marginTop: Platform.isPad ? SIZES[50] : null
          }}
        >
          <ChartLegends
            backgroundColor={'#144B8D'}
            name={'Tentative'}
            percentage={'7%'}
          />

          <ChartLegends
            backgroundColor={'#5A81AF'}
            name={'Pre-schedule'}
            percentage={'35%'}
          />
          <ChartLegends
            backgroundColor={'#A1B7D1'}
            name={'Scheduled'}
            percentage={'29%'}
          />
          <ChartLegends
            backgroundColor={'#E6C54F'}
            name={'Cancelled'}
            percentage={'16%'}
          />
          <ChartLegends
            backgroundColor={'#DD7878'}
            name={'Closed'}
            percentage={'8%'}
          />
          <ChartLegends
            backgroundColor={'#81AB96'}
            name={'Live'}
            percentage={'5%'}
          />
        </View>
      </View>
      <View style={styles.chartContainer}>
        <BarCharts chartColor={chartColorMeeting} title={'Meeting status'} />
        <ChartLegends
          backgroundColor={'#144B8D'}
          name={'Tentative'}
          percentage={'7%'}
        />
        <ChartLegends
          backgroundColor={'#5A81AF'}
          name={'Pre-schedule'}
          percentage={'35%'}
        />
        <ChartLegends
          backgroundColor={'#A1B7D1'}
          name={'Scheduled'}
          percentage={'29%'}
        />
        <ChartLegends
          backgroundColor={'#E6C54F'}
          name={'Cancelled'}
          percentage={'16%'}
        />
        <ChartLegends
          backgroundColor={'#DD7878'}
          name={'Closed'}
          percentage={'8%'}
        />
        <ChartLegends
          backgroundColor={'#81AB96'}
          name={'Live'}
          percentage={'5%'}
        />
      </View>
    </ScrollView>
  );
};

export default StatisticMeetingStatusComponent;
