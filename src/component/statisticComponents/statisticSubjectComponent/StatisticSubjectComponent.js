import { View, ScrollView } from 'react-native';
import React from 'react';

import BarCharts from '../../barCharts/BarCharts';
import { styles } from './styles';

const StatisticSubjectComponent = ({
  selectedCommittees,
  startDate,
  endDate
}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={styles.chartContainer}>
        <BarCharts
          startDate={startDate}
          endDate={endDate}
          selectedCommittees={selectedCommittees}
          title={'By status'}
          type={2}
        />
      </View>
    </ScrollView>
  );
};

export default StatisticSubjectComponent;
