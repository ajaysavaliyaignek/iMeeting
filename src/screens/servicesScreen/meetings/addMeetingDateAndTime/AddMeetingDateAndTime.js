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
  const [startDateTime, setStartDateTime] = useState(
    meetingsData?.startDateTime
      ? new Date(meetingsData?.startDateTime)
      : new Date()
  );
  const [endDateTime, setEndDateTime] = useState(
    meetingsData?.startDateTime
      ? new Date(meetingsData?.endDateTime)
      : new Date()
  );
  const [isStartDate, setIsStartDate] = useState(false);

  const [startDate, setStartdate] = useState(
    meetingsData?.startDate
      ? moment(meetingsData?.startDate).format('DD MMM,YYYY')
      : moment(new Date()).format('DD MMM,YYYY')
  );
  // const [startNewDate, setStartNewDate] = useState(
  //   meetingsData?.startDate
  //     ? meetingsData?.startDate
  //     : moment(new Date()).format('YYYY-MM-DD')
  // );
  const [startTime, setStartTime] = useState(
    meetingsData?.startTime
      ? meetingsData?.startTime
      : moment(new Date()).format('LT')
  );
  const [endDate, setEnddate] = useState(
    meetingsData?.endDate
      ? moment(meetingsData?.endDate).format('DD MMM,YYYY')
      : startDate
  );
  // const [endNewDate, setEndNewdate] = useState(
  //   meetingsData?.endDate
  //     ? meetingsData?.startDate
  //     : moment(new Date()).format('YYYY-MM-DD')
  // );
  const [endTime, setEndTime] = useState(
    meetingsData?.endTime
      ? meetingsData?.endTime
      : moment(new Date()).format('LT')
  );
  // const [date, setDate] = useState(new Date());
  // const [dates, setDates] = useState(new Date());
  // const [time, setTime] = useState(new Date());
  // const [times, setTimes] = useState(new Date());
  const [timeZone, setTimeZone] = useState([]);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openClock, setOpenClock] = useState(false);
  const [valueRepeat, setValueRepeat] = useState(
    meetingsData?.Repeat ? meetingsData?.Repeat : null
  );
  const [valueTimeZone, setValueTimeZone] = useState(
    meetingsData?.TimeZone ? meetingsData?.TimeZone : null
  );
  const [itemsRepeat, setItems] = useState([
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
  ]);

  const handleConfirmClock = (date) => {
    console.log('status of isStartDate ', isStartDate);
    if (isStartDate) {
      date = moment(date).date(startDateTime.date);
      if (moment(date).isBefore(moment(new Date()))) {
        console.log('start time issue');
        // Alert.alert('Invalid start time');
        setStartDateTime(date);
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
    //     moment(time, 'hh:mm A').isAfter(moment()),
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
    // console.log('startDate', startDate);
    // console.log('endDate', endDate);
    // console.log(startTime, 'startTime');
    // console.log('value', value);

    // if (startDate === endDate) {
    //   console.log('-----');
    //   if (moment(time, 'hh:mm A').isAfter(moment(startTime, 'hh:mm A'))) {
    //     if (value == 'endTime') {
    //       setEndTime(time);
    //     }
    //     setOpenClock(false);
    //   } else {
    //     Alert.alert('Please select future time');
    //   }
    // } else {
    //   if (value == 'endTime') {
    //     console.log('+++++++++');
    //     setEndTime(time);
    //   }
    //   // if (value == 'endTime') {
    //   //   setEndTime(time);
    //   // }
    //   setOpenClock(false);
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
                setIsStartDate(true);
                setOpenCalendar(!openCalendar);
                setOpenClock(false);
                // setValue('startDate');
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
                // setValue('startTime');
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
                // setValue('endDate');
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
                // setValue('endTime');
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
            data={itemsRepeat}
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
          timePickerModeAndroid="spinner"
        />

        <DateTimePickerModal
          isVisible={openClock}
          mode="time"
          onConfirm={handleConfirmClock}
          onCancel={() => setOpenClock(false)}
          // minimumDate={
          //   isStartDate ? new Date() : new Date(startDateTime).getTime()
          // }
          date={isStartDate ? new Date(startDateTime) : new Date(endDateTime)}
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
                startDateTime: startDateTime,
                endDateTime: endDateTime,
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
                startDateTime: startDateTime,
                endDateTime: endDateTime,
                TimeZone: valueTimeZone,
                Repeat: valueRepeat
              });
              navigation.navigate('AddMeetingLocation');
            }}
            layoutStyle={[
              {
                opacity:
                  // startNewDate == '' ||
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
              // startNewDate == '' ||
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
