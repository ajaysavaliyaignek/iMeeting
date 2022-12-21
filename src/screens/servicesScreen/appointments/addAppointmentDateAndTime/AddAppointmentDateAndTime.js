import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import React, { useContext, useState } from 'react';
import * as Progress from 'react-native-progress';
import { useNavigation, useRoute } from '@react-navigation/native';
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

const AddAppointmentDateAndTime = () => {
  const navigation = useNavigation();
  const { appointmentsData, setAppointmentsData } = useContext(UserContext);
  console.log(
    'appointment data from add appointment date and time',
    appointmentsData
  );

  const [startDateTime, setStartDateTime] = useState(
    appointmentsData?.startDateTime
      ? new Date(appointmentsData?.startDateTime)
      : new Date()
  );
  const [endDateTime, setEndDateTime] = useState(
    appointmentsData?.startDateTime
      ? new Date(appointmentsData?.endDateTime)
      : new Date()
  );
  const [isStartDate, setIsStartDate] = useState(false);

  const [startDate, setStartdate] = useState(
    appointmentsData?.startDate
      ? moment(appointmentsData?.startDate).format('DD MMM,YYYY')
      : moment(new Date()).format('DD MMM,YYYY')
  );
  // const [startNewDate, setStartNewDate] = useState(
  //   appointmentsData?.startDate
  //     ? appointmentsData?.startDate
  //     : moment(new Date()).format('YYYY-MM-DD')
  // );
  // const [endNewDate, setEndNewdate] = useState(
  //   appointmentsData?.endDate
  //     ? appointmentsData?.startDate
  //     : moment(new Date()).format('YYYY-MM-DD')
  // );
  const [startTime, setStartTime] = useState(
    appointmentsData?.startTime
      ? appointmentsData?.startTime
      : moment(new Date()).format('LT')
  );
  const [endDate, setEnddate] = useState(
    appointmentsData?.endDate
      ? moment(appointmentsData?.endDate).format('DD MMM,YYYY')
      : startDate
  );
  const [endTime, setEndTime] = useState(
    appointmentsData?.endTime ? appointmentsData?.endTime : startTime
  );
  // const [date, setDate] = useState(new Date());
  // const [dates, setDates] = useState(new Date());
  // const [time, setTime] = useState(new Date());
  const [timeZone, setTimeZone] = useState([]);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openClock, setOpenClock] = useState(false);
  const [value, setValue] = useState('');
  const [openTimeZone, setOpenTimeZone] = useState(false);
  const [openRepeat, setOpenRepeat] = useState(false);
  const [valueRepeat, setValueRepeat] = useState(appointmentsData?.Repeat);
  const [valueTimeZone, setValueTimeZone] = useState(
    appointmentsData?.TimeZone ? appointmentsData?.TimeZone : null
  );
  const [items, setItems] = useState([
    { label: 'GMT_8 (USA)', value: 'GMT_8 (USA)' }
  ]);
  const [isFocus, setIsFocus] = useState(false);

  const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' }
  ];

  const handleConfirmClock = (date) => {
    console.log('status of isStartDate ', isStartDate);
    if (isStartDate) {
      date = moment(date).date(startDateTime.date);
      if (moment(date).isBefore(moment(new Date()))) {
        console.log('start time issue');
        Alert.alert('Invalid start time');
        setOpenClock(false);

        return;
      }
      setStartDateTime(date);
    } else {
      date = moment(date).date(endDateTime.date);

      if (moment(date).isBefore(moment(startDateTime))) {
        console.log('end time issue');
        Alert.alert('Invalid end time');
        setOpenClock(false);
        return;
      }
      setEndDateTime(date);
    }
    // console.log('A time has been picked: ', date);

    // const time = moment(date).format('LT');
    // console.log('time', time);

    // var d = dates.toLocaleDateString();
    // let currentDate = moment().format('DD/MM/YYYY');

    // if (d == currentDate) {
    //   console.log(
    //     moment(time, 'hh:mm A').isSameOrAfter(moment()),
    //     "moment(time, 'hh:mm A').isSameOrAfter(moment())"
    //   );
    //   if (moment(time, 'hh:mm A').isAfter(moment())) {
    //     if (value == 'startTime') {
    //       setStartTime(time);
    //       setEndTime(time);
    //       setTime(date);
    //     }
    //     if (value == 'endTime') {
    //       setEndTime(time);
    //     }
    //     setOpenClock(false);
    //   } else {
    //     Alert.alert('Please select future time');
    //   }
    // } else {
    //   if (value == 'startTime') {
    //     setStartTime(time);
    //     setEndTime(time);
    //     setTime(date);
    //   }
    //   // if (value == 'endTime') {
    //   //   setEndTime(time);
    //   // }
    //   setOpenClock(false);
    // }
    // console.log(
    //   moment(time, 'hh:mm A').isAfter(moment(startTime, 'hh:mm A')),
    //   'time compare'
    // );
    // console.log(startTime, 'startTime');
    // if (value == 'endTime') {
    //   if (startDate == endDate) {
    //     if (moment(time, 'hh:mm A').isAfter(moment(startTime, 'hh:mm A'))) {
    //       if (value == 'startTime') {
    //         setStartTime(time);
    //         setEndTime(time);
    //         setTime(date);
    //       }
    //       if (value == 'endTime') {
    //         setEndTime(time);
    //       }
    //       setOpenClock(false);
    //     } else {
    //       Alert.alert('Please select future time');
    //     }
    //   } else {
    //     if (value == 'endTime') {
    //       setEndTime(time);
    //     }
    //   }
    // }
    setOpenClock(false);
  };
  const handleConfirmCalendar = (date) => {
    if (isStartDate) {
      date = moment(date)
        .hour(moment(startDateTime).hour)
        .minute(moment(startDateTime).minute);
      if (moment(date).isAfter(moment(new Date()))) {
        console.log('start date issue');
        // Alert.alert('Invalid start date');
        setStartDateTime(date);
        setEndDateTime(date);
        setOpenCalendar(false);
        return;
      }
      setStartDateTime(date);
    } else {
      date = moment(date)
        .hour(moment(endDateTime).hour)
        .minute(moment(endDateTime).minute);
      if (moment(date).isBefore(moment(startDateTime))) {
        console.log('end date issue');
        Alert.alert('Invalid end date');
        setOpenCalendar(false);
        return;
      }
      setEndDateTime(date);
    }
    // console.log('A date has been picked: ', date);

    // const Date = moment(date).format('DD MMM,YYYY');
    // const newDate = moment(date).format('YYYY-MM-DD');
    // const time = moment(date).format('LT');
    // console.log('time', time);
    // console.log('new date', newDate);
    // console.log('time', Date);
    // if (value == 'startDate') {
    //   setStartdate(Date);
    //   setStartNewDate(newDate);
    //   setDates(date);
    //   setEnddate(Date);
    //   setDate(date);
    //   setStartTime(time);
    //   setEndTime(time);
    //   setTime(date);
    // }
    // if (value == 'endDate') {
    //   setEnddate(Date);
    //   setEndNewdate(newDate);
    //   setDate(date);
    //   setEndTime(time);
    // }
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

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Add appointment'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <View style={styles.progressContainer}>
          <Progress.Bar
            color={Colors.switch}
            progress={0.75}
            borderColor={Colors.white}
            unfilledColor={'#e6e7e9'}
            width={DeviceInfo.isTablet() ? 800 : 264}
          />
          <Text style={styles.txtProgress}>Step 3/4</Text>
        </View>

        <Text style={styles.txtAddSubjectTitle}>Date & Time</Text>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.txtTitle}>START DATE</Text>
          <View style={styles.dateTimeRowView}>
            <TouchableOpacity
              style={styles.dateContainer}
              onPress={() => {
                setIsStartDate(true);
                setOpenCalendar(!openCalendar);
                setOpenClock(false);
                setValue('startDate');
              }}
            >
              <TextInput
                style={styles.textInput}
                value={moment(startDateTime).format('DD MMM,YYYY')}
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
                setIsStartDate(true);
                setOpenClock(!openClock);
                setOpenCalendar(false);
                setValue('startTime');
              }}
            >
              <TextInput
                style={styles.textInput}
                value={moment(startDateTime).format('LT')}
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
                setIsStartDate(false);
                setOpenCalendar(!openCalendar);
                setOpenClock(false);
                setValue('endDate');
              }}
            >
              <TextInput
                style={styles.textInput}
                value={moment(endDateTime).format('DD MMM,YYYY')}
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
                setIsStartDate(false);
                setOpenClock(!openClock);
                setOpenCalendar(false);
                setValue('endTime');
              }}
            >
              <TextInput
                style={styles.textInput}
                value={moment(endDateTime).format('LT')}
                editable={false}
              />

              <Icon
                name={IconName.Arrow_Down}
                height={SIZES[6]}
                width={SIZES[12]}
              />
            </TouchableOpacity>
          </View>

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
          minimumDate={isStartDate ? new Date() : new Date(startDateTime)}
          date={isStartDate ? new Date(startDateTime) : new Date(endDateTime)}
        />

        <DateTimePickerModal
          isVisible={openClock}
          mode="time"
          onConfirm={handleConfirmClock}
          onCancel={() => setOpenClock(false)}
          // minimumDate={
          //   value == 'startTime' ? new Date() : startDate == endDate && time
          // }
          date={isStartDate ? new Date(startDateTime) : new Date(endDateTime)}
        />
      </View>
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
              setAppointmentsData({
                ...appointmentsData,
                startDateTime: startDateTime,
                endDateTime: endDateTime,
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
              setAppointmentsData({
                ...appointmentsData,
                startDateTime: startDateTime,
                endDateTime: endDateTime,
                TimeZone: valueTimeZone,
                Repeat: valueRepeat
              });
              navigation.navigate('AddAppointmentLocation');
            }}
            layoutStyle={[
              // {
              //     opacity: title === "" || discription === "" ? 0.5 : null,
              // },
              styles.nextBtnLayout
            ]}
            textStyle={styles.txtNextBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddAppointmentDateAndTime;
