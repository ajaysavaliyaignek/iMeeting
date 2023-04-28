import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert
} from 'react-native';
import React, { useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Divider } from 'react-native-paper';
import { useMutation } from '@apollo/client';
import moment from 'moment';
import { useNavigation, useRoute } from '@react-navigation/native';

import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { styles } from './styles';
import { SIZES } from '../../../../themes/Sizes';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';
import { Button } from '../../../../component/button/Button';
import { UPDATE_ANSWER } from '../../../../graphql/mutation';
import {
  GET_All_APPOINTMENT,
  GET_All_MEETING,
  GET_ALL_VIDEO_CONFERENCES,
  GET_ANSWER,
  GET_USER_PAYLOAD
} from '../../../../graphql/query';
import DropDownPicker from '../../../../component/DropDownPicker/DropDownPicker';

const YourAnswer = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item, userID } = route?.params;
  const [valueAnswer, setValue] = useState(null);
  const [suggestedDateAndTime, setSuggestedDateAndTime] = useState(new Date());
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openClock, setOpenClock] = useState(false);
  const [items, setItems] = useState([
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: 'Unknown', value: 'Unknown' },
    { label: 'Suggest time', value: 'Suggest time' }
  ]);

  let queryParams;

  if (item.meetingId == undefined) {
    queryParams = {
      id: +item.appointmentId,

      userId: +userID,
      type: 4
    };
  } else if (item.meetingId == undefined && item.appointmentId == undefined) {
    queryParams = {
      id: +item.videoConferenceId,

      userId: +userID,
      type: 5
    };
  } else {
    queryParams = {
      id: +item.meetingId,

      userId: +userID,
      type: 1
    };
  }

  const [updateAnswer] = useMutation(UPDATE_ANSWER, {
    refetchQueries: [
      {
        query: GET_All_MEETING,
        variables: {
          onlyMyMeeting: false,
          committeeIds: '',
          screen: 0,
          searchValue: '',
          page: -1,
          pageSize: -1
        }
      },
      {
        query: GET_All_APPOINTMENT,
        variables: {
          searchValue: '',
          page: -1,
          pageSize: -1
        }
      },
      {
        query: GET_ANSWER,
        variables: queryParams
      },
      {
        query: GET_USER_PAYLOAD
      },
      {
        query: GET_ALL_VIDEO_CONFERENCES,
        variables: {
          date: '',
          page: -1,
          pageSize: -1,
          searchValue: '',
          sort: ''
        }
      }
    ],
    onCompleted: (data) => {
      if (data.updateAnswer.status.statusCode == 200) {
        navigation.goBack();
      }
    },
    onError: (data) => {
      console.log('update answer error', data);
    }
  });

  const handleConfirmCalendar = (date) => {
    setSuggestedDateAndTime(date);

    setOpenCalendar(false);
  };

  // set date time from calendar model
  const handleConfirmClock = (date) => {
    date = moment(date)
      .hour(moment(suggestedDateAndTime).hour)
      .minute(moment(suggestedDateAndTime).minute);

    setSuggestedDateAndTime(date);
    setOpenClock(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Your answer'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <DropDownPicker
          data={items}
          disable={false}
          placeholder={''}
          setData={setValue}
          title={'YOUR ANSWER'}
          value={valueAnswer}
        />
        {valueAnswer == 'Suggest time' ? (
          <View>
            <Text style={styles.txtTitle}>YOUR SUGGESTION TIME</Text>
            <View style={styles.dateTimeRowView}>
              {/* select start date */}
              <TouchableOpacity
                style={styles.dateContainer}
                onPress={() => {
                  setOpenCalendar(!openCalendar);
                  setOpenClock(false);
                  // setValue('startDate');
                }}
              >
                <Text style={styles.textInput}>
                  {moment(suggestedDateAndTime).format('DD MMM,YYYY')}
                </Text>

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
                  setOpenClock(!openClock);
                  setOpenCalendar(false);
                }}
              >
                <Text style={styles.textInput}>
                  {moment(suggestedDateAndTime).format('LT')}
                </Text>

                <Icon
                  name={IconName.Arrow_Down}
                  height={SIZES[6]}
                  width={SIZES[12]}
                />
              </TouchableOpacity>
            </View>

            {/* date  picker modal */}
            <DateTimePickerModal
              isVisible={openCalendar}
              mode="date"
              onConfirm={handleConfirmCalendar}
              onCancel={() => setOpenCalendar(false)}
              minimumDate={new Date()}
              date={new Date(suggestedDateAndTime)}
              timePickerModeAndroid="spinner"
            />

            {/* time picker modal */}
            <DateTimePickerModal
              isVisible={openClock}
              mode="time"
              onConfirm={handleConfirmClock}
              onCancel={() => setOpenClock(false)}
              date={new Date(suggestedDateAndTime)}
            />
          </View>
        ) : null}
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
            title={'Close'}
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Save'}
            layoutStyle={[styles.nextBtnLayout]}
            textStyle={styles.txtNextBtn}
            onPress={() => {
              updateAnswer({
                variables: {
                  answer: {
                    answer: valueAnswer,
                    appointmentId:
                      item?.appointmentId == undefined
                        ? 0
                        : item?.appointmentId,
                    suggestionTime:
                      valueAnswer == 'Suggest time'
                        ? moment(suggestedDateAndTime).format(
                            'YYYY-MM-DD hh:mm A'
                          )
                        : '',
                    meetingId:
                      item?.meetingId == undefined ? 0 : item?.meetingId,
                    videoConferenceId:
                      item?.meetingId == undefined &&
                      item?.appointmentId == undefined
                        ? item.videoConferenceId
                        : 0
                  }
                }
              });
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default YourAnswer;
