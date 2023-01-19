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

import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { styles } from './styles';
import { Colors } from '../../../../themes/Colors';
import { SIZES } from '../../../../themes/Sizes';
import { Button } from '../../../../component/button/Button';
import { useQuery } from '@apollo/client';
import { GET_MEETING_BY_ID, GET_TIMEZONE } from '../../../../graphql/query';
import { UserContext } from '../../../../context';
import DropDownPicker from '../../../../component/DropDownPicker/DropDownPicker';

const EditMeetingDateAndTime = () => {
  const navigation = useNavigation();
  const { meetingsData, setMeetingsData } = useContext(UserContext);

  const route = useRoute();
  const { item } = route?.params;
  console.log('item from edit meeting date and time', meetingsData);

  const [startDate, setStartdate] = useState(
    meetingsData?.startDate
      ? meetingsData?.startDate
      : moment(item?.setDate).format('DD MMM,YYYY')
  );
  const [startNewDate, setStartNewDate] = useState(
    meetingsData?.startDate
      ? moment(meetingsData?.setDate).format('YYYY-MM-DD')
      : moment(item?.setDate).format('YYYY-MM-DD')
  );
  const [startTime, setStartTime] = useState(item?.setTime);
  const [endDate, setEnddate] = useState(
    meetingsData?.endDate
      ? meetingsData?.endDate
      : moment(item?.endDate).format('DD MMM,YYYY')
  );
  const [endNewDate, setEndNewdate] = useState(
    meetingsData?.endDate
      ? moment(meetingsData?.endDate).format('YYYY-MM-DD')
      : moment(item?.endDate).format('YYYY-MM-DD')
  );
  const [endTime, setEndTime] = useState(item?.endTime);
  const [meeting, setMeeting] = useState(null);
  const [timeZone, setTimeZone] = useState([]);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openClock, setOpenClock] = useState(false);
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date());
  const [dates, setDates] = useState(new Date());
  const [openTimeZone, setOpenTimeZone] = useState(false);
  const [openRepeat, setOpenRepeat] = useState(false);
  const [onFocus, setIsFocus] = useState(false);
  const [time, setTime] = useState('');
  const [valueRepeat, setValueRepeat] = useState(
    meetingsData?.Repeat ? meetingsData?.Repeat : item.repeat
  );
  const [valueTimeZone, setValueTimeZone] = useState(
    meetingsData?.TimeZone ? meetingsData?.TimeZone : item?.timeZone
  );
  const [items, setItems] = useState([
    { label: 'GMT_8 (USA)', value: 'GMT_8 (USA)' }
  ]);

  const { data, error, loading } = useQuery(GET_MEETING_BY_ID, {
    fetchPolicy: 'cache-and-network',
    variables: {
      meetingId: item.meetingId
    },
    onCompleted: (data) => {
      console.log('meeting by id', data.meeting);
      if (data) {
        setMeeting(data.meeting);
      }
    },
    onError: (data) => {
      console.log('error in get meeting by id', data);
    }
  });

  const handleConfirmClock = (date) => {
    console.log('A date has been picked: ', date);

    const time = moment(date).format('LT');
    console.log('time', time);
    var d = dates.toLocaleDateString();
    let currentDate = moment().format('DD/MM/YYYY');

    if (d == currentDate) {
      console.log(
        moment(time, 'hh:mm A').isSameOrAfter(moment()),
        "moment(time, 'hh:mm A').isSameOrAfter(moment())"
      );
      if (moment(time, 'hh:mm A').isSameOrAfter(moment())) {
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
          Alert.alert('Please select  time');
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
    setOpenCalendar(false);
    const Date = moment(date).format('DD MMM,YYYY');
    const newDate = moment(date).format('YYYY-MM-DD');
    console.log('new date', newDate);
    console.log('time', Date);
    if (value == 'startDate') {
      setStartdate(Date);
      setStartNewDate(newDate);
      setDates(date);
      setEnddate(Date);
      setDate(date);
    }
    if (value == 'endDate') {
      setEnddate(Date);
      setEndNewdate(newDate);
      setDate(date);
    }
  };

  const TimeZone = useQuery(GET_TIMEZONE, {
    fetchPolicy: 'cache-and-network',
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
        name={'Edit meeting'}
        rightIconName={IconName.Close}
        onRightPress={() => {
          navigation.navigate('Details', {
            title: 'Meetings',
            active: '0'
          });
        }}
      />
      <View style={styles.subContainer}>
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

          {/* dropdown timezone */}
          <DropDownPicker
            data={timeZone?.map((item) => ({
              label: item.timeZone,
              value: item.timeZoneId
            }))}
            disable={false}
            placeholder={item.timeZone}
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
            setData={setValueTimeZone}
            title={'REPEAT'}
            value={valueRepeat}
          />
        </View>
        <DateTimePickerModal
          isVisible={openCalendar}
          mode="date"
          onConfirm={handleConfirmCalendar}
          onCancel={() => setOpenCalendar(false)}
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
          minimumDate={value === 'startDate' ? new Date() : dates}
          date={value === 'startDate' ? dates : date}
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
              navigation.navigate('EditMeetingLocation', { item: item });
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

export default EditMeetingDateAndTime;
