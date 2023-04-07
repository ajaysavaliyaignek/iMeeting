import { View, ScrollView } from 'react-native';
import React from 'react';

import { styles } from './styles';
import PieChart from '../../pieCharts/PieChart';
import BarCharts from '../../barCharts/BarCharts';

const StatisticMeetingStatusComponent = ({
  selectedCommittees,
  startDate,
  endDate
}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={[styles.chartContainer]}>
        <PieChart
          startDate={startDate}
          endDate={endDate}
          title={'Meeting Status'}
          type={1}
          selectedCommittees={selectedCommittees}
        />
      </View>
      <View style={styles.chartContainer}>
        <BarCharts
          startDate={startDate}
          endDate={endDate}
          title={'Meeting Status'}
          type={1}
          selectedCommittees={selectedCommittees}
        />
      </View>
    </ScrollView>
  );
};

export default StatisticMeetingStatusComponent;
