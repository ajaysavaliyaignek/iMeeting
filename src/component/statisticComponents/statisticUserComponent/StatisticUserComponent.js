import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from './styles';
import PieChart from '../../pieCharts/PieChart';
import ChartLegends from '../../chartLegends/ChartLegends';
import BarCharts from '../../barCharts/BarCharts';
import { useQuery } from '@apollo/client';
import { GET_STATISTICS } from '../../../graphql/query';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';

const StatisticUserComponent = ({ startDate, endDate, selectedUsers }) => {
  const [chartDataUsers, setChartDataUsers] = useState([]);
  const [chartLegends, setChartLegends] = useState([]);
  const [barchartColorMeeting, setBarChartColorMeeting] = useState([]);
  const [barcharLegends, setBarChartLegends] = useState([]);
  const [barchartCommittees, setBarChartCommittees] = useState([]);
  const [barchartData, setBarChartData] = useState([]);
  const [barChartselectedStatus, setBarChartSelectedStatus] = useState('');
  const [selectedUserId, setSelectedUserId] = useState([]);

  const [chartColorUsers, setChartColorUsers] = useState([]);
  // const chartColorAttendance = ['#81AB96', '#E6C54F'];
  let newCharLegendsData;
  let newbarCharLegendsData;

  const {} = useQuery(GET_STATISTICS, {
    variables: {
      type: 11,
      graphType: 9,
      committeeIds: '',
      attendanceStatusIds: '',
      startDate: startDate !== '' ? moment(startDate).format('YYYY-MM-DD') : '',
      endDate: endDate !== '' ? moment(endDate).format('YYYY-MM-DD') : '',
      statusIds: '',
      userIds: selectedUsers.join(',')
    },
    onCompleted: (data) => {
      console.log('newstatistics', data.statistics);
      let newstatistics = data.statistics.statisticContent.map((data) => {
        return { y: parseInt(data.y), x: data.x };
      });

      let newStatisticsColor = data.statistics.statisticContent.map((data) => {
        return data.backgroundColor;
      });

      newCharLegendsData = data.statistics.statisticStatus.map(
        (item, index) => {
          let isSelected = true;
          return { ...item, isSelected };
        }
      );
      console.log('newCharLegendsData', newCharLegendsData);
      if (newCharLegendsData) {
        setChartLegends(newCharLegendsData);
      }

      setChartColorUsers(newStatisticsColor);

      setChartDataUsers(newstatistics);
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
    // charLegends?.map((data) => {
    //   if (data?.isSelected) {
    //     selectedStatusList.push(data.statusId);
    //   }
    // });
    // selectedStatus = selectedStatusList.join(',');
    // // setSelectedStatus(selectedStatusList.join(','));
  };
  console.log('chartLegends', chartLegends);

  useEffect(() => {
    let selectedStatusList = [];
    chartLegends?.map((data) => {
      if (data?.isSelected) {
        selectedStatusList.push(data.statusId);
      }
    });

    setSelectedUserId(selectedStatusList);
  }, [chartLegends]);

  // query for bar chart
  const { loading: barChartLoading } = useQuery(GET_STATISTICS, {
    variables: {
      type: 11,
      graphType: 10,
      committeeIds: '',
      attendanceStatusIds: barChartselectedStatus,
      startDate: startDate !== '' ? moment(startDate).format('YYYY-MM-DD') : '',
      endDate: endDate !== '' ? moment(endDate).format('YYYY-MM-DD') : '',
      statusIds: '',
      userIds: selectedUsers.join(',')
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
  console.log('barChartselectedStatus', barChartselectedStatus);

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
              chartColor={chartColorUsers}
              chartData={chartDataUsers}
              title={'Number users of committes'}
            />
            {chartLegends.map((chart, index) => {
              return (
                <ChartLegends
                  backgroundColor={chart.backgroundColor}
                  name={chart.x.split('\n')[1]}
                  percentage={`${chart.y}%`}
                  setOnSelect={setOnSelect}
                  item={chart}
                />
              );
            })}
          </View>
        )}
      </View>
      {selectedUsers.length > 0 && (
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
                percentage={
                  chart.percentage == '' ? '' : `${chart.percentage}%`
                }
                item={chart}
                setOnSelect={setOnBarChartSelect}
              />
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

export default StatisticUserComponent;
