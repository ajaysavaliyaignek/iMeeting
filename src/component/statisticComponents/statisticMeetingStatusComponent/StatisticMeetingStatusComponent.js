import { View, Text, ScrollView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import { styles } from './styles';
import PieChart from '../../pieCharts/PieChart';
import { SIZES } from '../../../themes/Sizes';
import ChartLegends from '../../chartLegends/ChartLegends';
import BarCharts from '../../barCharts/BarCharts';
import { GET_STATISTICS } from '../../../graphql/query';
import Loader from '../../Loader/Loader';
import { Colors } from '../../../themes/Colors';
import moment from 'moment';
let selectedChartStatus;

const StatisticMeetingStatusComponent = ({
  selectedCommittees,
  startDate,
  endDate
}) => {
  const [chartDataMeeting, setChartDataMeeting] = useState([]);
  const [chartColorMeeting, setChartColorMeeting] = useState([]);
  const [barchartColorMeeting, setBarChartColorMeeting] = useState([]);
  const [charLegends, setChartLegends] = useState([]);
  const [barcharLegends, setBarChartLegends] = useState([]);
  const [barchartCommittees, setBarChartCommittees] = useState([]);
  const [barchartData, setBarChartData] = useState([]);
  // let selectedStatus = '';
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [barChartselectedStatus, setBarChartSelectedStatus] = useState('');

  let newCharLegendsData;
  let newbarCharLegendsData;

  useEffect(() => {
    let selectedStatusList = [];
    barcharLegends?.map((data) => {
      if (data?.isSelected) {
        selectedStatusList.push(data.statusId);
      }
    });

    setBarChartSelectedStatus(selectedStatusList.join(','));
  }, [barcharLegends]);

  // query for pi chart
  const { loading } = useQuery(GET_STATISTICS, {
    variables: {
      type: 1,
      graphType: 9,
      committeeIds: selectedCommittees.join(','),
      attendanceStatusIds: '',
      startDate: startDate !== '' ? moment(startDate).format('YYYY-MM-DD') : '',
      endDate: endDate !== '' ? moment(endDate).format('YYYY-MM-DD') : '',
      statusIds: selectedStatus.join(','),
      userIds: ''
    },
    onCompleted: (data) => {
      let newstatistics = data.statistics.statisticContent.map((data) => {
        return { y: parseInt(data.y), x: data.x };
      });

      setChartDataMeeting(newstatistics);

      let newStatisticsColor = data.statistics.statisticContent.map((data) => {
        return data.backgroundColor;
      });
      setChartColorMeeting(newStatisticsColor);
      let newCharLegendsDataStatus = data.statistics.statisticStatus.map(
        (item, index) => {
          return item.statusId;
        }
      );
      setSelectedStatus(newCharLegendsDataStatus);

      newCharLegendsData = data.statistics.statisticStatus.map(
        (item, index) => {
          let isSelected = false;
          let previousUserIndex = selectedStatus.findIndex(
            (user) => user === item.statusId
          );

          if (previousUserIndex >= 0) {
            isSelected = true;
          }
          return { ...item, isSelected };
        }
      );

      if (newCharLegendsData) {
        setChartLegends(newCharLegendsData);
      }
    },
    onError: (data) => {
      console.log('statistic data error', data.message);
    }
  });

  useEffect(() => {
    let selectedStatusList = [];
    charLegends?.map((data) => {
      if (data?.isSelected) {
        selectedStatusList.push(data.statusId);
      }
    });

    setSelectedStatus(selectedStatusList);
  }, [charLegends]);

  // query for bar chart
  const { loading: barChartLoading } = useQuery(GET_STATISTICS, {
    variables: {
      type: 1,
      graphType: 10,
      committeeIds: selectedCommittees.join(','),
      attendanceStatusIds: '',
      startDate: startDate !== '' ? moment(startDate).format('YYYY-MM-DD') : '',
      endDate: endDate !== '' ? moment(endDate).format('YYYY-MM-DD') : '',
      statusIds: barChartselectedStatus,
      userIds: ''
    },
    onCompleted: (data) => {
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

  const setOnSelect = (item) => {
    charLegends.map((data) => {
      if (data.statusId === item.statusId) {
        data.isSelected = !data.isSelected;
      }
    });

    setChartLegends([...charLegends]);
  };
  const setOnBarChartSelect = (item) => {
    barcharLegends.map((data) => {
      if (data.statusId === item.statusId) {
        data.isSelected = !data.isSelected;
      }
    });

    setBarChartLegends([...barcharLegends]);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={[styles.chartContainer]}>
        {Platform.OS == 'android' && loading ? (
          <Loader color={Colors.primary} />
        ) : (
          <PieChart
            chartColor={chartColorMeeting}
            chartData={chartDataMeeting}
            title={'Meeting Status'}
          />
        )}
        <View
          style={{
            width: Platform.isPad ? '100%' : null,
            marginTop: Platform.isPad ? SIZES[50] : null
          }}
        >
          {charLegends?.map((chart, index) => {
            return (
              <ChartLegends
                backgroundColor={chart.backgroundColor}
                name={chart.statusTitle}
                percentage={
                  chart.percentage == '' ? '' : `${chart.percentage}%`
                }
                item={chart}
                setOnSelect={setOnSelect}
              />
            );
          })}
        </View>
      </View>
      <View style={styles.chartContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarCharts
            chartColor={barchartColorMeeting}
            title={'Meeting status'}
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

export default StatisticMeetingStatusComponent;
