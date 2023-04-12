import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import CalendarPicker from 'react-native-calendar-picker';

import Header from '../../component/header/Header';
import { Colors } from '../../themes/Colors';
import { Icon, IconName } from '../../component';
import { Fonts } from '../../themes';
import { SIZES } from '../../themes/Sizes';
import StatisticSubjectComponent from '../../component/statisticComponents/statisticSubjectComponent/StatisticSubjectComponent';
import StatisticUserComponent from '../../component/statisticComponents/statisticUserComponent/StatisticUserComponent';
import StatisticMeetingStatusComponent from '../../component/statisticComponents/statisticMeetingStatusComponent/StatisticMeetingStatusComponent';
import StatisticMeetingAttendanceComponent from '../../component/statisticComponents/statisticMeetingAttendanceComponent/StatisticMeetingAttendanceComponent';
import DropDownPicker from '../../component/DropDownPicker/DropDownPicker';
import moment from 'moment';

const StatisticScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('status');
  const [valueType, setValueType] = useState('meeting');
  const [startDate, setStartDate] = useState('');
  const [endDate, setendDate] = useState('');
  const [displayedDate, setDisplayedDate] = useState(moment());
  const [open, setOpen] = useState(false);
  const [itemsType, setItemsType] = useState([
    { label: 'Meeting', value: 'meeting' },
    { label: 'Subject', value: 'subject' },
    { label: 'Users', value: 'users' }
  ]);
  const [valuePeriod, setValuePeriod] = useState('');
  const [itemsPeriod, setItemsPeriod] = useState([
    { label: '5-11 sep', value: '5-11 sep' },
    { label: '6-10 oct', value: '6-10 oct' }
  ]);
  const [selectedCommittees, setSelectedCommittees] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  function onDateChange(date, type) {
    if (type === 'END_DATE') {
      setendDate(date);
      setOpen(false);
    } else {
      setStartDate(date);
      setendDate(null);
    }
  }

  useEffect(() => {
    if (
      startDate !== '' &&
      endDate !== '' &&
      startDate !== null &&
      endDate !== null
    ) {
      setValuePeriod(
        `${moment(startDate).format('DD MMM')}-${moment(endDate).format(
          'DD MMM'
        )}`
      );
    }
  }, [startDate, endDate]);

  return (
    <SafeAreaView style={styles.mainContainer}>
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
          onPress={() => {
            navigation.navigate('CommitteeExpandedView', {
              setSelectedCommittees: setSelectedCommittees,
              setSelectedUsers,
              valueType,
              selectedCommittees,
              selectedUsers
            });
          }}
        >
          <Text style={styles.txtCommittee}>Committee</Text>
          <Icon
            name={IconName.Arrow_Right}
            height={SIZES[12]}
            width={SIZES[6]}
          />
        </TouchableOpacity>
        <Divider style={styles.divider} />
        <View style={styles.dropdownContainer}>
          <DropDownPicker
            title={'TYPE'}
            data={itemsType}
            placeholder={''}
            setData={setValueType}
            value={valueType}
            styleContainer={{ width: '48%' }}
          />
          <TouchableOpacity
            onPress={() => {
              setOpen(!open);
            }}
            style={{
              width: '48%',
              marginTop: SIZES[16],
              borderBottomWidth: SIZES[1],
              borderBottomColor: Colors.line,
              zIndex: 20
            }}
          >
            <Text
              style={{
                ...Fonts.PoppinsRegular[12],
                color: Colors.secondary
                // paddingBottom: 10
              }}
            >
              PERIOD
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: SIZES[12],
                marginTop: Platform.OS == 'android' ? SIZES[8] : SIZES[14],
                paddingRight: SIZES[10]
                // marginTop: SIZES[6]
              }}
            >
              <Text
                style={{
                  ...Fonts.PoppinsRegular[14],
                  color: Colors.bold
                }}
              >
                {valuePeriod}
              </Text>
              <Icon
                name={IconName.Arrow_Down}
                height={SIZES[10]}
                width={SIZES[10]}
              />
            </View>
            {/* <Divider style={[styles.divider]} /> */}
            {/* <DropDownPicker
              title={'PERIOD'}
              data={itemsPeriod}
              placeholder={valuePeriod}
              disable={true}
              setData={setValuePeriod}
              value={valuePeriod}
              // styleContainer={{ width: '48%', marginBottom: SIZES[16] }}
            /> */}
          </TouchableOpacity>
        </View>
        {open && (
          <CalendarPicker
            startFromMonday={true}
            allowRangeSelection={true}
            // minDate={minDate}
            // maxDate={maxDate}
            todayBackgroundColor={Colors.primary}
            selectedDayColor={Colors.primary}
            selectedDayTextColor="#FFFFFF"
            onDateChange={onDateChange}
          />
        )}
        {valueType == 'meeting' && (
          <View style={styles.btnView}>
            <TouchableOpacity
              style={[
                styles.btnContainer,
                {
                  backgroundColor:
                    activeTab === 'status' ? Colors.white : 'transparent'
                }
              ]}
              onPress={() => setActiveTab('status')}
            >
              <Text style={styles.txtBtn}>Status</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btnContainer,
                {
                  backgroundColor:
                    activeTab === 'attendance' ? Colors.white : 'transparent'
                }
              ]}
              onPress={() => setActiveTab('attendance')}
            >
              <Text style={styles.txtBtn}>Attendance</Text>
            </TouchableOpacity>
          </View>
        )}
        {valueType == 'subject' && (
          <StatisticSubjectComponent
            selectedCommittees={selectedCommittees}
            startDate={startDate}
            endDate={endDate}
          />
        )}
        {valueType == 'users' && (
          <StatisticUserComponent
            startDate={startDate}
            endDate={endDate}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
        )}
        {activeTab === 'status' && valueType == 'meeting' && (
          <StatisticMeetingStatusComponent
            selectedCommittees={selectedCommittees}
            startDate={startDate}
            endDate={endDate}
          />
        )}
        {activeTab === 'attendance' && valueType == 'meeting' && (
          <StatisticMeetingAttendanceComponent
            selectedCommittees={selectedCommittees}
            startDate={startDate}
            endDate={endDate}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default StatisticScreen;

const styles = StyleSheet.create({
  mainContainer: { flex: 1, paddingBottom: SIZES[16] },
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
  },
  btnContainer: {
    paddingVertical: SIZES[8],
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES[8]
  },
  btnView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: SIZES[10],
    padding: SIZES[2]
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
    marginBottom: SIZES[16]
  },
  dropdown: {
    height: SIZES[44],
    borderWidth: 0,
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.line
  },
  txtBtn: { ...Fonts.PoppinsSemiBold[12], color: Colors.bold }
});
