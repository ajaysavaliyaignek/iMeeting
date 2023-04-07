import { View, Text, ScrollView } from 'react-native';
import React from 'react';

import { styles } from './styles';
import PieChart from '../../pieCharts/PieChart';
import BarCharts from '../../barCharts/BarCharts';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';

const StatisticUserComponent = ({
  startDate,
  endDate,
  selectedUsers,
  setSelectedUsers
}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={styles.chartContainer}>
        {selectedUsers.length <= 0 ? (
          <View
            style={{
              flex: 1,
              height: 300,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ ...Fonts.PoppinsSemiBold[14], color: Colors.bold }}>
              Please select user from committee
            </Text>
          </View>
        ) : (
          <View>
            <PieChart
              title={'Number users of committes'}
              type={11}
              startDate={startDate}
              endDate={endDate}
              selectedCommittees={[]}
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
            />
          </View>
        )}
      </View>
      {selectedUsers.length > 0 && (
        <View style={styles.chartContainer}>
          <BarCharts
            startDate={startDate}
            type={11}
            endDate={endDate}
            selectedCommittees={[]}
            title={'Attendance'}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default StatisticUserComponent;
