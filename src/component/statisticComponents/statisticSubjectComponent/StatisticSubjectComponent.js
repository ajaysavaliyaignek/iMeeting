import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { SIZES } from '../../../themes/Sizes';
import { Colors } from '../../../themes/Colors';
import BarCharts from '../../barCharts/BarCharts';
import ChartLegends from '../../chartLegends/ChartLegends';
import { styles } from './styles';

const StatisticSubjectComponent = () => {
  const chartColorSubject = ['#81AB96', '#DD7878', '#E6C54F'];
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={styles.chartContainer}>
        <BarCharts chartColor={chartColorSubject} title={'By status'} />
        <View>
          <ChartLegends
            backgroundColor={Colors.Approved}
            name={'Approved'}
            percentage={'71%'}
          />
          <ChartLegends
            backgroundColor={Colors.Pending}
            name={'Pending'}
            percentage={'7%'}
          />
          <ChartLegends
            backgroundColor={Colors.Rejected}
            name={'Cancelled'}
            percentage={'7%'}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default StatisticSubjectComponent;
