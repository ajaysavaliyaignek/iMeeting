import { View, Text, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { VictoryPie } from 'victory-native';
import moment from 'moment';
import { useQuery } from '@apollo/client';

import { Colors } from '../../themes/Colors';
import { Fonts } from '../../themes';
import Normalize from '../../themes/mixins';
import { SIZES } from '../../themes/Sizes';
import { GET_STATISTICS } from '../../graphql/query';
import ChartLegends from '../chartLegends/ChartLegends';
import Loader from '../Loader/Loader';

const PieChart = ({
  title,
  type,
  selectedCommittees,
  startDate,
  endDate,
  selectedUsers,
  setSelectedUsers
}) => {
  const [chartData, setChartData] = useState([]);
  const [chartColor, setChartColor] = useState([]);
  const [charLegends, setChartLegends] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [userName, setUserName] = useState([]);
  let newCharLegendsData;
  let ids = [];
  let name = [];

  useEffect(() => {
    ids = selectedUsers?.map((item) => item.userId);
    name = selectedUsers?.map((item) => item.userName);
    setUserIds(ids);
    setUserName(name);
  }, [selectedUsers]);

  const { loading, error } = useQuery(GET_STATISTICS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      type: type,
      graphType: 9,
      committeeIds: selectedCommittees.join(','),
      attendanceStatusIds: type == 12 ? selectedStatus.join(',') : '',
      startDate:
        startDate !== '' && endDate !== '' && endDate !== null
          ? moment(startDate).format('YYYY-MM-DD')
          : '',
      endDate:
        startDate !== '' && endDate !== '' && endDate !== null
          ? moment(endDate).format('YYYY-MM-DD')
          : '',
      statusIds: type == 1 ? selectedStatus.join(',') : '',
      userIds: type == 11 ? userIds.join(',') : ''
    },
    onCompleted: (data) => {
      let newstatistics = data.statistics.statisticContent.map((data) => {
        return { y: parseInt(data.y), x: data.x };
      });

      setChartData(newstatistics);

      let newStatisticsColor = data.statistics.statisticContent.map((data) => {
        return data.backgroundColor;
      });
      setChartColor(newStatisticsColor);

      newCharLegendsData = data.statistics.statisticStatus.map(
        (item, index) => {
          let isSelected = false;
          data.statistics.statisticContent.map((element) => {
            if (type == 11) {
              isSelected = true;
            } else {
              if (element.x.split('\n')[1] == item.statusTitle) {
                setSelectedStatus((prev) => {
                  const pevDaa = prev?.filter((ite) => {
                    return ite !== element.statusId;
                  });
                  return [...pevDaa, element.statusId];
                });
                isSelected = true;
              }
            }
          });

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

  const setOnSelect = (item) => {
    if (type == 11) {
      charLegends.map((data) => {
        if (data.x.split('\n')[1] === item.x.split('\n')[1]) {
          data.isSelected = !data.isSelected;
        }
      });

      setChartLegends([...charLegends]);
      let selectedStatusList = [];
      charLegends?.map((data) => {
        if (data?.isSelected == false) {
          var j = userName.indexOf(item.x.split('\n')[1]);
          userName.splice(j, 1);
        }
        let newUser = userName.map((user, index) => {
          return { userId: userIds[index], userName: user };
        });
        setSelectedUsers(newUser);
      });
    } else {
      charLegends.map((data) => {
        if (data.statusId === item.statusId) {
          data.isSelected = !data.isSelected;
        }
      });

      setChartLegends([...charLegends]);
      let selectedStatusList = [];
      charLegends?.map((data) => {
        if (data?.isSelected) {
          selectedStatusList.push(data.statusId);
        }
      });

      setSelectedStatus(selectedStatusList);
    }
  };

  return (
    <View>
      {error ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}>
            {error.message == 'Network request failed'
              ? 'No Internet connection'
              : 'Something went wrong.'}
          </Text>
        </View>
      ) : (
        <View>
          <Text
            style={{
              ...Fonts.PoppinsBold[20],
              color: Colors.bold,
              marginTop: SIZES[24],
              marginLeft: SIZES[16],
              backgroundColor: Colors.gray
            }}
          >
            {title}
          </Text>
          {loading && Platform.OS == 'android' ? (
            <View
              style={{
                height: 300,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Loader color={Colors.primary} size={'small'} />
            </View>
          ) : chartData.length > 0 ? (
            <VictoryPie
              labelPosition={'centroid'}
              data={chartData}
              width={Normalize(350)}
              height={300}
              innerRadius={80}
              style={{
                labels: {
                  fill: Colors.bold,
                  ...Fonts.PoppinsRegular[12],
                  padding: 10
                }
              }}
              padAngle={6}
              colorScale={chartColor}
            />
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
          <View
            style={{
              width: Platform.isPad ? '100%' : null,
              marginTop: Platform.isPad ? SIZES[50] : null
            }}
          >
            {charLegends?.map((chart, index) => {
              return (
                <ChartLegends
                  key={index.toString()}
                  backgroundColor={chart.backgroundColor}
                  name={type == 11 ? chart.x.split('\n')[1] : chart.statusTitle}
                  percentage={
                    type == 11
                      ? `${chart.y}%`
                      : chart.percentage == ''
                      ? ''
                      : `${chart.percentage}%`
                  }
                  item={chart}
                  setOnSelect={setOnSelect}
                />
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

export default PieChart;
