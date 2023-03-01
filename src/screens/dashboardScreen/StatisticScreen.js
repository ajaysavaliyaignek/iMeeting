import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Divider } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';

import ChartLegends from '../../component/chartLegends/ChartLegends';
import BarCharts from '../../component/barCharts/BarCharts';
import Header from '../../component/header/Header';
import { Colors } from '../../themes/Colors';
import { Icon, IconName } from '../../component';
import Normalize from '../../themes/mixins';
import { Fonts } from '../../themes';
import PieChart from '../../component/pieCharts/PieChart';
import { SIZES } from '../../themes/Sizes';
import StatisticSubjectComponent from '../../component/statisticComponents/statisticSubjectComponent/StatisticSubjectComponent';
import StatisticUserComponent from '../../component/statisticComponents/statisticUserComponent/StatisticUserComponent';
import StatisticMeetingStatusComponent from '../../component/statisticComponents/statisticMeetingStatusComponent/StatisticMeetingStatusComponent';

const StatisticScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('0');
  const [openType, setOpenType] = useState(false);
  const [valueType, setValueType] = useState('meeting');
  const [itemsType, setItemsType] = useState([
    { label: 'Meeting', value: 'meeting' },
    { label: 'Subject', value: 'subject' },
    { label: 'Users', value: 'users' }
  ]);
  const [openPeriod, setOpenPeriod] = useState(false);
  const [valuePeriod, setValuePeriod] = useState(null);
  const [itemsPeriod, setItemsPeriod] = useState([
    { label: '5-11 sep', value: '5-11 sep' },
    { label: '6-10 oct', value: '6-10 oct' }
  ]);

  useEffect(() => {
    console.log('valueType', valueType);
    console.log('itemsType', itemsType);
  }, [valueType, itemsType]);

  const chartDataMeeting = [
    { y: 7, x: `7%\nTentative` },
    { y: 35, x: `35%\nPre-schedule` },
    { y: 29, x: `29%\nScheduled` },
    { y: 16, x: `16%\nCancelled` },
    { y: 8, x: `8%\nClosed` },
    { y: 5, x: `5%\nLive` }
  ];

  const chartDataAttendance = [
    { y: 71, x: `71%\nAttend` },
    { y: 29, x: `29%\nAbsent` }
  ];
  const chartColorMeeting = [
    '#144B8D',
    '#5A81AF',
    '#A1B7D1',
    '#E6C54F',
    '#DD7878',
    '#81AB96'
  ];
  const chartColorAttendance = ['#81AB96', '#E6C54F'];

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: 16 }}>
      {/* header */}
      <Header
        name={'Statistic'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.committeeView}
          activeOpacity={0.5}
          // onPress={() =>
          //   navigation.navigate('Committee', {
          //     Data: null,
          //     activeTab: null,
          //     setCommittee: null,
          //     committee: null
          //   })
          // }
        >
          <Text style={styles.txtCommittee}>Committee</Text>
          <Icon
            name={IconName.Arrow_Right}
            height={Normalize(12)}
            width={Normalize(6)}
          />
        </TouchableOpacity>
        <Divider style={styles.divider} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 20,
            paddingVertical: Normalize(16)
          }}
        >
          <View
            style={{
              width: '49%'
            }}
          >
            <Text style={styles.txtType}>TYPE</Text>
            <DropDownPicker
              open={openType}
              value={valueType}
              items={itemsType}
              setOpen={setOpenType}
              setValue={setValueType}
              setItems={setItemsType}
              placeholder={'TYPE'}
              placeholderStyle={{
                ...Fonts.PoppinsRegular[12],
                color: Colors.secondary
              }}
              style={{
                height: Normalize(44),
                borderWidth: 0,
                borderBottomWidth: Normalize(1),
                borderBottomColor: Colors.line
              }}
              textStyle={{ ...Fonts.PoppinsRegular[14], color: Colors.bold }}
            />
          </View>
          <View
            style={{
              width: '48%'
            }}
          >
            <Text style={styles.txtType}>PERIOD</Text>
            <DropDownPicker
              open={openPeriod}
              value={valuePeriod}
              items={itemsPeriod}
              setOpen={setOpenPeriod}
              setValue={setValuePeriod}
              setItems={setItemsPeriod}
              placeholder={'PERIOD'}
              placeholderStyle={{
                ...Fonts.PoppinsRegular[12],
                color: Colors.secondary
              }}
              style={{
                height: Normalize(44),
                borderWidth: 0,
                borderBottomWidth: Normalize(1),
                borderBottomColor: Colors.line
              }}
              textStyle={{ ...Fonts.PoppinsRegular[14] }}
              listItemContainerStyle={{
                backgroundColor: Colors.white
              }}
            />
          </View>
        </View>
        {valueType == 'meeting' && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(118, 118, 128, 0.12)',
              borderRadius: Normalize(10),
              padding: Normalize(2)
            }}
          >
            <TouchableOpacity
              style={{
                paddingVertical: Normalize(8),
                width: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: Normalize(8),
                backgroundColor:
                  activeTab === '0' ? Colors.white : 'transparent'
              }}
              onPress={() => setActiveTab('0')}
            >
              <Text
                style={{ ...Fonts.PoppinsSemiBold[12], color: Colors.bold }}
              >
                Status
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: Normalize(8),
                width: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: Normalize(8),
                backgroundColor:
                  activeTab === '1' ? Colors.white : 'transparent'
              }}
              onPress={() => setActiveTab('1')}
            >
              <Text
                style={{ ...Fonts.PoppinsSemiBold[12], color: Colors.bold }}
              >
                Attendance
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {valueType == 'subject' && activeTab == '0' && (
          <StatisticSubjectComponent />
        )}
        {valueType == 'users' && activeTab == '0' && <StatisticUserComponent />}
        {activeTab === '0' &&
        valueType !== 'subject' &&
        valueType !== 'users' ? (
          <StatisticMeetingStatusComponent />
        ) : null}
        {activeTab === '1' && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ paddingBottom: 16, flex: 1 }}
          >
            <View
              style={{
                marginTop: Normalize(16),
                backgroundColor: '#f8f8f8',
                borderRadius: Normalize(12)
              }}
            >
              <PieChart
                chartColor={chartColorAttendance}
                chartData={chartDataAttendance}
                title={'Attendance'}
              />
              <ChartLegends
                backgroundColor={'#81AB96'}
                name={'Attend'}
                percentage={'71%'}
              />

              <ChartLegends
                backgroundColor={'#E6C54F'}
                name={'Absent'}
                percentage={'29%'}
              />
            </View>
            <View
              style={{
                marginVertical: Normalize(16),
                backgroundColor: '#f8f8f8',
                borderRadius: Normalize(12)
              }}
            >
              <BarCharts
                chartColor={chartColorAttendance}
                title={'Attendance'}
              />
              <ChartLegends
                backgroundColor={'#81AB96'}
                name={'Attend'}
                percentage={'71%'}
              />
              <ChartLegends
                backgroundColor={'#E6C54F'}
                name={'Absent'}
                percentage={'29%'}
              />
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default StatisticScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    width: '100%',
    padding: SIZES[16],
    height: '100%'
  },
  committeeView: {
    marginBottom: SIZES[10],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  },
  txtCommittee: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  },
  txtType: {
    ...Fonts.PoppinsRegular[12],
    fontWeight: '500',
    color: Colors.secondary
  }
});
