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
import {
  useNavigation,
  usePreventRemoveContext,
  useRoute
} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Dropdown } from 'react-native-element-dropdown';

import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { styles } from './styles';
import { Colors } from '../../../../themes/Colors';
import { SIZES } from '../../../../themes/Sizes';
import { Divider } from 'react-native-paper';
import moment from 'moment';
import { Fonts } from '../../../../themes';
import { Button } from '../../../../component/button/Button';
import { useQuery } from '@apollo/client';
import { GET_TIMEZONE } from '../../../../graphql/query';
import { UserContext } from '../../../../context';

const EditAppointmentDateAndTime = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { appointmentsData, setAppointmentsData } = useContext(UserContext);
  const {
    attachFiles,
    committee,
    title,
    discription,
    users,
    item,
    userRequired
  } = route?.params;
  console.log('appintment data from date and time', {
    attachFiles,
    committee,
    title,
    discription,
    users,
    item,
    userRequired,
    appointmentsData
  });

  const [startDate, setStartdate] = useState(
    item.setDate == null
      ? moment(new Date()).format('DD MMM,YYYY')
      : appointmentsData?.startDate
      ? appointmentsData?.startDate
      : moment(item.setDate).format('DD MMM,YYYY')
  );
  const [startNewDate, setStartNewDate] = useState(
    item.setDate == null
      ? moment(new Date()).format('YYYY-MM-DD')
      : moment(item.setDate).format('YYYY-MM-DD')
  );
  const [endNewDate, setEndNewdate] = useState(
    item.end == null
      ? moment(new Date()).format('YYYY-MM-DD')
      : moment(item.endDate).format('YYYY-MM-DD')
  );
  const [startTime, setStartTime] = useState(
    item?.setTime
      ? item.setTime
      : appointmentsData?.startTime
      ? appointmentsData?.startTime
      : moment(new Date()).format('LT')
  );
  const [endDate, setEnddate] = useState(
    item.endDate == null
      ? moment(new Date()).format('DD MMM,YYYY')
      : appointmentsData?.endDate
      ? appointmentsData?.endDate
      : moment(item.endDate).format('DD MMM,YYYY')
  );
  const [endTime, setEndTime] = useState(
    item.endTime == null
      ? moment(new Date()).format('LT')
      : appointmentsData?.endTime
      ? appointmentsData?.endTime
      : item.endTime
  );
  const [timeZone, setTimeZone] = useState([]);
  const [date, setDate] = useState(new Date());
  const [dates, setDates] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openClock, setOpenClock] = useState(false);
  const [value, setValue] = useState('');
  const [onFocus, setIsFocus] = useState(false);
  const [valueRepeat, setValueRepeat] = useState(
    appointmentsData?.Repeat ? appointmentsData?.Repeat : item.repeat
  );
  const [valueTimeZone, setValueTimeZone] = useState(
    appointmentsData?.TimeZone ? appointmentsData?.TimeZone : item?.timeZone
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
        moment(time, 'hh:mm A').isSameOrAfter(moment()),
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
    console.log(
      moment(time, 'hh:mm A').isAfter(moment(startTime, 'hh:mm A')),
      'time compare'
    );
    console.log(startTime, 'startTime');
    if (value == 'endTime') {
      if (startDate == endDate) {
        if (moment(time, 'hh:mm A').isAfter(moment(startTime, 'hh:mm A'))) {
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
        if (value == 'endTime') {
          setEndTime(time);
        }
      }
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
        name={'Edit appointment'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.navigate('AppointmentsList')}
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
          <View style={styles.timezoneContainer}>
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
              placeholder={item.timeZone}
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
          </View>
          <View style={styles.repeatContainer}>
            <Text style={styles.txtTitle}>REPEAT</Text>
            <Dropdown
              placeholderStyle={{
                ...Fonts.PoppinsRegular[12],
                color: Colors.secondary
              }}
              style={{
                borderWidth: 0,
                paddingRight: SIZES[16],
                paddingLeft: 0
              }}
              textStyle={{ ...Fonts.PoppinsRegular[14] }}
              arrowIconStyle={{
                height: SIZES[12],
                width: SIZES[14]
              }}
              // search
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
              // search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={''}
              searchPlaceholder="Search..."
              value={valueRepeat}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setValueRepeat(item.value);
                setIsFocus(false);
              }}
            />

            <Divider style={styles.divider} />
          </View>
        </View>
        <DateTimePickerModal
          isVisible={openCalendar}
          mode="date"
          onConfirm={handleConfirmCalendar}
          onCancel={() => setOpenCalendar(false)}
          minimumDate={value === 'startDate' ? new Date() : dates}
          date={value === 'startDate' ? dates : date}
        />
        {/* {openCalendar && (
          <RNDateTimePicker
            value={new Date()}
            display="default"
            onChange={(event, date) => {
              console.log(event);
              console.log(date);
            }}
          />
        )} */}
        <DateTimePickerModal
          isVisible={openClock}
          mode="time"
          onConfirm={handleConfirmClock}
          onCancel={() => setOpenClock(false)}
        />
        {/* {openClock && (
          <RNDateTimePicker
            value={new Date()}
            mode="time"
            display="default"
            onChange={(event, date) => {
              console.log(event);
              console.log(date);
            }}
          />
        )} */}
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
                startDate: startDate,
                endDate: endDate,
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
                startDate: startDate,
                endDate: endDate,
                startTime: startTime,
                endTime: endTime,
                TimeZone: valueTimeZone,
                Repeat: valueRepeat
              });
              navigation.navigate('EditAppointmentLocation', {
                attachFiles,
                committee,
                title,
                discription,
                users,
                userRequired,
                startDate: startNewDate,
                endDate: endNewDate,
                startTime: startTime,
                endTime: endTime,
                TimeZone: valueTimeZone,
                Repeat: valueRepeat,
                item
              });
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

export default EditAppointmentDateAndTime;
