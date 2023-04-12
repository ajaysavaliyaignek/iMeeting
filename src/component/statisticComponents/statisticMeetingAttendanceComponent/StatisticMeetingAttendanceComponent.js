import { ScrollView, View } from 'react-native';
import React from 'react';

import { styles } from './styles';
import PieChart from '../../pieCharts/PieChart';
import BarCharts from '../../barCharts/BarCharts';

const StatisticMeetingAttendanceComponent = ({
  selectedCommittees,
  startDate,
  endDate
}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={styles.chartContainer}>
        <PieChart
          title={'Attendance'}
          selectedCommittees={selectedCommittees}
          startDate={startDate}
          endDate={endDate}
          type={12}
        />
      </View>
      <View style={styles.chartContainer}>
        {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1 }}
        > */}
        <BarCharts
          title={'Attendance'}
          selectedCommittees={selectedCommittees}
          startDate={startDate}
          endDate={endDate}
          type={12}
        />
        {/* </ScrollView> */}
      </View>
    </ScrollView>
  );
};

export default StatisticMeetingAttendanceComponent;
