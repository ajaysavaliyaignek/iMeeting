import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity
} from 'react-native';
import React, { useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import Header from '../../../../component/header/Header';
import { IconName } from '../../../../component';
import { styles } from './styles';
import DropDownPicker from 'react-native-dropdown-picker';
import { SIZES } from '../../../../themes/Sizes';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';
import { Button } from '../../../../component/button/Button';
import { Divider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { UPDATE_ANSWER } from '../../../../graphql/mutation';
import moment from 'moment';
import {
  GET_All_APPOINTMENT,
  GET_All_MEETING
} from '../../../../graphql/query';

const YourAnswer = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route?.params;
  console.log('item from your answer', item);
  const [open, setOpen] = useState(false);
  const [valueAnswer, setValue] = useState(null);
  const [suggestedTime, setSuggestedTime] = useState('');
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [items, setItems] = useState([
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: 'Unknown', value: 'Unknown' },
    { label: 'Suggest time', value: 'Suggest time' }
  ]);

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
      }
    ],
    onCompleted: (data) => {
      console.log('add answer status', data.updateAnswer);
      if (data.updateAnswer.status[0].statusCode == 200) {
        navigation.goBack();
      }
    },
    onError: (data) => {
      console.log('update answer error', data);
    }
  });

  const handleConfirmClock = (date) => {
    console.log('A date has been picked: ', date);

    const time = moment(date).format('LT');
    setSuggestedTime(time);
    console.log('time', time);
    setOpenTimePicker(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Your answer'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.txtTitle}>YOUR ANSWER</Text>
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={open}
            value={valueAnswer}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder={''}
            placeholderStyle={{
              ...Fonts.PoppinsRegular[12],
              color: Colors.secondary
            }}
            style={{
              borderWidth: 0,
              paddingLeft: 0,
              paddingRight: SIZES[16]
            }}
            textStyle={{ ...Fonts.PoppinsRegular[14] }}
          />
          {/* <TextInput style={styles.textInput} /> */}
        </View>
        {valueAnswer == 'Suggest time' ? (
          <View>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setOpenTimePicker(!openTimePicker)}
            >
              <Text style={styles.txtTitle}>YOUR SUGGESTION TIME</Text>
              <TextInput
                onChangeText={(text) => setSuggestedTime(text)}
                style={styles.input}
                editable={false}
                value={suggestedTime}
              />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={openTimePicker}
              mode="time"
              onConfirm={handleConfirmClock}
              onCancel={() => setOpenTimePicker(false)}
              minimumDate={new Date()}
              date={new Date()}
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
              console.log('add answer data', {
                answer: valueAnswer,
                appointmentId:
                  item?.appointmentId == undefined ? 0 : item?.appointmentId,
                suggestionTime:
                  valueAnswer == 'Suggest time' ? suggestedTime : '',
                meetingId: item?.meetingId == undefined ? 0 : item?.meetingId,
                videoConferenceId: 0
              });
              updateAnswer({
                variables: {
                  answer: {
                    answer: valueAnswer,
                    appointmentId:
                      item?.appointmentId == undefined
                        ? 0
                        : item?.appointmentId,
                    suggestionTime:
                      valueAnswer == 'Suggest time' ? suggestedTime : '',
                    meetingId:
                      item?.meetingId == undefined ? 0 : item?.meetingId,
                    videoConferenceId: 0
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
