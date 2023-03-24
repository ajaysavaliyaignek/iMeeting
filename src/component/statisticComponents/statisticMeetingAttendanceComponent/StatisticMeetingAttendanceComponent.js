import { ScrollView, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import { styles } from './styles';
import PieChart from '../../pieCharts/PieChart';
import ChartLegends from '../../chartLegends/ChartLegends';
import BarCharts from '../../barCharts/BarCharts';
import { GET_STATISTICS } from '../../../graphql/query';

const StatisticMeetingAttendanceComponent = ({
  selectedCommittees,
  startDate,
  endDate
}) => {
  const [chartDataAttendance, setChartDataAttendance] = useState([]);
  const [chartColorAttendance, setChartColorAttendance] = useState([]);
  const [chartLegends, setChartLegends] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [barchartColorMeeting, setBarChartColorMeeting] = useState([]);
  const [barcharLegends, setBarChartLegends] = useState([]);
  const [barchartCommittees, setBarChartCommittees] = useState([]);
  const [barchartData, setBarChartData] = useState([]);
  const [barChartselectedStatus, setBarChartSelectedStatus] = useState('');
  let newCharLegendsData;
  let newbarCharLegendsData;

  const {} = useQuery(GET_STATISTICS, {
    variables: {
      type: 12,
      graphType: 9,
      committeeIds: selectedCommittees.join(','),
      attendanceStatusIds: selectedStatus,
      startDate: startDate !== '' ? moment(startDate).format('YYYY-MM-DD') : '',
      endDate: endDate !== '' ? moment(endDate).format('YYYY-MM-DD') : '',
      statusIds: '',
      userIds: ''
    },
    onCompleted: (data) => {
      console.log('statistics data', data.statistics);
      let newstatistics = data.statistics.statisticContent.map((data) => {
        return { y: parseInt(data.y), x: data.x };
      });

      let newStatisticsColor = data.statistics.statisticContent.map((data) => {
        return data.backgroundColor;
      });

      newCharLegendsData = data.statistics.statisticStatus.map(
        (item, index) => {
          let previousUserIndex = selectedStatus
            ?.split(',')
            .findIndex((user) => user === item.statusId);
          let isSelected = false;

          if (previousUserIndex >= 0) {
            isSelected = true;
          }
          return { ...item, isSelected };
        }
      );

      if (newCharLegendsData) {
        setChartLegends(newCharLegendsData);
      }

      setChartColorAttendance(newStatisticsColor);

      setChartDataAttendance(newstatistics);
    },
    onError: (data) => {
      console.log('statistic data error', data.message);
    }
  });

  const setOnSelect = (item) => {
    const selectedStatusList = [];
    chartLegends.map((data) => {
      if (data.statusId === item.statusId) {
        data.isSelected = !data.isSelected;
      }
    });
    setChartLegends([...chartLegends]);
  };

  useEffect(() => {
    let selectedStatusList = [];
    chartLegends?.map((data) => {
      if (data?.isSelected) {
        selectedStatusList.push(data.statusId);
      }
    });

    setSelectedStatus(selectedStatusList.join(','));
    // console.log('selectedStatusList', selectedStatus);
  }, [chartLegends]);

  // query for bar chart
  const { loading: barChartLoading } = useQuery(GET_STATISTICS, {
    variables: {
      type: 12,
      graphType: 10,
      committeeIds: selectedCommittees.join(','),
      attendanceStatusIds: barChartselectedStatus,
      startDate: startDate !== '' ? moment(startDate).format('YYYY-MM-DD') : '',
      endDate: endDate !== '' ? moment(endDate).format('YYYY-MM-DD') : '',
      statusIds: '',
      userIds: ''
    },
    onCompleted: (data) => {
      console.log('bar chart data statisticCommittees', data.statistics);
      console.log('bar chart data statisticContent', data.statistics);
      console.log(
        'bar chart data statisticStatus',
        data.statistics.statisticStatus
      );
      let newBarChartStatisticsColor = data.statistics.statisticStatus.map(
        (data) => {
          return data.backgroundColor;
        }
      );
      setBarChartColorMeeting(data.statistics.statisticColors);
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
  }, [barcharLegends]);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={styles.chartContainer}>
        <PieChart
          chartColor={chartColorAttendance}
          chartData={chartDataAttendance}
          title={'Attendance'}
        />
        {chartLegends.map((chart, index) => {
          return (
            <ChartLegends
              backgroundColor={chart.backgroundColor}
              name={chart.statusTitle}
              percentage={`${chart.percentage}%`}
              setOnSelect={setOnSelect}
              item={chart}
            />
          );
        })}
      </View>
      <View style={styles.chartContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarCharts
            chartColor={barchartColorMeeting}
            title={'Attendance'}
            barchartCommittees={barchartCommittees}
            barchartData={barchartData}
          />
        </ScrollView>
        {barcharLegends?.map((chart, index) => {
          return (
            <ChartLegends
              backgroundColor={chart.backgroundColor}
              name={chart.statusTitle}
              percentage={chart.percentage == '' ? '' : `${chart.percentage}%`}
              item={chart}
              setOnSelect={setOnBarChartSelect}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

export default StatisticMeetingAttendanceComponent;
