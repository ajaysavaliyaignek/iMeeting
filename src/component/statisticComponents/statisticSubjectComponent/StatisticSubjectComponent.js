import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import React, { useState } from 'react';

import BarCharts from '../../barCharts/BarCharts';
import { styles } from './styles';
import { Colors } from '../../../themes/Colors';

const StatisticSubjectComponent = ({
  selectedCommittees,
  startDate,
  endDate
}) => {
  const [activeTab, setActiveTab] = useState('By status');
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.btnView}>
        <TouchableOpacity
          style={[
            styles.btnContainer,
            {
              backgroundColor:
                activeTab === 'By status' ? Colors.white : 'transparent'
            }
          ]}
          onPress={() => setActiveTab('By status')}
        >
          <Text style={styles.txtBtn}>By status</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.btnContainer,
            {
              backgroundColor:
                activeTab === 'By decision' ? Colors.white : 'transparent'
            }
          ]}
          onPress={() => setActiveTab('By decision')}
        >
          <Text style={styles.txtBtn}>By decision</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.btnContainer,
            {
              backgroundColor:
                activeTab === 'By study' ? Colors.white : 'transparent'
            }
          ]}
          onPress={() => setActiveTab('By study')}
        >
          <Text style={styles.txtBtn}>By study</Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={styles.chartContainer}>
          <BarCharts
            startDate={startDate}
            endDate={endDate}
            selectedCommittees={selectedCommittees}
            title={
              activeTab == 'By status'
                ? 'By status'
                : activeTab == 'By decision'
                ? 'By decision'
                : 'By study'
            }
            type={
              activeTab == 'By status' ? 2 : activeTab == 'By decision' ? 7 : 18
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default StatisticSubjectComponent;
