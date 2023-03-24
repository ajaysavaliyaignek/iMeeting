import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SIZES } from '../../../themes/Sizes';
import { Colors } from '../../../themes/Colors';
import BarCharts from '../../barCharts/BarCharts';
import ChartLegends from '../../chartLegends/ChartLegends';
import { styles } from './styles';
import { GET_STATISTICS } from '../../../graphql/query';
import { useQuery } from '@apollo/client';
import moment from 'moment';
import Loader from '../../Loader/Loader';

const StatisticSubjectComponent = ({
  selectedCommittees,
  startDate,
  endDate
}) => {
  const [barcharLegends, setBarChartLegends] = useState([]);
  const [barchartCommittees, setBarChartCommittees] = useState([]);
  const [barchartData, setBarChartData] = useState([]);
  const [barChartselectedStatus, setBarChartSelectedStatus] = useState('');
  const [barchartColorSubjects, setBarChartColorSubjects] = useState([]);
  let newbarCharLegendsData;

  const { loading: barChartLoading } = useQuery(GET_STATISTICS, {
    variables: {
      type: 2,
      graphType: 10,
      committeeIds: selectedCommittees.join(','),
      attendanceStatusIds: '',
      startDate: startDate !== '' ? moment(startDate).format('YYYY-MM-DD') : '',
      endDate: endDate !== '' ? moment(endDate).format('YYYY-MM-DD') : '',
      statusIds: barChartselectedStatus,
      userIds: ''
    },
    onCompleted: (data) => {
      setBarChartColorSubjects(data.statistics.statisticColors);
      setBarChartCommittees(data.statistics.statisticCommittees);
      setBarChartData(data.statistics.statisticContent);
      newbarCharLegendsData = data.statistics.statisticStatus.map(
        (item, index) => {
          let isSelected = false;
          let previousUserIndex = barChartselectedStatus
            ?.split(',')
            .findIndex((user) => user === item.statusId);

          if (previousUserIndex >= 0) {
            isSelected = true;
          }
          return { ...item, isSelected };
        }
      );

      if (newbarCharLegendsData) {
        setBarChartLegends(newbarCharLegendsData);
      }
    }
  });

  const setOnBarChartSelect = (item) => {
    barcharLegends.map((data) => {
      if (data.statusId === item.statusId) {
        data.isSelected = !data.isSelected;
      }
    });

    setBarChartLegends([...barcharLegends]);
  };

  useEffect(() => {
    let selectedStatusList = [];
    barcharLegends?.map((data) => {
      if (data?.isSelected) {
        selectedStatusList.push(data.statusId);
      }
    });

    setBarChartSelectedStatus(selectedStatusList.join(','));
    // console.log('selectedStatusList', selectedStatus);
  }, [barcharLegends]);

  // const chartColorSubject = ['#81AB96', '#DD7878', '#E6C54F'];
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {barChartLoading ? (
        <Loader color={Colors.primary} />
      ) : (
        <View style={styles.chartContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarCharts
              chartColor={barchartColorSubjects}
              title={'By status'}
              barchartCommittees={barchartCommittees}
              barchartData={barchartData}
            />
          </ScrollView>
          <View>
            {barcharLegends?.map((chart, index) => {
              return (
                <ChartLegends
                  backgroundColor={chart.backgroundColor}
                  name={chart.statusTitle}
                  percentage={
                    chart.percentage == '' ? '' : `${chart.percentage}%`
                  }
                  item={chart}
                  setOnSelect={setOnBarChartSelect}
                />
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default StatisticSubjectComponent;
