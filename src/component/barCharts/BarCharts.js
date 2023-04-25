import { View, Text, Platform, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  LineSegment,
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryStack,
  VictoryTheme
} from 'victory-native';
import moment from 'moment';
import { useQuery } from '@apollo/client';

import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';
import { GET_STATISTICS } from '../../graphql/query';
import ChartLegends from '../chartLegends/ChartLegends';
import Loader from '../Loader/Loader';

const BarCharts = ({
  title,
  type,
  selectedCommittees,
  startDate,
  endDate,
  selectedUsers,
  setSelectedUsers
}) => {
  const [barchartColor, setBarChartColor] = useState([]);
  const [barcharLegends, setBarChartLegends] = useState([]);
  const [barchartCommittees, setBarChartCommittees] = useState([]);
  const [barchartData, setBarChartData] = useState([]);
  const [barChartselectedStatus, setBarChartSelectedStatus] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [userName, setUserName] = useState([]);
  let newbarCharLegendsData;
  let ids = [];
  let name = [];

  useEffect(() => {
    ids = selectedUsers?.map((item) => item.userId);
    name = selectedUsers?.map((item) => item.userName);
    setUserIds(ids);
    setUserName(name);
  }, [selectedUsers]);

  // // query for bar chart
  const { loading } = useQuery(GET_STATISTICS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      type: type,
      graphType: 10,
      committeeIds: selectedCommittees.join(','),
      attendanceStatusIds:
        type == 12 || type == 11 ? barChartselectedStatus.join(',') : '',
      startDate: startDate !== '' ? moment(startDate).format('YYYY-MM-DD') : '',
      endDate: endDate !== '' ? moment(endDate).format('YYYY-MM-DD') : '',
      statusIds: type == 1 || type == 2 ? barChartselectedStatus.join(',') : '',
      userIds: type == 11 ? userIds.join(',') : ''
    },
    onCompleted: (data) => {
      setBarChartColor(data?.statistics?.statisticColors);
      setBarChartCommittees(data?.statistics?.statisticCommittees);
      setBarChartData(data?.statistics?.statisticContent);
      let newBarchartcolor = (newbarCharLegendsData =
        data.statistics.statisticStatus.map((item, index) => {
          let isSelected = false;
          let previousUserIndex = barChartselectedStatus?.findIndex(
            (user) => user === item.statusId
          );

          if (previousUserIndex >= 0) {
            isSelected = true;
          }
          return { ...item, isSelected };
        }));

      if (newbarCharLegendsData) {
        setBarChartLegends(newbarCharLegendsData);
      }
    },
    onError: (data) => {
      console.log('get bar chart data for meeting status error', data.message);
    }
  });

  const setOnBarChartSelect = (item) => {
    barcharLegends.map((data) => {
      if (data.statusId === item.statusId) {
        data.isSelected = !data.isSelected;
      }
    });

    setBarChartLegends([...barcharLegends]);
    let selectedStatusList = [];
    barcharLegends?.map((data) => {
      if (data?.isSelected) {
        selectedStatusList.push(data.statusId);
      }
    });

    setBarChartSelectedStatus(selectedStatusList);
  };
  return (
    <View style={{ marginBottom: SIZES[16] }}>
      <Text
        style={{
          ...Fonts.PoppinsBold[20],
          color: Colors.bold,
          marginTop: SIZES[24],
          marginLeft: SIZES[16],
          backgroundColor: '#f8f8f8'
        }}
      >
        {title}
      </Text>
      {loading ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: 600
          }}
        >
          <Loader color={Colors.primary} size={'small'} />
        </View>
      ) : barchartData.length > 0 ? (
        <ScrollView>
          <VictoryChart
            domainPadding={SIZES[24]}
            width={SIZES[350]}
            height={SIZES[600]}
            // theme={VictoryTheme.material}
            padding={{ bottom: 200, right: 20, left: 40, top: 20 }}
          >
            <VictoryAxis
              tickValues={barchartCommittees}
              gridComponent={<LineSegment />}
              tickLabelComponent={
                <VictoryLabel
                  angle={90}
                  verticalAnchor="middle"
                  textAnchor="start"
                  style={{
                    ...Fonts.PoppinsRegular[14],
                    color: Colors.bold
                  }}
                />
              }
            />

            <VictoryAxis
              dependentAxis
              tickFormat={(x) => `${x}`}
              style={{
                tickLabels: {
                  ...Fonts.PoppinsRegular[14],
                  color: Colors.bold,
                  textAnchor: 'start'
                }
              }}
              tickLabelComponent={
                <VictoryLabel
                  verticalAnchor="middle"
                  textAnchor="end"
                  style={{
                    ...Fonts.PoppinsRegular[14],
                    color: Colors.bold
                  }}
                />
              }
            />

            <VictoryStack colorScale={barchartColor}>
              {barchartData?.map((item, index) => {
                return (
                  <VictoryBar
                    key={index.toString()}
                    data={item}
                    x="x"
                    y="y"
                    cornerRadius={{ top: 4, bottom: 4 }}
                    barWidth={32}
                  />
                );
              })}
            </VictoryStack>
          </VictoryChart>
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: 600
          }}
        >
          <Text style={{ ...Fonts.PoppinsBold[20] }}>No data found.</Text>
        </View>
      )}
      <View style={{ paddingTop: SIZES[16] }}>
        {barcharLegends?.map((chart, index) => {
          return (
            <ChartLegends
              key={index.toString()}
              backgroundColor={chart.backgroundColor}
              name={chart.statusTitle}
              percentage={chart.percentage == '' ? '' : `${chart.percentage}%`}
              item={chart}
              setOnSelect={setOnBarChartSelect}
            />
          );
        })}
      </View>
    </View>
  );
};

export default BarCharts;
