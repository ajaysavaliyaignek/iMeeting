import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import React, { useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { useQuery } from '@apollo/client';

import { Icon, IconName } from '../../../../component';
import { styles } from './styles';
import { SIZES } from '../../../../themes/Sizes';
import { GET_TIMEZONE } from '../../../../graphql/query';
import DropDownPicker from '../../../../component/DropDownPicker/DropDownPicker';
import { currentTimeZone } from '../../../../component/currentTimeZone/CurrentTimezone';
import { Colors } from '../../../../themes/Colors';
import { Fonts } from '../../../../themes';

const AddEditDateAndTime = ({
  generaldData,
  setGeneralData,
  details,
  showRequired,
  setShowRequired
}) => {
  const [isStartDate, setIsStartDate] = useState(false);
  const [timezone, setTimeZone] = useState([]);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openClock, setOpenClock] = useState(false);
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

  // set date time from clock model
  const handleConfirmCalendar = (date) => {
    if (isStartDate) {
      // date = moment(date).date(generaldData?.startDateTime.date);

      if (moment(date).isBefore(moment(new Date()))) {
        Alert.alert('Invalid start date');

        setOpenCalendar(false);

        return;
      }
      setGeneralData({
        ...generaldData,
        startDateTime: date,
        endDateTime: date
      });
      setShowRequired(false);
    } else {
      if (moment(date).isBefore(moment(generaldData?.startDateTime))) {
        setGeneralData({ ...generaldData, endDateTime: date });
        setShowRequired(false);
        setOpenCalendar(false);
        return;
      }
      setGeneralData({ ...generaldData, endDateTime: date });
      setShowRequired(false);
    }

    setOpenCalendar(false);
  };

  // set date time from calendar model
  const handleConfirmClock = (date) => {
    if (isStartDate) {
      date = moment(date)
        .hour(moment(generaldData?.startDateTime).hour)
        .minute(moment(generaldData?.startDateTime).minute);
      if (moment(date).isBefore(moment(new Date()))) {
        Alert.alert('Invalid start time');

        setOpenClock(false);
        return;
      }
      setGeneralData({
        ...generaldData,
        startDateTime: date,
        endDateTime: date
      });
    } else {
      date = moment(date)
        .hour(moment(generaldData?.endDateTime).hour)
        .minute(moment(generaldData?.endDateTime).minute);
      if (moment(date).isBefore(moment(generaldData?.startDateTime))) {
        Alert.alert('Invalid end time');
        setOpenClock(false);
        return;
      }
      setGeneralData({ ...generaldData, endDateTime: date });
    }

    setOpenClock(false);
  };

  // get timezone dropdown list
  const TimeZone = useQuery(GET_TIMEZONE, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data) {
        setTimeZone(data.timeZone.items);
        let filterTimeZone = data?.timeZone?.items?.filter((time) => {
          if (time.timeZone.split(' ')[0] == currentTimeZone) {
            return time;
          }
        });
        if (details == null) {
          setGeneralData({
            ...generaldData,
            valueTimeZone: filterTimeZone[0]?.timeZoneId
          });
          setShowRequired(false);
        }
      }
    },
    onError: (data) => {
      console.log('timezone error', data);
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.subContainer}>
        <Text style={styles.txtAddSubjectTitle}>Date & Time</Text>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.txtTitle}>START DATE</Text>
          <>
            <View style={styles.dateTimeRowView}>
              {/* select start date */}
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
                  value={moment(generaldData?.startDateTime).format(
                    'DD MMM,YYYY'
                  )}
                  editable={false}
                />

                <Icon
                  name={IconName.Calendar}
                  height={SIZES[20]}
                  width={SIZES[18]}
                />
              </TouchableOpacity>

              {/* for select start time */}
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
                  value={moment(generaldData?.startDateTime).format('LT')}
                  editable={false}
                />

                <Icon
                  name={IconName.Arrow_Down}
                  height={SIZES[6]}
                  width={SIZES[12]}
                />
              </TouchableOpacity>
            </View>
            {showRequired &&
            generaldData?.generaldData?.startDateTime == null ? (
              <Text
                style={{ color: Colors.Rejected, ...Fonts.PoppinsRegular[10] }}
              >
                *This fields are required
              </Text>
            ) : null}
          </>
          <Text style={[styles.txtTitle, { marginTop: SIZES[24] }]}>
            END DATE
          </Text>

          <>
            <View style={styles.dateTimeRowView}>
              {/* for select end date */}
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
                  value={moment(generaldData?.endDateTime).format(
                    'DD MMM,YYYY'
                  )}
                  editable={false}
                />

                <Icon
                  name={IconName.Calendar}
                  height={SIZES[20]}
                  width={SIZES[18]}
                />
              </TouchableOpacity>

              {/* for select end time */}
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
                  value={moment(generaldData?.endDateTime).format('LT')}
                  editable={false}
                />

                <Icon
                  name={IconName.Arrow_Down}
                  height={SIZES[6]}
                  width={SIZES[12]}
                />
              </TouchableOpacity>
            </View>
          </>
          {showRequired && generaldData?.generaldData?.startDateTime == null ? (
            <Text
              style={{ color: Colors.Rejected, ...Fonts.PoppinsRegular[10] }}
            >
              *This fields are required
            </Text>
          ) : null}

          {/* dropdown timezone */}
          <DropDownPicker
            data={timezone?.map((item) => ({
              label: item.timeZone,
              value: item.timeZoneId
            }))}
            disable={false}
            placeholder={''}
            setData={(item) => {
              setGeneralData({
                ...generaldData,
                valueTimeZone: item
              });
            }}
            title={'TIMEZONE'}
            value={generaldData?.valueTimeZone}
          />
          {showRequired && generaldData?.generaldData?.valueTimeZone == null ? (
            <Text
              style={{ color: Colors.Rejected, ...Fonts.PoppinsRegular[10] }}
            >
              *This field is required
            </Text>
          ) : null}

          {/* dropdown repeat */}
          <DropDownPicker
            data={itemsRepeat}
            disable={false}
            placeholder={''}
            setData={(item) =>
              setGeneralData({
                ...generaldData,
                valueRepeat: item
              })
            }
            title={'REPEAT'}
            value={generaldData?.valueRepeat}
          />
        </View>

        {/* date  picker modal */}
        <DateTimePickerModal
          isVisible={openCalendar}
          mode="date"
          onConfirm={handleConfirmCalendar}
          onCancel={() => setOpenCalendar(false)}
          minimumDate={
            isStartDate ? new Date() : new Date(generaldData?.startDateTime)
          }
          date={
            isStartDate
              ? new Date(generaldData?.startDateTime)
              : new Date(generaldData?.endDateTime)
          }
          timePickerModeAndroid="spinner"
        />

        {/* time picker modal */}
        <DateTimePickerModal
          isVisible={openClock}
          mode="time"
          onConfirm={handleConfirmClock}
          onCancel={() => setOpenClock(false)}
          // minimumDate={
          //   isStartDate ? new Date() : new Date(startDateTime).getTime()
          // }
          date={
            isStartDate
              ? new Date(generaldData?.startDateTime)
              : new Date(generaldData?.endDateTime)
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddEditDateAndTime;
