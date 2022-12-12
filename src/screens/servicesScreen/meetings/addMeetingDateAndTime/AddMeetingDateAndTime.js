import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import React, { useContext, useState } from 'react';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Divider } from 'react-native-paper';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import { Dropdown } from 'react-native-element-dropdown';

import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { styles } from './styles';
import { Colors } from '../../../../themes/Colors';
import { SIZES } from '../../../../themes/Sizes';
import { Fonts } from '../../../../themes';
import { Button } from '../../../../component/button/Button';
import { GET_TIMEZONE } from '../../../../graphql/query';
import { UserContext } from '../../../../context';
import DropDownPicker from '../../../../component/DropDownPicker/DropDownPicker';

const AddMeetingDateAndTime = () => {
  const navigation = useNavigation();
  const { meetingsData, setMeetingsData } = useContext(UserContext);
  console.log('meeting data from date and time', meetingsData);
  const [startDate, setStartdate] = useState(
    meetingsData?.startDate
      ? meetingsData?.startDate
      : moment(new Date()).format('DD MMM,YYYY')
  );
  const [startNewDate, setStartNewDate] = useState(
    meetingsData?.startDate
      ? meetingsData?.startDate
      : moment(new Date()).format('YYYY-MM-DD')
  );
  const [startTime, setStartTime] = useState(
    meetingsData?.startTime
      ? meetingsData?.startTime
      : moment(new Date()).format('LT')
  );
  const [endDate, setEnddate] = useState(
    meetingsData?.endDate ? meetingsData?.endDate : startDate
  );
  const [endNewDate, setEndNewdate] = useState(
    meetingsData?.endDate
      ? meetingsData?.startDate
      : moment(new Date()).format('YYYY-MM-DD')
  );
  const [endTime, setEndTime] = useState(
    meetingsData?.endTime
      ? meetingsData?.endTime
      : moment(new Date()).format('LT')
  );
  const [date, setDate] = useState(new Date());
  const [dates, setDates] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [times, setTimes] = useState(new Date());
  const [timeZone, setTimeZone] = useState([]);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openClock, setOpenClock] = useState(false);
  const [value, setValue] = useState('');
  const [openTimeZone, setOpenTimeZone] = useState(false);
  const [openRepeat, setOpenRepeat] = useState(false);
  const [onFocus, setIsFocus] = useState(false);
  const [valueRepeat, setValueRepeat] = useState(
    meetingsData?.Repeat ? meetingsData?.Repeat : null
  );
  const [valueTimeZone, setValueTimeZone] = useState(
    meetingsData?.TimeZone ? meetingsData?.TimeZone : null
  );
  const [items, setItems] = useState([
    { label: 'GMT_8 (USA)', value: 'GMT_8 (USA)' }
  ]);

  const handleConfirmClock = (date) => {
    console.log('A time has been picked: ', date);

    const time = moment(date).format('LT');
    console.log('time', time);

    var d = dates.toLocaleDateString();
    let currentDate = moment().format('DD/MM/YYYY');

    if (d == currentDate) {
      console.log(
        moment(time, 'hh:mm A').isAfter(moment()),
        "moment(time, 'hh:mm A').isSameOrAfter(moment())"
      );
      if (moment(time, 'hh:mm A').isAfter(moment())) {
        if (value == 'startTime') {
          setStartTime(time);
          setEndTime(time);
          setTime(date);
        }
        if (value == 'endTime') {
          setEndTime(time);
        }
        setOpenClock(false);
      } else {
        Alert.alert('Please select future time');
      }
    } else {
      if (value == 'startTime') {
        setStartTime(time);
        setEndTime(time);
        setTime(date);
      }
      // if (value == 'endTime') {
      //   setEndTime(time);
      // }
      setOpenClock(false);
    }
    console.log('startDate', startDate);
    console.log('endDate', endDate);
    console.log(startTime, 'startTime');
    console.log('value', value);

    if (startDate === endDate) {
      console.log('-----');
      if (moment(time, 'hh:mm A').isAfter(moment(startTime, 'hh:mm A'))) {
        if (value == 'endTime') {
          setEndTime(time);
        }
        setOpenClock(false);
      } else {
        Alert.alert('Please select future time');
      }
    } else {
      if (value == 'endTime') {
        console.log('+++++++++');
        setEndTime(time);
      }
      // if (value == 'endTime') {
      //   setEndTime(time);
      // }
      setOpenClock(false);
    }
  };
  const handleConfirmCalendar = (date) => {
    console.log('A date has been picked: ', date);

    const Date = moment(date).format('DD MMM,YYYY');
    const newDate = moment(date).format('YYYY-MM-DD');
    const time = moment(date).format('LT');
    console.log('time', time);
    console.log('new date', newDate);
    console.log('time', Date);
    if (value == 'startDate') {
      setStartdate(Date);
      setStartNewDate(newDate);
      setDates(date);
      setEnddate(Date);
      setDate(date);
      setStartTime(time);
      setEndTime(time);
      setTime(date);
    }
    if (value == 'endDate') {
      setEnddate(Date);
      setEndNewdate(newDate);
      setDate(date);
      setEndTime(time);
    }
    setOpenCalendar(false);
  };

  const TimeZone = useQuery(GET_TIMEZONE, {
    onCompleted: (data) => {
      console.log(data.timeZone.items);
      if (data) {
        setTimeZone(data.timeZone.items);
      }
    },
    onError: (data) => {
      console.log('timezone error', data);
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Add meeting'}
        rightIconName={IconName.Close}
        onRightPress={() =>
          navigation.navigate('Details', {
            title: 'Meetings',
            active: '0'
          })
        }
      />
      <ScrollView style={styles.subContainer}>
        <View style={styles.progressContainer}>
          <Progress.Bar
            color={Colors.switch}
            progress={0.6}
            borderColor={Colors.white}
            unfilledColor={'#e6e7e9'}
            width={DeviceInfo.isTablet() ? 800 : 264}
          />
          <Text style={styles.txtProgress}>Step 3/5</Text>
        </View>

        <Text style={styles.txtAddSubjectTitle}>Date & Time</Text>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.txtTitle}>START DATE</Text>
          <View style={styles.dateTimeRowView}>
            <TouchableOpacity
              style={styles.dateContainer}
              onPress={() => {
                setOpenCalendar(!openCalendar);
                setOpenClock(false);
                setValue('startDate');
              }}
            >
              <TextInput
                style={styles.textInput}
                value={startDate}
                editable={false}
              />

              <Icon
                name={IconName.Calendar}
                height={SIZES[20]}
                width={SIZES[18]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateContainer}
              onPress={() => {
                setOpenClock(!openClock);
                setOpenCalendar(false);
                setValue('startTime');
              }}
            >
              <TextInput
                style={styles.textInput}
                value={startTime}
                editable={false}
              />

              <Icon
                name={IconName.Arrow_Down}
                height={SIZES[6]}
                width={SIZES[12]}
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.txtTitle, { marginTop: SIZES[24] }]}>
            END DATE
          </Text>
          <View style={styles.dateTimeRowView}>
            <TouchableOpacity
              style={styles.dateContainer}
              onPress={() => {
                setOpenCalendar(!openCalendar);
                setOpenClock(false);
                setValue('endDate');
              }}
            >
              <TextInput
                style={styles.textInput}
                value={endDate}
                editable={false}
              />

              <Icon
                name={IconName.Calendar}
                height={SIZES[20]}
                width={SIZES[18]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateContainer}
              onPress={() => {
                setOpenClock(!openClock);
                setOpenCalendar(false);
                setValue('endTime');
              }}
            >
              <TextInput
                style={styles.textInput}
                value={endTime}
                editable={false}
              />

              <Icon
                name={IconName.Arrow_Down}
                height={SIZES[6]}
                width={SIZES[12]}
              />
            </TouchableOpacity>
          </View>
          {/* <View style={styles.timezoneContainer}>
            <Text style={styles.txtTitle}>TIMEZONE</Text>
            <Dropdown
              placeholderStyle={{
                ...Fonts.PoppinsRegular[12],
                color: Colors.secondary
              }}
              data={timeZone?.map((item) => ({
                label: item.timeZone,
                value: item.timeZoneId
              }))}
              style={{
                borderWidth: 0,
                paddingRight: SIZES[16],
                paddingLeft: 0
              }}
              textStyle={{ ...Fonts.PoppinsRegular[14] }}
              // search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={''}
              arrowIconStyle={{
                height: SIZES[12],
                width: SIZES[14]
              }}
              searchPlaceholder="Search..."
              value={valueTimeZone}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setValueTimeZone(item.value);
                setIsFocus(false);
              }}
            />

            <Divider style={styles.divider} />
          </View> */}
          {/* dropdown timezone */}
          <DropDownPicker
            data={timeZone?.map((item) => ({
              label: item.timeZone,
              value: item.timeZoneId
            }))}
            disable={false}
            placeholder={''}
            setData={setValueTimeZone}
            title={'TIMEZONE'}
            value={valueTimeZone}
          />

          {/* dropdown repeat */}
          <DropDownPicker
            data={[
              {
                label: "Dosen't repeat",
                value: 0
              },
              {
                label: 'Repeat daily',
                value: 1
              },
              {
                value: 2,
                label: 'Repeat weekly'
              },
              {
                value: 3,
                label: 'Repeat monthly'
              },
              {
                value: 4,
                label: 'Repeat yearly'
              }
            ]}
            disable={false}
            placeholder={''}
            setData={setValueRepeat}
            title={'REPEAT'}
            value={valueRepeat}
          />
        </View>
        <DateTimePickerModal
          isVisible={openCalendar}
          mode="date"
          onConfirm={handleConfirmCalendar}
          onCancel={() => setOpenCalendar(false)}
          minimumDate={value === 'startDate' ? new Date() : dates}
          date={value === 'startDate' ? dates : date}
          timePickerModeAndroid="spinner"
        />

        <DateTimePickerModal
          isVisible={openClock}
          mode="time"
          onConfirm={handleConfirmClock}
          onCancel={() => setOpenClock(false)}
          minimumDate={value == 'startTime' ? new Date() : times}
          date={value == 'startTime' ? times : time}
        />
      </ScrollView>
      <View
        style={{
          backgroundColor: Colors.white,
          justifyContent: 'flex-end'
        }}
      >
        {/* Divider */}
        <Divider style={styles.divider} />
        <View style={styles.buttonContainer}>
          <Button
            title={'Back'}
            onPress={() => {
              navigation.goBack();
              setMeetingsData({
                ...meetingsData,
                startDate: startNewDate,
                endDate: endNewDate,
                startTime: startTime,
                endTime: endTime,
                TimeZone: valueTimeZone,
                Repeat: valueRepeat
              });
            }}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Next'}
            onPress={() => {
              setMeetingsData({
                ...meetingsData,
                startDate: startNewDate,
                endDate: endNewDate,
                startTime: startTime,
                endTime: endTime,
                TimeZone: valueTimeZone,
                Repeat: valueRepeat
              });
              navigation.navigate('AddMeetingLocation');
            }}
            layoutStyle={[
              {
                opacity:
                  startNewDate == '' ||
                  endDate == '' ||
                  startTime == '' ||
                  endTime == '' ||
                  valueTimeZone == '' ||
                  valueRepeat == null
                    ? 0.5
                    : null
              },
              styles.nextBtnLayout
            ]}
            textStyle={styles.txtNextBtn}
            disable={
              startNewDate == '' ||
              endDate == '' ||
              startTime == '' ||
              endTime == '' ||
              valueTimeZone == '' ||
              valueRepeat == null
                ? true
                : false
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddMeetingDateAndTime;
