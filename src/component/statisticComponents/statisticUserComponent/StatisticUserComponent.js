import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { styles } from './styles';
import PieChart from '../../pieCharts/PieChart';
import ChartLegends from '../../chartLegends/ChartLegends';
import BarCharts from '../../barCharts/BarCharts';

const StatisticUserComponent = () => {
  const chartDataUsers = [
    { y: 36, x: `36%\nDarlene Robertson` },
    { y: 64, x: `64%\nEleanor Pena` }
  ];
  const chartColorUsers = ['#144B8D', '#5A81AF'];
  const chartColorAttendance = ['#81AB96', '#E6C54F'];
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={styles.chartContainer}>
        <PieChart
          chartColor={chartColorUsers}
          chartData={chartDataUsers}
          title={'Number users of committes'}
        />
        <ChartLegends
          backgroundColor={'#144B8D'}
          name={'Darlene robertson'}
          percentage={'36%'}
        />

        <ChartLegends
          backgroundColor={'#5A81AF'}
          name={'Eleanor Pena'}
          percentage={'64%'}
        />
      </View>
      <View style={styles.chartContainer}>
        <BarCharts chartColor={chartColorAttendance} title={'Attendance'} />
        <ChartLegends
          backgroundColor={'#81AB96'}
          name={'Attend'}
          percentage={'71%'}
        />
        <ChartLegends
          backgroundColor={'#E6C54F'}
          name={'Absent'}
          percentage={'29%'}
        />
      </View>
    </ScrollView>
  );
};

export default StatisticUserComponent;
